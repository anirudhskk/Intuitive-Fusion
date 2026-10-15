import { Stack, type StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';

/**
 * Network segmentation (SEC-N02): internet-facing load balancers in public subnets, services in
 * private subnets, databases and document stores reachable only from isolated subnets / VPC endpoints.
 */
export class NetworkStack extends Stack {
  readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3, // multi-AZ for availability (NFR-AV01/AV02)
      natGateways: 2,
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
        { name: 'app', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { name: 'data', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
      flowLogs: { all: { trafficType: ec2.FlowLogTrafficType.ALL } },
    });

    // Keep AWS service traffic (S3, Bedrock, KMS, Secrets Manager) off the internet
    this.vpc.addGatewayEndpoint('S3', { service: ec2.GatewayVpcEndpointAwsService.S3 });
    for (const [key, svc] of Object.entries({
      Kms: ec2.InterfaceVpcEndpointAwsService.KMS,
      Secrets: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      BedrockRuntime: ec2.InterfaceVpcEndpointAwsService.BEDROCK_RUNTIME,
    })) {
      this.vpc.addInterfaceEndpoint(key, { service: svc });
    }
  }
}
