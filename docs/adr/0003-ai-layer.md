# ADR 0003 — AI layer: one gateway, facts model, deterministic edits

Status: Proposed · 2026-10-15

## Context
The AI populates and amends nearly every field across the lifecycle (OBJ-03: >70% auto-populated),
must keep duplicated information consistent across documents, must give repeatable output, must use
only enterprise-approved models inside the tenant boundary (OBJ-08), and must never be the final
decision-maker on stage gates.

## Decision
1. **Single `ModelGateway`** (`packages/ai`) for all model calls; tenant policy selects approved models
   and region. Default provider Amazon Bedrock; stub provider for local/dev.
2. **Facts model**: the AI writes to `ProcurementField` facts, never directly into documents. Documents
   bind to facts and re-render on change.
3. **Policy stack** for prompts: platform → policy group (e.g. CPR) → enterprise → enterprise knowledge.
4. **Deterministic splicing** for scoped edits; the model only writes the replacement text.
5. **Recipes** (pinned steps, prompt version, temperature 0, curated library) for repeatable output.
6. **Guardrails**: untrusted content wrapped and screened; every AI action audited with model id; human
   approval gates remain.

## Consequences
- Swapping models per tenant is configuration (NFR-M06). Auditors can see exactly which model did what.
- Consistency across documents is a data-model property rather than an AI behaviour we hope for.
- Requires a well-governed fact catalogue (`packages/domain/src/facts.ts`) that grows with templates.
