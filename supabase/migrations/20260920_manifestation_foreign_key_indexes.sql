create index if not exists gratitude_entries_manifestation_id_idx
  on public.gratitude_entries(manifestation_id);
create index if not exists practice_completions_manifestation_id_idx
  on public.practice_completions(manifestation_id);
create index if not exists practice_completions_meditation_id_idx
  on public.practice_completions(meditation_id);
create index if not exists practice_completions_practice_id_idx
  on public.practice_completions(practice_id);
create index if not exists visualization_sessions_manifestation_id_idx
  on public.visualization_sessions(manifestation_id);
