/**
 * Procurement fact catalogue — the canonical fields the AI populates once and every document binds to.
 *
 * From the client's AI narrative: "a lot of the information in the fields can be duplicated when
 * users select the procurement plan view or the tender document view" and "[a change] gets pushed
 * to other fields that are the same, e.g. add milestone 7 in the plan → updated in the tender pack".
 * So the plan, tender pack, evaluation report and contract are *views* over these facts.
 *
 * `usedIn` drives which documents re-render when a fact changes (FR-0010, NFR-P01..P03).
 */
export type DocumentView =
  | 'REQUEST'
  | 'PROCUREMENT_PLAN'
  | 'TENDER_PACK'
  | 'EVALUATION_REPORT'
  | 'CONTRACT'
  | 'CONTRACT_MANAGEMENT_PLAN';

export interface FactDefinition {
  key: string;
  label: string;
  kind: 'text' | 'richtext' | 'money' | 'date' | 'list' | 'people' | 'table';
  usedIn: DocumentView[];
  /** Required at or above this estimated contract value (AUD). High value (e.g. ≥ $1m) needs more detail. */
  requiredFromValue?: number;
}

const ALL_PRE_AWARD: DocumentView[] = ['REQUEST', 'PROCUREMENT_PLAN', 'TENDER_PACK', 'EVALUATION_REPORT'];

export const PROCUREMENT_FACTS: FactDefinition[] = [
  { key: 'title', label: 'Title', kind: 'text', usedIn: [...ALL_PRE_AWARD, 'CONTRACT'] },
  { key: 'keyDates', label: 'Key dates', kind: 'table', usedIn: [...ALL_PRE_AWARD, 'CONTRACT', 'CONTRACT_MANAGEMENT_PLAN'] },
  { key: 'estimatedCost', label: 'Estimated cost (ECV)', kind: 'money', usedIn: ALL_PRE_AWARD },
  { key: 'businessUnits', label: 'Business units', kind: 'list', usedIn: ['REQUEST', 'PROCUREMENT_PLAN'] },
  { key: 'contractOwner', label: 'Contract owner', kind: 'people', usedIn: ['PROCUREMENT_PLAN', 'CONTRACT', 'CONTRACT_MANAGEMENT_PLAN'] },
  { key: 'policyExemption', label: 'Policy exemption (e.g. CPR)', kind: 'text', usedIn: ['PROCUREMENT_PLAN', 'EVALUATION_REPORT'] },
  { key: 'background', label: 'Background / need', kind: 'richtext', usedIn: ALL_PRE_AWARD },
  { key: 'requirements', label: 'Detailed requirements', kind: 'richtext', usedIn: [...ALL_PRE_AWARD, 'CONTRACT'] },
  { key: 'deliverables', label: 'Deliverables', kind: 'list', usedIn: [...ALL_PRE_AWARD, 'CONTRACT', 'CONTRACT_MANAGEMENT_PLAN'] },
  { key: 'milestones', label: 'Milestones', kind: 'table', usedIn: [...ALL_PRE_AWARD, 'CONTRACT', 'CONTRACT_MANAGEMENT_PLAN'] },
  { key: 'risks', label: 'Risks, ratings and mitigations', kind: 'table', usedIn: ['PROCUREMENT_PLAN', 'EVALUATION_REPORT', 'CONTRACT_MANAGEMENT_PLAN'] },
  { key: 'evaluationCommittee', label: 'Evaluation committee (with COI status)', kind: 'people', usedIn: ['PROCUREMENT_PLAN', 'EVALUATION_REPORT'] },
  { key: 'evaluationCriteria', label: 'Evaluation criteria & weightings', kind: 'table', usedIn: ['PROCUREMENT_PLAN', 'TENDER_PACK', 'EVALUATION_REPORT'] },
  { key: 'steeringCommittee', label: 'Steering committee', kind: 'people', usedIn: ['PROCUREMENT_PLAN'], requiredFromValue: 1_000_000 },
  { key: 'governance', label: 'Other governance structures', kind: 'people', usedIn: ['PROCUREMENT_PLAN'], requiredFromValue: 1_000_000 },
  { key: 'delegate', label: 'Approving delegate', kind: 'people', usedIn: ['PROCUREMENT_PLAN', 'EVALUATION_REPORT'] },
  { key: 'requiredEngagements', label: 'Required consultations (IT, legal, cyber, finance...)', kind: 'list', usedIn: ['REQUEST', 'PROCUREMENT_PLAN'] },
  { key: 'dueDiligence', label: 'Supplier due diligence approach', kind: 'richtext', usedIn: ['PROCUREMENT_PLAN', 'EVALUATION_REPORT'] },
  { key: 'policyObligations', label: 'Policy obligations (modern slavery, sustainability, economic benefit...)', kind: 'list', usedIn: ['PROCUREMENT_PLAN', 'TENDER_PACK', 'CONTRACT'] },
  { key: 'categoryCode', label: 'Category (UNSPSC/CPV/NAICS)', kind: 'text', usedIn: ['REQUEST', 'PROCUREMENT_PLAN'] },
];

/** Documents that must re-render when the given fact changes. */
export function viewsAffectedBy(factKey: string): DocumentView[] {
  return PROCUREMENT_FACTS.find((f) => f.key === factKey)?.usedIn ?? [];
}

/** Facts still missing for a given value — drives the AI's follow-up questions (FR-0035). */
export function missingFacts(captured: Record<string, unknown>, estimatedValue: number): FactDefinition[] {
  return PROCUREMENT_FACTS.filter(
    (f) => (f.requiredFromValue === undefined || estimatedValue >= f.requiredFromValue) && captured[f.key] == null,
  );
}
