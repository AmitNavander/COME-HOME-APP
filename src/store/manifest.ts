import { useSyncExternalStore } from 'react';
export type ManifestPage = 'overview' | 'goal' | 'water' | 'vision' | `foundation:${number}`;
export function validManifestPage(value: string): value is ManifestPage {
  return ['overview', 'goal', 'water', 'vision'].includes(value) || /^foundation:[0-6]$/.test(value);
}
let page: ManifestPage = 'overview';
const listeners = new Set<() => void>();
export const manifestNavigation = {
  get page() { return page; },
  open(next: ManifestPage) { if (!validManifestPage(next) || page === next) return; page = next; listeners.forEach(listener => listener()); },
};
export function useManifestPage() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => page, () => page);
}
