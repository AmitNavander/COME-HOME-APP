import { app } from '../store/app';
import type { JournalPath } from './guidance';

let pending: { path: JournalPath; affirmation?: string } | null = null;
export function openGuidedJournal(path: JournalPath, affirmation?: string) {
  pending = { path, affirmation };
  app.setView('journal');
}
export function takeJournalContext() {
  return pending;
}
export function clearJournalContext() {
  pending = null;
}
