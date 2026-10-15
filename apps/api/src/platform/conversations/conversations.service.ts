import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConversationOrchestrator, createModelGateway, type TurnInput, type TurnResult } from '@if/ai';
import { AuditService } from '../audit/audit.service.js';
import { currentContext } from '../tenancy/tenant-context.js';

/**
 * Bridges HTTP to the AI orchestrator. Field updates returned by the AI are *proposals*: they are
 * applied to procurement facts (and audited as AI actions) but always remain user-editable, and
 * stage progression still requires human approval (NFR-AV05).
 */
@Injectable()
export class ConversationsService {
  private readonly orchestrator = new ConversationOrchestrator(createModelGateway());

  constructor(private readonly audit: AuditService) {}

  async start(contextType: string, contextId?: string) {
    const { tenantId } = currentContext();
    // TODO persist Conversation row; transcripts get the same residency/retention as other data (SEC-D06)
    return { conversationId: randomUUID(), tenantId, contextType, contextId };
  }

  async handleTurn(conversationId: string, input: TurnInput): Promise<TurnResult> {
    const { tenantId, principal } = currentContext();
    const result = await this.orchestrator.handleTurn({ tenantId, userId: principal.userId, conversationId, input });

    for (const update of result.fieldUpdates) {
      // TODO apply to ProcurementField facts → bound documents re-render (FR-0010, NFR-P03)
      await this.audit.recordChange(
        { type: 'ProcurementField', id: update.fieldKey },
        'ai.populate',
        null,
        { value: update.value },
        { actorKind: 'ai', aiModelId: result.modelId },
      );
    }
    return result;
  }
}
