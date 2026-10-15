import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class EvaluationReportService {
  /** Compile evaluation report / sourcing recommendation. FR-0345, FR-0350, FR-0360 */
  generateReport(_evaluationId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation-report.generateReport', 'FR-0345, FR-0350, FR-0360');
  }

  /** Get the evaluation report. FR-0345 */
  getReport(_reportId: string): Promise<unknown> {
    return notImplemented('evaluation-report.getReport', 'FR-0345');
  }

  /** Route to the delegate for the value tier. FR-0375 */
  submitForApproval(_reportId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation-report.submitForApproval', 'FR-0375');
  }

  /** Printable report with audit timestamps. FR-0355 */
  exportReport(_reportId: string): Promise<unknown> {
    return notImplemented('evaluation-report.exportReport', 'FR-0355');
  }
}
