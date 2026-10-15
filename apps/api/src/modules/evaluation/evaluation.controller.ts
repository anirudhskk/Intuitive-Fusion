import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { EvaluationService } from './evaluation.service.js';

/** Compliance gate, isolated individual scoring, consensus moderation, multi-stage shortlisting and negotiation/BAFO. See ./REQUIREMENTS.md. */
@ApiTags('evaluation')
@Audience('internal')
@Controller()
export class EvaluationController {
  constructor(private readonly service: EvaluationService) {}

  @Post('tenders/:tenderId/evaluation')
  @ApiOperation({ summary: 'Create one evaluation record per respondent, with pass/fail compliance gate', description: 'Requirements: FR-0255, FR-0265, FR-0320' })
  createEvaluation(@Param('tenderId') tenderId: string, @Body() body: Record<string, unknown>) {
    return this.service.createEvaluation(tenderId, body);
  }

  @Get('evaluations/:evaluationId/my-sheet')
  @ApiOperation({ summary: 'Role-scoped scoring sheet (pricing hidden from technical evaluators)', description: 'Requirements: FR-0260, FR-0270, SEC-AC07' })
  getMyScoringSheet(@Param('evaluationId') evaluationId: string) {
    return this.service.getMyScoringSheet(evaluationId);
  }

  @Post('evaluations/:evaluationId/scores')
  @ApiOperation({ summary: 'Submit scores and comments, structured or plain language', description: 'Requirements: FR-0270, FR-0280, FR-0315' })
  submitScores(@Param('evaluationId') evaluationId: string, @Body() body: Record<string, unknown>) {
    return this.service.submitScores(evaluationId, body);
  }

  @Get('evaluations/:evaluationId/submission-summaries')
  @ApiOperation({ summary: 'AI summary of each response: pricing, dates, variations, pros and cons', description: 'Requirements: FR-0760' })
  getSubmissionSummaries(@Param('evaluationId') evaluationId: string) {
    return this.service.getSubmissionSummaries(evaluationId);
  }

  @Get('evaluations/:evaluationId/consensus')
  @ApiOperation({ summary: 'Side-by-side consensus view with deviation flags', description: 'Requirements: FR-0275' })
  getConsensus(@Param('evaluationId') evaluationId: string) {
    return this.service.getConsensus(evaluationId);
  }

  @Post('evaluations/:evaluationId/shortlist')
  @ApiOperation({ summary: 'Shortlist for next stage; notify unsuccessful suppliers', description: 'Requirements: FR-0225, FR-0285' })
  shortlist(@Param('evaluationId') evaluationId: string, @Body() body: Record<string, unknown>) {
    return this.service.shortlist(evaluationId, body);
  }

  @Post('evaluations/:evaluationId/negotiation-plan')
  @ApiOperation({ summary: 'AI negotiation strategy and BAFO workspace', description: 'Requirements: FR-0290, FR-0295, FR-0485' })
  generateNegotiationPlan(@Param('evaluationId') evaluationId: string, @Body() body: Record<string, unknown>) {
    return this.service.generateNegotiationPlan(evaluationId, body);
  }
}
