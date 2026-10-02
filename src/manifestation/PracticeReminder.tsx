import { useEffect, useId, useRef, useState } from 'react';
import './journey.css';
import { Bell } from 'lucide-react';
import { defaultReminderTime, googleCalendarLink, reminderCalendar } from './reminderCalendar';

export default function PracticeReminder({ day, title, action, location = 'Manifest → Foundation', label = 'Set reminder', prompt = 'Take a mindful pause. What is one small action you can practise today?' }: { day?: number; title: string; action: string; location?: string; label?: string; prompt?: string }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const [start, setStart] = useState(defaultReminderTime);
  const [repeat, setRepeat] = useState<'once' | 'daily7' | 'daily21' | 'weekly4'>('once');
  const [includeAction, setIncludeAction] = useState(false);
  const [message, setMessage] = useState('');
  const url = useRef<string | null>(null);
  const uid = useRef(crypto.randomUUID());
  useEffect(() => () => { if (url.current) URL.revokeObjectURL(url.current); }, []);
  function reminderInput() {
    return { start, daily: false, repeat, location, title: day === undefined ? title : `Day ${day + 1} · ${title}`, action: includeAction ? action : prompt, uid: uid.current };
  }
  function openGoogle() {
    try {
      const link = document.createElement('a');
      link.href = googleCalendarLink(reminderInput());
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.body.appendChild(link); link.click(); link.remove();
      setMessage('In Google Calendar, check the time and repeat schedule, add a notification, then tap Save. Your reminder is not scheduled until you save it there.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not open Google Calendar. Try the calendar file instead.'); }
  }
  function download() {
    try {
      const content = reminderCalendar(reminderInput());
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url.current; link.download = 'come-home-reminder.ics';
      document.body.appendChild(link); link.click(); link.remove();
      setMessage('Calendar file prepared. Open it and confirm Add or Import in your calendar. Check that an alert is enabled. Nothing is scheduled until you finish that step.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not prepare the reminder. Please try again.'); }
  }
  return <section className="practice-reminder">
    <button type="button" className="journey-button reminder-button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(value => !value)}><Bell size={18} aria-hidden="true" />{label}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div id={panelId} hidden={!expanded} className="reminder-settings">
    <label className="journey-label">First reminder (your local time)<input type="datetime-local" value={start} onChange={e => { setStart(e.target.value); setMessage(''); }} /></label>
    <label className="journey-label">Repeat<select value={repeat} onChange={e => { setRepeat(e.target.value as typeof repeat); setMessage(''); }}><option value="once">Just once</option><option value="daily7">Daily for 7 days</option><option value="daily21">Daily for 21 days</option><option value="weekly4">Weekly for 4 weeks</option></select></label>
    <label className="water-check"><input type="checkbox" checked={includeAction} onChange={e => { setIncludeAction(e.target.checked); setMessage(''); }} />Include my practice or action text in the calendar event</label>
    {includeAction && <p className="water-pause">{action}</p>}
    <p className="journey-muted">Personal text may be visible in shared calendars and notifications. Without it, your reminder uses a gentle, general prompt.</p>
    <div className="journey-actions"><button type="button" className="journey-button" onClick={openGoogle}>Open Google Calendar</button>
    <button type="button" className="journey-button" onClick={download}>Download calendar file (.ics)</button></div>
    <p className="journey-muted">Google Calendar opens in a new tab and may ask you to sign in. For Apple Calendar or another calendar, use the calendar file option.</p>
    <p role="status">{message}</p>
    <p>Your calendar handles alerts, including while COME HOME is closed. The reminder text stays the same; it does not change with your progress. To change, snooze or stop reminders, use your calendar; completing or updating a practice here will not cancel them.</p>
    <details><summary>Apple Calendar and other calendars</summary><p>Download the .ics file, open it with your calendar and confirm Add or Import. Check the time, repeat schedule and alert. If your iPhone only saves the file without offering Calendar, import it on a Mac using Calendar → File → Import, or use Google Calendar instead. Choose a calendar that syncs to your phone.</p><p>To change an existing reminder, edit it in your calendar instead of adding another copy. COME HOME cannot confirm whether you finished saving it.</p></details>
    </div>
  </section>;
}
