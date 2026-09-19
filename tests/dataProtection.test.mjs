import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const database = new Map();
let fail = false;
globalThis.__testStore = {
  get: async k => { if (fail) throw Error('Storage unavailable'); return database.get(k); },
  set: async (k, v) => { if (fail) throw Error('Storage unavailable'); database.set(k, v); },
  update: async (k, fn) => { if (fail) throw Error('Storage unavailable'); database.set(k, fn(database.get(k))); },
  getMany: async keys => { if (fail) throw Error('Storage unavailable'); return keys.map(k => database.get(k)); },
};
const stub = 'data:text/javascript,' + encodeURIComponent('export const {get,set,update,getMany}=globalThis.__testStore;');
const hook = registerHooks({ resolve(specifier, context, next) { return specifier === 'idb-keyval' ? { url: stub, shortCircuit: true } : next(specifier, context); } });
const { saveJournalEntry, deleteJournalEntry } = await import('../src/lib/storage.ts');
const { exportJourney } = await import('../src/lib/journeyExport.ts');
hook.deregister();

test('journal writes preserve older entries, update by id and expose failed writes', async () => {
  const old = Array.from({ length: 301 }, (_, i) => ({ id: `old-${i}`, ts: i, text: 'Saved' }));
  database.set('come-home:journal', old);
  const added = await saveJournalEntry({ text: 'Keep this writing' });
  assert.equal(database.get('come-home:journal').length, 302);
  await saveJournalEntry({ id: added.id, text: 'Updated' });
  assert.equal(database.get('come-home:journal').length, 302);
  assert.equal(database.get('come-home:journal')[0].text, 'Updated');
  fail = true;
  await assert.rejects(saveJournalEntry({ text: 'Draft' }), /unavailable/);
  await assert.rejects(deleteJournalEntry(added.id), /unavailable/);
  assert.equal(database.get('come-home:journal').length, 302);
  fail = false;
  await deleteJournalEntry(added.id);
  assert.equal(database.get('come-home:journal').length, 301);
});
test('personal export contains saved work, excludes credentials and rejects partial reads', async () => {
  const values = new Map([['come-home:manifest-journey:v1', JSON.stringify({ answers: { 0: 'My words' } })], ['sb-auth-token', 'PRIVATE_TOKEN']]);
  globalThis.localStorage = { getItem: key => values.get(key) ?? null };
  database.set('come-home:vision-board:v1', [{ id: 'v1', caption: 'My vision' }]);
  const text = await exportJourney();
  const data = JSON.parse(text);
  assert.equal(data.local['come-home:manifest-journey:v1'].answers[0], 'My words');
  assert.equal(data.indexed['come-home:vision-board:v1'][0].caption, 'My vision');
  assert.ok(!text.includes('PRIVATE_TOKEN'));
  assert.ok(!text.includes('sb-auth-token'));
  fail = true;
  await assert.rejects(exportJourney(), /unavailable/);
  fail = false;
  values.set('come-home:manifest-journey:v1', '{invalid');
  await assert.rejects(exportJourney());
});
