import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Principal } from '@if/domain';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { AUDIENCE_KEY, type RouteAudience } from './audience.decorator.js';

/**
 * Authenticates every request.
 *  - Internal users: enterprise SSO (Azure AD/Entra, Okta, Google, AWS IAM Identity Center) federated
 *    through the internal Cognito pool via SAML/OIDC (SEC-A02, TR-05). MFA enforced at the IdP/pool (SEC-A01).
 *  - Suppliers: separate federated pool (SEC-A03).
 * Authorisation (who may do what to which record) is NOT done here — see @if/authz (Cedar).
 *
 * OPEN DECISION: approve-from-email without sign-in (NFR-U05) vs mandatory SSO for all actions (SEC-A04).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwks = {
    internal: process.env.OIDC_INTERNAL_ISSUER
      ? createRemoteJWKSet(new URL(`${process.env.OIDC_INTERNAL_ISSUER}/.well-known/jwks.json`))
      : undefined,
    supplier: process.env.OIDC_SUPPLIER_ISSUER
      ? createRemoteJWKSet(new URL(`${process.env.OIDC_SUPPLIER_ISSUER}/.well-known/jwks.json`))
      : undefined,
  };

  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const audience =
      this.reflector.getAllAndOverride<RouteAudience>(AUDIENCE_KEY, [ctx.getHandler(), ctx.getClass()]) ??
      'internal';
    if (audience === 'public') return true;

    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; principal?: Principal }>();

    // Local development only — never enabled in deployed environments (SEC-AP06).
    if (process.env.AUTH_DEV_BYPASS === 'true' && req.headers['x-dev-principal']) {
      req.principal = JSON.parse(req.headers['x-dev-principal']) as Principal;
      return this.audienceAllowed(audience, req.principal);
    }

    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token) throw new UnauthorizedException();

    req.principal = await this.verify(token);
    if (!this.audienceAllowed(audience, req.principal)) throw new UnauthorizedException();
    return true;
  }

  private audienceAllowed(route: RouteAudience, p: Principal): boolean {
    return route === 'any' || route === p.audience;
  }

  private async verify(token: string): Promise<Principal> {
    for (const pool of ['internal', 'supplier'] as const) {
      const jwks = this.jwks[pool];
      if (!jwks) continue;
      try {
        const { payload } = await jwtVerify(token, jwks);
        return toPrincipal(payload, pool);
      } catch {
        /* try the next pool */
      }
    }
    throw new UnauthorizedException();
  }
}

function toPrincipal(claims: JWTPayload, audience: 'internal' | 'supplier'): Principal {
  // TODO map IdP group/role claims to platform roles via tenant config (SEC-AC01)
  return {
    userId: String(claims.sub),
    tenantId: String(claims['custom:tenant_id'] ?? ''),
    audience,
    roles: (claims['cognito:groups'] as string[] | undefined) ?? [],
    orgUnitIds: [],
    supplierId: audience === 'supplier' ? String(claims['custom:supplier_id'] ?? '') : undefined,
  };
}
