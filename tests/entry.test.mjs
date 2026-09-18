import test from 'node:test';
import assert from 'node:assert/strict';
import { entryKey, entryTab, readEntryChoice, saveEntryChoice } from '../src/first-run/entryChoice.ts';

test('first choice is account-scoped, persisted and routes to the matching path', () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(readEntryChoice('new-user'), null);
  saveEntryChoice('a', 'meditate');
  assert.equal(readEntryChoice('a'), 'meditate');
  assert.equal(readEntryChoice('b'), null);
  assert.equal(readEntryChoice('local-guest'), null);
  assert.equal(entryTab('meditate'), 'library');
  assert.equal(entryTab('manifest'), 'manifest');
  assert.equal(entryTab('both'), 'home');
  saveEntryChoice('a', 'manifest');
  assert.equal(readEntryChoice('a'), 'manifest');
  values.set(entryKey('b'), 'invalid');
  assert.equal(readEntryChoice('b'), null);
  globalThis.localStorage.setItem = () => { throw new Error('Storage unavailable'); };
  assert.throws(() => saveEntryChoice('a', 'both'), /Storage unavailable/);
});
