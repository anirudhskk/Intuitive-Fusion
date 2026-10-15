import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { RfxService } from './rfx.service.js';

/** RFT/RFP/RFQ/RFI/EOI authoring from the plan, tender pack assembly, anonymised Q&A and controlled publication. See ./REQUIREMENTS.md. */
@ApiTags('rfx')
@Audience('internal')
@Controller()
export class RfxController {
  constructor(private readonly service: RfxService) {}

  @Post('procurements/:id/rfx')
  @ApiOperation({ summary: 'Create RFx, auto-populated from intake and plan; AI selects the template', description: 'Requirements: FR-0110, FR-0750' })
  createRfx(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.createRfx(id, body);
  }

  @Get('rfx/:rfxId')
  @ApiOperation({ summary: 'Get RFx content', description: 'Requirements: FR-0110' })
  getRfx(@Param('rfxId') rfxId: string) {
    return this.service.getRfx(rfxId);
  }

  @Post('rfx/:rfxId/assemble')
  @ApiOperation({ summary: 'Assemble the tender pack with corporate terms and legal schedules', description: 'Requirements: FR-0120' })
  assemblePack(@Param('rfxId') rfxId: string, @Body() body: Record<string, unknown>) {
    return this.service.assemblePack(rfxId, body);
  }

  @Post('rfx/:rfxId/questions/:questionId/answer')
  @ApiOperation({ summary: 'Answer a supplier question anonymously; publish to one or all', description: 'Requirements: FR-0135, FR-0195' })
  answerQuestion(@Param('rfxId') rfxId: string, @Param('questionId') questionId: string, @Body() body: Record<string, unknown>) {
    return this.service.answerQuestion(rfxId, questionId, body);
  }

  @Post('rfx/:rfxId/request-publish')
  @ApiOperation({ summary: 'Validate statutory windows and request delegate permission to publish', description: 'Requirements: FR-0145, FR-0150, NFR-L01' })
  requestPublish(@Param('rfxId') rfxId: string, @Body() body: Record<string, unknown>) {
    return this.service.requestPublish(rfxId, body);
  }

  @Post('rfx/:rfxId/publish')
  @ApiOperation({ summary: 'Publish and route to public registers (e.g. AusTender)', description: 'Requirements: FR-0140' })
  publish(@Param('rfxId') rfxId: string, @Body() body: Record<string, unknown>) {
    return this.service.publish(rfxId, body);
  }
}
