import { Module } from '@nestjs/common';
import { RfxController } from './rfx.controller.js';
import { RfxService } from './rfx.service.js';

@Module({
  controllers: [RfxController],
  providers: [RfxService],
  exports: [RfxService],
})
export class RfxModule {}
