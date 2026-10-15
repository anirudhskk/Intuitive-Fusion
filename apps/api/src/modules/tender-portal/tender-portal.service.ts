import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class TenderPortalService {
  /** Tenders this supplier can see (open, or invited if closed). FR-0155, FR-0160 */
  listTenders(): Promise<unknown> {
    return notImplemented('tender-portal.listTenders', 'FR-0155, FR-0160');
  }

  /** Tender detail and downloadable pack. FR-0155, FR-0200 */
  getTender(_tenderId: string): Promise<unknown> {
    return notImplemented('tender-portal.getTender', 'FR-0155, FR-0200');
  }

  /** Start an encrypted upload into the sealed bid box (presigned, KMS envelope). FR-0165, FR-0170, FR-0230, SEC-D03, SEC-D04, SEC-AP04 */
  createSubmission(_tenderId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('tender-portal.createSubmission', 'FR-0165, FR-0170, FR-0230, SEC-D03, SEC-D04, SEC-AP04');
  }

  /** Ask a clarification question. FR-0135, FR-0195 */
  askQuestion(_tenderId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('tender-portal.askQuestion', 'FR-0135, FR-0195');
  }

  /** Buyer issues an addendum or changes dates; bidders notified. FR-0210 */
  issueAddendum(_tenderId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('tender-portal.issueAddendum', 'FR-0210');
  }

  /** Close: lock submissions, discard partial uploads, unseal for evaluation. FR-0165, SEC-AC13 */
  closeTender(_tenderId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('tender-portal.closeTender', 'FR-0165, SEC-AC13');
  }
}
