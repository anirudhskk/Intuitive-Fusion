import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class ContractsService {
  /** Draft contract (or work order under a master agreement): AI selects template, clause engine assembles. FR-0395, FR-0575, FR-0750 */
  draftContract(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contracts.draftContract', 'FR-0395, FR-0575, FR-0750');
  }

  /** Legal deviation register with AI risk ratings. FR-0125, FR-0400, FR-0475 */
  getDeviations(_contractId: string): Promise<unknown> {
    return notImplemented('contracts.getDeviations', 'FR-0125, FR-0400, FR-0475');
  }

  /** Cross-check winning submission against RFx. FR-0405 */
  consistencyCheck(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contracts.consistencyCheck', 'FR-0405');
  }

  /** Verify vendor legal name, tax and bank details before signing unlocks. FR-0415, FR-0440, SEC-TP03 */
  preflight(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contracts.preflight', 'FR-0415, FR-0440, SEC-TP03');
  }

  /** Start signing workflow (sequential/simultaneous/blind) after optional endorsements. FR-0380, FR-0410, FR-0420, FR-0425, FR-0480 */
  startSigning(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contracts.startSigning', 'FR-0380, FR-0410, FR-0420, FR-0425, FR-0480');
  }

  /** AI contract risk summary for the delegate. FR-0450 */
  getRiskSummary(_contractId: string): Promise<unknown> {
    return notImplemented('contracts.getRiskSummary', 'FR-0450');
  }

  /** Native legal matter board, review hours, clause library; live legal edits. FR-0385, FR-0465, FR-0470 */
  getLegalMatter(_contractId: string): Promise<unknown> {
    return notImplemented('contracts.getLegalMatter', 'FR-0385, FR-0465, FR-0470');
  }

  /** Soft-delete (authorised roles only; signed contracts are locked). FR-0455, NFR-CA02 */
  softDelete(_contractId: string): Promise<unknown> {
    return notImplemented('contracts.softDelete', 'FR-0455, NFR-CA02');
  }
}
