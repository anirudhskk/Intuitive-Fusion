// Domain modules — one per provisional use case (UC-01..UC-15) in the Requirements Register.
export { IntakeModule } from './intake/intake.module.js';
export { ProcurementPlanModule } from './procurement-plan/procurement-plan.module.js';
export { RfxModule } from './rfx/rfx.module.js';
export { TenderPortalModule } from './tender-portal/tender-portal.module.js';
export { SuppliersModule } from './suppliers/suppliers.module.js';
export { EvaluationModule } from './evaluation/evaluation.module.js';
export { EvaluationReportModule } from './evaluation-report/evaluation-report.module.js';
export { ContractsModule } from './contracts/contracts.module.js';
export { ContractManagementModule } from './contract-management/contract-management.module.js';
export { ReportingModule } from './reporting/reporting.module.js';
export { MigrationModule } from './migration/migration.module.js';
export { AdminModule } from './admin/admin.module.js';
export { GovernanceModule } from './governance/governance.module.js';
export { IntegrationsModule } from './integrations/integrations.module.js';
export { CollaborationModule } from './collaboration/collaboration.module.js';

export const DOMAIN_MODULE_NAMES = [
  'intake',
  'procurement-plan',
  'rfx',
  'tender-portal',
  'suppliers',
  'evaluation',
  'evaluation-report',
  'contracts',
  'contract-management',
  'reporting',
  'migration',
  'admin',
  'governance',
  'integrations',
  'collaboration',
] as const;
