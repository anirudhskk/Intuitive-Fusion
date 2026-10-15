import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { ContractsService } from './contracts.service.js';

/** Contract drafting via clause assembly, legal review and deviations, pre-flight checks and signing. See ./REQUIREMENTS.md. */
@ApiTags('contracts')
@Audience('internal')
@Controller()
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Post('procurements/:id/contract')
  @ApiOperation({ summary: 'Draft contract (or work order under a master agreement): AI selects template, clause engine assembles', description: 'Requirements: FR-0395, FR-0575, FR-0750' })
  draftContract(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.service.draftContract(id, body);
  }

  @Get('contracts/:contractId/deviations')
  @ApiOperation({ summary: 'Legal deviation register with AI risk ratings', description: 'Requirements: FR-0125, FR-0400, FR-0475' })
  getDeviations(@Param('contractId') contractId: string) {
    return this.service.getDeviations(contractId);
  }

  @Post('contracts/:contractId/consistency-check')
  @ApiOperation({ summary: 'Cross-check winning submission against RFx', description: 'Requirements: FR-0405' })
  consistencyCheck(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.consistencyCheck(contractId, body);
  }

  @Post('contracts/:contractId/preflight')
  @ApiOperation({ summary: 'Verify vendor legal name, tax and bank details before signing unlocks', description: 'Requirements: FR-0415, FR-0440, SEC-TP03' })
  preflight(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.preflight(contractId, body);
  }

  @Post('contracts/:contractId/signing')
  @ApiOperation({ summary: 'Start signing workflow (sequential/simultaneous/blind) after optional endorsements', description: 'Requirements: FR-0380, FR-0410, FR-0420, FR-0425, FR-0480' })
  startSigning(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.startSigning(contractId, body);
  }

  @Get('contracts/:contractId/risk-summary')
  @ApiOperation({ summary: 'AI contract risk summary for the delegate', description: 'Requirements: FR-0450' })
  getRiskSummary(@Param('contractId') contractId: string) {
    return this.service.getRiskSummary(contractId);
  }

  @Get('contracts/:contractId/legal-matter')
  @ApiOperation({ summary: 'Native legal matter board, review hours, clause library; live legal edits', description: 'Requirements: FR-0385, FR-0465, FR-0470' })
  getLegalMatter(@Param('contractId') contractId: string) {
    return this.service.getLegalMatter(contractId);
  }

  @Delete('contracts/:contractId')
  @ApiOperation({ summary: 'Soft-delete (authorised roles only; signed contracts are locked)', description: 'Requirements: FR-0455, NFR-CA02' })
  softDelete(@Param('contractId') contractId: string) {
    return this.service.softDelete(contractId);
  }
}
