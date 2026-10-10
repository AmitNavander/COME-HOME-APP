export const practiceDuration = (path: string | null) => path === 'more-15' ? 900 : path === 'stay-5' ? 300 : 120;

type ClockOptions = {
  target: number;
  elapsed: () => number;
  advance: (seconds: number) => void;
  finish: () => void;
  volume: (level: number) => void;
  now: () => number;
};

/** One clock per sitting. Audio events, not screen mounts, control elapsed time. */
export function createPracticeTimer(options: ClockOptions) {
  let last: number | null = null;
  let finished = false;
  function tick() {
    if (last === null || finished) return;
    const now = options.now();
    const delta = Math.max(0, (now - last) / 1000);
    last = now;
    const remaining = Math.max(0, options.target - options.elapsed());
    if (delta) options.advance(Math.min(delta, remaining));
    const left = Math.max(0, options.target - options.elapsed());
    options.volume(Math.min(1, left / 3));
    if (left <= 0) {
      finished = true;
      last = null;
      options.finish();
      options.volume(1);
    }
  }
  return {
    tick,
    play() { if (!finished && last === null) { last = options.now(); tick(); } },
    pause() { tick(); last = null; },
    dispose() { last = null; finished = true; options.volume(1); },
  };
}
