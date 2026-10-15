import { Global, Module } from '@nestjs/common';
import { AuditInterceptor } from './audit.interceptor.js';
import { AuditService } from './audit.service.js';

@Global()
@Module({
  providers: [AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
