import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { GovernanceService } from './governance.service.js';

/** Delegation of authority, approvals, conflict of interest, segregation of duties and probity oversight. See ./REQUIREMENTS.md. */
@ApiTags('governance')
@Audience('internal')
@Controller()
export class GovernanceController {
  constructor(private readonly service: GovernanceService) {}

  @Post('procurements/:id/coi-declarations')
  @ApiOperation({ summary: 'Declare conflict of interest (conversationally)', description: 'Requirements: FR-0105, FR-0300, FR-0370' })
  declareConflict(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.declareConflict(id, body);
  }

  @Post('coi-declarations/:declarationId/disposition')
  @ApiOperation({ summary: 'Record COI disposition and replacements', description: 'Requirements: FR-0330, FR-0335' })
  recordDisposition(@Param('declarationId') declarationId: string, @Body() body: Record<string, unknown>) {
    return this.service.recordDisposition(declarationId, body);
  }

  @Get('procurements/:id/delegate')
  @ApiOperation({ summary: 'Resolve delegate for value tier with auto-escalation', description: 'Requirements: FR-0715, FR-0725, SEC-AC04' })
  resolveDelegate(@Param('id') id: string) {
    return this.service.resolveDelegate(id);
  }

  @Get('approvals/:approvalId/summary')
  @ApiOperation({ summary: 'One-screen AI summary for the delegate', description: 'Requirements: FR-0785' })
  getApprovalSummary(@Param('approvalId') approvalId: string) {
    return this.service.getApprovalSummary(approvalId);
  }

  @Post('approvals/:approvalId/decision')
  @ApiOperation({ summary: 'Approve/reject by click or voice; applies stamp', description: 'Requirements: FR-0080, FR-0375, FR-0780' })
  decide(@Param('approvalId') approvalId: string, @Body() body: Record<string, unknown>) {
    return this.service.decide(approvalId, body);
  }

  @Get('probity/procurements')
  @ApiOperation({ summary: 'Read-only probity advisor portal', description: 'Requirements: FR-0310, FR-0340' })
  listProbityProcurements() {
    return this.service.listProbityProcurements();
  }
}
