import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { TenderPortalService } from './tender-portal.service.js';

/** Supplier-facing tender access and the sealed, encrypted bid box. Nothing internal can read a submission before close. See ./REQUIREMENTS.md. */
@ApiTags('tender-portal')
@Audience('supplier')
@Controller()
export class TenderPortalController {
  constructor(private readonly service: TenderPortalService) {}

  @Get('portal/tenders')
  @ApiOperation({ summary: 'Tenders this supplier can see (open, or invited if closed)', description: 'Requirements: FR-0155, FR-0160' })
  listTenders() {
    return this.service.listTenders();
  }

  @Get('portal/tenders/:tenderId')
  @ApiOperation({ summary: 'Tender detail and downloadable pack', description: 'Requirements: FR-0155, FR-0200' })
  getTender(@Param('tenderId') tenderId: string) {
    return this.service.getTender(tenderId);
  }

  @Post('portal/tenders/:tenderId/submissions')
  @ApiOperation({ summary: 'Start an encrypted upload into the sealed bid box (presigned, KMS envelope)', description: 'Requirements: FR-0165, FR-0170, FR-0230, SEC-D03, SEC-D04, SEC-AP04' })
  createSubmission(@Param('tenderId') tenderId: string, @Body() body: Record<string, unknown>) {
    return this.service.createSubmission(tenderId, body);
  }

  @Post('portal/tenders/:tenderId/questions')
  @ApiOperation({ summary: 'Ask a clarification question', description: 'Requirements: FR-0135, FR-0195' })
  askQuestion(@Param('tenderId') tenderId: string, @Body() body: Record<string, unknown>) {
    return this.service.askQuestion(tenderId, body);
  }

  @Audience('internal')
  @Post('tenders/:tenderId/addenda')
  @ApiOperation({ summary: 'Buyer issues an addendum or changes dates; bidders notified', description: 'Requirements: FR-0210' })
  issueAddendum(@Param('tenderId') tenderId: string, @Body() body: Record<string, unknown>) {
    return this.service.issueAddendum(tenderId, body);
  }

  @Audience('internal')
  @Post('tenders/:tenderId/close')
  @ApiOperation({ summary: 'Close: lock submissions, discard partial uploads, unseal for evaluation', description: 'Requirements: FR-0165, SEC-AC13' })
  closeTender(@Param('tenderId') tenderId: string, @Body() body: Record<string, unknown>) {
    return this.service.closeTender(tenderId, body);
  }
}
