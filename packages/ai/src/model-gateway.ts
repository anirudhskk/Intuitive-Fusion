import { BedrockRuntimeClient, ConverseCommand, type Message } from '@aws-sdk/client-bedrock-runtime';

/**
 * The ONLY way the platform talks to a model.
 *
 *  - Pluggable per tenant: each tenant's approved models live in Tenant.aiPolicy (NFR-C01, NFR-M06).
 *  - Data boundary: requests go only to the tenant's enterprise/in-house endpoint in its nominated
 *    region — never a public/general endpoint (SEC-D05, SEC-D09, OBJ-08).
 *  - Provider approval: a model must be approved under the tenant's AI governance policy (SEC-TP07).
 */
export interface ModelMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ModelRequest {
  tenantId: string;
  system: string;
  messages: ModelMessage[];
  /** Deterministic recipes pin temperature to 0 for repeatable output (see recipes.ts). */
  temperature?: number;
  maxTokens?: number;
  /** Optional JSON schema the model must return (field population). */
  responseSchema?: Record<string, unknown>;
}

export interface ModelResponse {
  text: string;
  modelId: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface ModelGateway {
  complete(req: ModelRequest): Promise<ModelResponse>;
}

export interface TenantModelPolicy {
  approvedModelIds: string[];
  defaultModelId: string;
  region: string;
}

/** Resolves a tenant's AI policy. Backed by Tenant.aiPolicy in the API. */
export type TenantPolicyResolver = (tenantId: string) => Promise<TenantModelPolicy>;

export class BedrockModelGateway implements ModelGateway {
  private readonly clients = new Map<string, BedrockRuntimeClient>();

  constructor(private readonly resolvePolicy: TenantPolicyResolver) {}

  async complete(req: ModelRequest): Promise<ModelResponse> {
    const policy = await this.resolvePolicy(req.tenantId);
    const modelId = policy.defaultModelId;
    if (!policy.approvedModelIds.includes(modelId)) {
      throw new Error(`Model ${modelId} is not approved for tenant ${req.tenantId}`);
    }

    const client = this.clientFor(policy.region);
    const messages: Message[] = req.messages.map((m) => ({ role: m.role, content: [{ text: m.content }] }));
    const out = await client.send(
      new ConverseCommand({
        modelId,
        system: [{ text: req.system }],
        messages,
        inferenceConfig: { temperature: req.temperature ?? 0.2, maxTokens: req.maxTokens ?? 2048 },
      }),
    );
    const text = out.output?.message?.content?.map((c) => c.text ?? '').join('') ?? '';
    return { text, modelId, inputTokens: out.usage?.inputTokens, outputTokens: out.usage?.outputTokens };
  }

  private clientFor(region: string): BedrockRuntimeClient {
    let c = this.clients.get(region);
    if (!c) {
      c = new BedrockRuntimeClient({ region });
      this.clients.set(region, c);
    }
    return c;
  }
}

/** Deterministic stand-in for local development and tests — no network, no data leaves the machine. */
export class StubModelGateway implements ModelGateway {
  async complete(req: ModelRequest): Promise<ModelResponse> {
    const last = req.messages.at(-1)?.content ?? '';
    return { text: JSON.stringify({ reply: `(stub) I heard: ${last}`, fieldUpdates: [], followUpQuestions: [] }), modelId: 'stub' };
  }
}

export function createModelGateway(resolver?: TenantPolicyResolver): ModelGateway {
  if (process.env.AI_STUB_MODE === 'true' || !resolver) return new StubModelGateway();
  return new BedrockModelGateway(resolver);
}
