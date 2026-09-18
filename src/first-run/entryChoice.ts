export type EntryChoice = 'meditate' | 'manifest' | 'both';
export const entryKey = (userId: string) => `come-home:entry-choice:v1:${encodeURIComponent(userId)}`;
export function readEntryChoice(userId: string): EntryChoice | null {
  try { const value = localStorage.getItem(entryKey(userId)); return value === 'meditate' || value === 'manifest' || value === 'both' ? value : null; } catch { return null; }
}
export function saveEntryChoice(userId: string, choice: EntryChoice) { localStorage.setItem(entryKey(userId), choice); }
export function entryTab(choice: EntryChoice): 'library' | 'manifest' | 'home' { return choice === 'meditate' ? 'library' : choice === 'manifest' ? 'manifest' : 'home'; }
