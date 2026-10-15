# ADR 0001 — TypeScript monorepo, modular-monolith API

Status: Proposed · 2026-10-15

## Context
15 functional areas (UC-01…UC-15), heavy cross-module coupling (one procurement's facts feed the plan,
tender, evaluation, contract and contract management), a small initial team, and requirements for
API-first design (TR-03), zero-downtime deploys (TR-08) and independent scaling of document generation,
scoring and clause assembly (NFR-SC02).

## Decision
- One pnpm/Turborepo monorepo, TypeScript end to end (API, web apps, workers, MCP server, IaC).
- The core API is a **NestJS modular monolith**: one module per use case with no cross-module database
  access — modules talk through services or domain events.
- Spiky/heavy work runs in **separately scaled workers** (Lambda/ECS) triggered by EventBridge.

## Consequences
- One deployable and one schema to evolve while the domain is still moving; transactions across
  facts/documents stay simple.
- Module seams are explicit, so a module (e.g. tender portal for peak-load isolation, NFR-SC04) can be
  extracted into its own service later.
- Python-native AI tooling isn't the default; if a Python service is needed (e.g. document ML), it plugs
  in as a worker behind the same events.
