/**
 * Domain events published to the tenant event bus (EventBridge, BRS §5.2). Workers, integrations,
 * notifications and the analytics pipeline subscribe to these instead of calling each other.
 */
export type DomainEvent =
  | { type: 'procurement.created'; procurementId: string }
  | { type: 'fact.changed'; procurementId: string; factKey: string; version: number }
  | { type: 'approval.requested'; approvalId: string; subjectType: string; subjectId: string }
  | { type: 'approval.decided'; approvalId: string; decision: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN' }
  | { type: 'coi.declared'; procurementId: string; userId: string; hasConflict: boolean }
  | { type: 'rfx.published'; rfxId: string }
  | { type: 'tender.closed'; rfxId: string }
  | { type: 'submission.received'; rfxId: string; submissionId: string }
  | { type: 'evaluation.consensus_locked'; evaluationId: string }
  | { type: 'contract.signed'; contractId: string }
  | { type: 'alert.due'; alertId: string }
  | { type: 'notification.requested'; channels: string[]; recipientUserIds: string[]; subject: string; deepLink?: string };

export interface EventEnvelope<E extends DomainEvent = DomainEvent> {
  id: string;
  tenantId: string;
  occurredAt: string;
  actorId: string;
  event: E;
}
