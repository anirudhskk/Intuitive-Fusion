import { Module } from '@nestjs/common';
import { TenderPortalController } from './tender-portal.controller.js';
import { TenderPortalService } from './tender-portal.service.js';

@Module({
  controllers: [TenderPortalController],
  providers: [TenderPortalService],
  exports: [TenderPortalService],
})
export class TenderPortalModule {}
