const PROFILE_PAGES = ['overview', 'progress', 'journeys', 'preferences', 'plans', 'help', 'account', 'export'];
type ProfilePage = string;
function validManifestPage(value: string) { return ['overview', 'goal', 'water', 'vision'].includes(value) || /^foundation:[0-6]$/.test(value); }
export function durableDestination(value: string | null): string | null {
  if (!value) return null;
  if (/^hub:(home|manifest|journal|affirmations|support|sleep|library|profile)$/.test(value)) return value;
  if (value.startsWith('profile:') && PROFILE_PAGES.includes(value.slice(8) as ProfilePage)) return value;
  if (value.startsWith('manifest:') && validManifestPage(value.slice(9))) return value;
  if (['tool:timer', 'tool:breathe', 'journal', 'sanctuary', 'manifestation'].includes(value)) return value;
  if (['session', 'sleep', 'flow', 'programme'].includes(value)) return 'hub:library';
  return null;
}
