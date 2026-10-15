import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { ProcurementPlanService } from './procurement-plan.service.js';

/** The procurement plan as a view over procurement facts: auto-populated, collaboratively edited, approved, then locked. See ./REQUIREMENTS.md. */
@ApiTags('procurement-plan')
@Audience('internal')
@Controller()
export class ProcurementPlanController {
  constructor(private readonly service: ProcurementPlanService) {}

  @Get('procurements/:id/plan')
  @ApiOperation({ summary: 'Get the procurement plan (fields bound to procurement facts)', description: 'Requirements: FR-0075' })
  getPlan(@Param('id') id: string) {
    return this.service.getPlan(id);
  }

  @Patch('procurements/:id/plan/fields/:fieldKey')
  @ApiOperation({ summary: 'Amend a field directly', description: 'Requirements: FR-0075, NFR-U08' })
  amendField(@Param('id') id: string, @Param('fieldKey') fieldKey: string, @Body() body: Record<string, unknown>) {
    return this.service.amendField(id, fieldKey, body);
  }

  @Post('procurements/:id/plan/amend')
  @ApiOperation({ summary: "Natural-language amendment, e.g. 'change paragraph 3 only'", description: 'Requirements: FR-0075, FR-0745' })
  amendByInstruction(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.amendByInstruction(id, body);
  }

  @Post('procurements/:id/plan/submit-for-approval')
  @ApiOperation({ summary: 'Route the plan to signatories and delegate', description: 'Requirements: FR-0080, FR-0100' })
  submitForApproval(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.submitForApproval(id, body);
  }

  @Post('procurements/:id/plan/reopen')
  @ApiOperation({ summary: 'Procurement-team reopen of an approved (locked) plan', description: 'Requirements: AI narrative — Procurement Plan' })
  reopen(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.reopen(id, body);
  }

  @Get('procurements/:id/plan/export')
  @ApiOperation({ summary: 'Printable Word/PDF with approval stamps', description: 'Requirements: FR-0780, NFR-U03' })
  exportPlan(@Param('id') id: string) {
    return this.service.exportPlan(id);
  }
}
