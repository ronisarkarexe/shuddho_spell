-- 025_saifurs_word_marks.sql
--
-- Which Saifur's cards this learner is studying, and which they have marked
-- known. The list is content, not a table of words, so there is nothing in
-- `words` to hang a `review_items` row on. One row per learner per headword
-- is the whole fact. Written by the server after it has checked the word
-- exists in the corpus; the client may not invent a mark for a ghost.

create table if not exists public.saifurs_word_marks (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        not null references public.learner_profiles (id) on delete cascade,
  word        text        not null,
  status      text        not null check (status in ('learning', 'known')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (profile_id, word)
);

comment on table public.saifurs_word_marks is
  'Per-word Learning / Known marks for Saifur''s vocabulary. One row per learner per headword.';

comment on column public.saifurs_word_marks.word is
  'Headword, matching SaifursEntry.cursor. Validated against the corpus before write.';

comment on column public.saifurs_word_marks.status is
  'learning = I am studying this card; known = I have it. Clearing the mark deletes the row.';

create index if not exists saifurs_word_marks_profile_status_idx
  on public.saifurs_word_marks (profile_id, status);

alter table public.saifurs_word_marks enable row level security;

grant select on public.saifurs_word_marks to authenticated;

drop policy if exists saifurs_word_marks_select_own on public.saifurs_word_marks;
create policy saifurs_word_marks_select_own
  on public.saifurs_word_marks for select
  to authenticated
  using (profile_id = public.current_profile_id());

-- No insert/update/delete from the client. The server writes through the
-- service client after it has confirmed the headword is in the corpus.

drop trigger if exists set_updated_at_saifurs_word_marks on public.saifurs_word_marks;
create trigger set_updated_at_saifurs_word_marks
  before update on public.saifurs_word_marks
  for each row execute function public.set_updated_at();
