# Intuitive Fusion — Developer Guide

A short tour of every part of this repo: what it is, why it exists, and where to look.
Read this first, then `docs/architecture.md` for the design and `docs/open-decisions.md` for what's unresolved.

---

## 1. The product in 60 seconds

Intuitive Fusion is a **conversational procurement and contract management platform** for Australian
government and enterprise buyers.

- A staff member says or types *"we need a Java developer for 6 months, about $180k"*.
- The AI fills in the request, works out how complex/risky it is, picks the right process, checks
  budget in the ERP, and drafts the **procurement plan**.
- The same information flows into the **tender pack (RFx)**, the **evaluation sheets**, the
  **evaluation report**, the **contract** and the **contract management plan** — change it once, it
  changes everywhere.
- Suppliers register and submit bids in a separate **supplier portal**; bids are sealed until closing.
- Delegates approve on their phone; every action is audited; conflicts of interest, delegation of
  authority and segregation of duties are enforced by the system.

Scope comes from `Requirements_Register_IntuitiveFusion_v0.2.xlsx` (311 rows), exported to
`docs/requirements/`. Every requirement has an ID (FR-xxxx, NFR-xxx, SEC-xxx, TR-xx) — cite them.

---

## 2. How one request flows through the code

```
apps/web  ConversationPanel.tsx
   │  POST /conversations/:id/messages  { text }
   ▼
apps/api  platform/auth/auth.guard.ts            ← verifies SSO token, picks identity pool
          platform/tenancy/tenant-context.*       ← binds tenant + user to the request
          platform/conversations/*.ts             ← HTTP → AI
   ▼
packages/ai  orchestrator.ts                      ← builds prompt from policy-stack.ts + recipes.ts
             model-gateway.ts                     ← calls the tenant's approved Bedrock model
   ▼
apps/api  ProcurementField facts updated          ← prisma/schema.prisma
          platform/audit/audit.service.ts         ← field-level diff, actor = "ai", model id
          event "fact.changed" → EventBridge
   ▼
apps/workers  jobs/regenerate-documents.ts        ← re-renders plan / tender pack / contract
packages/documents  bindTemplate()                ← template placeholders ← facts
```

Approvals, tenders, evaluation and contracts follow the same pattern: controller → service →
authorisation check (Cedar) → write facts/records → audit → domain event → workers.

---

## 3. Repo map

### Root

| Path | What it is |
|---|---|
| `package.json` | Workspace scripts (`dev`, `build`, `typecheck`, `test`, `db:*`, `infra:synth`). |
| `pnpm-workspace.yaml`, `turbo.json` | pnpm workspaces + Turborepo task pipeline (builds deps first, caches). |
| `tsconfig.base.json` | Shared strict TypeScript settings every package extends. |
| `docker-compose.yml` | Local Postgres, MinIO (stands in for S3), Mailpit (catches emails). |
| `.env.example` | Local env vars. Real secrets live in AWS Secrets Manager. |
| `CLAUDE.md` | Rules for Claude Code and humans working in the repo. Short — read it. |
| `.github/workflows/ci.yml` | On every PR: typecheck, lint, test, build, CDK synth, Semgrep SAST, dependency audit. |
| `.github/workflows/deploy.yml` | main → staging → production (manual approval gate). AWS auth via OIDC, no stored keys. |
| `scripts/export_requirements.py` | Re-exports the Excel register into `docs/requirements/*.csv` and each module's `REQUIREMENTS.md`. Run when the register changes. |

### `apps/api` — the core backend (NestJS)

One deployable API, organised as a **modular monolith**: platform plumbing + one module per use case.

| Path | What it is |
|---|---|
| `src/main.ts` | Boots Nest, publishes OpenAPI docs at `/docs` (API-first, TR-03). |
| `src/app.module.ts` | Wires all modules plus the global guard/interceptors (auth → tenant context → audit). |
| `prisma/schema.prisma` | The data model (≈35 tables). Start here to understand the domain. |
| `prisma/rls.sql` | Postgres row-level security for tenant isolation + insert-only audit table. |
| `prisma.config.ts` | Prisma 7 config (DB URL comes from env). |
| `src/generated/` | Generated Prisma client (`pnpm db:generate`). Not committed. |

**`src/platform/` — cross-cutting plumbing used by every module**

| Folder | What it does |
|---|---|
| `auth/auth.guard.ts` | Authenticates every request. Two identity pools: internal staff (enterprise SSO) and suppliers. |
| `auth/audience.decorator.ts` | `@Audience('internal' \| 'supplier' \| 'any')`, `@Public()` — which pool may call a route. |
| `auth/authorization.service.ts` | `authz.assert(action, resource)` — fine-grained checks via Cedar policies. |
| `tenancy/` | Puts the current tenant/user in async context. `currentContext().tenantId` must scope every query. |
| `audit/` | Append-only audit trail with field-level before/after diffs. Interceptor logs every mutation. |
| `conversations/` | Text and voice turns → AI orchestrator → proposed field updates. |
| `documents/` | Render any document to Word/PDF. |
| `notifications/` | Enqueue email / Teams / Slack / in-app messages (workers deliver). |
| `prisma/` | DB client (Aurora PostgreSQL in AWS). |
| `health/` | `GET /health` for load balancer checks. |
| `common/not-implemented.ts` | Stub helper. `grep -r "notImplemented(" apps/api/src` = the build backlog. |

**`src/modules/` — one folder per use case.** Each has `*.controller.ts` (routes), `*.service.ts`
(logic, currently stubs that return the requirement IDs they implement), `*.module.ts`, and a generated
`REQUIREMENTS.md` with full requirement text and acceptance criteria.

| Module | Use case | In short |
|---|---|---|
| `intake` | UC-01 | Voice/text request intake, budget check, complexity score, workflow selection. |
| `procurement-plan` | UC-02 | Auto-drafted plan, natural-language edits, submit/lock/reopen, export. |
| `rfx` | UC-03 | RFT/RFP/RFQ/RFI/EOI authoring, tender pack assembly, anonymous Q&A, publish to AusTender. |
| `tender-portal` | UC-04 | Supplier-facing tender access and the **sealed bid box**; buyer addenda and close. |
| `suppliers` | UC-05 | Supplier registration, invitations, contacts, sanctions screening. |
| `evaluation` | UC-06 | Compliance gate, hidden individual scoring, consensus, shortlisting, negotiation/BAFO. |
| `evaluation-report` | UC-07 | Auto-compiled report and recommendation, delegate approval. |
| `contracts` | UC-08 | Clause assembly, legal deviation register, pre-signing checks, e-signature. |
| `contract-management` | UC-09 | Obligations, alerts (incl. non-mutable 180/90/60-day), variations, extensions, spend. |
| `reporting` | UC-10 | Dashboards, Gantt, spend analytics, natural-language reports, probity audit export. |
| `migration` | UC-11 | Import legacy contracts/procurements, validate, link, AI-extract obligations. |
| `admin` | UC-12 | Workflows, segmented admin settings, numbering, field-label mapping. |
| `governance` | UC-13 | Delegation of authority, approvals, conflict of interest, probity portal. |
| `integrations` | UC-14 | Connector management, inbound webhooks, reconciliation. |
| `collaboration` | UC-15 | Versions, "what changed since I looked", template switching, phase advance, members. |

### `apps/web` — internal workspace (Next.js)

Mobile-first (delegates approve on phones), WCAG-targeted.

| Path | What it is |
|---|---|
| `app/layout.tsx`, `app/globals.css` | Shell, navigation, skip link, design tokens, dark mode, 44px touch targets. |
| `app/page.tsx` | Home: "waiting on you" + pipeline by phase. |
| `app/intake/` | New request via conversation. |
| `app/procurements/`, `[id]/` | List; one procurement with tabs for each document view + assistant. |
| `app/approvals/`, `[id]/` | Approval queue; one-screen mobile approval with AI summary. |
| `app/contracts/`, `reports/`, `admin/` | Placeholders for those areas. |
| `components/ConversationPanel.tsx` | The reusable chat/voice panel (calls `/conversations`). |
| `lib/api.ts` | Fetch wrapper for the API. |

### `apps/supplier-portal` — external portal (Next.js)

Deployed separately behind WAF, separate login. Pages: my tenders, register, company profile,
tender detail, submit (upload to sealed bid box).

### `apps/workers` — background jobs

Triggered by events or schedules; run as Lambda/ECS tasks.

| Job | Does |
|---|---|
| `regenerate-documents` | On `fact.changed`, re-renders affected documents (live early-stage, batched later-stage). |
| `tender-close` | At closing time: lock bid box, discard partial uploads, send receipts, unseal for evaluation. |
| `contract-alerts` | Daily: ensure mandatory expiry alerts exist, fire due alerts. |
| `approval-reminders` | Hourly: nudge and escalate pending approvals / COI declarations. |
| `send-notification` | Fan-out to email, Teams, Slack, in-app. |
| `refresh-best-practice` | Weekly: refresh the curated content library the AI drafts from. |
| `migration-ingest` | Extract and validate legacy records. |

### `apps/mcp-server` — MCP server (TR-04)

Lets a customer's approved AI assistant query the platform (procurement summary, expiring contracts,
spend, natural-language reports). Thin client over the API using the user's token, so all security
rules still apply. Read-only for now.

### `packages/` — shared libraries

| Package | What it is |
|---|---|
| `domain` | Pure types and logic shared everywhere: `Principal`, lifecycle phases, **fact catalogue** (`facts.ts` — which fields exist and which documents use them), audit diff, domain events, complexity scoring. No dependencies. |
| `ai` | `model-gateway.ts` (only way to call a model; per-tenant approved models; Bedrock or stub), `policy-stack.ts` (platform → policy group e.g. CPR → enterprise → enterprise data), `orchestrator.ts` (one conversational turn), `field-editor.ts` ("change paragraph 3 only", done deterministically), `guardrails.ts` (supplier text is untrusted; prompt-injection screening), `recipes.ts` (repeatable generation), `voice.ts` (speech interfaces). |
| `authz` | Cedar policies in `policies/`: `guardrails.cedar` (hard forbids — tenant isolation, sealed bid box, segregation of duties, COI before bids, pricing isolation, bank details finance-only) and `permits.cedar` (who may do what, incl. dollar-limit approvals). `src/index.ts` calls Amazon Verified Permissions; **deny by default** if not configured. |
| `documents` | `bindTemplate()` resolves template placeholders from facts; renderer interface (Word/PDF); approval stamps hashed to the exact version approved. |
| `integrations` | Interfaces for ERP (budget check, vendor verify, spend), legal systems, e-signature, sanctions/insurance, public tender registers, SharePoint-style repositories, notification channels. |

### `infra/cdk` — AWS infrastructure as code

| Stack | Contains |
|---|---|
| `NetworkStack` | VPC across 3 AZs: public / app / isolated data subnets, flow logs, private endpoints for S3, KMS, Secrets, Bedrock. |
| `SecurityStack` | KMS keys (data, bid box, audit) with rotation, CloudTrail, GuardDuty. |
| `IdentityStack` | Cognito: internal pool (SSO federation, MFA) and separate supplier pool. |
| `DataStack` | Aurora PostgreSQL Serverless v2, S3 documents bucket, S3 bid box (own key), S3 audit archive (Object Lock/WORM), DynamoDB sessions. |
| `AppStack` | EventBridge bus, SQS + DLQ, ECS Fargate API behind ALB (zero-downtime rolling deploys), WAF. |
| `AnalyticsStack` | Data lake bucket + Glue catalog (Redshift/QuickSight to come). |

`bin/app.ts` deploys one stage into one region (default Sydney). `pnpm infra:synth` to generate templates.

### `docs/`

| Path | What it is |
|---|---|
| `architecture.md` | System diagram, key design decisions, module map, suggested build order. |
| `open-decisions.md` | Conflicts and gaps in the requirements that need a client decision. **Check before building a slice.** |
| `adr/` | Architecture decision records (monorepo/monolith, AWS, AI layer). |
| `requirements/*.csv` | The register, greppable: `grep FR-0745 docs/requirements/functional.csv`. |
| `requirements/ai_narrative.md` | The client's free-text AI vision, verbatim. Rich context for AI features. |
| `requirements/unassigned_functional.md` | Rows with no ID or use case. |

---

## 4. Concepts you'll meet

| Term | Meaning |
|---|---|
| **Fact** | One canonical value about a procurement (milestones, risks, criteria…). Documents bind to facts; never copy values between documents. |
| **ECV** | Estimated contract value — drives complexity, workflow and which delegate approves. |
| **Complexity score** | Low / Medium / High / Critical from value, category, risk → picks workflow and self-service vs team-led route. |
| **Delegate** | Person with financial authority to approve at a value tier. Signing authority is a separate delegation. |
| **COI** | Conflict of interest. Declared at plan, after close (when suppliers are known) and at report stage. |
| **Probity** | Fairness of the process. Probity advisors get a read-only portal; everything must be auditable. |
| **Segregation of duties** | Tender administrators and probity officers can't also be evaluators on the same project. |
| **RFx** | Umbrella for RFT (tender), RFP (proposal), RFQ (quote), RFI (information), EOI (expression of interest). |
| **Tender pack** | The published bundle: requirements, conditions, contract terms, response schedules. |
| **Sealed bid box** | Encrypted submission storage nobody internal can read until the tender closes. |
| **Addendum** | Change to a live tender; all bidders are notified. |
| **Consensus** | After individual hidden scoring, the panel chair moderates scores side by side. |
| **BAFO** | Best and final offer during negotiation. |
| **Deviation register** | Supplier-proposed changes to contract clauses, with legal risk ratings. |
| **Variation / optional extension** | Changes to a signed contract / pre-agreed extra terms. Both link to the parent contract. |
| **CMP / RMP** | Contract management plan / risk management plan, auto-drafted post-award. |
| **Policy group** | Rules above the customer, e.g. Commonwealth Procurement Rules (CPR) for federal agencies. |
| **Panel** | Pre-approved supplier arrangement with its own templates (e.g. work orders under a head agreement). |
| **AusTender** | The Australian Government's public tender register. |
| **IRAP** | Australian Government security assessment programme for cloud services. |
| **Tenant** | One customer organisation. All data is tenant-scoped. |

---

## 5. Rules (the short version of CLAUDE.md)

1. Every query is scoped by `tenantId`.
2. Every mutation is audited with a field-level diff.
3. Store facts once; documents bind to them.
4. AI proposes, humans approve stage gates.
5. Never add a way to read bids before close.
6. Call models only through `ModelGateway`.
7. Treat supplier/uploaded content as untrusted AI input.
8. Signed records are soft-deleted only.
9. Cite requirement IDs in code comments, tests and PR titles.

---

## 6. Running it

```bash
pnpm install
cp .env.example .env
docker compose up -d          # postgres, minio, mailpit
pnpm db:generate              # prisma client
pnpm dev                      # api :4000 (OpenAPI at /docs), web :3000, supplier portal :3001
pnpm typecheck && pnpm test
pnpm infra:synth              # CloudFormation templates into infra/cdk/cdk.out
```

Local auth shortcut: set `AUTH_DEV_BYPASS=true` and send header
`x-dev-principal: {"userId":"u1","tenantId":"t1","audience":"internal","roles":["procurement_officer"],"orgUnitIds":[]}`.
Set `AI_STUB_MODE=true` to run without a model.

## 7. Adding a feature (the recipe)

1. Pick the requirement(s) — e.g. FR-0060 complexity score. Read the module's `REQUIREMENTS.md`
   and check `docs/open-decisions.md`.
2. Replace the stub in the module's `*.service.ts`. Read/write via Prisma scoped by `currentContext().tenantId`.
3. Call `authz.assert(...)` before touching protected records; add/adjust Cedar policies if needed.
4. Record the change with `audit.recordChange(...)`; publish a domain event if others care.
5. Put pure logic in `packages/domain` (or `ai`/`documents`) and unit-test it there.
6. Reference the requirement IDs in the test name and PR title.

## 8. What's real vs stubbed today

| Area | State |
|---|---|
| Monorepo, build, CI/CD workflows | Real |
| API boot, OpenAPI, 91 routes, auth guard, tenant context, audit interceptor | Real (JWT verification needs IdP config) |
| Domain endpoints (86) | Stubs returning `501` + the requirement IDs they cover. 146 of 158 in-scope functional requirements are mapped to an endpoint — every Must except FR-0090, which has no description |
| Data model, RLS sketch | Real schema, no migrations yet |
| Fact catalogue, complexity scoring, audit diff, template binding, scoped edits, guardrails | Real, unit-tested |
| AI orchestrator, Bedrock gateway | Real call path; prompts, retrieval and intent routing are TODO |
| Cedar policies | Written; validate with the Cedar CLI and deploy to Verified Permissions |
| Web apps | Page skeletons; conversation panel wired to API |
| Workers | Handlers with documented steps; logic TODO |
| CDK | Synthesises 6 stacks; Lambdas, Step Functions, CloudFront, Redshift, QuickSight TODO |
