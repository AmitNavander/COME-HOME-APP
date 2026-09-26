import { useState } from 'react';
import { app } from '../store/app';
import { hub } from '../store/hub';
import { useAuth } from '../lib/auth';
import { markOnboardingDone } from '../lib/storage';
import { entryTab, readEntryChoice, saveEntryChoice } from './entryChoice';
import type { EntryChoice } from './entryChoice';
import '../manifestation/journey.css';

const options: { id: EntryChoice; title: string; text: string }[] = [
  { id: 'meditate', title: 'I want to meditate', text: 'Find calm, breathe, rest and explore the meditation library.' },
  { id: 'manifest', title: 'I want to manifest', text: 'Build clarity through intention, visualization and practical action. Begin with a guided foundation.' },
  { id: 'both', title: 'I want to explore both', text: 'See two clearly separated paths on Today and choose what you need each day.' },
];
export default function Onboarding() {
  const { user, loading } = useAuth();
  const [choice, setChoice] = useState<EntryChoice | null>(() => readEntryChoice(user.id));
  const [error, setError] = useState('');
  function finish() {
    if (!choice || loading) return;
    try { saveEntryChoice(user.id, choice); markOnboardingDone(); hub.setTab(entryTab(choice)); app.setView('hub'); }
    catch { setError('Could not save your choice. Please allow browser storage and try again.'); }
  }
  return <div className="screen"><main className="journey-page entry-page">
    <div className="eyebrow">Welcome to COME HOME</div><h1 className="serif">What brings you here?</h1>
    <p>Choose where you want to start. You can change this later under You, and both paths remain available.</p>
    <fieldset><legend className="eyebrow">Choose your starting path</legend>{options.map(option => <label key={option.id} className={`entry-option ${choice === option.id ? 'selected' : ''}`}><input type="radio" name="entry-path" value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} /><span><strong>{option.title}</strong><span>{option.text}</span></span></label>)}</fieldset>
    <button className="journey-button" disabled={!choice || loading} onClick={finish}>{choice === 'meditate' ? 'Enter Meditate' : choice === 'manifest' ? 'Enter Manifest' : choice === 'both' ? 'Explore both paths' : 'Choose a path to continue'}</button>
    <p role="alert">{error}</p>
  </main></div>;
}
