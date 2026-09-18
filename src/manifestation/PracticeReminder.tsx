import { useEffect, useId, useRef, useState } from 'react';
import './journey.css';
import { Bell } from 'lucide-react';
import { defaultReminderTime, reminderCalendar } from './reminderCalendar';

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
  function download() {
    try {
      const content = reminderCalendar({ start, daily: false, repeat, location, title: day === undefined ? title : `Day ${day + 1} · ${title}`, action: includeAction ? action : prompt, uid: uid.current });
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
    <label className="water-check"><input type="checkbox" checked={includeAction} onChange={e => setIncludeAction(e.target.checked)} />Include my practice or action text in the calendar event</label>
    {includeAction && <p className="water-pause">{action}</p>}
    <p className="journey-muted">Personal text may be visible in shared calendars and notifications. Without it, your reminder uses a gentle, general prompt.</p>
    <button type="button" className="journey-button" onClick={download}>Add to calendar</button>
    <p role="status">{message}</p>
    <p>Your calendar handles alerts, including while COME HOME is closed. The reminder text stays the same; it does not change with your progress. To change, snooze or stop reminders, use your calendar; completing or updating a practice here will not cancel them.</p>
    <details><summary>How to finish adding it</summary><p>Open the downloaded .ics file with a calendar app and confirm the event. If your phone only downloads the file, use your calendar’s import option on a computer. Check the event time and notification settings. If you change this reminder, edit the existing calendar event to avoid duplicates.</p></details>
    </div>
  </section>;
}
