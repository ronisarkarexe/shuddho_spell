-- 024_saifurs_vocabulary_progress.sql
--
-- Where a learner stopped in Saifur's vocabulary.
--
-- The list is content, not a table of words, so there is nothing in `words`
-- to hang a `review_items` row on. One row per learner is the whole fact:
-- last page, last serial, how far they have reached. Written by the server
-- from the page number; the serial is computed from the corpus so the client
-- cannot invent a count.

create table if not exists public.saifurs_vocabulary_progress (
  profile_id  uuid        primary key references public.learner_profiles (id) on delete cascade,
  last_page   integer     not null default 1 check (last_page >= 1),
  last_serial integer     not null default 0 check (last_serial >= 0),
  words_read  integer     not null default 0 check (words_read >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.saifurs_vocabulary_progress is
  'Bookmark for Saifur''s vocabulary. One row per learner; words_read only rises.';

comment on column public.saifurs_vocabulary_progress.last_page is
  '1-based page of the unfiltered list the learner last stood on.';

comment on column public.saifurs_vocabulary_progress.last_serial is
  'Last word number on that page. Computed on the server from the corpus.';

comment on column public.saifurs_vocabulary_progress.words_read is
  'Furthest serial reached. Going back a page does not lower this.';

alter table public.saifurs_vocabulary_progress enable row level security;

grant select on public.saifurs_vocabulary_progress to authenticated;

drop policy if exists saifurs_vocabulary_progress_select_own on public.saifurs_vocabulary_progress;
create policy saifurs_vocabulary_progress_select_own
  on public.saifurs_vocabulary_progress for select
  to authenticated
  using (profile_id = public.current_profile_id());

-- No insert/update from the client. The server writes through the service
-- client after it has turned a page number into a serial.

drop trigger if exists set_updated_at_saifurs_vocabulary_progress on public.saifurs_vocabulary_progress;
create trigger set_updated_at_saifurs_vocabulary_progress
  before update on public.saifurs_vocabulary_progress
  for each row execute function public.set_updated_at();
