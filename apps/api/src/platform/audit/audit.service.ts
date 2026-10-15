import { Injectable, Logger } from '@nestjs/common';
import { type AuditEvent, diffFields } from '@if/domain';
import { currentContext } from '../tenancy/tenant-context.js';

/**
 * Append-only audit trail (SEC-L01..L05, FR-0070, FR-0630, TR-06).
 *
 * Every mutation records who, what, when, the session role and a field-level before/after diff.
 * Storage: `audit_events` table with UPDATE/DELETE revoked from the app role, mirrored to an
 * S3 Object Lock (WORM) bucket for tamper evidence. AI actions and conversation turns are audited
 * the same way (SEC-L05).
 */
@Injectable()
export class AuditService {
  private readonly log = new Logger('Audit');

  async recordChange<T extends Record<string, unknown>>(
    entity: { type: string; id: string },
    action: string,
    before: T | null,
    after: T | null,
    meta: { actorKind?: AuditEvent['actorKind']; aiModelId?: string } = {},
  ): Promise<AuditEvent> {
    const { principal, tenantId, requestId } = currentContext();
    const event: AuditEvent = {
      tenantId,
      requestId,
      actorId: principal.userId,
      actorKind: meta.actorKind ?? 'user',
      actorRoles: principal.roles,
      entityType: entity.type,
      entityId: entity.id,
      action,
      changes: diffFields(before ?? {}, after ?? {}),
      aiModelId: meta.aiModelId,
      occurredAt: new Date().toISOString(),
    };
    // TODO persist via Prisma (append-only) + publish to EventBridge for the WORM archive
    this.log.debug(JSON.stringify(event));
    return event;
  }

  async recordAccess(entity: { type: string; id: string }, action: string): Promise<void> {
    // Read access to sensitive records (bids, evaluations, bank details) is audited too (FR-0615)
    await this.recordChange(entity, action, null, null);
  }
}
