import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class AdminService {
  /** Workflow library (simple → high-risk/high-value). FR-0705 */
  listWorkflows(): Promise<unknown> {
    return notImplemented('admin.listWorkflows', 'FR-0705');
  }

  /** Configure or design a workflow, incl. mandatory checkpoints. FR-0710, FR-0720, FR-0730 */
  upsertWorkflow(_workflowId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('admin.upsertWorkflow', 'FR-0710, FR-0720, FR-0730');
  }

  /** Segmented settings (Finance, Users, Legal, Procurement, Delegations). FR-0680, FR-0685, SEC-AC11 */
  getConfig(_segment: string): Promise<unknown> {
    return notImplemented('admin.getConfig', 'FR-0680, FR-0685, SEC-AC11');
  }

  /** Update settings (audited). FR-0690, NFR-M05 */
  updateConfig(_segment: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('admin.updateConfig', 'FR-0690, NFR-M05');
  }

  /** Procurement/contract number format. FR-0695 */
  updateNumbering(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('admin.updateNumbering', 'FR-0695');
  }

  /** Map field labels to customer naming. FR-0700 */
  updateFieldLabels(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('admin.updateFieldLabels', 'FR-0700');
  }
}
