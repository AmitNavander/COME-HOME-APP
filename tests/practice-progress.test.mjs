import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const moduleUrl = async (path) => `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(await readFile(new URL(path, import.meta.url), 'utf8'))).toString('base64')}`;
const waterUrl = await moduleUrl('../src/manifestation/waterCourse.ts');
const foundationUrl = await moduleUrl('../src/manifestation/foundationDays.ts');
let source = await readFile(new URL('../src/manifestation/practiceProgress.ts', import.meta.url), 'utf8');
source = source.replace("'./waterCourse'", JSON.stringify(waterUrl)).replace("'./foundationDays'", JSON.stringify(foundationUrl));
const { readResume, RESUME_KEY, nextWaterStep } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`);
const state = (point, answers = {}, completed = []) => ({ goal: '', why: '', completed, answers: { [RESUME_KEY]: JSON.stringify(point), ...answers } });
test('resume returns the saved workshop day, including an out-of-order practice', () => {
  assert.deepEqual(readResume(state({ kind: 'water', day: 12 })), { kind: 'water', day: 12 });
  assert.deepEqual(readResume(state({ kind: 'foundation', day: 3 })), { kind: 'foundation', day: 3 });
});
test('completed days advance only within their own workshop; a finished journey has no resume prompt', () => {
  assert.deepEqual(readResume(state({ kind: 'water', day: 0 }, { 'water-course:v2:0:completed': '1' })), { kind: 'water', day: 1 });
  assert.deepEqual(readResume(state({ kind: 'foundation', day: 0 }, {}, [0])), { kind: 'foundation', day: 1 });
  assert.equal(readResume(state({ kind: 'foundation', day: 6 }, {}, [0,1,2,3,4,5,6])), null);
  assert.equal(readResume(state({ kind: 'water', day: 20 }, Object.fromEntries(Array.from({length:21}, (_,i) => [`water-course:v2:${i}:completed`, '1'])))), null);
});
test('corrupt and out-of-range resume points cannot open an invalid lesson', () => {
  for (const point of [null, {kind:'other',day:0}, {kind:'water',day:-1}, {kind:'water',day:21}, {kind:'foundation',day:7}, {kind:'water',day:1.2}]) assert.equal(readResume(state(point)), null);
  assert.equal(readResume({ ...state(null), answers: {[RESUME_KEY]:'broken'} }), null);
});
test('Water resumes at first unfinished step and ends at review, including skipped steps', () => {
  assert.equal(nextWaterStep({}), 0);
  assert.equal(nextWaterStep({'check:reading':'1','check:practice':'1'}), 2);
  assert.equal(nextWaterStep({'check:reading':'1','check:journal':'1'}), 1);
  assert.equal(nextWaterStep(Object.fromEntries(['reading','practice','journal','action','reminder','evening','milestone','evidence'].map(key=>[`check:${key}`,'1']))), 7);
});
