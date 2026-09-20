create table if not exists public.account_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  manifestation jsonb not null default '{"goal":"","why":"","answers":{},"completed":[]}'::jsonb,
  programme_progress jsonb not null default '{}'::jsonb,
  favorites jsonb not null default '[]'::jsonb,
  journal jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint account_app_state_manifestation_object check (jsonb_typeof(manifestation) = 'object'),
  constraint account_app_state_programme_object check (jsonb_typeof(programme_progress) = 'object'),
  constraint account_app_state_favorites_array check (jsonb_typeof(favorites) = 'array'),
  constraint account_app_state_journal_array check (jsonb_typeof(journal) = 'array')
);

alter table public.account_app_state enable row level security;
revoke all on table public.account_app_state from anon;
grant select, insert, update, delete on table public.account_app_state to authenticated;

create policy "account_app_state_select_own" on public.account_app_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "account_app_state_insert_own" on public.account_app_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "account_app_state_update_own" on public.account_app_state
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "account_app_state_delete_own" on public.account_app_state
  for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.vision_board_items (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  caption text not null check (char_length(caption) between 1 and 300),
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vision_board_image_owned_path check (image_path is null or image_path like user_id::text || '/%')
);
create index if not exists vision_board_items_user_id_idx on public.vision_board_items(user_id);
alter table public.vision_board_items enable row level security;
revoke all on table public.vision_board_items from anon;
grant select, insert, update, delete on table public.vision_board_items to authenticated;

create policy "vision_board_items_select_own" on public.vision_board_items
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "vision_board_items_insert_own" on public.vision_board_items
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "vision_board_items_update_own" on public.vision_board_items
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "vision_board_items_delete_own" on public.vision_board_items
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.set_account_data_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_account_app_state_updated_at before update on public.account_app_state
  for each row execute function public.set_account_data_updated_at();
create trigger set_vision_board_items_updated_at before update on public.vision_board_items
  for each row execute function public.set_account_data_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vision-board', 'vision-board', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "vision_board_images_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'vision-board' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "vision_board_images_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'vision-board' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "vision_board_images_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'vision-board' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'vision-board' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "vision_board_images_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'vision-board' and (storage.foldername(name))[1] = (select auth.uid())::text);
