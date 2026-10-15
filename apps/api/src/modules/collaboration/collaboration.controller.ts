import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { CollaborationService } from './collaboration.service.js';

/** Concurrent editing, versions and change summaries, template switching, phase advancement and membership. See ./REQUIREMENTS.md. */
@ApiTags('collaboration')
@Audience('internal')
@Controller()
export class CollaborationController {
  constructor(private readonly service: CollaborationService) {}

  @Get('documents/:documentId/versions')
  @ApiOperation({ summary: 'Version history and comparison', description: 'Requirements: FR-0740' })
  listVersions(@Param('documentId') documentId: string) {
    return this.service.listVersions(documentId);
  }

  @Get('documents/:documentId/changes-since-last-view')
  @ApiOperation({ summary: 'AI summary of changes since my last view', description: 'Requirements: FR-0740' })
  changesSinceLastView(@Param('documentId') documentId: string) {
    return this.service.changesSinceLastView(documentId);
  }

  @Post('documents/:documentId/template')
  @ApiOperation({ summary: 'Switch template by instruction and re-populate', description: 'Requirements: FR-0750' })
  changeTemplate(@Param('documentId') documentId: string, @Body() body: Record<string, unknown>) {
    return this.service.changeTemplate(documentId, body);
  }

  @Post('procurements/:id/advance')
  @ApiOperation({ summary: 'Advance phase by plain language', description: 'Requirements: FR-0770' })
  advancePhase(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.advancePhase(id, body);
  }

  @Put('procurements/:id/members')
  @ApiOperation({ summary: 'Add/remove members by instruction or name; evaluator substitution', description: 'Requirements: FR-0775, FR-0305' })
  updateMembers(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.updateMembers(id, body);
  }
}
