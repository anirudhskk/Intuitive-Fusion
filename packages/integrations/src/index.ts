/**
 * Integration adapters. Every adapter:
 *  - is configured per tenant (IntegrationConnection) with credentials in Secrets Manager (SEC-N03)
 *  - maps field labels to the customer's naming (FR-0700)
 *  - is idempotent with retries + a reconciliation job for missed syncs (NFR-AV03)
 *  - has a manual fallback path when the remote system is down (NFR-AV04)
 * Middleware (MuleSoft, Boomi...) may sit between us and the customer; it must not be a weaker link (SEC-TP04).
 */

// ── ERP: SAP S/4HANA, Oracle Cloud, Microsoft Dynamics… (NFR-C02, FR-0050, FR-0495, FR-0580) ──
export interface BudgetCheckResult {
  status: 'CLEARED' | 'INSUFFICIENT_FUNDS' | 'NO_ACTIVE_LINE' | 'ERP_UNAVAILABLE';
  availableAmount?: number;
  budgetLineRef?: string;
}

export interface ErpAdapter {
  checkBudget(args: { costCentre: string; amount: number; currency: string; fiscalYear: string }): Promise<BudgetCheckResult>;
  syncOrgStructure(): Promise<{ orgUnits: number; costCentres: number }>;
  verifyVendor(args: { legalName: string; abn?: string; bankAccountHash?: string }): Promise<{ matched: boolean; mismatches: string[] }>;
  spendAgainstContract(contractNumber: string): Promise<{ invoiced: number; paid: number }>;
}

// ── Enterprise legal platforms: HighQ, Icertis… (NFR-C03, FR-0390) ──
export interface LegalSystemAdapter {
  openMatter(args: { contractId: string; summary: string; documents: string[] }): Promise<{ matterRef: string }>;
  getMatterStatus(matterRef: string): Promise<{ stage: string; redlinesAvailable: boolean }>;
}

// ── E-signature: native eIDAS-aligned baseline + DocuSign / Adobe Sign (NFR-C04, FR-0420, FR-0425) ──
export interface SigningRequest {
  documentS3Key: string;
  signatories: Array<{ name: string; email: string; order?: number; blind?: boolean }>;
  mode: 'sequential' | 'simultaneous';
}
export interface ESignatureAdapter {
  createEnvelope(req: SigningRequest): Promise<{ envelopeId: string }>;
  getStatus(envelopeId: string): Promise<{ completed: boolean; signedBy: string[] }>;
}

// ── Third-party risk: sanctions/watchlists and insurance verification (NFR-C05, SEC-TP01, SEC-TP05) ──
export interface SanctionsScreeningAdapter {
  screen(entity: { legalName: string; country: string; registrationNumber?: string }): Promise<{ hit: boolean; lists: string[]; reference: string }>;
}
export interface InsuranceVerificationAdapter {
  verify(certificateS3Key: string): Promise<{ policyLimit?: number; expiry?: string; valid: boolean }>;
}

// ── Public tender registers: AusTender, state portals, SAM.gov, TED (FR-0140, FR-0545) ──
export interface PublicRegisterAdapter {
  jurisdiction: string;
  publishNotice(args: { rfxId: string; title: string; closeAt: string; summary: string }): Promise<{ externalRef: string }>;
  discloseContract(args: { contractNumber: string; value: number; supplier: string }): Promise<{ externalRef: string }>;
}

// ── Enterprise document repositories: SharePoint… (NFR-C06, SEC-D11) ──
export interface DocumentRepositoryAdapter {
  write(path: string, content: Uint8Array): Promise<{ url: string }>;
  read(path: string): Promise<Uint8Array>;
}

// ── Notification channels (FR-0065) ──
export type NotificationChannelName = 'in_app' | 'email' | 'teams' | 'slack' | 'sms';

export interface NotificationMessage {
  tenantId: string;
  recipientUserIds: string[];
  subject: string;
  body: string;
  /** Deep link straight to the section needing action, e.g. the plan section a delegate must approve. */
  deepLink?: string;
}

export interface NotificationChannelAdapter {
  channel: NotificationChannelName;
  send(message: NotificationMessage): Promise<void>;
}
