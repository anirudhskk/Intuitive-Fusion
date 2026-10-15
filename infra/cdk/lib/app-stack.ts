import { Duration, Stack, type StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import type { Construct } from 'constructs';
import type { DataStack } from './data-stack.js';
import type { IdentityStack } from './identity-stack.js';
import type { PlatformKeys } from './security-stack.js';

/**
 * Compute and messaging (BRS §5.2):
 *  - API on ECS Fargate behind an ALB, rolling deploys with circuit breaker (zero downtime, TR-08)
 *  - EventBridge bus for domain events; SQS work queues with DLQs for workers (NFR-AV03)
 *  - WAF on internet-facing entry points (SEC-AP01); Shield Advanced to be enabled on prod (SEC-AP02)
 * TODO: worker Lambdas, Step Functions approval/escalation state machines, EventBridge Scheduler for
 *       tender close, CloudFront for the two web apps, API Gateway usage plans per tenant (NFR-SC01),
 *       CloudWatch dashboards/alarms for AI latency + ERP sync failures (NFR-M03), X-Ray (NFR-M04).
 */
export class AppStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { stage: string; vpc: ec2.IVpc; data: DataStack; identity: IdentityStack; keys: PlatformKeys },
  ) {
    super(scope, id, props);

    const bus = new events.EventBus(this, 'DomainEvents', { eventBusName: `if-${props.stage}-domain` });

    const dlq = new sqs.Queue(this, 'WorkDlq', { encryptionMasterKey: props.keys.data, retentionPeriod: Duration.days(14) });
    new sqs.Queue(this, 'DocumentWork', {
      encryptionMasterKey: props.keys.data,
      visibilityTimeout: Duration.minutes(5),
      deadLetterQueue: { queue: dlq, maxReceiveCount: 5 },
    });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: props.vpc, containerInsightsV2: ecs.ContainerInsights.ENHANCED });

    const api = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Api', {
      cluster,
      desiredCount: props.stage === 'prod' ? 3 : 1,
      cpu: 1024,
      memoryLimitMiB: 2048,
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      circuitBreaker: { rollback: true },
      minHealthyPercent: 100, // never drop below desired count during deploys (zero downtime, TR-08)
      taskImageOptions: {
        // TODO replace with ContainerImage.fromAsset('../../apps/api') once the Dockerfile exists
        image: ecs.ContainerImage.fromRegistry('public.ecr.aws/docker/library/node:22-alpine'),
        containerPort: 4000,
        environment: {
          STAGE: props.stage,
          EVENT_BUS: bus.eventBusName,
          DOCUMENTS_BUCKET: props.data.documents.bucketName,
          BIDBOX_BUCKET: props.data.bidBox.bucketName,
          INTERNAL_USER_POOL_ID: props.identity.internalPool.userPoolId,
          SUPPLIER_USER_POOL_ID: props.identity.supplierPool.userPoolId,
        },
      },
    });
    api.targetGroup.configureHealthCheck({ path: '/health' });
    props.data.documents.grantReadWrite(api.taskDefinition.taskRole);
    props.data.bidBox.grantPut(api.taskDefinition.taskRole); // write-only: no read before close
    bus.grantPutEventsTo(api.taskDefinition.taskRole);

    const waf = new wafv2.CfnWebACL(this, 'Waf', {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      visibilityConfig: { cloudWatchMetricsEnabled: true, metricName: 'if-waf', sampledRequestsEnabled: true },
      rules: [
        managedRule('AWSManagedRulesCommonRuleSet', 1),
        managedRule('AWSManagedRulesKnownBadInputsRuleSet', 2),
        managedRule('AWSManagedRulesSQLiRuleSet', 3),
      ],
    });
    new wafv2.CfnWebACLAssociation(this, 'WafApi', {
      resourceArn: api.loadBalancer.loadBalancerArn,
      webAclArn: waf.attrArn,
    });
  }
}

function managedRule(name: string, priority: number): wafv2.CfnWebACL.RuleProperty {
  return {
    name,
    priority,
    overrideAction: { none: {} },
    statement: { managedRuleGroupStatement: { vendorName: 'AWS', name } },
    visibilityConfig: { cloudWatchMetricsEnabled: true, metricName: name, sampledRequestsEnabled: true },
  };
}
