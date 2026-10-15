import { Controller, Get, Module, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type OutputFormat } from '@if/documents';
import { Audience } from '../auth/audience.decorator.js';
import { notImplemented } from '../common/not-implemented.js';

/**
 * Rendering of any document (plan, RFx, evaluation report, contract, CMP/RMP) to Word or PDF with
 * approval stamps and audit timestamps. Documents are views over procurement facts — rendering
 * binds the template to the current facts (see @if/documents).
 */
@ApiTags('documents')
@Audience('any')
@Controller('documents')
class DocumentsController {
  @Get(':documentId/render')
  @ApiOperation({
    summary: 'Render a document to Word or PDF',
    description: 'Requirements: NFR-U03, FR-0355, FR-0780, FR-0465',
  })
  render(@Param('documentId') documentId: string, @Query('format') format: OutputFormat = 'pdf') {
    return notImplemented(`documents.render(${documentId}, ${format})`, 'NFR-U03, FR-0780');
  }
}

@Module({ controllers: [DocumentsController] })
export class DocumentsModule {}
