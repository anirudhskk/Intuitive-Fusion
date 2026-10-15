import { Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import type { PlatformKeys } from './security-stack.js';

/**
 * Stateful resources (BRS §5.3). All encrypted with platform keys, no public access (SEC-N04),
 * versioned with soft-delete semantics (NFR-CA02), backed up (NFR-DR01).
 */
export class DataStack extends Stack {
  readonly database: rds.DatabaseCluster;
  readonly documents: s3.Bucket;
  readonly bidBox: s3.Bucket;
  readonly auditArchive: s3.Bucket;
  readonly sessions: dynamodb.Table;

  constructor(scope: Construct, id: string, props: StackProps & { stage: string; vpc: ec2.IVpc; keys: PlatformKeys }) {
    super(scope, id, props);
    const prod = props.stage === 'prod';
    const removalPolicy = prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    // Core transactional DB — Aurora PostgreSQL Serverless v2, multi-AZ (NFR-AV01/AV02, NFR-SC02)
    this.database = new rds.DatabaseCluster(this, 'Core', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_4 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [rds.ClusterInstance.serverlessV2('reader', { scaleWithWriter: true })],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: prod ? 64 : 4,
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      storageEncryptionKey: props.keys.data,
      backup: { retention: Duration.days(prod ? 35 : 7) },
      deletionProtection: prod,
      iamAuthentication: true,
      removalPolicy,
    });

    const secureBucket = (name: string, key = props.keys.data, extra: Partial<s3.BucketProps> = {}) =>
      new s3.Bucket(this, name, {
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: key,
        bucketKeyEnabled: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        versioned: true,
        removalPolicy,
        ...extra,
      });

    // Generated documents, templates, uploads (rendered Word/PDF, contract versions)
    this.documents = secureBucket('Documents');

    // Sealed bid box — separate key; writes via presigned URLs only; reads blocked until close (SEC-D03/D04, SEC-AC13)
    this.bidBox = secureBucket('BidBox', props.keys.bidBox, {
      lifecycleRules: [{ abortIncompleteMultipartUploadAfter: Duration.days(1) }],
    });

    // WORM archive for the audit trail (tamper evidence, SEC-L01, NFR-L04)
    this.auditArchive = secureBucket('AuditArchive', props.keys.audit, {
      objectLockEnabled: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(Duration.days(prod ? 3650 : 1)),
    });

    // Conversation session state / collaboration presence (BRS §5.3)
    this.sessions = new dynamodb.Table(this, 'Sessions', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
      encryptionKey: props.keys.data,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      timeToLiveAttribute: 'ttl',
      removalPolicy,
    });
  }
}
