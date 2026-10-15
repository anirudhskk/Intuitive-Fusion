import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { AdminService } from './admin.service.js';

/** Tenant configuration: workflows, segmented admin settings, numbering and field labels. See ./REQUIREMENTS.md. */
@ApiTags('admin')
@Audience('internal')
@Controller()
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('admin/workflows')
  @ApiOperation({ summary: 'Workflow library (simple → high-risk/high-value)', description: 'Requirements: FR-0705' })
  listWorkflows() {
    return this.service.listWorkflows();
  }

  @Put('admin/workflows/:workflowId')
  @ApiOperation({ summary: 'Configure or design a workflow, incl. mandatory checkpoints', description: 'Requirements: FR-0710, FR-0720, FR-0730' })
  upsertWorkflow(@Param('workflowId') workflowId: string, @Body() body: Record<string, unknown>) {
    return this.service.upsertWorkflow(workflowId, body);
  }

  @Get('admin/config/:segment')
  @ApiOperation({ summary: 'Segmented settings (Finance, Users, Legal, Procurement, Delegations)', description: 'Requirements: FR-0680, FR-0685, SEC-AC11' })
  getConfig(@Param('segment') segment: string) {
    return this.service.getConfig(segment);
  }

  @Put('admin/config/:segment')
  @ApiOperation({ summary: 'Update settings (audited)', description: 'Requirements: FR-0690, NFR-M05' })
  updateConfig(@Param('segment') segment: string, @Body() body: Record<string, unknown>) {
    return this.service.updateConfig(segment, body);
  }

  @Put('admin/numbering')
  @ApiOperation({ summary: 'Procurement/contract number format', description: 'Requirements: FR-0695' })
  updateNumbering(@Body() body: Record<string, unknown>) {
    return this.service.updateNumbering(body);
  }

  @Put('admin/field-labels')
  @ApiOperation({ summary: 'Map field labels to customer naming', description: 'Requirements: FR-0700' })
  updateFieldLabels(@Body() body: Record<string, unknown>) {
    return this.service.updateFieldLabels(body);
  }
}
