import { useState } from 'react';
import { PATHS } from '../data/paths';
import { PROGRAMMES } from '../data/programmes';
import { SLEEP_ITEMS } from '../data/sleep';
import { FEELING_FLOWS } from '../data/flows';
import { session } from '../store/session';
import { programme } from '../store/programme';
import { app } from '../store/app';
import { enterFlow } from '../store/flow';
import { openSleep } from '../store/sleep';
import '../manifestation/journey.css';

export function beginMeditation() {
  programme.clearActiveDay(); session.reset(); session.go('arrival'); app.setView('session');
}

export default function MeditationCollection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const entries = [
    ...PATHS.map(path => ({ id: `path:${path.id}`, title: path.title, group: 'Meditation', detail: `${path.duration} suggested sitting · on-screen prompts and music`, open: () => { programme.clearActiveDay(); session.reset(); session.pickPath(path.id); app.setView('session'); } })),
    ...PROGRAMMES.filter(p => !p.comingSoon).map(p => ({ id: `programme:${p.id}`, title: p.title, group: 'Programmes', detail: `${p.days.length} days · ${p.blurb}`, open: () => programme.open(p.id) })),
    ...SLEEP_ITEMS.filter(item => item.src).map(item => ({ id: item.id, title: item.title, group: 'Sleep & sound', detail: `${item.kind}${item.length ? ` · ${item.length}` : ''}`, open: () => { programme.clearActiveDay(); openSleep(item); } })),
    ...FEELING_FLOWS.map(item => ({ id: `flow:${item.id}`, title: item.practice.title, group: 'Emotional support', detail: `${item.title} · on-screen practice with sound`, open: () => { programme.clearActiveDay(); enterFlow(item.id); } })),
  ];
  const visible = entries.filter(entry => (category === 'All' || entry.group === category) && `${entry.title} ${entry.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="journey-card">
    <h2 className="serif">Meditation & rest library</h2>
    <button className="journey-button" onClick={beginMeditation}>Begin a meditation</button>
    <label className="journey-label">Find a practice<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Grounding, rest, fear…" /></label>
    <label className="journey-label">Browse collection<select value={category} onChange={e => setCategory(e.target.value)}>{['All', 'Meditation', 'Programmes', 'Sleep & sound', 'Emotional support'].map(label => <option key={label}>{label}</option>)}</select></label>
    <p role="status">{visible.length} {visible.length === 1 ? 'practice' : 'practices'} to explore</p>
    <p className="journey-muted">These are the existing practices. Some share audio; programme days reuse existing sessions. On-screen guidance is labelled separately from recorded narration.</p>
    {visible.map(entry => <button className="journey-row" key={entry.id} onClick={entry.open}><span>{entry.title}<small>{entry.detail}</small></span><span aria-hidden="true">→</span></button>)}
    {!visible.length && <p>No matching practice. Try a different word or collection.</p>}
  </section>;
}
