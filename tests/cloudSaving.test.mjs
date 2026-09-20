import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const migration = await readFile(new URL('../supabase/migrations/20260920_account_cloud_saving.sql', import.meta.url), 'utf8');
const client = await readFile(new URL('../src/lib/accountCloud.ts', import.meta.url), 'utf8');

test('account state and vision cards are protected by own-row RLS', () => {
  assert.match(migration, /alter table public\.account_app_state enable row level security/i);
  assert.match(migration, /alter table public\.vision_board_items enable row level security/i);
  assert.match(migration, /using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(migration, /with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(migration, /revoke all on table public\.account_app_state from anon/i);
});

test('vision images use a private, account-folder-scoped bucket', () => {
  assert.match(migration, /'vision-board',\s*'vision-board',\s*false/i);
  assert.match(migration, /storage\.foldername\(name\)\)\[1\] = \(select auth\.uid\(\)\)::text/i);
  assert.match(migration, /file_size_limit[^;]*5242880/is);
});

test('browser client never contains a privileged Supabase key', () => {
  assert.doesNotMatch(client, /service[_-]?role/i);
  assert.match(client, /ACTIVE_ACCOUNT_KEY/);
  assert.match(client, /restoreGuest/);
});
