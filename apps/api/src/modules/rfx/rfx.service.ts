import { Injectable } from '@nestjs/common';
import { notImplemented } from '../../platform/common/not-implemented.js';

@Injectable()
export class RfxService {
  /** Create RFx, auto-populated from intake and plan; AI selects the template. FR-0110, FR-0750 */
  createRfx(_id: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('rfx.createRfx', 'FR-0110, FR-0750');
  }

  /** Get RFx content. FR-0110 */
  getRfx(_rfxId: string): Promise<unknown> {
    return notImplemented('rfx.getRfx', 'FR-0110');
  }

  /** Assemble the tender pack with corporate terms and legal schedules. FR-0120 */
  assemblePack(_rfxId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('rfx.assemblePack', 'FR-0120');
  }

  /** Answer a supplier question anonymously; publish to one or all. FR-0135, FR-0195 */
  answerQuestion(_rfxId: string, _questionId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('rfx.answerQuestion', 'FR-0135, FR-0195');
  }

  /** Validate statutory windows and request delegate permission to publish. FR-0145, FR-0150, NFR-L01 */
  requestPublish(_rfxId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('rfx.requestPublish', 'FR-0145, FR-0150, NFR-L01');
  }

  /** Publish and route to public registers (e.g. AusTender). FR-0140 */
  publish(_rfxId: string, _body: Record<string, unknown>): Promise<unknown> {
    return notImplemented('rfx.publish', 'FR-0140');
  }
}
