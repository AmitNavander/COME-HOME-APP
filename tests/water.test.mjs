import test from 'node:test';
import assert from 'node:assert/strict';
import { waterDays, waterWeeks, nextWaterDay, waterAnswers, waterPrefix } from '../src/manifestation/waterCourse.ts';

test('all 21 supplied day titles have eight substantive sections', () => {
  assert.equal(waterWeeks.length, 3);
  assert.deepEqual(waterDays.map(d => d.title), ['Sacred Initiation', 'Water of Clarity', 'Water of Release', 'Water of Emotional Healing', 'Water of Gratitude', 'Water of Forgiveness', 'Sacred Purification Ceremony', 'Water of Intention', 'Water of Affirmation', 'Future Self Water', 'Opportunity Water', 'Worthiness Water', 'Prosperity Water', 'Sacred Charging Ceremony', 'Receiving Water', 'Courage Water', 'Abundance Immersion', 'Trust Water Meditation', 'Timeline Water Journey', 'Commitment Water Ceremony', 'Grand Water Manifestation Ceremony']);
  for (const day of waterDays) {
    for (const key of ['wisdom', 'teaching', 'declaration', 'action', 'reminder', 'evening', 'milestone']) assert.ok(day[key].trim().length > 0, `${day.title}: ${key}`);
    assert.ok(day.teaching.length > 100);
    assert.equal(day.ceremony.length, 3);
    assert.equal(day.prompts.length, 2);
  }
});
test('new curriculum preserves old journals and tracks completion separately from drafts', () => {
  const old = { 'water:0:prompt:0': 'Original entry', 'water:0:saved': '1', '0': 'Foundation entry' };
  const draft = waterAnswers(old, 0, { 'reflection:0': 'New entry' }, false);
  assert.equal(nextWaterDay(draft), 0);
  assert.equal(draft['water:0:prompt:0'], 'Original entry');
  assert.equal(draft['0'], 'Foundation entry');
  assert.equal(old[waterPrefix(0) + 'saved'], undefined);
  const done = waterAnswers(draft, 0, { 'reflection:0': 'New entry' }, true);
  assert.equal(nextWaterDay(done), 1);
  const reverted = waterAnswers(done, 0, { 'reflection:0': 'New entry' }, false);
  assert.equal(nextWaterDay(reverted), 0);
  assert.equal(reverted[waterPrefix(0) + 'reflection:0'], 'New entry');
  let all = done;
  for (let i = 1; i < 21; i++) all = waterAnswers(all, i, {}, true);
  assert.equal(nextWaterDay(all), null);
});
