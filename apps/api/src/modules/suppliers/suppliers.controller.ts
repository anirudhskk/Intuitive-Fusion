import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Audience } from '../../platform/auth/audience.decorator.js';
import { SuppliersService } from './suppliers.service.js';

/** Supplier self-registration, invitations, contact management and compliance profile (insurance, sanctions). See ./REQUIREMENTS.md. */
@ApiTags('suppliers')
@Audience('supplier')
@Controller()
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Post('suppliers/register')
  @ApiOperation({ summary: 'Self-register by voice or text (ABN, contacts, bank details)', description: 'Requirements: FR-0235' })
  register(@Body() body: Record<string, unknown>) {
    return this.service.register(body);
  }

  @Audience('internal')
  @Post('suppliers/invitations')
  @ApiOperation({ summary: 'Invite a prospective supplier with a unique set-up link', description: 'Requirements: FR-0240' })
  invite(@Body() body: Record<string, unknown>) {
    return this.service.invite(body);
  }

  @Audience('any')
  @Get('suppliers/:supplierId')
  @ApiOperation({ summary: 'Supplier profile with insurance and screening status', description: 'Requirements: FR-0250' })
  getProfile(@Param('supplierId') supplierId: string) {
    return this.service.getProfile(supplierId);
  }

  @Put('suppliers/:supplierId/contacts')
  @ApiOperation({ summary: 'Manage and reassign supplier contacts', description: 'Requirements: FR-0245, SEC-A06' })
  updateContacts(@Param('supplierId') supplierId: string, @Body() body: Record<string, unknown>) {
    return this.service.updateContacts(supplierId, body);
  }

  @Audience('internal')
  @Post('suppliers/:supplierId/screening')
  @ApiOperation({ summary: 'Sanctions/watchlist screening and insurance compliance hold', description: 'Requirements: FR-0180, FR-0550, SEC-TP01, SEC-TP05' })
  runScreening(@Param('supplierId') supplierId: string, @Body() body: Record<string, unknown>) {
    return this.service.runScreening(supplierId, body);
  }
}
