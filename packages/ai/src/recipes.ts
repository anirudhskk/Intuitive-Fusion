/**
 * Deterministic generation recipes.
 *
 * Client requirement: "if a user wants a Java developer, it will get the same output each time by
 * following the same steps to search and create output". A recipe pins the steps, prompt version,
 * model and temperature (0), and starts from the curated best-practice library rather than free
 * generation. The library is refreshed on a schedule (weekly/monthly) and pushed to every tenant
 * (FR-0765, NFR-R03) — see apps/workers refresh-best-practice job.
 */
export interface Recipe {
  id: string; // e.g. "role-description@3"
  purpose: string;
  steps: Array<'classify_category' | 'retrieve_library' | 'retrieve_enterprise_examples' | 'draft' | 'validate_against_policy'>;
  promptVersion: string;
  temperature: 0;
}

export const RECIPES: Recipe[] = [
  {
    id: 'role-description@1',
    purpose: 'Statement of requirements for a labour-hire / contractor role',
    steps: ['classify_category', 'retrieve_library', 'retrieve_enterprise_examples', 'draft', 'validate_against_policy'],
    promptVersion: '2026-10-01',
    temperature: 0,
  },
  {
    id: 'risk-assessment@1',
    purpose: 'Draft procurement risk register for the user to accept/reject and rate (FR-0755)',
    steps: ['classify_category', 'retrieve_library', 'draft', 'validate_against_policy'],
    promptVersion: '2026-10-01',
    temperature: 0,
  },
  {
    id: 'negotiation-plan@1',
    purpose: 'Negotiation strategy, walk-away positions and likely outcomes (FR-0295, FR-0485)',
    steps: ['retrieve_library', 'retrieve_enterprise_examples', 'draft'],
    promptVersion: '2026-10-01',
    temperature: 0,
  },
];
