import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class CollaborationService {
  /** Version history and comparison. FR-0740 */
  listVersions(_documentId: string): Promise<unknown> {
    return notImplemented('collaboration.listVersions', 'FR-0740');
  }

  /** AI summary of changes since my last view. FR-0740 */
  changesSinceLastView(_documentId: string): Promise<unknown> {
    return notImplemented('collaboration.changesSinceLastView', 'FR-0740');
  }

  /** Switch template by instruction and re-populate. FR-0750 */
  changeTemplate(_documentId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('collaboration.changeTemplate', 'FR-0750');
  }

  /** Advance phase by plain language. FR-0770 */
  advancePhase(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('collaboration.advancePhase', 'FR-0770');
  }

  /** Add/remove members by instruction or name; evaluator substitution. FR-0775, FR-0305 */
  updateMembers(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('collaboration.updateMembers', 'FR-0775, FR-0305');
  }
}
