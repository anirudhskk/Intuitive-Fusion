import type { ModelGateway } from './model-gateway.js';
import { buildSystemPrompt, type PolicyLayer } from './policy-stack.js';

export type TurnInput =
  | { kind: 'text'; text: string }
  | { kind: 'audio'; audioBase64: string; mimeType: string };

export interface FieldUpdate {
  fieldKey: string;
  value: unknown;
  /** For scoped edits: which paragraph(s) were targeted (FR-0745). */
  scope?: { paragraph?: number };
  confidence?: number;
}

export interface TurnResult {
  reply: string;
  /** Proposed changes to procurement facts — applied, audited as AI actions, always user-editable. */
  fieldUpdates: FieldUpdate[];
  /** Targeted follow-ups for missing information (FR-0035). */
  followUpQuestions: string[];
  /** Detected intent, e.g. advance phase (FR-0770), add alert (FR-0515), approve (FR-0080). */
  intent?: 'populate' | 'amend' | 'question' | 'advance_phase' | 'add_alert' | 'approve' | 'add_member';
  modelId: string;
}

/**
 * One conversational turn, used by every module.
 *
 * Pipeline (each step is a TODO in the skeleton):
 *   1. audio → text via SpeechToText (Transcribe)                          NFR-U07
 *   2. load conversation + procurement facts + missing-fact list           FR-0035
 *   3. build system prompt from the tenant's policy stack + recipe         policy-stack.ts, recipes.ts
 *   4. retrieve enterprise knowledge (tenant-scoped vector index)          NFR-R03
 *   5. call ModelGateway with a JSON response schema
 *   6. validate output; route intents (amend → field-editor, approve → governance service)
 *   7. persist turn + audit                                                SEC-L05
 */
export class ConversationOrchestrator {
  constructor(private readonly models: ModelGateway) {}

  async handleTurn(args: { tenantId: string; userId: string; conversationId: string; input: TurnInput }): Promise<TurnResult> {
    const text = args.input.kind === 'text' ? args.input.text : '[audio transcription pending — SpeechToText TODO]';

    const layers: PolicyLayer[] = [
      { level: 'platform', name: 'Intuitive Fusion framework', rules: ['Draft, never decide: humans approve every stage gate.'] },
      // TODO load policy_group / enterprise layers from tenant config, enterprise_knowledge via retrieval
    ];

    const res = await this.models.complete({
      tenantId: args.tenantId,
      system: buildSystemPrompt(layers, 'Populate procurement facts from the conversation; ask for anything missing.'),
      messages: [{ role: 'user', content: text }],
      temperature: 0,
    });

    try {
      const parsed = JSON.parse(res.text) as Omit<TurnResult, 'modelId'>;
      return { reply: parsed.reply, fieldUpdates: parsed.fieldUpdates ?? [], followUpQuestions: parsed.followUpQuestions ?? [], intent: parsed.intent, modelId: res.modelId };
    } catch {
      return { reply: res.text, fieldUpdates: [], followUpQuestions: [], modelId: res.modelId };
    }
  }
}
