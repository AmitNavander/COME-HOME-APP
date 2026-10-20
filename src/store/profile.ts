import { useSyncExternalStore } from 'react';
export const PROFILE_PAGES = ['overview', 'progress', 'journeys', 'preferences', 'plans', 'help', 'account', 'export'] as const;
export type ProfilePage = typeof PROFILE_PAGES[number];
let page: ProfilePage = 'overview';
const listeners = new Set<() => void>();
export const profileNavigation = {
  get page() { return page; },
  open(next: ProfilePage) { if (page === next) return; page = next; listeners.forEach(listener => listener()); },
};
export function useProfilePage() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => page, () => page);
}
