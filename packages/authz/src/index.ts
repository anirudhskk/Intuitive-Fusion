import { IsAuthorizedCommand, VerifiedPermissionsClient } from '@aws-sdk/client-verifiedpermissions';
import type { Principal } from '@if/domain';

/**
 * Fine-grained authorisation (SEC-AC01..AC13). Policies live in ../policies/*.cedar and are
 * deployed to an Amazon Verified Permissions policy store per environment (BRS §5.1).
 *
 * Deny by default: if no policy store is configured the engine refuses everything, so a missing
 * config can never silently open access.
 */
export interface AuthzRequest {
  principal: Principal;
  action: string; // e.g. "ScoreSubmission", "Approve", "ReadSubmission"
  resource: { type: string; id: string };
  context?: Record<string, unknown>;
}

export interface AuthzDecision {
  allowed: boolean;
  reasons: string[]; // determining policy ids, e.g. "sealed-bid-box"
}

export class PolicyEngine {
  private readonly client?: VerifiedPermissionsClient;
  private readonly policyStoreId = process.env.AVP_POLICY_STORE_ID;

  constructor() {
    if (this.policyStoreId) this.client = new VerifiedPermissionsClient({});
  }

  async isAuthorized(req: AuthzRequest): Promise<AuthzDecision> {
    if (!this.client || !this.policyStoreId) {
      return { allowed: false, reasons: ['policy-store-not-configured'] };
    }
    // TODO build the entities slice (principal roles, resource parents/attributes) from the DB
    const out = await this.client.send(
      new IsAuthorizedCommand({
        policyStoreId: this.policyStoreId,
        principal: { entityType: 'IF::User', entityId: req.principal.userId },
        action: { actionType: 'IF::Action', actionId: req.action },
        resource: { entityType: `IF::${req.resource.type}`, entityId: req.resource.id },
      }),
    );
    return {
      allowed: out.decision === 'ALLOW',
      reasons: (out.determiningPolicies ?? []).map((p) => p.policyId ?? 'unknown'),
    };
  }
}
