import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPracticeTimer, practiceDuration } from '../src/session/practiceTimer.ts';

function fixture(path) {
  let time = 0, elapsed = 0, finishes = 0, volume = 1;
  const timer = createPracticeTimer({ target: practiceDuration(path), now: () => time,
    elapsed: () => elapsed, advance: seconds => { elapsed += seconds; },
    volume: value => { volume = value; }, finish: () => { finishes++; } });
  return { timer, wait(seconds) { time += seconds * 1000; }, get elapsed() { return elapsed; },
    get finishes() { return finishes; }, get volume() { return volume; } };
}
test('each selected duration finishes exactly once and restores volume', () => {
  for (const [path, seconds] of [['grounding-2', 120], ['stay-5', 300], ['more-15', 900]]) {
    const f = fixture(path); f.timer.play(); f.wait(seconds - 2); f.timer.tick();
    assert.equal(f.finishes, 0); assert.ok(f.volume < 1);
    f.wait(2); f.timer.tick(); f.timer.tick(); f.timer.play();
    assert.equal(f.elapsed, seconds); assert.equal(f.finishes, 1); assert.equal(f.volume, 1);
  }
});
test('paused time is excluded and repeated play does not reset elapsed time', () => {
  const f = fixture('grounding-2'); f.timer.play(); f.wait(30); f.timer.pause();
  f.wait(600); f.timer.tick(); assert.equal(f.elapsed, 30);
  f.timer.play(); f.wait(20); f.timer.play(); f.wait(70); f.timer.tick();
  assert.equal(f.elapsed, 120); assert.equal(f.finishes, 1);
});
test('delayed background tick caps elapsed time and completes on the next event', () => {
  const f = fixture('grounding-2'); f.timer.play(); f.wait(140); f.timer.tick();
  assert.equal(f.elapsed, 120); assert.equal(f.finishes, 1);
});
test('leaving the session disposes the clock without completing it', () => {
  const f = fixture('grounding-2'); f.timer.play(); f.wait(20); f.timer.tick(); f.timer.dispose();
  f.wait(200); f.timer.tick(); assert.equal(f.finishes, 0); assert.equal(f.volume, 1);
});
