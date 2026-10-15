import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class ContractManagementService {
  /** Obligations, KPIs and SLAs extracted from the contract. FR-0490, FR-0530 */
  getObligations(_contractId: string): Promise<unknown> {
    return notImplemented('contract-management.getObligations', 'FR-0490, FR-0530');
  }

  /** Alerts including non-mutable 180/90/60-day expiry countdown. FR-0505, FR-0510 */
  getAlerts(_contractId: string): Promise<unknown> {
    return notImplemented('contract-management.getAlerts', 'FR-0505, FR-0510');
  }

  /** Add a custom alert in plain language. FR-0515 */
  addAlert(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contract-management.addAlert', 'FR-0515');
  }

  /** Variation linked to parent, with business case and cumulative-variance calculation. FR-0460, FR-0535, FR-0540, FR-0565 */
  createVariation(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contract-management.createVariation', 'FR-0460, FR-0535, FR-0540, FR-0565');
  }

  /** Exercise an optional extension (new linked procurement). FR-0570 */
  exerciseExtension(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contract-management.exerciseExtension', 'FR-0570');
  }

  /** Live spend vs contract value and term. FR-0580 */
  getSpend(_contractId: string): Promise<unknown> {
    return notImplemented('contract-management.getSpend', 'FR-0580');
  }

  /** Auto-populate contract & risk management plans. FR-0555 */
  generateManagementPlans(_contractId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('contract-management.generateManagementPlans', 'FR-0555');
  }
}
