import { useEffect, useRef, useState } from 'react';
import { defaultReminderTime, reminderCalendar } from './reminderCalendar';

export default function PracticeReminder({ day, title, action }: { day: number; title: string; action: string }) {
  const [start, setStart] = useState(defaultReminderTime);
  const [daily, setDaily] = useState(false);
  const [includeAction, setIncludeAction] = useState(false);
  const [message, setMessage] = useState('');
  const url = useRef<string | null>(null);
  const uid = useRef(crypto.randomUUID());
  useEffect(() => () => { if (url.current) URL.revokeObjectURL(url.current); }, []);
  function download() {
    try {
      const content = reminderCalendar({ start, daily, title: `Day ${day + 1} · ${title}`, action: includeAction ? action : 'Take a mindful pause. What is one small action you can practise today?', uid: uid.current });
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url.current; link.download = `come-home-day-${day + 1}-reminder.ics`;
      document.body.appendChild(link); link.click(); link.remove();
      setMessage('Calendar file prepared. Open it and confirm Add or Import in your calendar. Check that an alert is enabled. Nothing is scheduled until you finish that step.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not prepare the reminder. Please try again.'); }
  }
  return <details className="journey-disclosure">
    <summary>Set reminder <small>A gentle nudge to carry this practice into your day</small></summary>
    <label className="journey-label">First reminder (your local time)<input type="datetime-local" value={start} onChange={e => { setStart(e.target.value); setMessage(''); }} /></label>
    <label className="journey-label">Repeat<select value={daily ? 'daily' : 'once'} onChange={e => { setDaily(e.target.value === 'daily'); setMessage(''); }}><option value="once">Just once</option><option value="daily">Daily for 7 days</option></select></label>
    <label className="water-check"><input type="checkbox" checked={includeAction} onChange={e => setIncludeAction(e.target.checked)} />Include my action text in the calendar event</label>
    {includeAction && <p className="water-pause">{action}</p>}
    <p className="journey-muted">Personal action text may be visible in shared calendars and notifications. Without it, your reminder uses a gentle, general prompt.</p>
    <button type="button" className="journey-button" onClick={download}>Add to calendar</button>
    <p role="status">{message}</p>
    <p>Your calendar handles alerts, including while COME HOME is closed. This repeats this day’s practice only. To change, snooze or stop reminders, use your calendar; completing the lesson here will not cancel them.</p>
    <details><summary>How to finish adding it</summary><p>Open the downloaded .ics file with a calendar app and confirm the event. If your phone only downloads the file, use your calendar’s import option on a computer. Check the event time and notification settings. If you change this reminder, edit the existing calendar event to avoid duplicates.</p></details>
  </details>;
}
