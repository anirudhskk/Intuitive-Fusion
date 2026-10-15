import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class GovernanceService {
  /** Declare conflict of interest (conversationally). FR-0105, FR-0300, FR-0370 */
  declareConflict(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('governance.declareConflict', 'FR-0105, FR-0300, FR-0370');
  }

  /** Record COI disposition and replacements. FR-0330, FR-0335 */
  recordDisposition(_declarationId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('governance.recordDisposition', 'FR-0330, FR-0335');
  }

  /** Resolve delegate for value tier with auto-escalation. FR-0715, FR-0725, SEC-AC04 */
  resolveDelegate(_id: string): Promise<unknown> {
    return notImplemented('governance.resolveDelegate', 'FR-0715, FR-0725, SEC-AC04');
  }

  /** One-screen AI summary for the delegate. FR-0785 */
  getApprovalSummary(_approvalId: string): Promise<unknown> {
    return notImplemented('governance.getApprovalSummary', 'FR-0785');
  }

  /** Approve/reject by click or voice; applies stamp. FR-0080, FR-0375, FR-0780 */
  decide(_approvalId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('governance.decide', 'FR-0080, FR-0375, FR-0780');
  }

  /** Read-only probity advisor portal. FR-0310, FR-0340 */
  listProbityProcurements(): Promise<unknown> {
    return notImplemented('governance.listProbityProcurements', 'FR-0310, FR-0340');
  }
}
