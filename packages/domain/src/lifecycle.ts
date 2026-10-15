/** End-to-end procurement lifecycle. Mirrors the Prisma enum; shared with frontends. */
export const PROCUREMENT_PHASES = [
  'INTAKE',
  'PLANNING',
  'PLAN_APPROVAL',
  'RFX_PREPARATION',
  'OPEN_TO_MARKET',
  'EVALUATION',
  'NEGOTIATION',
  'REPORT_APPROVAL',
  'CONTRACT_DRAFTING',
  'SIGNING',
  'CONTRACT_MANAGEMENT',
  'CLOSED',
  'CANCELLED',
] as const;
export type ProcurementPhase = (typeof PROCUREMENT_PHASES)[number];

export type ComplexityScore = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IntakeRoute = 'SELF_SERVICE' | 'PROCUREMENT_TEAM_LED';
export type RfxType = 'RFT' | 'RFP' | 'RFQ' | 'RFI' | 'EOI';

/**
 * Hard-coded, non-mutable contract expiry countdown in days (FR-0510). Users can add alerts but
 * cannot remove these.
 */
export const MANDATORY_EXPIRY_ALERT_DAYS = [180, 90, 60] as const;
