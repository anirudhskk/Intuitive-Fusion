import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class IntakeService {
  /** Start a procurement request from a voice or text description. FR-0005, FR-0006 */
  startRequest(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('intake.startRequest', 'FR-0005, FR-0006');
  }

  /** Continue the intake conversation; AI populates fields and asks targeted follow-ups. FR-0010, FR-0035 */
  sendMessage(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('intake.sendMessage', 'FR-0010, FR-0035');
  }

  /** List required fields not yet captured. FR-0035 */
  getMissingFields(_id: string): Promise<unknown> {
    return notImplemented('intake.getMissingFields', 'FR-0035');
  }

  /** Real-time ERP pre-commitment budget check. FR-0050, FR-0055, NFR-P04 */
  checkBudget(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('intake.checkBudget', 'FR-0050, FR-0055, NFR-P04');
  }

  /** Complexity score, selected workflow and required engagements (IT, legal, cyber...). FR-0015, FR-0025, FR-0030, FR-0060 */
  getComplexity(_id: string): Promise<unknown> {
    return notImplemented('intake.getComplexity', 'FR-0015, FR-0025, FR-0030, FR-0060');
  }

  /** Submit via self-service or procurement-team-led route. FR-0040, FR-0065 */
  submit(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('intake.submit', 'FR-0040, FR-0065');
  }
}
