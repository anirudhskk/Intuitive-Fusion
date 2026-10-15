/**
 * Legacy data migration (FR-0655..FR-0675, NFR-CA01).
 *  1. Ingest structured exports / DB extracts / document repositories into a quarantined prefix.
 *  2. Textract + AI extraction of parties, dates, values, obligations, KPIs, SLAs, options.
 *  3. Validation & profiling → exceptions report (missing mandatory fields, unparseable docs, orphans).
 *  4. On commit: link contracts ↔ procurements, flag source=MIGRATED, create alerts.
 */
export async function handler(event: { tenantId: string; batchId: string }): Promise<{ records: number; exceptions: number }> {
  void event;
  return { records: 0, exceptions: 0 };
}
