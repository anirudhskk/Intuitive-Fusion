import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { EvaluationReportService } from './evaluation-report.service.js';

/** Auto-compiled evaluation report and sourcing recommendation with delegate approval. See ./REQUIREMENTS.md. */
@ApiTags('evaluation-report')
@Audience('internal')
@Controller()
export class EvaluationReportController {
  constructor(private readonly service: EvaluationReportService) {}

  @Post('evaluations/:evaluationId/report')
  @ApiOperation({ summary: 'Compile evaluation report / sourcing recommendation', description: 'Requirements: FR-0345, FR-0350, FR-0360' })
  generateReport(@Param('evaluationId') evaluationId: string, @Body() body: Record<string, unknown>) {
    return this.service.generateReport(evaluationId, body);
  }

  @Get('evaluation-reports/:reportId')
  @ApiOperation({ summary: 'Get the evaluation report', description: 'Requirements: FR-0345' })
  getReport(@Param('reportId') reportId: string) {
    return this.service.getReport(reportId);
  }

  @Post('evaluation-reports/:reportId/submit-for-approval')
  @ApiOperation({ summary: 'Route to the delegate for the value tier', description: 'Requirements: FR-0375' })
  submitForApproval(@Param('reportId') reportId: string, @Body() body: Record<string, unknown>) {
    return this.service.submitForApproval(reportId, body);
  }

  @Get('evaluation-reports/:reportId/export')
  @ApiOperation({ summary: 'Printable report with audit timestamps', description: 'Requirements: FR-0355' })
  exportReport(@Param('reportId') reportId: string) {
    return this.service.exportReport(reportId);
  }
}
