/**
 * Job catalogue. Each handler is deployed as a Lambda (short jobs) or ECS task (document rendering,
 * migration) by infra/cdk WorkflowStack. Triggers are EventBridge rules on DomainEvents or schedules.
 */
export { handler as contractAlerts } from './jobs/contract-alerts.js';
export { handler as tenderClose } from './jobs/tender-close.js';
export { handler as regenerateDocuments } from './jobs/regenerate-documents.js';
export { handler as sendNotification } from './jobs/send-notification.js';
export { handler as approvalReminders } from './jobs/approval-reminders.js';
export { handler as refreshBestPractice } from './jobs/refresh-best-practice.js';
export { handler as migrationIngest } from './jobs/migration-ingest.js';

export const JOB_TRIGGERS = {
  contractAlerts: 'schedule: daily 06:00 tenant-local',
  tenderClose: 'schedule: one-off at Rfx.closeAt (EventBridge Scheduler)',
  regenerateDocuments: 'event: fact.changed',
  sendNotification: 'event: notification.requested',
  approvalReminders: 'schedule: hourly',
  refreshBestPractice: 'schedule: weekly (configurable monthly)',
  migrationIngest: 'event: migration batch uploaded',
} as const;
