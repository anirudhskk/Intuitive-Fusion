import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import type { PlatformKeys } from './security-stack.js';

/**
 * Reporting runs on a data layer decoupled from the transactional DB (NFR-P05, NFR-SC03, BRS §5.9):
 * domain events + CDC → S3 data lake (Glue catalog, Lake Formation permissions per tenant) →
 * Redshift Serverless → QuickSight embedded dashboards and natural-language queries (FR-0625).
 */
export class AnalyticsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & { stage: string; keys: PlatformKeys }) {
    super(scope, id, props);

    new s3.Bucket(this, 'DataLake', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: props.keys.data,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      removalPolicy: props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    new glue.CfnDatabase(this, 'Catalog', {
      catalogId: this.account,
      databaseInput: { name: `if_${props.stage}_analytics`, description: 'Intuitive Fusion analytics catalog' },
    });

    // TODO Lake Formation tenant-scoped permissions, Redshift Serverless workgroup, QuickSight
    //      namespaces per tenant, Location Service for the geospatial supplier view (FR-0610).
  }
}
