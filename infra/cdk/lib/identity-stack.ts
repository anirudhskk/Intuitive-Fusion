import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import type { Construct } from 'constructs';

/**
 * Two isolated identity pools (SEC-A03):
 *  - Internal: federates each tenant's enterprise IdP via SAML/OIDC — Entra ID (Azure AD), Okta,
 *    Google, AWS IAM Identity Center (TR-05, SEC-A02). MFA enforced (SEC-A01).
 *  - Supplier: self-registration for external tenderers, separate directory.
 * Fine-grained permissions are Cedar/Verified Permissions, not Cognito groups alone.
 */
export class IdentityStack extends Stack {
  readonly internalPool: cognito.UserPool;
  readonly supplierPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: StackProps & { stage: string }) {
    super(scope, id, props);
    const removalPolicy = props.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    this.internalPool = new cognito.UserPool(this, 'InternalUsers', {
      selfSignUpEnabled: false,
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: { otp: true, sms: true }, // OPEN DECISION: SMS OTP acceptability (SEC-A01)
      customAttributes: { tenant_id: new cognito.StringAttribute({ mutable: false }) },
      removalPolicy,
    });
    // TODO per-tenant UserPoolIdentityProviderSaml / Oidc added by tenant onboarding

    this.supplierPool = new cognito.UserPool(this, 'SupplierUsers', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: { otp: true, sms: false },
      customAttributes: { supplier_id: new cognito.StringAttribute({ mutable: true }) },
      removalPolicy,
    });
  }
}
