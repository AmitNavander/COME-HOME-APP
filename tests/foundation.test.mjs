import test from 'node:test';
import assert from 'node:assert/strict';
import { foundationDays, nextFoundationDay } from '../src/manifestation/foundationDays.ts';

test('seven complete written sessions preserve the agreed sequence', () => {
  assert.deepEqual(foundationDays.map(day => day.title), ['Vision', 'Why', 'Feel', 'See', 'Align', 'Act', 'Notice']);
  for (const day of foundationDays) {
    for (const field of ['teaching', 'affirmation', 'prompt', 'action', 'evening']) assert.ok(day[field].length > 20);
    assert.equal(day.practice.length, 3);
    assert.ok(day.minutes > 0);
  }
});
test('continue selects first unfinished day, including out-of-order completion', () => {
  assert.equal(nextFoundationDay([]), 0);
  assert.equal(nextFoundationDay([0, 1]), 2);
  assert.equal(nextFoundationDay([0, 2, 3]), 1);
  assert.equal(nextFoundationDay([0, 1, 2, 3, 4, 5, 6]), null);
});
test('saving preserves existing reflections, and reports unavailable storage', async () => {
  const values = new Map();
  globalThis.localStorage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) };
  const { saveJourney } = await import('../src/manifestation/journeyStore.ts');
  const state = { goal: 'Practice', why: 'Clarity', answers: { 0: 'Existing reflection', 'evening:0': 'Today I began' }, completed: [0] };
  saveJourney(state);
  assert.deepEqual(JSON.parse(values.get('come-home:manifest-journey:v1')), state);
  globalThis.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => saveJourney(state), /Quota exceeded/);
});
