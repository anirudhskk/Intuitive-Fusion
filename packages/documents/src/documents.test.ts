import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bindTemplate } from './index.js';

test('one fact feeds every template that binds it', () => {
  const sources = {
    fact: { milestones: ['M1', 'M2', 'M7 final invoice'], keyDates: { tenderClose: '2026-11-30' } },
    tenant: { name: 'Example Agency' },
    procurement: {},
  };
  const plan = bindTemplate({ milestones: 'fact:milestones', agency: 'tenant:name' }, sources);
  const tenderPack = bindTemplate({ schedule: 'fact:milestones', closes: 'fact:keyDates.tenderClose' }, sources);
  assert.deepEqual(plan.milestones, tenderPack.schedule);
  assert.equal(tenderPack.closes, '2026-11-30');
  assert.equal(plan.agency, 'Example Agency');
});
