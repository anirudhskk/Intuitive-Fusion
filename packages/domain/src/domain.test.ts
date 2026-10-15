import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diffFields } from './audit.js';
import { routeFor, scoreComplexity } from './complexity.js';
import { missingFacts, viewsAffectedBy } from './facts.js';

test('diffFields records only changed fields', () => {
  const changes = diffFields({ a: 1, b: 'x' }, { a: 1, b: 'y', c: true });
  assert.deepEqual(changes, [
    { field: 'b', before: 'x', after: 'y' },
    { field: 'c', before: null, after: true },
  ]);
});

test('low-value, low-risk request goes self-service', () => {
  const score = scoreComplexity({ estimatedValue: 5_000, categoryCriticality: 1, riskRating: 1, involvesPersonalData: false, involvesIctOrCyber: false });
  assert.equal(score, 'LOW');
  assert.equal(routeFor(score), 'SELF_SERVICE');
});

test('$1m+ request is at least HIGH and procurement-team led', () => {
  const score = scoreComplexity({ estimatedValue: 1_200_000, categoryCriticality: 1, riskRating: 1, involvesPersonalData: false, involvesIctOrCyber: false });
  assert.equal(score, 'HIGH');
  assert.equal(routeFor(score), 'PROCUREMENT_TEAM_LED');
});

test('milestones change propagates to plan, tender pack and contract', () => {
  const views = viewsAffectedBy('milestones');
  for (const v of ['PROCUREMENT_PLAN', 'TENDER_PACK', 'CONTRACT'] as const) assert.ok(views.includes(v));
});

test('high-value procurements require steering committee details', () => {
  assert.ok(missingFacts({}, 2_000_000).some((f) => f.key === 'steeringCommittee'));
  assert.ok(!missingFacts({}, 50_000).some((f) => f.key === 'steeringCommittee'));
});
