export type ReminderInput = { start: string; daily: boolean; title: string; action: string; uid: string; location?: string; repeat?: 'once' | 'daily7' | 'daily21' | 'weekly4' };
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
// RFC 5545 folding counts UTF-8 octets, without splitting a Unicode character.
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  let result = '', bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { result += '\r\n '; bytes = 1; }
    result += char; bytes += size;
  }
  return result;
}
export function reminderCalendar(input: ReminderInput, now = new Date()): string {
  const date = new Date(input.start);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.start) || !Number.isFinite(date.getTime()) || date <= now) throw new Error('Choose a future date and time.');
  if (!/^[a-zA-Z0-9-]+$/.test(input.uid)) throw new Error('Invalid reminder identifier.');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//COME HOME//Foundation reminders//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${input.uid}@come-home`, `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${input.start.replace(/[-:]/g, '')}00`, 'DURATION:PT5M', ...(input.repeat === 'daily21' ? ['RRULE:FREQ=DAILY;COUNT=21'] : input.repeat === 'weekly4' ? ['RRULE:FREQ=WEEKLY;COUNT=4'] : input.repeat === 'daily7' || (!input.repeat && input.daily) ? ['RRULE:FREQ=DAILY;COUNT=7'] : []), `SUMMARY:${escapeText('COME HOME · ' + input.title)}`, `DESCRIPTION:${escapeText(input.action + '\n\nOpen COME HOME → ' + (input.location || 'Manifest → Foundation') + '. Manage or delete this reminder in your calendar. This is a fixed reminder; it does not automatically change with your progress.')}`, 'STATUS:CONFIRMED', 'TRANSP:TRANSPARENT', 'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0S', `DESCRIPTION:${escapeText('COME HOME · ' + input.title)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
export function defaultReminderTime(now = new Date()): string {
  const next = new Date(now.getTime() + 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(next.getHours())}:${pad(next.getMinutes())}`;
}
