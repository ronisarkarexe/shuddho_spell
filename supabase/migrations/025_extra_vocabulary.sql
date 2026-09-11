-- 025_extra_vocabulary.sql
--
-- Extra vocabulary is a separate list from Saifur's. One bookmark row per
-- learner, and one Learning / Known mark per learner per headword. The list
-- is content, not a table of words. Writes go through the service client
-- after the server has turned a page number into a serial, or checked the
-- headword exists in the corpus.

create table if not exists public.extra_vocabulary_progress (
  profile_id  uuid        primary key references public.learner_profiles (id) on delete cascade,
  last_page   integer     not null default 1 check (last_page >= 1),
  last_serial integer     not null default 0 check (last_serial >= 0),
  words_read  integer     not null default 0 check (words_read >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.extra_vocabulary_progress is
  'Bookmark for Extra vocabulary. One row per learner; words_read only rises.';

alter table public.extra_vocabulary_progress enable row level security;

grant select on public.extra_vocabulary_progress to authenticated;

drop policy if exists extra_vocabulary_progress_select_own on public.extra_vocabulary_progress;
create policy extra_vocabulary_progress_select_own
  on public.extra_vocabulary_progress for select
  to authenticated
  using (profile_id = public.current_profile_id());

drop trigger if exists set_updated_at_extra_vocabulary_progress on public.extra_vocabulary_progress;
create trigger set_updated_at_extra_vocabulary_progress
  before update on public.extra_vocabulary_progress
  for each row execute function public.set_updated_at();

create table if not exists public.extra_vocabulary_marks (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        not null references public.learner_profiles (id) on delete cascade,
  word        text        not null,
  status      text        not null check (status in ('learning', 'known')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (profile_id, word)
);

comment on table public.extra_vocabulary_marks is
  'Per-word Learning / Known marks for Extra vocabulary. One row per learner per headword.';

create index if not exists extra_vocabulary_marks_profile_status_idx
  on public.extra_vocabulary_marks (profile_id, status);

alter table public.extra_vocabulary_marks enable row level security;

grant select on public.extra_vocabulary_marks to authenticated;

drop policy if exists extra_vocabulary_marks_select_own on public.extra_vocabulary_marks;
create policy extra_vocabulary_marks_select_own
  on public.extra_vocabulary_marks for select
  to authenticated
  using (profile_id = public.current_profile_id());

drop trigger if exists set_updated_at_extra_vocabulary_marks on public.extra_vocabulary_marks;
create trigger set_updated_at_extra_vocabulary_marks
  before update on public.extra_vocabulary_marks
  for each row execute function public.set_updated_at();
