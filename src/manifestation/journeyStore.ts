import { useSyncExternalStore } from 'react';

const KEY = 'come-home:manifest-journey:v1';
export type JourneyData = { goal: string; why: string; answers: Record<string, string>; completed: number[] };
const empty: JourneyData = { goal: '', why: '', answers: {}, completed: [] };
function read(): JourneyData {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw || typeof raw.goal !== 'string' || typeof raw.why !== 'string') return empty;
    return { goal: raw.goal, why: raw.why, answers: Object.fromEntries(Object.entries(raw.answers || {}).filter(([, v]) => typeof v === 'string')) as Record<string, string>, completed: Array.isArray(raw.completed) ? [...new Set<number>(raw.completed.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < 7))] : [] };
  } catch { return empty; }
}
let data = read();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function saveJourney(next: JourneyData) {
  // Do not report success or discard the draft if device storage is unavailable.
  localStorage.setItem(KEY, JSON.stringify(next));
  data = next;
  listeners.forEach(listener => listener());
}
export function useJourney() {
  return { data: useSyncExternalStore(subscribe, () => data, () => empty), save: saveJourney };
}
