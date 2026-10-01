import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

test('install prompt handles dismissal, retry, errors and confirmed installation', async () => {
  const previousWindow = globalThis.window;
  const events = new EventTarget();
  const display = new EventTarget();
  display.matches = false;
  globalThis.window = Object.assign(events, { matchMedia: () => display });
  try {
    const source = (await readFile(new URL('../src/pwa/install.ts', import.meta.url), 'utf8'))
      .replace("import { useSyncExternalStore } from 'react';", 'const useSyncExternalStore = (_subscribe, getSnapshot) => getSnapshot();');
    const compiled = stripTypeScriptTypes(source);
    const app = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
    assert.equal(app.useInstall().available, false);
    const offer = (outcome, fail = false) => {
      const event = new Event('beforeinstallprompt', { cancelable: true });
      event.prompt = async () => { if (fail) throw new Error('unavailable'); };
      event.userChoice = Promise.resolve({ outcome });
      events.dispatchEvent(event);
      assert.equal(event.defaultPrevented, true);
    };
    offer('dismissed');
    await app.installApp();
    assert.equal(app.useInstall().installed, false);
    assert.equal(app.useInstall().available, false);
    assert.match(app.useInstall().message, /later/);
    offer('accepted', true);
    await app.installApp();
    assert.equal(app.useInstall().busy, false);
    assert.match(app.useInstall().message, /browser menu/);
    offer('accepted');
    await app.installApp();
    assert.equal(app.useInstall().installed, false, 'accepted prompt is not confirmed installation');
    events.dispatchEvent(new Event('appinstalled'));
    assert.equal(app.useInstall().installed, true);
    assert.equal(app.useInstall().available, false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
