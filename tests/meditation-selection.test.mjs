import { test } from 'node:test';
import assert from 'node:assert/strict';
import { session, getSessionSnapshot } from '../src/store/session.ts';
import { FEELING_FLOWS, flowTrackSrc } from '../src/data/flows.ts';
import { existsSync } from 'node:fs';

test('all six feelings open their existing practice and audio directly', () => {
  assert.equal(FEELING_FLOWS.length, 6);
  for (const entry of FEELING_FLOWS) {
    const feeling = entry.id;
    const music = { title: entry.practice.title, src: flowTrackSrc(entry.practice.track) };
    assert.ok(existsSync(new URL(`../public${music.src}`, import.meta.url)));
    session.reset();
    session.beginMeditation(feeling, music);
    assert.equal(getSessionSnapshot().emotion, feeling);
    assert.equal(getSessionSnapshot().step, 'music');
    assert.equal(getSessionSnapshot().path, 'stay-5');
    assert.deepEqual(getSessionSnapshot().music, music);
    for (const path of ['grounding-2', 'stay-5', 'more-15']) {
      session.pickPath(path);
      assert.equal(getSessionSnapshot().path, path);
      assert.equal(getSessionSnapshot().step, 'support');
      assert.equal(getSessionSnapshot().emotion, feeling);
    }
  }
});

test('skipping the feeling starts grounding directly and clears the previous track', () => {
  session.beginMeditation(null);
  assert.equal(getSessionSnapshot().step, 'music');
  assert.equal(getSessionSnapshot().path, 'grounding-2');
  assert.equal(getSessionSnapshot().music, null);
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
