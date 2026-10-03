export function draftKey(owner: string, kind: string) { return `come-home:draft:v1:${owner}:${kind}`; }
export function readDraft<T>(key: string, fallback: T, valid: (value: unknown) => boolean): T {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) || 'null'); return valid(value) ? value as T : fallback; }
  catch { return fallback; }
}
export function writeDraft(key: string, value: unknown) {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
}
export function dateKey(now = new Date()) { return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; }
export type AffirmationDraft = { day: string; chosen: string; count: number; completed: boolean };
export function validAffirmation(value: unknown): value is AffirmationDraft {
  const v = value as AffirmationDraft | null;
  return !!v && typeof v.day === 'string' && typeof v.chosen === 'string' && Number.isInteger(v.count) && v.count >= 0 && v.count <= 3 && typeof v.completed === 'boolean';
}
