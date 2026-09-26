import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccountIdentityTracker } from '../src/lib/accountIdentity.ts';

const account = (id, loading = false) => ({ loading, user: { id, isGuest: false } });
const guest = (loading = false) => ({ loading, user: { id: 'local-guest', isGuest: true } });

test('session hydration does not restore guest data before the signed-in identity is known', () => {
  const changed = createAccountIdentityTracker();
  assert.equal(changed(guest(true)), false);
  assert.equal(changed(account('a')), true);
});

test('repeated sign-in, token refresh and profile updates do not reload cloud data', () => {
  const changed = createAccountIdentityTracker();
  let deviceDraft = 'cloud copy';
  if (changed(account('a'))) deviceDraft = 'cloud copy';
  deviceDraft = 'new offline writing';
  for (let i = 0; i < 3; i++) {
    if (changed(account('a'))) deviceDraft = 'cloud copy';
  }
  assert.equal(deviceDraft, 'new offline writing');
});

test('sign-out, another account and signing back in each trigger a transition once', () => {
  const changed = createAccountIdentityTracker();
  assert.equal(changed(guest()), true);
  assert.equal(changed(guest()), false);
  assert.equal(changed(account('a')), true);
  assert.equal(changed(account('b')), true);
  assert.equal(changed(guest()), true);
  assert.equal(changed(account('b')), true);
  assert.equal(changed(account('b')), false);
});
