import test from 'node:test';
import assert from 'node:assert/strict';
import { affirmations, affirmationDay, affirmationForDate } from '../src/affirmations/affirmations.ts';

test('365 complete, distinct prewritten affirmations cover a full cycle', () => {
  assert.equal(affirmations.length, 365);
  assert.equal(new Set(affirmations.map(item => item.text)).size, 365);
  for (const item of affirmations) {
    assert.equal(typeof item.text, 'string');
    assert.ok(item.text.length >= 18 && item.text.length <= 160);
    assert.ok(item.text.endsWith('.'));
    assert.ok(item.theme.length > 0);
  }
  const seen = new Set();
  for (let i = 0; i < 365; i++) seen.add(affirmationForDate(new Date(2026, 8, 18 + i)).text);
  assert.equal(seen.size, 365);
});
test('affirmation stays consistent all day and advances at local midnight', () => {
  assert.deepEqual(affirmationForDate(new Date(2026, 8, 18, 0, 1)), affirmationForDate(new Date(2026, 8, 18, 23, 59)));
  assert.notEqual(affirmationForDate(new Date(2026, 8, 18)).text, affirmationForDate(new Date(2026, 8, 19)).text);
  assert.equal(affirmationDay(new Date(2028, 2, 1)) - affirmationDay(new Date(2028, 1, 28)), 2);
  assert.equal(affirmationDay(new Date(2026, 2, 9)) - affirmationDay(new Date(2026, 2, 8)), 1);
  assert.equal(affirmationForDate(new Date(2026, 0, 1)).index, 0);
  assert.equal(affirmationForDate(new Date(2027, 0, 1)).index, 0);
  assert.equal(affirmationForDate(new Date(2025, 11, 31)).index, 364);
});
