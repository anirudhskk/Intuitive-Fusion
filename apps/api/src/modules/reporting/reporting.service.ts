import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class ReportingService {
  /** Role/hierarchy-based dashboard. FR-0590, FR-0600, FR-0650 */
  getDashboard(_role: string): Promise<unknown> {
    return notImplemented('reporting.getDashboard', 'FR-0590, FR-0600, FR-0650');
  }

  /** Procurement pipeline Gantt. FR-0595 */
  getPipelineGantt(): Promise<unknown> {
    return notImplemented('reporting.getPipelineGantt', 'FR-0595');
  }

  /** Contract expiry Gantt and 90-day report. FR-0635, FR-0640 */
  getContractExpiry(): Promise<unknown> {
    return notImplemented('reporting.getContractExpiry', 'FR-0635, FR-0640');
  }

  /** Spend by supplier, contract, BU, division; maverick spend; savings. FR-0605, FR-0645 */
  getSpend(): Promise<unknown> {
    return notImplemented('reporting.getSpend', 'FR-0605, FR-0645');
  }

  /** Natural-language question over reportable data. FR-0625, FR-0630 */
  ask(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('reporting.ask', 'FR-0625, FR-0630');
  }

  /** Unalterable probity/audit trail export. FR-0615, SEC-L07 */
  getProbityAudit(_procurementId: string): Promise<unknown> {
    return notImplemented('reporting.getProbityAudit', 'FR-0615, SEC-L07');
  }
}
