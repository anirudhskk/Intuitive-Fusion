# Intuitive Fusion

Conversational, AI-first procurement & contract lifecycle management for Australian public-sector and
enterprise buyers. Describe a need by voice or text; the platform drafts the request, procurement
plan, tender pack, evaluation, contract and contract-management records — and keeps them in sync.

> **Status:** project skeleton (v0.1). Structure, data model, security model, infrastructure and API
> contract are in place; domain logic is stubbed and traced to requirement IDs.

## Start here
- **[Developer guide](docs/DEVELOPER_GUIDE.md)** — every part of the repo explained in short
- [Architecture](docs/architecture.md) — system diagram, design decisions, build order
- [Open decisions](docs/open-decisions.md) — requirement conflicts and gaps needing a client call
- [Requirements](docs/requirements/) — the register exported to CSV (FR / NFR / SEC / TR)

## Layout
```
apps/
  api/              NestJS modular monolith — 15 use-case modules + platform (auth, tenancy, audit, AI conversations)
  web/              Internal workspace (Next.js, mobile-first)
  supplier-portal/  External supplier & tender portal (Next.js)
  workers/          Async jobs: document regeneration, tender close, alerts, notifications, migration
  mcp-server/       MCP server for enterprise AI assistants
packages/
  domain/           Shared types, procurement fact catalogue, events, complexity scoring
  ai/               Model gateway, policy stack, orchestrator, scoped edits, guardrails
  authz/            Cedar policies (RBAC + ABAC, sealed bid box, segregation of duties)
  documents/        Template binding, Word/PDF rendering, approval stamps
  integrations/     ERP, legal, e-signature, sanctions, registers, channels (interfaces)
infra/cdk/          AWS CDK stacks (network, security, identity, data, app, analytics)
docs/               Architecture, ADRs, developer guide, open decisions, requirements
```

## Quick start
```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm dev            # API http://localhost:4000/docs · web :3000 · supplier portal :3001
```

Requires Node 22+ and pnpm 10.
