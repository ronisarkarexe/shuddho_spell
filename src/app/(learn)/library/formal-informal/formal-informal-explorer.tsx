'use client';

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import {
  FORMAL_INFORMAL_PAGE_SIZE,
  formalInformalPageSchema,
  formalInformalProgressSchema,
  type FormalInformalPage,
  type FormalInformalPairView,
  type FormalInformalProgress,
} from '@/components/learning/formal-informal-contracts';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface IFormalInformalExplorerProps {
  readonly initialPage: FormalInformalPage;
  readonly initialProgress: FormalInformalProgress;
}

const LANG = 'en-GB';

interface IFilters {
  readonly topic: string;
  readonly startsWith: string;
}

const NO_FILTERS: IFilters = { topic: '', startsWith: '' };

/**
 * Informal → formal reference with serials, page numbers, and a bookmark.
 *
 * Progress is written to the database, never to localStorage: the place they
 * stopped has to follow them across devices, and the serial is computed on
 * the server from the page they opened.
 */
export function FormalInformalExplorer({
  initialPage,
  initialProgress,
}: IFormalInformalExplorerProps): ReactElement {
  const [page, setPage] = useState<FormalInformalPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(initialPage.page);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState<FormalInformalProgress>(initialProgress);
  const [jumpValue, setJumpValue] = useState(String(initialPage.page));
  const skipFirstFetch = useRef(true);
  const appliedSearch = useRef('');

  const filtered = filters.topic !== '' || filters.startsWith !== '';

  const saveProgress = useCallback((pageToSave: number): void => {
    void apiFetch('/api/v1/library/formal-informal/progress', {
      schema: formalInformalProgressSchema,
      method: 'PUT',
      body: { page: pageToSave },
    })
      .then((next) => {
        setProgress(next);
      })
      .catch(() => {
        /* Bookmark write is best-effort; a failed save must not blank the list. */
      });
  }, []);

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

    void apiFetch('/api/v1/library/formal-informal', {
      schema: formalInformalPageSchema,
      query: {
        pageSize: FORMAL_INFORMAL_PAGE_SIZE,
        page: pageNumber,
        topic: filters.topic === '' ? undefined : filters.topic,
        startsWith: filters.startsWith === '' ? undefined : filters.startsWith,
      },
    })
      .then((next) => {
        if (!live) {
          return;
        }

        setPage(next);
        setJumpValue(String(next.page));

        if (filters.topic === '' && filters.startsWith === '') {
          saveProgress(next.page);
        }
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
  }, [pageNumber, filters, saveProgress]);

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

  return (
    <div className="flex flex-col gap-5">
      <ProgressBanner
        onContinue={() => {
          appliedSearch.current = '';
          setTyped('');
          setFilters(NO_FILTERS);
          goTo(progress.lastPage);
        }}
        progress={progress}
      />

      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">Find an informal or formal word</span>
            <Glyph
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              name="search"
            />
            <input
              className="w-full rounded-control border border-neutral-300 py-2 pl-10 pr-3"
              onChange={(event) => {
                setTyped(event.target.value);
              }}
              placeholder="ask, enquire, জিজ্ঞাসা…"
              type="search"
              value={typed}
            />
          </label>

          <select
            aria-label="Topic"
            className="rounded-control border border-neutral-300 px-3 py-2"
            onChange={(event) => {
              setFilters((current) => ({ ...current, topic: event.target.value }));
              setPageNumber(1);
            }}
            value={filters.topic}
          >
            <option value="">Every topic</option>
            {page.topics.map((topic) => (
              <option key={topic.topic} value={topic.topic}>
                {topic.topic} ({topic.pairs})
              </option>
            ))}
          </select>

          <button
            className="rounded-control border border-neutral-300 px-3 py-2 text-muted hover:text-primary-900"
            onClick={clearFilters}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <p aria-live="polite" className="num text-muted">
        {filtered
          ? `${String(page.matchedPairs)} of ${String(page.totalPairs)} pairs match`
          : `${String(page.totalPairs)} pairs`}
        {` · page ${String(page.page)} of ${String(page.totalPages)}`}
        {loading ? ' · loading…' : ''}
      </p>

      {failed && (
        <p className="rounded-card border border-secondary-300 bg-secondary-100 p-4 text-primary-900">
          The list could not be loaded. Try the page again.
        </p>
      )}

      {page.pairs.length === 0 && !loading && (
        <p className="rounded-card border border-hairline bg-neutral-50 p-6 text-muted">
          Nothing matches that. Clear a filter and the list comes back.
        </p>
      )}

      {page.pairs.length > 0 && (
        <div className="hidden grid-cols-[3rem_1fr_auto_1fr_5rem] gap-3 px-3 text-[11px] uppercase tracking-wider text-muted md:grid">
          <span className="num">No.</span>
          <span>
            Informal <span className="font-bengali normal-case tracking-normal">অনানুষ্ঠানিক</span>
          </span>
          <span />
          <span>
            Formal <span className="font-bengali normal-case tracking-normal">আনুষ্ঠানিক</span>
          </span>
          <span>Topic</span>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {page.pairs.map((pair) => (
          <PairRow key={pair.cursor} pair={pair} />
        ))}
      </ul>

      <Pager
        jumpValue={jumpValue}
        onJump={(next) => {
          goTo(next);
        }}
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

function ProgressBanner({
  progress,
  onContinue,
}: {
  readonly progress: FormalInformalProgress;
  readonly onContinue: () => void;
}): ReactElement {
  if (progress.pairsRead === 0) {
    return (
      <p className="rounded-card border border-hairline bg-surface px-4 py-3 text-muted">
        You have not started this list yet.{' '}
        <span className="font-bengali" lang="bn">
          এখনও পড়া শুরু হয়নি।
        </span>
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-hairline bg-surface px-4 py-3">
      <div>
        <p className="text-primary-900">
          You have read <span className="num">{progress.pairsRead}</span> of{' '}
          <span className="num">{progress.totalPairs}</span> pairs. Last page{' '}
          <span className="num">{progress.lastPage}</span>, up to pair{' '}
          <span className="num">{progress.lastSerial}</span>.
        </p>
        <p className="font-bengali text-muted" lang="bn">
          {progress.pairsRead}টি পড়া হয়েছে। শেষ পাতা {progress.lastPage}। সেই পাতায় ফিরে
          যেতে পারেন।
        </p>
      </div>
      <button
        className="h-8 rounded-control bg-primary-900 px-3 text-surface"
        onClick={onContinue}
        type="button"
      >
        Continue from page {progress.lastPage}
      </button>
    </div>
  );
}

function Pager({
  page,
  totalPages,
  jumpValue,
  onPrevious,
  onNext,
  onJump,
  onJumpValue,
}: {
  readonly page: number;
  readonly totalPages: number;
  readonly jumpValue: string;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onJump: (page: number) => void;
  readonly onJumpValue: (value: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button
        className="rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
        disabled={page <= 1}
        onClick={onPrevious}
        type="button"
      >
        Previous page
        <span className="ml-1 font-bengali" lang="bn">
          আগের পাতা
        </span>
      </button>

      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const next = Number.parseInt(jumpValue, 10);

          if (Number.isFinite(next)) {
            onJump(Math.min(totalPages, Math.max(1, next)));
          }
        }}
      >
        <label className="flex items-center gap-2 text-muted">
          Page
          <span className="font-bengali" lang="bn">
            পাতা
          </span>
          <input
            className="num w-16 rounded-control border border-neutral-300 px-2 py-1 text-center"
            inputMode="numeric"
            min={1}
            max={totalPages}
            onChange={(event) => {
              onJumpValue(event.target.value);
            }}
            value={jumpValue}
          />
          of <span className="num">{totalPages}</span>
        </label>
        <button className="rounded-control border border-neutral-300 px-3 py-1 text-primary-900" type="submit">
          Go
        </button>
      </form>

      <button
        className="rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={onNext}
        type="button"
      >
        Next page
        <span className="ml-1 font-bengali" lang="bn">
          পরের পাতা
        </span>
      </button>
    </div>
  );
}

function PairRow({ pair }: { readonly pair: FormalInformalPairView }): ReactElement {
  const { supported, say } = useSpeech();

  return (
    <li className="rounded-card border border-hairline bg-surface px-3 py-2">
      <div className="grid grid-cols-1 items-baseline gap-2 md:grid-cols-[3rem_1fr_auto_1fr_5rem] md:gap-3">
        <span className="num text-muted">{pair.serial}</span>
        <Side
          bangla={pair.informalBn}
          ipa={pair.informalIpa}
          isPhrase={pair.isInformalPhrase}
          label="Informal"
          labelBn="অনানুষ্ঠানিক"
          say={supported ? say : null}
          word={pair.informal}
        />
        <span className="hidden text-muted md:inline">→</span>
        <Side
          bangla={pair.formalBn}
          ipa={pair.formalIpa}
          isPhrase={pair.isFormalPhrase}
          label="Formal"
          labelBn="আনুষ্ঠানিক"
          say={supported ? say : null}
          tone="formal"
          word={pair.formal}
        />
        <span className="text-[11px] capitalize text-muted">{pair.topic}</span>
      </div>
    </li>
  );
}

function Side({
  word,
  ipa,
  bangla,
  isPhrase,
  label,
  labelBn,
  say,
  tone = 'informal',
}: {
  readonly word: string;
  readonly ipa: string;
  readonly bangla: string;
  readonly isPhrase: boolean;
  readonly label: string;
  readonly labelBn: string;
  readonly say: ((text: string, rate: number, lang: string) => void) | null;
  readonly tone?: 'informal' | 'formal';
}): ReactElement {
  return (
    <div className="min-w-0">
      <p className="label md:hidden">
        {label} · <span className="font-bengali normal-case tracking-normal">{labelBn}</span>
      </p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        {say !== null && (
          <button
            aria-label={`Hear ${word}`}
            className="text-neutral-300 hover:text-primary-900"
            onClick={() => {
              say(word, isPhrase ? SENTENCE_RATE : DICTATION_RATE, LANG);
            }}
            type="button"
          >
            <Glyph name="play" />
          </button>
        )}
        <span className={cn('font-medium', tone === 'formal' ? 'text-mastered' : 'text-primary-900')}>
          {word}
        </span>
        <span className="num text-[11px] text-muted">/{ipa}/</span>
      </p>
      <p className="font-bengali text-muted" lang="bn">
        {bangla}
      </p>
    </div>
  );
}
