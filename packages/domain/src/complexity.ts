import type { ComplexityScore, IntakeRoute } from './lifecycle.js';

/**
 * Procurement Complexity Score (FR-0060) → workflow tier (FR-0025) and intake route (FR-0040).
 * Parameters and thresholds are tenant-configurable; the defaults below are placeholders until the
 * client confirms them.
 */
export interface ComplexityInputs {
  estimatedValue: number;
  categoryCriticality: 1 | 2 | 3 | 4; // from category taxonomy config
  riskRating: 1 | 2 | 3 | 4; // from AI draft risk assessment (FR-0755)
  involvesPersonalData: boolean;
  involvesIctOrCyber: boolean;
}

export interface ComplexityThresholds {
  valueBands: [number, number, number]; // LOW < b0 ≤ MEDIUM < b1 ≤ HIGH < b2 ≤ CRITICAL
  selfServiceMax: ComplexityScore;
}

export const DEFAULT_THRESHOLDS: ComplexityThresholds = {
  valueBands: [80_000, 1_000_000, 10_000_000],
  selfServiceMax: 'LOW',
};

const ORDER: ComplexityScore[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export function scoreComplexity(input: ComplexityInputs, t: ComplexityThresholds = DEFAULT_THRESHOLDS): ComplexityScore {
  const valueLevel = t.valueBands.filter((band) => input.estimatedValue >= band).length; // 0..3
  const flags = (input.involvesPersonalData ? 1 : 0) + (input.involvesIctOrCyber ? 1 : 0);
  const level = Math.max(valueLevel, input.categoryCriticality - 1, input.riskRating - 1, Math.min(flags, 2));
  return ORDER[Math.min(level, 3)]!;
}

export function routeFor(score: ComplexityScore, t: ComplexityThresholds = DEFAULT_THRESHOLDS): IntakeRoute {
  return ORDER.indexOf(score) <= ORDER.indexOf(t.selfServiceMax) ? 'SELF_SERVICE' : 'PROCUREMENT_TEAM_LED';
}
