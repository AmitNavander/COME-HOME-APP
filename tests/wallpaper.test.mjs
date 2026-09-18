import test from 'node:test';
import assert from 'node:assert/strict';
import { captionLines, wallpaperLayout, WALLPAPER_WIDTH } from '../src/manifestation/wallpaper.ts';

test('all supported boards fit below the clock and above the branding without overlap', () => {
  for (const height of [1920, 2400]) for (let count = 1; count <= 6; count++) {
    const boxes = wallpaperLayout(count, height);
    assert.equal(boxes.length, count);
    for (const box of boxes) {
      assert.ok(box.x >= 72 && box.x + box.width <= WALLPAPER_WIDTH - 72);
      assert.ok(box.y >= height * .25 && box.y + box.height <= height - 239);
      assert.ok(box.height > 200);
    }
    for (let a = 0; a < count; a++) for (let b = a + 1; b < count; b++) {
      const x = boxes[a], y = boxes[b];
      assert.ok(x.x + x.width <= y.x || y.x + y.width <= x.x || x.y + x.height <= y.y || y.y + y.height <= x.y);
    }
  }
  assert.throws(() => wallpaperLayout(0, 2400));
  assert.throws(() => wallpaperLayout(7, 2400));
  assert.throws(() => wallpaperLayout(3, 100));
});
test('captions fit their region, preserve short text and visibly truncate long text', () => {
  const measure = value => Array.from(value).length * 10;
  assert.deepEqual(captionLines('My vision', 200, 3, measure), ['My vision']);
  assert.deepEqual(captionLines('My meaningful work', 140, 3, measure), ['My meaningful', 'work']);
  const lines = captionLines('A'.repeat(300), 100, 3, measure);
  assert.equal(lines.length, 3);
  assert.ok(lines.every(line => measure(line) <= 100));
  assert.ok(lines.at(-1).endsWith('…'));
  assert.deepEqual(captionLines('🌊🌊🌊', 20, 3, measure), ['🌊🌊', '🌊']);
});
