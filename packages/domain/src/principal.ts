/** The authenticated caller, as seen by every layer after the auth guard. */
export interface Principal {
  userId: string;
  tenantId: string;
  /** Internal staff and suppliers come from separate identity pools (SEC-A03). */
  audience: 'internal' | 'supplier';
  roles: string[];
  orgUnitIds: string[];
  supplierId?: string;
}

/** Platform roles referenced by authorisation policies. Tenants map IdP groups onto these. */
export const PLATFORM_ROLES = [
  'business_user',
  'procurement_officer',
  'procurement_lead',
  'delegate',
  'evaluator',
  'panel_chair',
  'probity_advisor',
  'tender_administrator',
  'legal',
  'finance',
  'risk_compliance',
  'executive',
  'auditor',
  'admin_finance',
  'admin_users',
  'admin_legal',
  'admin_procurement',
  'admin_delegations',
  'supplier_contact',
] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];
