#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

/**
 * MCP server (TR-04): lets an enterprise's approved AI assistant query Intuitive Fusion for
 * integration and reporting. It is a thin client over the public API — it holds no data and calls
 * the API with the *user's* token, so tenant isolation, Cedar authorisation and audit all apply
 * exactly as they do in the web app (SEC-D10, SEC-L05). Read-only in v1.
 *
 * Remote deployment should use the Streamable HTTP transport behind the API gateway with OAuth;
 * stdio is for local development.
 */
const API_URL = process.env.IF_API_URL ?? 'http://localhost:4000';
const TOKEN = process.env.IF_API_TOKEN ?? '';

async function api(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
}

const asText = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });

const server = new McpServer({ name: 'intuitive-fusion', version: '0.1.0' });

server.registerTool(
  'get_procurement_summary',
  {
    title: 'Procurement summary',
    description: 'Phase, key facts, outstanding approvals and COI status for one procurement',
    inputSchema: { procurementId: z.string() },
  },
  async ({ procurementId }) => asText(await api(`/procurements/${encodeURIComponent(procurementId)}/plan`)),
);

server.registerTool(
  'list_expiring_contracts',
  {
    title: 'Expiring contracts',
    description: 'Contracts expiring or reaching an optional-extension decision within N days (FR-0640)',
    inputSchema: { withinDays: z.number().int().positive().default(90) },
  },
  async ({ withinDays }) => asText(await api(`/reports/contract-expiry?withinDays=${withinDays}`)),
);

server.registerTool(
  'ask_reporting',
  {
    title: 'Ask a reporting question',
    description: 'Natural-language question over reportable procurement and contract data (FR-0625)',
    inputSchema: { question: z.string().min(3) },
  },
  async ({ question }) => asText(await api('/reports/ask', { method: 'POST', body: JSON.stringify({ question }) })),
);

server.registerTool(
  'get_spend',
  {
    title: 'Spend breakdown',
    description: 'Spend by supplier, contract, master agreement, project, business unit or division (FR-0645)',
    inputSchema: { groupBy: z.enum(['supplier', 'contract', 'master_agreement', 'project', 'business_unit', 'division']) },
  },
  async ({ groupBy }) => asText(await api(`/reports/spend?groupBy=${groupBy}`)),
);

await server.connect(new StdioServerTransport());
