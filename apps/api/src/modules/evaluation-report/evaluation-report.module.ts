import { Module } from '@nestjs/common';
import { EvaluationReportController } from './evaluation-report.controller.js';
import { EvaluationReportService } from './evaluation-report.service.js';

@Module({
  controllers: [EvaluationReportController],
  providers: [EvaluationReportService],
  exports: [EvaluationReportService],
})
export class EvaluationReportModule {}
