import test from 'node:test';
import assert from 'node:assert/strict';
import { reminderCalendar, googleCalendarLink, foldLine, defaultReminderTime } from '../src/manifestation/reminderCalendar.ts';
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
test('workshop and board schedules are bounded and point to their own destination', () => {
  const workshop = reminderCalendar({ ...input, repeat: 'daily21', location: 'Manifest → Water' }, now);
  const board = reminderCalendar({ ...input, repeat: 'weekly4', location: 'Manifest → My vision board' }, now).replace(/\r\n /g, '');
  assert.match(workshop, /RRULE:FREQ=DAILY;COUNT=21/);
  assert.match(board, /RRULE:FREQ=WEEKLY;COUNT=4/);
  assert.match(board, /Manifest → My vision board/);
  assert.doesNotMatch(board, /Manifest → Foundation/);
});

test('Google link preserves the chosen instant, bounded repeat and encoded private text', () => {
  const event = new URL(googleCalendarLink({ ...input, repeat: 'daily21', action: 'शांत & kind? #one', location: 'Manifest → Water' }, now, 'Asia/Kolkata'));
  assert.equal(event.origin, 'https://calendar.google.com');
  assert.equal(event.searchParams.get('recur'), 'RRULE:FREQ=DAILY;COUNT=21');
  assert.equal(event.searchParams.get('stz'), 'Asia/Kolkata');
  assert.match(event.searchParams.get('details'), /शांत & kind\? #one/);
  assert.match(event.searchParams.get('details'), /Manifest → Water/);
  const start = new Date(input.start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  assert.ok(event.searchParams.get('dates').startsWith(start + '/'));
  assert.equal(new URL(googleCalendarLink(input, now)).searchParams.has('recur'), false);
  assert.equal(new URL(googleCalendarLink({ ...input, repeat: 'weekly4' }, now)).searchParams.get('recur'), 'RRULE:FREQ=WEEKLY;COUNT=4');
});
test('both calendar options reject nonexistent dates and past reminders', () => {
  for (const make of [reminderCalendar, googleCalendarLink]) {
    assert.throws(() => make({ ...input, start: '2027-02-30T09:00' }, now));
    assert.throws(() => make({ ...input, start: '2020-01-01T09:00' }, now));
  }
});
