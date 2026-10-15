import { Module } from '@nestjs/common';
import { ContractManagementController } from './contract-management.controller.js';
import { ContractManagementService } from './contract-management.service.js';

@Module({
  controllers: [ContractManagementController],
  providers: [ContractManagementService],
  exports: [ContractManagementService],
})
export class ContractManagementModule {}
