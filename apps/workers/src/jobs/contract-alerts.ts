import { MANDATORY_EXPIRY_ALERT_DAYS } from '@if/domain';

/**
 * Contract alert engine (FR-0505, FR-0510, FR-0515, FR-0530).
 *  1. Ensure every active contract has the non-mutable 180/90/60-day expiry/extension countdown.
 *  2. Ensure notice-period alerts fire early enough (e.g. 90-day termination notice → alert at 150 days).
 *  3. Fire due alerts → notification.requested; recipients given as role titles are resolved now,
 *     so "whoever is in my manager's role at that time" works.
 */
export async function handler(event: { tenantId?: string } = {}): Promise<{ checked: number; fired: number }> {
  const offsets = [...MANDATORY_EXPIRY_ALERT_DAYS];
  // TODO for each tenant (or event.tenantId): upsert mandatory alerts at endDate - offsets; query due alerts; publish
  void offsets;
  void event;
  return { checked: 0, fired: 0 };
}
