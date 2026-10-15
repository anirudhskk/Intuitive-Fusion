import { ForbiddenException, Injectable } from '@nestjs/common';
import { type AuthzRequest, PolicyEngine } from '@if/authz';
import { currentContext } from '../tenancy/tenant-context.js';

/**
 * Fine-grained authorisation: RBAC + ABAC evaluated as Cedar policies (BRS §5.1 Verified Permissions).
 * Services call `assert()` before touching a record, e.g.
 *   await authz.assert('Score', { type: 'Evaluation', id: evaluationId });
 */
@Injectable()
export class AuthorizationService {
  private readonly engine = new PolicyEngine();

  async assert(action: string, resource: AuthzRequest['resource'], context: Record<string, unknown> = {}) {
    const { principal } = currentContext();
    const decision = await this.engine.isAuthorized({ principal, action, resource, context });
    if (!decision.allowed) {
      throw new ForbiddenException({ action, resource, reasons: decision.reasons });
    }
  }
}
