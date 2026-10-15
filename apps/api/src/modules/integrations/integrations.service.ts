import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class IntegrationsService {
  /** Configured connectors for this tenant. NFR-C02..C07 */
  listConnectors(): Promise<unknown> {
    return notImplemented('integrations.listConnectors', 'NFR-C02..C07');
  }

  /** Test a connector. NFR-C07 */
  testConnector(_connector: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('integrations.testConnector', 'NFR-C07');
  }

  /** Inbound webhook (idempotent). NFR-AV03 */
  receiveWebhook(_connector: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('integrations.receiveWebhook', 'NFR-AV03');
  }

  /** Reconcile missed syncs. NFR-AV03, NFR-AV04 */
  reconcile(_connector: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('integrations.reconcile', 'NFR-AV03, NFR-AV04');
  }
}
