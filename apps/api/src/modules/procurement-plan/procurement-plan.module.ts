import { Module } from '@nestjs/common';
import { ProcurementPlanController } from './procurement-plan.controller.js';
import { ProcurementPlanService } from './procurement-plan.service.js';

@Module({
  controllers: [ProcurementPlanController],
  providers: [ProcurementPlanService],
  exports: [ProcurementPlanService],
})
export class ProcurementPlanModule {}
