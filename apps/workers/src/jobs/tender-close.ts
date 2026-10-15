/**
 * Tender close (FR-0165, SEC-AC13, SEC-D04). Runs exactly at Rfx.closeAt.
 *  1. Flip the bid-box bucket policy for this tender to deny further writes; discard incomplete
 *     multipart uploads; send each bidder an automatic receipt.
 *  2. Mark the Rfx closed → the Cedar `sealed-bid-box` policy now permits evaluators (after COI).
 *  3. Grant the evaluation role kms:Decrypt on this tender's envelope key (per-tenant CMK).
 *  4. Emit tender.closed → creates one evaluation record per respondent (FR-0255) and triggers
 *     COI re-declaration reminders now that supplier identities are known (FR-0325).
 * OPEN DECISION: optional dual-witness opening for high-value tenders (FR-0175).
 */
export async function handler(event: { tenantId: string; rfxId: string }): Promise<void> {
  // TODO implement steps above; must be idempotent (EventBridge may deliver twice)
  void event;
}
