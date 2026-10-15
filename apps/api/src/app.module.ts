import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

// Platform (cross-cutting) modules
import { AuditInterceptor } from './platform/audit/audit.interceptor.js';
import { AuditModule } from './platform/audit/audit.module.js';
import { AuthGuard } from './platform/auth/auth.guard.js';
import { AuthModule } from './platform/auth/auth.module.js';
import { ConversationsModule } from './platform/conversations/conversations.module.js';
import { DocumentsModule } from './platform/documents/documents.module.js';
import { HealthModule } from './platform/health/health.module.js';
import { NotificationsModule } from './platform/notifications/notifications.module.js';
import { PrismaModule } from './platform/prisma/prisma.module.js';
import { TenantContextInterceptor } from './platform/tenancy/tenant-context.interceptor.js';

// Domain modules — one per use case (UC-01..UC-15)
import {
  AdminModule,
  CollaborationModule,
  ContractManagementModule,
  ContractsModule,
  EvaluationModule,
  EvaluationReportModule,
  GovernanceModule,
  IntakeModule,
  IntegrationsModule,
  MigrationModule,
  ProcurementPlanModule,
  ReportingModule,
  RfxModule,
  SuppliersModule,
  TenderPortalModule,
} from './modules/index.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditModule,
    HealthModule,
    ConversationsModule,
    DocumentsModule,
    NotificationsModule,

    IntakeModule,
    ProcurementPlanModule,
    RfxModule,
    TenderPortalModule,
    SuppliersModule,
    EvaluationModule,
    EvaluationReportModule,
    ContractsModule,
    ContractManagementModule,
    ReportingModule,
    MigrationModule,
    AdminModule,
    GovernanceModule,
    IntegrationsModule,
    CollaborationModule,
  ],
  providers: [
    // Order matters: authenticate → bind tenant context → audit the mutation.
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
