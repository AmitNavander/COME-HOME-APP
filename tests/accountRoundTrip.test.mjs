import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const rows = new Map();
const copy = value => structuredClone(value);
let device;
let user = { id: 'qa-account', isGuest: false };
const emptyDevice = () => ({ values: new Map(), indexed: new Map(), journey: { goal: '', why: '', answers: {}, completed: [] }, journal: [], progress: {}, favorites: [] });
const storage = { getItem: key => device.values.get(key) ?? null, setItem: (key, value) => device.values.set(key, value), removeItem: key => device.values.delete(key) };
globalThis.localStorage = storage;
globalThis.window = { localStorage: storage };
globalThis.__cloudQA = {
  useSyncExternalStore: (_subscribe, read) => read(),
  get: async key => copy(device.indexed.get(key)),
  set: async (key, value) => device.indexed.set(key, copy(value)),
  getAuthUser: () => user,
  getAuthState: () => ({ user, loading: false }),
  subscribeAuth: () => () => {},
  getJournal: async () => copy(device.journal),
  replaceJournal: async value => { device.journal = copy(value); },
  getJourneySnapshot: () => copy(device.journey),
  hydrateJourney: value => { device.journey = copy(value); },
  getProgrammeProgress: () => copy(device.progress),
  hydrateProgrammeProgress: value => { device.progress = copy(value); },
  getFavorites: () => copy(device.favorites),
  hydrateFavorites: value => { device.favorites = copy(value); },
  syncVisionBoard: async () => {},
  supabase: { from: () => ({
    select: () => ({ eq: (_key, id) => ({ maybeSingle: async () => ({ data: copy(rows.get(id)), error: null }) }) }),
    upsert: payload => ({ select: () => ({ single: async () => {
      rows.set(payload.user_id, { ...copy(payload), updated_at: '2026-09-26T12:00:00Z' });
      return { data: { updated_at: '2026-09-26T12:00:00Z' }, error: null };
    } }) }),
  }) },
};
const exportsFor = {
  react: 'useSyncExternalStore', 'idb-keyval': 'get,set', './supabase': 'supabase',
  './auth': 'getAuthUser,getAuthState,subscribeAuth', './storage': 'getJournal,replaceJournal',
  '../manifestation/journeyStore': 'getJourneySnapshot,hydrateJourney',
  '../store/programme': 'getProgrammeProgress,hydrateProgrammeProgress',
  '../store/favorites': 'getFavorites,hydrateFavorites',
  '../manifestation/visionBoardStore': 'syncVisionBoard',
};
registerHooks({ resolve(specifier, context, next) {
  if (exportsFor[specifier]) return { url: 'data:text/javascript,' + encodeURIComponent(`export const {${exportsFor[specifier]}}=globalThis.__cloudQA;`), shortCircuit: true };
  if (specifier === './accountIdentity') return next('./accountIdentity.ts', context);
  return next(specifier, context);
} });
const cloud = await import('../src/lib/accountCloud.ts');

test('two independent device stores round-trip a full journal, foundation and meditation progress', async () => {
  device = emptyDevice();
  device.journal = Array.from({ length: 650 }, (_, i) => ({ id: `qa-${i}`, ts: i, text: `Entry ${i}`, prompt: 'Reflection' }));
  device.journey = { goal: 'Practice daily', why: 'Calm', answers: { 0: 'My intention' }, completed: [0, 1] };
  device.progress = { 'seven-days-home': [0, 1, 2] };
  device.favorites = ['grounding'];
  await cloud.enableAccountCloud('device');
  const first = device;
  device = emptyDevice();
  await cloud.enableAccountCloud('cloud');
  assert.equal(device.journal.length, 650);
  assert.deepEqual(device.journal.map(x => x.id).sort(), first.journal.map(x => x.id).sort());
  assert.deepEqual(device.journey, first.journey);
  assert.deepEqual(device.progress, first.progress);
  assert.deepEqual(device.favorites, first.favorites);
});

test('switching back to device-only restores the guest journal captured before cloud loading', async () => {
  device = emptyDevice();
  device.journal = [{ id: 'guest', ts: 1, text: 'Guest writing' }];
  await cloud.enableAccountCloud('cloud');
  await cloud.disableAccountCloud();
  assert.deepEqual(device.journal, [{ id: 'guest', ts: 1, text: 'Guest writing' }]);
});
