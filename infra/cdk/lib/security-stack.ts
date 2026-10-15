import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as guardduty from 'aws-cdk-lib/aws-guardduty';
import * as kms from 'aws-cdk-lib/aws-kms';
import type { Construct } from 'constructs';

export interface PlatformKeys {
  data: kms.Key; // general data at rest (SEC-D01)
  bidBox: kms.Key; // sealed submissions — decrypt granted to evaluation role only after close (SEC-D04)
  audit: kms.Key; // audit trail + WORM archive
}

/**
 * Encryption keys and account-level threat detection/logging.
 * Customer-managed keys per tenant (SEC-D02) are created by the tenant-onboarding workflow, not here.
 */
export class SecurityStack extends Stack {
  readonly keys: PlatformKeys;

  constructor(scope: Construct, id: string, props: StackProps & { stage: string }) {
    super(scope, id, props);
    const retain = props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    const key = (name: string, description: string) =>
      new kms.Key(this, name, { description, enableKeyRotation: true, removalPolicy: retain });

    this.keys = {
      data: key('DataKey', 'Intuitive Fusion — data at rest'),
      bidBox: key('BidBoxKey', 'Intuitive Fusion — sealed tender submissions'),
      audit: key('AuditKey', 'Intuitive Fusion — audit trail'),
    };

    // Immutable logging of all control/data-plane actions (SEC-L02)
    new cloudtrail.Trail(this, 'Trail', {
      isMultiRegionTrail: true,
      enableFileValidation: true,
      encryptionKey: this.keys.audit,
      includeGlobalServiceEvents: true,
    });

    // Continuous threat monitoring (SEC-L06)
    new guardduty.CfnDetector(this, 'GuardDuty', { enable: true });

    // TODO: AWS Config conformance packs + auto-remediation (SEC-L08), Macie for sensitive-data
    //       discovery (SEC-D07), Security Hub with findings routed to the named security owner (SEC-IR03).
  }
}
