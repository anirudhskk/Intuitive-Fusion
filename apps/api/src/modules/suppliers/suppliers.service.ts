import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class SuppliersService {
  /** Self-register by voice or text (ABN, contacts, bank details). FR-0235 */
  register(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('suppliers.register', 'FR-0235');
  }

  /** Invite a prospective supplier with a unique set-up link. FR-0240 */
  invite(_body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('suppliers.invite', 'FR-0240');
  }

  /** Supplier profile with insurance and screening status. FR-0250 */
  getProfile(_supplierId: string): Promise<unknown> {
    return notImplemented('suppliers.getProfile', 'FR-0250');
  }

  /** Manage and reassign supplier contacts. FR-0245, SEC-A06 */
  updateContacts(_supplierId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('suppliers.updateContacts', 'FR-0245, SEC-A06');
  }

  /** Sanctions/watchlist screening and insurance compliance hold. FR-0180, FR-0550, SEC-TP01, SEC-TP05 */
  runScreening(_supplierId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('suppliers.runScreening', 'FR-0180, FR-0550, SEC-TP01, SEC-TP05');
  }
}
