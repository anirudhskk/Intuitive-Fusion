import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { IntegrationsService } from './integrations.service.js';

/** Connector management for ERP, legal, e-signature, sanctions, public registers and document repositories. See ./REQUIREMENTS.md. */
@ApiTags('integrations')
@Audience('internal')
@Controller()
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get('integrations')
  @ApiOperation({ summary: 'Configured connectors for this tenant', description: 'Requirements: NFR-C02..C07' })
  listConnectors() {
    return this.service.listConnectors();
  }

  @Post('integrations/:connector/test')
  @ApiOperation({ summary: 'Test a connector', description: 'Requirements: NFR-C07' })
  testConnector(@Param('connector') connector: string, @Body() body: Record<string, unknown>) {
    return this.service.testConnector(connector, body);
  }

  @Post('integrations/webhooks/:connector')
  @ApiOperation({ summary: 'Inbound webhook (idempotent)', description: 'Requirements: NFR-AV03' })
  receiveWebhook(@Param('connector') connector: string, @Body() body: Record<string, unknown>) {
    return this.service.receiveWebhook(connector, body);
  }

  @Post('integrations/:connector/reconcile')
  @ApiOperation({ summary: 'Reconcile missed syncs', description: 'Requirements: NFR-AV03, NFR-AV04' })
  reconcile(@Param('connector') connector: string, @Body() body: Record<string, unknown>) {
    return this.service.reconcile(connector, body);
  }
}
