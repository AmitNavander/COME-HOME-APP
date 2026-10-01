import { useSyncExternalStore } from 'react';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const display = window.matchMedia('(display-mode: standalone)');
let prompt: InstallPrompt | null = null;
let installed = display.matches || !!(navigator as Navigator & { standalone?: boolean }).standalone;
let busy = false;
let message = '';
const listeners = new Set<() => void>();
let snapshot = { installed, available: false, busy, message };
function emit() {
  snapshot = { installed, available: !!prompt, busy, message };
  listeners.forEach(listener => listener());
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  prompt = event as InstallPrompt;
  emit();
});
window.addEventListener('appinstalled', () => {
  installed = true;
  prompt = null;
  message = 'COME HOME has been added. Open it from your home screen.';
  emit();
});
display.addEventListener('change', () => {
  installed = display.matches || !!(navigator as Navigator & { standalone?: boolean }).standalone;
  emit();
});

export function useInstall() {
  return useSyncExternalStore(listener => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, () => snapshot);
}

export async function installApp() {
  const pending = prompt;
  if (!pending || busy) return;
  busy = true;
  message = '';
  emit();
  try {
    await pending.prompt();
    const choice = await pending.userChoice;
    message = choice.outcome === 'accepted'
      ? 'Installation requested. Follow your browser’s confirmation, then look for COME HOME on your home screen.'
      : 'No problem. You can install later from your browser menu.';
  } catch {
    message = 'Use your browser menu to install, or follow the instructions below.';
  } finally {
    if (prompt === pending) prompt = null;
    busy = false;
    emit();
  }
}
