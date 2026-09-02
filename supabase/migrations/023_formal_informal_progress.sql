-- 023_formal_informal_progress.sql
--
-- Where a learner stopped in the informal → formal reference.
--
-- The list is content, not a table of words, so there is nothing in `words`
-- to hang a `review_items` row on. Folding a bookmark into `mastery_records`
-- would put a "how far did I scroll" number on a table whose job is accuracy.
-- One row per learner is the whole fact: last page, last serial, how far
-- they have reached. Written by the server from the page number; the serial
-- is computed from the corpus so the client cannot invent a count.

create table if not exists public.formal_informal_progress (
  profile_id  uuid        primary key references public.learner_profiles (id) on delete cascade,
  last_page   integer     not null default 1 check (last_page >= 1),
  last_serial integer     not null default 0 check (last_serial >= 0),
  pairs_read  integer     not null default 0 check (pairs_read >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.formal_informal_progress is
  'Bookmark for the informal → formal list. One row per learner; pairs_read only rises.';

comment on column public.formal_informal_progress.last_page is
  '1-based page of the unfiltered list the learner last stood on.';

comment on column public.formal_informal_progress.last_serial is
  'Last pair number on that page. Computed on the server from the corpus.';

comment on column public.formal_informal_progress.pairs_read is
  'Furthest serial reached. Going back a page does not lower this.';

alter table public.formal_informal_progress enable row level security;

grant select on public.formal_informal_progress to authenticated;

drop policy if exists formal_informal_progress_select_own on public.formal_informal_progress;
create policy formal_informal_progress_select_own
  on public.formal_informal_progress for select
  to authenticated
  using (profile_id = public.current_profile_id());

-- No insert/update from the client. The server writes through the service
-- client after it has turned a page number into a serial. A client able to
-- write pairs_read could report they had finished the list without opening it.

drop trigger if exists set_updated_at_formal_informal_progress on public.formal_informal_progress;
create trigger set_updated_at_formal_informal_progress
  before update on public.formal_informal_progress
  for each row execute function public.set_updated_at();
