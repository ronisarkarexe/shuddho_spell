'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import { LearnStepper } from '@/components/learning/learn-stepper';
import { NumberedPager } from '@/components/learning/numbered-pager';
import {
  StudyToggles,
  studyLang,
  type StudyAccent,
  type StudyMode,
} from '@/components/learning/study-toggles';
import {
  VOCABULARY_PAGE_SIZE,
  shortPos,
  vocabularyPageSchema,
  type VocabularyEntryView,
  type VocabularyPage,
} from '@/components/learning/vocabulary-contracts';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface IVocabularyExplorerProps {
  readonly initialPage: VocabularyPage;
  readonly initialAccent: StudyAccent;
  readonly lockedTopic?: string;
  readonly pageSize?: number;
}

interface IFilters {
  readonly partOfSpeech: string;
  readonly startsWith: string;
}

const NO_FILTERS: IFilters = { partOfSpeech: '', startsWith: '' };

/**
 * The vocabulary reference: filter, page, and one row per pair.
 *
 * A Client Component because filtering is interaction. The first page arrives
 * from the server render already populated; every page and every filter after
 * that comes from `/api/v1/library/vocabulary`, which runs the same use case
 * the server just ran.
 *
 * **The search box matches synonyms as well as headwords.** Half the reason to
 * open this screen is having the plain word and wanting the better one.
 *
 * A locked topic is a dedicated menu: the topic is in the URL, not a dropdown,
 * so paging and Learn stay inside that list.
 */
export function VocabularyExplorer({
  initialPage,
  initialAccent,
  lockedTopic,
  pageSize = VOCABULARY_PAGE_SIZE,
}: IVocabularyExplorerProps): ReactElement {
  const [page, setPage] = useState<VocabularyPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(initialPage.page);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [jumpValue, setJumpValue] = useState(String(initialPage.page));
  const [mode, setMode] = useState<StudyMode>('read');
  const [accent, setAccent] = useState<StudyAccent>(initialAccent);
  const [learnIndex, setLearnIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const skipFirstFetch = useRef(true);
  const appliedSearch = useRef('');

  const filtered = filters.partOfSpeech !== '' || filters.startsWith !== '';

  useEffect(() => {
    const nextSearch = typed.trim();
    const timer = setTimeout(() => {
      if (appliedSearch.current === nextSearch) {
        return;
      }

      appliedSearch.current = nextSearch;
      setFilters((current) => ({ ...current, startsWith: nextSearch }));
      setPageNumber(1);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [typed]);

  useEffect(() => {
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      return;
    }

    let live = true;
    setLoading(true);
    setFailed(false);

    void apiFetch('/api/v1/library/vocabulary', {
      schema: vocabularyPageSchema,
      query: {
        pageSize,
        page: pageNumber,
        topic: lockedTopic,
        partOfSpeech: filters.partOfSpeech === '' ? undefined : filters.partOfSpeech,
        startsWith: filters.startsWith === '' ? undefined : filters.startsWith,
      },
    })
      .then((next) => {
        if (!live) {
          return;
        }

        setPage(next);
        setJumpValue(String(next.page));
        setLearnIndex(0);
        setRevealed(false);
      })
      .catch(() => {
        if (live) {
          setFailed(true);
        }
      })
      .finally(() => {
        if (live) {
          setLoading(false);
        }
      });

    return () => {
      live = false;
    };
  }, [pageNumber, filters, lockedTopic, pageSize]);

  const goTo = useCallback((nextPage: number): void => {
    setPageNumber(nextPage);
  }, []);

  const clearFilters = (): void => {
    appliedSearch.current = '';
    setTyped('');
    setFilters(NO_FILTERS);
    setPageNumber(1);
    setJumpValue('1');
  };

  const current = page.entries[learnIndex] ?? page.entries[0] ?? null;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-3 sm:p-4">
        <StudyToggles
          accent={accent}
          mode={mode}
          onAccent={setAccent}
          onMode={(next) => {
            setMode(next);
            setRevealed(false);
            setLearnIndex(0);
          }}
        />

        {lockedTopic === undefined && <TopicLinks topics={page.topics} />}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-0 flex-1 sm:min-w-[14rem]">
            <span className="sr-only">Find a word or a synonym</span>
            <Glyph
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              name="search"
            />
            <input
              className="w-full rounded-control border border-neutral-300 py-2.5 pl-10 pr-3"
              onChange={(event) => {
                setTyped(event.target.value);
              }}
              placeholder="huge, vast, incre… — headwords and synonyms both"
              type="search"
              value={typed}
            />
          </label>

          <button
            className="min-h-10 rounded-control border border-neutral-300 px-3 py-2 text-muted hover:text-primary-900"
            onClick={clearFilters}
            type="button"
          >
            Clear
            <span className="ml-1 font-bengali" lang="bn">
              মুছুন
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label">Part of speech</span>
          {page.partsOfSpeech.map((entry) => (
            <button
              aria-pressed={filters.partOfSpeech === entry.partOfSpeech}
              className={cn(
                'min-h-8 rounded-chip border px-3 py-1 capitalize',
                filters.partOfSpeech === entry.partOfSpeech
                  ? 'border-primary-900 bg-primary-50 text-primary-900'
                  : 'border-neutral-300 text-muted hover:text-primary-900',
              )}
              key={entry.partOfSpeech}
              onClick={() => {
                setFilters((currentFilter) => ({
                  ...currentFilter,
                  partOfSpeech:
                    currentFilter.partOfSpeech === entry.partOfSpeech ? '' : entry.partOfSpeech,
                }));
                setPageNumber(1);
              }}
              type="button"
            >
              {entry.partOfSpeech} <span className="num text-[11px]">{entry.entries}</span>
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="num text-muted">
        {filtered
          ? `${String(page.matchedEntries)} of ${String(page.totalEntries)} pairs match`
          : `${String(page.matchedEntries)} pairs · ${String(page.totalSynonyms)} synonyms`}
        {` · page ${String(page.page)} of ${String(page.totalPages)} · ${String(page.pageSize)} per page`}
        {loading ? ' · loading…' : ''}
      </p>

      {failed && (
        <p className="rounded-card border border-secondary-300 bg-secondary-100 p-4 text-primary-900">
          The list could not be loaded. The filters above still hold what you asked for — try
          again.
        </p>
      )}

      {page.entries.length === 0 && !loading && (
        <p className="rounded-card border border-hairline bg-neutral-50 p-6 text-muted">
          Nothing matches that. Clear a filter and the list comes back.
        </p>
      )}

      {mode === 'read' && page.entries.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {page.entries.map((entry) => (
            <EntryRow accent={accent} entry={entry} key={entry.word} />
          ))}
        </ul>
      )}

      {mode === 'learn' && current !== null && (
        <LearnCard
          accent={accent}
          entry={current}
          index={learnIndex}
          onNext={() => {
            setLearnIndex((currentIndex) => Math.min(page.entries.length - 1, currentIndex + 1));
            setRevealed(false);
          }}
          onPrevious={() => {
            setLearnIndex((currentIndex) => Math.max(0, currentIndex - 1));
            setRevealed(false);
          }}
          onReveal={() => {
            setRevealed(true);
          }}
          revealed={revealed}
          total={page.entries.length}
        />
      )}

      <NumberedPager
        jumpValue={jumpValue}
        onJump={goTo}
        onJumpValue={setJumpValue}
        onNext={() => {
          goTo(Math.min(page.totalPages, page.page + 1));
        }}
        onPrevious={() => {
          goTo(Math.max(1, page.page - 1));
        }}
        page={page.page}
        totalPages={page.totalPages}
      />
    </div>
  );
}

function TopicLinks({
  topics,
}: {
  readonly topics: VocabularyPage['topics'];
}): ReactElement {
  return (
    <div className="flex flex-wrap gap-1" role="navigation" aria-label="Topics">
      {topics.map((topic) => (
        <Link
          className="min-h-8 rounded-chip border border-neutral-300 px-3 py-1 capitalize text-muted hover:text-primary-900"
          href={`/library/vocabulary/${topic.topic}`}
          key={topic.topic}
        >
          {topic.topic} <span className="num text-[11px]">{topic.entries}</span>
        </Link>
      ))}
    </div>
  );
}

function EntryRow({
  entry,
  accent,
}: {
  readonly entry: VocabularyEntryView;
  readonly accent: StudyAccent;
}): ReactElement {
  const { supported, say } = useSpeech();
  const [best, ...rest] = entry.synonyms;
  const lang = studyLang(accent);

  return (
    <li className="flex items-baseline gap-3 rounded-card border border-hairline bg-surface px-3 py-2">
      {supported && (
        <button
          aria-label={`Hear ${entry.word}`}
          className="text-neutral-300 hover:text-primary-900"
          onClick={() => {
            say(entry.word, entry.isPhrase ? SENTENCE_RATE : DICTATION_RATE, lang);
          }}
          type="button"
        >
          <Glyph name="play" />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-primary-900">{entry.word}</span>
          <span className="num text-[11px] text-muted">{shortPos(entry.partOfSpeech)}</span>
          <span className="text-muted">→</span>
          <span className="text-mastered">{best}</span>
          {entry.inCourse && (
            <span
              className="rounded-chip bg-primary-100 px-1 text-[0.625rem] uppercase text-primary-900"
              title="Also taught in the 28-day course"
            >
              course
            </span>
          )}
        </p>
        {rest.length > 0 && (
          <p className="text-muted">
            also{' '}
            {rest.map((synonym, position) => (
              <span key={synonym}>
                {position > 0 && ', '}
                {supported ? (
                  <button
                    className="hover:text-primary-900 hover:underline"
                    onClick={() => {
                      say(synonym, synonym.includes(' ') ? SENTENCE_RATE : DICTATION_RATE, lang);
                    }}
                    title={`Hear ${synonym}`}
                    type="button"
                  >
                    {synonym}
                  </button>
                ) : (
                  synonym
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      <span className="text-[11px] capitalize text-muted">{entry.topic}</span>
    </li>
  );
}

function LearnCard({
  entry,
  accent,
  index,
  total,
  revealed,
  onReveal,
  onNext,
  onPrevious,
}: {
  readonly entry: VocabularyEntryView;
  readonly accent: StudyAccent;
  readonly index: number;
  readonly total: number;
  readonly revealed: boolean;
  readonly onReveal: () => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
}): ReactElement {
  const { supported, say } = useSpeech();
  const lang = studyLang(accent);
  const [best, ...rest] = entry.synonyms;

  return (
    <div className="flex flex-col gap-4 rounded-card border border-hairline bg-surface p-4 sm:p-6">
      <p className="num text-muted">
        {String(index + 1)} of {String(total)} on this page
        <span className="ml-2 font-bengali" lang="bn">
          এই পাতায়
        </span>
      </p>

      <div className="flex flex-col items-start gap-2">
        <p className="font-display text-3xl tracking-tight text-primary-900 sm:text-4xl">
          {entry.word}
        </p>
        <span className="num text-[11px] capitalize text-muted">{entry.partOfSpeech}</span>
        {supported && (
          <button
            aria-label={`Hear ${entry.word}`}
            className="inline-flex min-h-9 items-center gap-1 text-muted hover:text-primary-900"
            onClick={() => {
              say(entry.word, entry.isPhrase ? SENTENCE_RATE : DICTATION_RATE, lang);
            }}
            type="button"
          >
            <Glyph name="play" />
          </button>
        )}
      </div>

      {revealed ? (
        <div className="flex flex-col gap-2 border-t border-hairline pt-4">
          <p>
            <span className="text-muted">→ </span>
            <span className="text-mastered">{best}</span>
          </p>
          {rest.length > 0 && <p className="text-muted">also {rest.join(', ')}</p>}
        </div>
      ) : (
        <button
          className="min-h-12 rounded-control bg-primary-900 px-4 text-surface"
          onClick={onReveal}
          type="button"
        >
          Show meaning
          <span className="ml-2 font-bengali" lang="bn">
            অর্থ দেখুন
          </span>
        </button>
      )}

      <LearnStepper index={index} onNext={onNext} onPrevious={onPrevious} total={total} />
    </div>
  );
}
