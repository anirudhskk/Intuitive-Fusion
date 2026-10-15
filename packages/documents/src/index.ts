import { createHash } from 'node:crypto';

export type OutputFormat = 'docx' | 'pdf';

/**
 * A template declares where each placeholder gets its value, e.g.
 *   { "milestones": "fact:milestones", "closingDate": "fact:keyDates.tenderClose", "agency": "tenant:name" }
 * Templates come from the platform defaults, panel suites (e.g. the Commonwealth Contracting Suite)
 * or the tenant's own uploads; the AI picks one from the workflow and the user can switch it (FR-0750).
 */
export type TemplateBindings = Record<string, string>;

export interface BindingSources {
  fact: Record<string, unknown>;
  tenant: Record<string, unknown>;
  procurement: Record<string, unknown>;
}

/** Resolve a template's bindings against current facts. Pure → re-run whenever a fact changes (NFR-P03). */
export function bindTemplate(bindings: TemplateBindings, sources: BindingSources): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [placeholder, ref] of Object.entries(bindings)) {
    const [source, path] = ref.split(':', 2) as [keyof BindingSources, string];
    out[placeholder] = path?.split('.').reduce<unknown>(
      (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
      sources[source],
    );
  }
  return out;
}

/**
 * Renders resolved data into a file. Implementations (TODO):
 *  - DocxRenderer — docxtemplater over the .docx template from S3
 *  - PdfRenderer  — headless LibreOffice/Gotenberg container on ECS (BRS §5.2 document generation)
 */
export interface DocumentRenderer {
  render(templateS3Key: string, data: Record<string, unknown>, format: OutputFormat): Promise<Uint8Array>;
}

/** Visible approval/signature stamp, in-platform and on generated documents (FR-0780, NFR-L04). */
export interface ApprovalStamp {
  approverName: string;
  roleTitle: string;
  decision: 'APPROVED' | 'REJECTED' | 'SIGNED' | 'ENDORSED';
  decidedAt: string; // ISO 8601, shown with timezone on documents
  channel: 'web' | 'mobile' | 'email_link' | 'voice' | 'teams';
  documentVersionHash: string;
}

export function stampText(s: ApprovalStamp): string {
  return `${s.decision} by ${s.approverName} (${s.roleTitle}) on ${s.decidedAt} via ${s.channel}`;
}

/** Hash binds the stamp to the exact document version it approved — later edits invalidate it. */
export function stampHash(s: ApprovalStamp): string {
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}
