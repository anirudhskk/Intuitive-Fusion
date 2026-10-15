# CLAUDE.md — working on Intuitive Fusion

Guidance for Claude Code (and humans) working in this repo.

## What this is
An AI-first, conversational procurement & contract lifecycle management (CLM) SaaS for Australian
public-sector and enterprise buyers. Users describe what they want to buy by voice or text; the AI
populates the request, procurement plan, tender pack, evaluation sheets, contract and contract
management records, and keeps them in sync as facts change.

Source of truth for scope: `docs/requirements/*.csv` (exported from
`Requirements_Register_IntuitiveFusion_v0.2.xlsx`). Every requirement has an ID — FR-xxxx,
NFR-xxx, SEC-xxx, TR-xx. **Reference requirement IDs in code comments, PR titles and tests.**

## Layout
Full walkthrough of every folder: `docs/DEVELOPER_GUIDE.md`.

- `apps/api` — NestJS modular monolith. One module per use case (`src/modules/*`), plus platform
  modules (`src/platform/*`: tenancy, auth, audit, conversations, notifications, documents).
  Each domain module has a `REQUIREMENTS.md` listing the requirement IDs it owns.
- `apps/web` — internal workspace (Next.js, mobile-first).
- `apps/supplier-portal` — external supplier/tender portal (Next.js, separate identity pool).
- `apps/workers` — async jobs (document generation, alerts, AI batch refresh, migration).
- `apps/mcp-server` — MCP server exposing tenant-scoped read tools to AI assistants.
- `packages/domain` — shared types, enums, domain events. No runtime dependencies.
- `packages/ai` — model gateway (pluggable per tenant), policy stack, field population/editing, guardrails.
- `packages/authz` — Cedar policies (RBAC + ABAC, segregation of duties, sealed bid box).
- `packages/documents` — template binding, Word/PDF rendering, approval stamps.
- `packages/integrations` — adapter interfaces for ERP, legal, e-signature, sanctions, channels.
- `infra/cdk` — AWS CDK stacks (BRS §5 reference architecture).

## Non-negotiable rules
1. **Tenant isolation** (SEC-D10): every query is scoped by `tenantId`. Never write a repository
   method that doesn't take a tenant context.
2. **Audit everything** (SEC-L01..L05, FR-0070): mutations go through services that emit an
   `AuditEvent` with a field-level before/after diff. The audit table is append-only.
3. **Facts, not copies**: procurement data lives once as `ProcurementField` facts; documents bind
   to facts. Never duplicate a value into a second document — bind it (FR-0010, NFR-P03).
4. **Humans approve, AI drafts** (NFR-AV05, SEC-AC12): AI output is always a proposal a human can
   edit; progression gates are explicit approvals.
5. **Sealed bid box** (SEC-AC13, SEC-D03/D04): no code path may read submission content before
   tender close. Don't add admin "peek" endpoints.
6. **AI data boundary** (SEC-D05, SEC-D09): call models only via `packages/ai` `ModelGateway`,
   which enforces the tenant's approved model and region. Never call a model SDK directly.
7. **Supplier content is untrusted input** to the AI (SEC-AP08): pass it through `guardrails`.
8. Soft delete only for signed records (FR-0455, NFR-CA02).

## Commands
```bash
pnpm install
docker compose up -d        # postgres, minio (S3), mailpit
pnpm db:generate            # prisma client
pnpm dev                    # all apps
pnpm typecheck && pnpm test
pnpm infra:synth            # CDK synth
```

## Open decisions
Several requirements conflict or lack targets — see `docs/open-decisions.md` before building
anything in those areas (e.g. approve-from-email vs mandatory SSO, late-submission override).
