# Open decisions & register issues

Things that block or shape the build and need a client / product-owner decision. Items 1–6 come from
the register's own "Open items requiring a client decision"; items 7–14 were found while building the
skeleton. Resolve before starting the slice that depends on them.

## From the register

| # | Decision | Requirements | Code affected |
|---|---|---|---|
| 1 | **Scope conflicts** between BRS §2.2 (out of scope) and BRS §3: dual-witness bid opening, insurance-certificate OCR gatekeeping, multi-currency ECV vs FX out of scope, SMS as an alert channel, geospatial supplier view | FR-0175, FR-0185, FR-0810, FR-0515, FR-0610 | `tender-portal`, `suppliers`, notifications, `reporting` |
| 2 | **Approve from email without sign-in** (NFR-U05) vs **mandatory SSO/device auth for all actions** (SEC-A04) — mutually exclusive defaults. Suggest: tenant setting, SSO by default | NFR-U05, SEC-A04 | `platform/auth`, `governance`, web `approvals/[id]` |
| 3 | **Missing quantitative targets**: response times & volumes, RTO/RPO, retention periods, accessibility standard (suggest WCAG 2.2 AA), browser/device baseline | NFR-P06, NFR-SC04, NFR-CA03, NFR-CA04, NFR-DR02, NFR-U06, NFR-C08 | infra sizing, DR, retention jobs, UI |
| 4 | **Compliance scope**: privacy framework & notifiable data breach process; IRAP — platform assessment vs reliance on IRAP-assessed AWS services | SEC-D08, SEC-IR05, NFR-R04, SEC-N01 | security programme, infra |
| 5 | **Architecture-affecting**: enterprise-hosted / hybrid storage and SharePoint-style repositories; finance-only bank details; AI adversarial-input controls depth | NFR-C06, SEC-D11, SEC-AC10, SEC-AP08 | `infra/cdk` topology, `authz` policies, `packages/ai/guardrails` |
| 6 | **Probity review**: admin override allowing a late tender submission contradicts the hard lockout in BRS §3.4 | FR-0205 (register cites FR-041) | `tender-portal` close logic |

## Found while building the skeleton

| # | Issue | Why it matters | Suggested fix |
|---|---|---|---|
| 7 | **Traceability Matrix IDs don't match the Functional sheet.** Matrix uses FR-001…FR-183; the Functional sheet uses FR-0005…FR-0880 (steps of 5). 0 of 184 functional IDs join. NFR and SEC IDs join fine. | Traceability to objectives/tests is broken for every functional requirement. | Re-key the matrix to the FR-0xxx IDs. |
| 8 | **Availability conflict**: TR-07 says 99.99%, NFR-AV01 and OBJ-07 say 99.9%. | 99.99% roughly needs multi-region active-active; 99.9% is multi-AZ. Large cost/complexity difference. | Confirm one target. Skeleton assumes 99.9% (multi-AZ). |
| 9 | **Technical Requirements tab has no IDs.** | Can't trace mobile-first, MCP, SSO providers, CI/CD. | Assigned provisional TR-01…TR-08 in `docs/requirements/technical.csv`; adopt or replace. |
| 10 | **AI tab is narrative, not requirements.** Summary tab counts 54 AI requirements but the tab has none numbered. | Key behaviours (policy layering, scoped edits, repeatable output, reopen locked plan, supplier AI help, auto-ordering) are untraceable. | Decompose into AI-xxx requirements. Kept verbatim in `docs/requirements/ai_narrative.md`. |
| 11 | **6 functional rows have no ID; 4 have no use case** (incl. configurable workflows, delegated approval set-up, conversational AI capability). One row is blank. | Can't be planned or tested. | See `docs/requirements/unassigned_functional.md`. |
| 12 | **FR-0055** is a question ("If budget is flagged as exceeded — what is next step??"). | Intake can't complete the budget-exceeded path. | Define: block, warn + route to finance, or delegate override. |
| 13 | **FR-0090** has no description. | — | Fill or delete. |
| 14 | **FR-0100**'s acceptance criteria (delegate financial authority) don't match its description (predefined view/edit list). | Testers will test the wrong thing. | Split into two requirements. |

Also note: Summary tab says 183 functional requirements; the sheet has 184 rows (including blanks).
