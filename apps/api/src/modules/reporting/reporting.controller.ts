import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { ReportingService } from './reporting.service.js';

/** Role-based dashboards, Gantt views, spend analytics, natural-language reporting and probity exports. Reads from the analytics layer, not the transactional DB. See ./REQUIREMENTS.md. */
@ApiTags('reporting')
@Audience('internal')
@Controller()
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Get('dashboards/:role')
  @ApiOperation({ summary: 'Role/hierarchy-based dashboard', description: 'Requirements: FR-0590, FR-0600, FR-0650' })
  getDashboard(@Param('role') role: string) {
    return this.service.getDashboard(role);
  }

  @Get('reports/pipeline-gantt')
  @ApiOperation({ summary: 'Procurement pipeline Gantt', description: 'Requirements: FR-0595' })
  getPipelineGantt() {
    return this.service.getPipelineGantt();
  }

  @Get('reports/contract-expiry')
  @ApiOperation({ summary: 'Contract expiry Gantt and 90-day report', description: 'Requirements: FR-0635, FR-0640' })
  getContractExpiry() {
    return this.service.getContractExpiry();
  }

  @Get('reports/spend')
  @ApiOperation({ summary: 'Spend by supplier, contract, BU, division; maverick spend; savings', description: 'Requirements: FR-0605, FR-0645' })
  getSpend() {
    return this.service.getSpend();
  }

  @Post('reports/ask')
  @ApiOperation({ summary: 'Natural-language question over reportable data', description: 'Requirements: FR-0625, FR-0630' })
  ask(@Body() body: Record<string, unknown>) {
    return this.service.ask(body);
  }

  @Get('reports/probity-audit/:procurementId')
  @ApiOperation({ summary: 'Unalterable probity/audit trail export', description: 'Requirements: FR-0615, SEC-L07' })
  getProbityAudit(@Param('procurementId') procurementId: string) {
    return this.service.getProbityAudit(procurementId);
  }
}
