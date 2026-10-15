import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { MigrationService } from './migration.service.js';

/** Ingest legacy procurement and contract records, validate, link, and AI-extract obligations. See ./REQUIREMENTS.md. */
@ApiTags('migration')
@Audience('internal')
@Controller()
export class MigrationController {
  constructor(private readonly service: MigrationService) {}

  @Post('migration/batches')
  @ApiOperation({ summary: 'Create a migration batch from exports or document repositories', description: 'Requirements: FR-0655' })
  createBatch(@Body() body: Record<string, unknown>) {
    return this.service.createBatch(body);
  }

  @Post('migration/batches/:batchId/validate')
  @ApiOperation({ summary: 'Validation and profiling pass', description: 'Requirements: FR-0665' })
  validateBatch(@Param('batchId') batchId: string, @Body() body: Record<string, unknown>) {
    return this.service.validateBatch(batchId, body);
  }

  @Get('migration/batches/:batchId/exceptions')
  @ApiOperation({ summary: 'Exceptions report', description: 'Requirements: FR-0665' })
  getExceptions(@Param('batchId') batchId: string) {
    return this.service.getExceptions(batchId);
  }

  @Post('migration/batches/:batchId/commit')
  @ApiOperation({ summary: 'Link records, extract obligations, create alerts', description: 'Requirements: FR-0660, FR-0670, FR-0675' })
  commitBatch(@Param('batchId') batchId: string, @Body() body: Record<string, unknown>) {
    return this.service.commitBatch(batchId, body);
  }
}
