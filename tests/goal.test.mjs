import test from 'node:test';
import assert from 'node:assert/strict';
import { newPlan, readPlan, PLAN_KEY, blankDay, readDay, nextStage, reviewReady, dailyKey, readReviews } from '../src/manifestation/goalWorkflow.ts';

test('legacy intentions survive and daily progress follows preparation, rehearsal and action', () => {
  const plan = readPlan({}, 'Write my book', 'Share what matters');
  assert.equal(plan.goal, 'Write my book');
  const day = blankDay();
  assert.equal(nextStage(plan, day), 0);
  Object.assign(plan, { id: 'goal-a', measure: 'Chapters', baseline: '2', target: '6', reviewDate: '2026-10-01' });
  assert.equal(nextStage(plan, day), 1);
  Object.assign(plan, { obstacle: 'No time', response: 'Write one paragraph' });
  assert.equal(nextStage(plan, day), 2);
  day.visualized = true;
  assert.equal(nextStage(plan, day), 3);
  Object.assign(day, { action: 'Draft a paragraph', when: '2026-09-18T09:00', status: 'blocked' });
  assert.equal(nextStage(plan, day), 4);
  assert.equal(reviewReady(day), false);
  Object.assign(day, { actual: '2 chapters', evidence: 'No paragraph drafted', learning: 'Need a quieter time', next: 'Try tomorrow morning' });
  assert.equal(reviewReady(day), true);
  assert.deepEqual(readPlan({ [PLAN_KEY]: JSON.stringify(plan) }), plan);
  assert.deepEqual(readDay(JSON.stringify(day)), day);
});
test('new goals and new dates cannot inherit previous daily completion', () => {
  assert.notEqual(dailyKey('a', '2026-09-18'), dailyKey('b', '2026-09-18'));
  assert.notEqual(dailyKey('a', '2026-09-18'), dailyKey('a', '2026-09-19'));
  assert.equal(readDay().visualized, false);
  assert.deepEqual(readPlan({ [PLAN_KEY]: '{broken' }), newPlan());
  assert.deepEqual(readDay('{broken'), blankDay());
});
test('review history keeps the goal and evidence snapshot, ignoring unrelated or corrupt entries', () => {
  const review = { id: 'a:today', at: '2026-09-18T00:00:00Z', plan: { ...newPlan(), goal: 'Original goal' }, day: { ...blankDay(), actual: 'One step', outcome: 'ongoing' } };
  const answers = { 'manifest-review:v1:a:today': JSON.stringify(review), 'manifest-review:v1:broken': 'bad', 'water:0:prompt:0': 'Existing water journal' };
  assert.deepEqual(readReviews(answers), [review]);
});
