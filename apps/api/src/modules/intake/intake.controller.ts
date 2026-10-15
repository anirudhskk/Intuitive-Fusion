import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { IntakeService } from './intake.service.js';

/** Single front door: users describe a need by voice or text; the AI fills the request, scores complexity, picks the workflow and flags required approvals. See ./REQUIREMENTS.md. */
@ApiTags('intake')
@Audience('internal')
@Controller()
export class IntakeController {
  constructor(private readonly service: IntakeService) {}

  @Post('intake/requests')
  @ApiOperation({ summary: 'Start a procurement request from a voice or text description', description: 'Requirements: FR-0005, FR-0006' })
  startRequest(@Body() body: Record<string, unknown>) {
    return this.service.startRequest(body);
  }

  @Post('intake/requests/:id/messages')
  @ApiOperation({ summary: 'Continue the intake conversation; AI populates fields and asks targeted follow-ups', description: 'Requirements: FR-0010, FR-0035' })
  sendMessage(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.sendMessage(id, body);
  }

  @Get('intake/requests/:id/missing-fields')
  @ApiOperation({ summary: 'List required fields not yet captured', description: 'Requirements: FR-0035' })
  getMissingFields(@Param('id') id: string) {
    return this.service.getMissingFields(id);
  }

  @Post('intake/requests/:id/budget-check')
  @ApiOperation({ summary: 'Real-time ERP pre-commitment budget check', description: 'Requirements: FR-0050, FR-0055, NFR-P04' })
  checkBudget(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.checkBudget(id, body);
  }

  @Get('intake/requests/:id/complexity')
  @ApiOperation({ summary: 'Complexity score, selected workflow and required engagements (IT, legal, cyber...)', description: 'Requirements: FR-0015, FR-0025, FR-0030, FR-0060' })
  getComplexity(@Param('id') id: string) {
    return this.service.getComplexity(id);
  }

  @Post('intake/requests/:id/submit')
  @ApiOperation({ summary: 'Submit via self-service or procurement-team-led route', description: 'Requirements: FR-0040, FR-0065' })
  submit(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.submit(id, body);
  }
}
