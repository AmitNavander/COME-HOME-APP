import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const cache = new Map();
const cacheKey = 'come-home:vision-board:v1:qa-account';
const image = new Blob(['synthetic-image'], { type: 'image/png' });
let failImage = false;
globalThis.__visionQA = {
  get: async key => cache.get(key), set: async (key, value) => cache.set(key, value),
  update: async (key, fn) => cache.set(key, fn(cache.get(key))),
  getAuthUser: () => ({ id: 'qa-account', isGuest: false }),
  isAccountCloudEnabled: () => true,
  supabase: {
    from: () => ({ select: () => ({ eq: () => ({ order: async () => ({ data: [{ id: 'card', caption: 'My vision', image_path: 'qa-account/card.png' }], error: null }) }) }) }),
    storage: { from: () => ({ download: async () => failImage ? { data: null, error: Error('Offline') } : { data: image, error: null } }) },
  },
};
const exportsFor = { 'idb-keyval': 'get,set,update', '../lib/supabase': 'supabase', '../lib/auth': 'getAuthUser', '../lib/accountCloud': 'isAccountCloudEnabled' };
registerHooks({ resolve(specifier, context, next) {
  return exportsFor[specifier] ? { url: 'data:text/javascript,' + encodeURIComponent(`export const {${exportsFor[specifier]}}=globalThis.__visionQA;`), shortCircuit: true } : next(specifier, context);
} });
const board = await import('../src/manifestation/visionBoardStore.ts');

test('vision image download failure preserves the complete cached board', async () => {
  const first = await board.listVisionBoard();
  assert.equal(first[0].image, image);
  failImage = true;
  const restored = await board.listVisionBoard();
  assert.equal(restored[0].image, image);
  assert.equal(cache.get(cacheKey)[0].image, image);
});

test('a new device reports unavailable images instead of pretending the board is empty or complete', async () => {
  cache.clear(); failImage = true;
  await assert.rejects(board.listVisionBoard(), /Offline/);
  assert.equal(cache.has(cacheKey), false);
});

test('retry after reconnection restores the full board', async () => {
  failImage = false;
  const restored = await board.listVisionBoard();
  assert.equal(restored[0].caption, 'My vision');
  assert.equal(restored[0].image, image);
});
