import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { ContractManagementService } from './contract-management.service.js';

/** Post-award obligations, alerts, spend tracking, variations and extensions. See ./REQUIREMENTS.md. */
@ApiTags('contract-management')
@Audience('internal')
@Controller()
export class ContractManagementController {
  constructor(private readonly service: ContractManagementService) {}

  @Get('contracts/:contractId/obligations')
  @ApiOperation({ summary: 'Obligations, KPIs and SLAs extracted from the contract', description: 'Requirements: FR-0490, FR-0530' })
  getObligations(@Param('contractId') contractId: string) {
    return this.service.getObligations(contractId);
  }

  @Get('contracts/:contractId/alerts')
  @ApiOperation({ summary: 'Alerts including non-mutable 180/90/60-day expiry countdown', description: 'Requirements: FR-0505, FR-0510' })
  getAlerts(@Param('contractId') contractId: string) {
    return this.service.getAlerts(contractId);
  }

  @Post('contracts/:contractId/alerts')
  @ApiOperation({ summary: 'Add a custom alert in plain language', description: 'Requirements: FR-0515' })
  addAlert(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.addAlert(contractId, body);
  }

  @Post('contracts/:contractId/variations')
  @ApiOperation({ summary: 'Variation linked to parent, with business case and cumulative-variance calculation', description: 'Requirements: FR-0460, FR-0535, FR-0540, FR-0565' })
  createVariation(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.createVariation(contractId, body);
  }

  @Post('contracts/:contractId/extensions')
  @ApiOperation({ summary: 'Exercise an optional extension (new linked procurement)', description: 'Requirements: FR-0570' })
  exerciseExtension(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.exerciseExtension(contractId, body);
  }

  @Get('contracts/:contractId/spend')
  @ApiOperation({ summary: 'Live spend vs contract value and term', description: 'Requirements: FR-0580' })
  getSpend(@Param('contractId') contractId: string) {
    return this.service.getSpend(contractId);
  }

  @Post('contracts/:contractId/management-plan')
  @ApiOperation({ summary: 'Auto-populate contract & risk management plans', description: 'Requirements: FR-0555' })
  generateManagementPlans(@Param('contractId') contractId: string, @Body() body: Record<string, unknown>) {
    return this.service.generateManagementPlans(contractId, body);
  }
}
