import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class MigrationService {
  /** Create a migration batch from exports or document repositories. FR-0655 */
  createBatch(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('migration.createBatch', 'FR-0655');
  }

  /** Validation and profiling pass. FR-0665 */
  validateBatch(_batchId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('migration.validateBatch', 'FR-0665');
  }

  /** Exceptions report. FR-0665 */
  getExceptions(_batchId: string): Promise<unknown> {
    return notImplemented('migration.getExceptions', 'FR-0665');
  }

  /** Link records, extract obligations, create alerts. FR-0660, FR-0670, FR-0675 */
  commitBatch(_batchId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('migration.commitBatch', 'FR-0660, FR-0670, FR-0675');
  }
}
