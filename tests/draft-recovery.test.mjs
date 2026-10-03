import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const source = stripTypeScriptTypes(await readFile(new URL('../src/lib/practiceDraft.ts', import.meta.url), 'utf8'));
const { draftKey, readDraft, writeDraft, validAffirmation } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const values = new Map();
globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
test('journal drafts survive a new read without crossing account or guest boundaries', () => {
 const key = draftKey('account-one', 'journal');
 writeDraft(key, { text: 'A test reflection', id: 'stable-id' });
 const valid = v => v && typeof v.text === 'string';
 assert.equal(readDraft(key, null, valid).text, 'A test reflection');
 assert.equal(readDraft(draftKey('account-two', 'journal'), null, valid), null);
 assert.equal(readDraft(draftKey('local-guest', 'journal'), null, valid), null);
 writeDraft(key, null);
 assert.equal(readDraft(key, null, valid), null);
});
test('affirmation completion survives navigation and resets for a new day', () => {
 const key = draftKey('account-one', 'affirmation');
 writeDraft(key, { day: '2026-10-3', chosen: 'I can begin.', count: 3, completed: true });
 assert.equal(readDraft(key, null, validAffirmation).count, 3);
 assert.equal(readDraft(key, null, v => validAffirmation(v) && v.day === '2026-10-4'), null);
});
test('corrupt progress is rejected and write failures reach the UI caller', () => {
 const key = draftKey('account-one', 'affirmation');
 values.set(key, '{invalid');
 assert.equal(readDraft(key, null, validAffirmation), null);
 assert.equal(validAffirmation({ day: 'today', chosen: 'a', count: 50, completed: true }), false);
 const original = localStorage.setItem;
 localStorage.setItem = () => { throw new Error('quota'); };
 assert.throws(() => writeDraft(key, { text: 'preserve in memory' }), /quota/);
 localStorage.setItem = original;
});
