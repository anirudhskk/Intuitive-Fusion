import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class ProcurementPlanService {
  /** Get the procurement plan (fields bound to procurement facts). FR-0075 */
  getPlan(_id: string): Promise<unknown> {
    return notImplemented('procurement-plan.getPlan', 'FR-0075');
  }

  /** Amend a field directly. FR-0075, NFR-U08 */
  amendField(_id: string, _fieldKey: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('procurement-plan.amendField', 'FR-0075, NFR-U08');
  }

  /** Natural-language amendment, e.g. 'change paragraph 3 only'. FR-0075, FR-0745 */
  amendByInstruction(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('procurement-plan.amendByInstruction', 'FR-0075, FR-0745');
  }

  /** Route the plan to signatories and delegate. FR-0080, FR-0100 */
  submitForApproval(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('procurement-plan.submitForApproval', 'FR-0080, FR-0100');
  }

  /** Procurement-team reopen of an approved (locked) plan. AI narrative — Procurement Plan */
  reopen(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('procurement-plan.reopen', 'AI narrative — Procurement Plan');
  }

  /** Printable Word/PDF with approval stamps. FR-0780, NFR-U03 */
  exportPlan(_id: string): Promise<unknown> {
    return notImplemented('procurement-plan.exportPlan', 'FR-0780, NFR-U03');
  }
}
