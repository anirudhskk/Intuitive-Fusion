import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class EvaluationService {
  /** Create one evaluation record per respondent, with pass/fail compliance gate. FR-0255, FR-0265, FR-0320 */
  createEvaluation(_tenderId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation.createEvaluation', 'FR-0255, FR-0265, FR-0320');
  }

  /** Role-scoped scoring sheet (pricing hidden from technical evaluators). FR-0260, FR-0270, SEC-AC07 */
  getMyScoringSheet(_evaluationId: string): Promise<unknown> {
    return notImplemented('evaluation.getMyScoringSheet', 'FR-0260, FR-0270, SEC-AC07');
  }

  /** Submit scores and comments, structured or plain language. FR-0270, FR-0280, FR-0315 */
  submitScores(_evaluationId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation.submitScores', 'FR-0270, FR-0280, FR-0315');
  }

  /** AI summary of each response: pricing, dates, variations, pros and cons. FR-0760 */
  getSubmissionSummaries(_evaluationId: string): Promise<unknown> {
    return notImplemented('evaluation.getSubmissionSummaries', 'FR-0760');
  }

  /** Side-by-side consensus view with deviation flags. FR-0275 */
  getConsensus(_evaluationId: string): Promise<unknown> {
    return notImplemented('evaluation.getConsensus', 'FR-0275');
  }

  /** Shortlist for next stage; notify unsuccessful suppliers. FR-0225, FR-0285 */
  shortlist(_evaluationId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation.shortlist', 'FR-0225, FR-0285');
  }

  /** AI negotiation strategy and BAFO workspace. FR-0290, FR-0295, FR-0485 */
  generateNegotiationPlan(_evaluationId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('evaluation.generateNegotiationPlan', 'FR-0290, FR-0295, FR-0485');
  }
}
