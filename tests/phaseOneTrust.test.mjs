import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const auth = await readFile(new URL('../src/lib/auth.ts', import.meta.url), 'utf8');
const firstRun = await readFile(new URL('../src/first-run/FirstRun.tsx', import.meta.url), 'utf8');
const profile = await readFile(new URL('../src/hub/tabs/ProfileTab.tsx', import.meta.url), 'utf8');
const removeAccount = await readFile(new URL('../supabase/functions/delete-account/index.ts', import.meta.url), 'utf8');

test('password recovery is available from login and completes through authenticated updateUser', () => {
  assert.match(firstRun, /Forgot password\?/);
  assert.match(auth, /resetPasswordForEmail/);
  assert.match(auth, /PASSWORD_RECOVERY/);
  assert.match(auth, /updateUser\(\{ password \}\)/);
});

test('account deletion verifies the caller and removes private files before the auth account', () => {
  const verifyAt = removeAccount.indexOf('auth.getUser(token)');
  const storageAt = removeAccount.indexOf("storage.from('vision-board').remove");
  const deleteAt = removeAccount.indexOf('auth.admin.deleteUser(user.id)');
  assert.ok(verifyAt > -1);
  assert.ok(storageAt > verifyAt);
  assert.ok(deleteAt > storageAt);
  assert.match(profile, /Delete permanently/);
  assert.doesNotMatch(auth, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('profile starts with calm collapsed sections rather than all settings expanded', () => {
  assert.match(profile, /function ProfileSection/);
  assert.match(profile, /<details className="journey-disclosure">/);
  assert.match(profile, /Privacy and account/);
});
