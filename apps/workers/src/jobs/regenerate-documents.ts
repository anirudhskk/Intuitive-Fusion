import { viewsAffectedBy } from '@if/domain';

/**
 * Keeps every document in sync with procurement facts (FR-0010, NFR-P01..P03).
 * Early-stage artefacts (request, plan, tender pack) re-render live; later-stage artefacts
 * (evaluation report, contract management records) are batched to manage AI cost (NFR-P02).
 */
const LIVE = new Set(['REQUEST', 'PROCUREMENT_PLAN', 'TENDER_PACK']);

export async function handler(event: { tenantId: string; procurementId: string; factKey: string }): Promise<{ live: string[]; batched: string[] }> {
  const views = viewsAffectedBy(event.factKey);
  const live = views.filter((v) => LIVE.has(v));
  const batched = views.filter((v) => !LIVE.has(v));
  // TODO: bindTemplate + DocumentRenderer for `live`; enqueue `batched` into the tenant's batch window
  return { live, batched };
}
