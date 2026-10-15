export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

/** One immutable audit record (SEC-L01..L05, FR-0070). */
export interface AuditEvent {
  tenantId: string;
  requestId: string;
  actorId: string;
  actorKind: 'user' | 'ai' | 'system' | 'integration';
  actorRoles: string[];
  entityType: string;
  entityId: string;
  action: string;
  changes: FieldChange[];
  aiModelId?: string;
  occurredAt: string;
}

/** Field-level before/after comparison (SEC-L03). Shallow by design; nested values compared as JSON. */
export function diffFields(before: Record<string, unknown>, after: Record<string, unknown>): FieldChange[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes: FieldChange[] = [];
  for (const field of keys) {
    if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
      changes.push({ field, before: before[field] ?? null, after: after[field] ?? null });
    }
  }
  return changes;
}
