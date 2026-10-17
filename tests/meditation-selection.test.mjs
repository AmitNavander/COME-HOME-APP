import { test } from 'node:test';
import assert from 'node:assert/strict';
import { session, getSessionSnapshot } from '../src/store/session.ts';

test('every arrival feeling and skipped check-in offers a choice, never auto-selects Grounding', () => {
  for (const feeling of [null, 'stress', 'afraid', 'depressed', 'angry', 'sleep-deprived', 'overwhelmed']) {
    session.reset();
    session.beginMeditation(feeling);
    assert.equal(getSessionSnapshot().emotion, feeling);
    assert.equal(getSessionSnapshot().step, 'response');
    assert.equal(getSessionSnapshot().path, null);
    for (const path of ['grounding-2', 'stay-5', 'more-15']) {
      session.pickPath(path);
      assert.equal(getSessionSnapshot().path, path);
      assert.equal(getSessionSnapshot().step, 'support');
      assert.equal(getSessionSnapshot().emotion, feeling);
    }
  }
});

test('direct music selection retains its track and chosen duration', () => {
  session.reset();
  const music = { title: 'A Softer Moment', src: '/audio/a-softer-moment.mp3' };
  session.chooseMusic(music);
  session.pickPath('stay-5');
  assert.equal(getSessionSnapshot().music, music);
  assert.equal(getSessionSnapshot().path, 'stay-5');
  session.pickPath('more-15');
  assert.equal(getSessionSnapshot().music, music);
  assert.equal(getSessionSnapshot().path, 'more-15');
  session.reset();
  assert.equal(getSessionSnapshot().music, null);
});
