import test from 'node:test';
import assert from 'node:assert/strict';
import { reminderCalendar, foldLine, defaultReminderTime } from '../src/manifestation/reminderCalendar.ts';
const now = new Date('2026-01-01T00:00:00Z');
const input = { start: '2027-01-02T09:30', daily: false, title: 'Pause', action: 'Notice, breathe; act\nBEGIN:VEVENT', uid: 'test-123' };
test('calendar reminder uses chosen wall-clock time, finite recurrence and an alert', () => {
  const once = reminderCalendar(input, now);
  assert.match(once, /DTSTART:20270102T093000\r\n/);
  assert.doesNotMatch(once, /RRULE/);
  assert.match(once, /TRIGGER:PT0S/);
  const daily = reminderCalendar({ ...input, daily: true }, now);
  assert.match(daily, /RRULE:FREQ=DAILY;COUNT=7/);
  assert.equal(once.match(/\r\nBEGIN:VEVENT/g).length, 1);
  assert.match(once, /Notice\\, breathe\\; act\\nBEGIN:VEVENT/);
});
test('invalid and past times are rejected and unicode calendar lines round-trip', () => {
  assert.throws(() => reminderCalendar({ ...input, start: 'bad' }, now));
  assert.throws(() => reminderCalendar({ ...input, start: '2020-01-01T09:00' }, now));
  const text = 'DESCRIPTION:' + 'शांत 🌊 '.repeat(60);
  const folded = foldLine(text);
  assert.equal(folded.replace(/\r\n /g, ''), text);
  for (const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.ok(new Date(defaultReminderTime(now)) > now);
});
