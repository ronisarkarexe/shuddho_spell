'use client';

import Link from 'next/link';
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
import { LearnStepper } from '@/components/learning/learn-stepper';
import { NumberedPager } from '@/components/learning/numbered-pager';
import {
  StudyToggles,
  studyLang,
  type StudyAccent,
  type StudyMode,
} from '@/components/learning/study-toggles';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface IFormalInformalExplorerProps {
  readonly initialPage: FormalInformalPage;
  readonly initialProgress: FormalInformalProgress;
  readonly initialAccent?: StudyAccent;
  readonly lockedTopic?: string;
  readonly pageSize?: number;
}

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
  initialAccent = 'british',
  lockedTopic,
  pageSize = FORMAL_INFORMAL_PAGE_SIZE,
}: IFormalInformalExplorerProps): ReactElement {
  const [page, setPage] = useState<FormalInformalPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(initialPage.page);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState<FormalInformalProgress>(initialProgress);
  const [jumpValue, setJumpValue] = useState(String(initialPage.page));
  const [mode, setMode] = useState<StudyMode>('read');
  const [accent, setAccent] = useState<StudyAccent>(initialAccent);
  const [learnIndex, setLearnIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const skipFirstFetch = useRef(true);
  const appliedSearch = useRef('');

  const filtered = (lockedTopic === undefined && filters.topic !== '') || filters.startsWith !== '';
  const topicForQuery = lockedTopic ?? (filters.topic === '' ? undefined : filters.topic);

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
        pageSize,
        page: pageNumber,
        topic: topicForQuery,
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

        if (lockedTopic === undefined && filters.topic === '' && filters.startsWith === '') {
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
  }, [pageNumber, filters, saveProgress, pageSize, topicForQuery, lockedTopic]);

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

  const current = page.pairs[learnIndex] ?? page.pairs[0] ?? null;

  return (
    <div className="flex flex-col gap-5">
      {lockedTopic === undefined && (
        <ProgressBanner
          onContinue={() => {
            appliedSearch.current = '';
            setTyped('');
            setFilters(NO_FILTERS);
            goTo(progress.lastPage);
          }}
          progress={progress}
        />
      )}

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

        {lockedTopic === undefined && (
          <div className="flex flex-wrap gap-1" role="navigation" aria-label="Topics">
            {page.topics.map((topic) => (
              <Link
                className="min-h-8 rounded-chip border border-neutral-300 px-3 py-1 capitalize text-muted hover:text-primary-900"
                href={`/library/formal-informal/${topic.topic}`}
                key={topic.topic}
              >
                {topic.topic} <span className="num text-[11px]">{topic.pairs}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-0 flex-1 sm:min-w-[14rem]">
            <span className="sr-only">Find an informal or formal word</span>
            <Glyph
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              name="search"
            />
            <input
              className="w-full rounded-control border border-neutral-300 py-2.5 pl-10 pr-3"
              onChange={(event) => {
                setTyped(event.target.value);
              }}
              placeholder="ask, enquire, জিজ্ঞাসা…"
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

      {mode === 'read' && page.pairs.length > 0 && (
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

      {mode === 'read' && (
        <ul className="flex flex-col gap-2">
          {page.pairs.map((pair) => (
            <PairRow accent={accent} key={pair.cursor} pair={pair} />
          ))}
        </ul>
      )}

      {mode === 'learn' && current !== null && (
        <LearnCard
          accent={accent}
          index={learnIndex}
          onNext={() => {
            setLearnIndex((currentIndex) => Math.min(page.pairs.length - 1, currentIndex + 1));
            setRevealed(false);
          }}
          onPrevious={() => {
            setLearnIndex((currentIndex) => Math.max(0, currentIndex - 1));
            setRevealed(false);
          }}
          onReveal={() => {
            setRevealed(true);
          }}
          pair={current}
          revealed={revealed}
          total={page.pairs.length}
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

function PairRow({
  pair,
  accent,
}: {
  readonly pair: FormalInformalPairView;
  readonly accent: StudyAccent;
}): ReactElement {
  const { supported, say } = useSpeech();
  const lang = studyLang(accent);

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
          lang={lang}
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
          lang={lang}
          say={supported ? say : null}
          tone="formal"
          word={pair.formal}
        />
        <span className="text-[11px] capitalize text-muted">{pair.topic}</span>
      </div>
    </li>
  );
}

function LearnCard({
  pair,
  accent,
  index,
  total,
  revealed,
  onReveal,
  onNext,
  onPrevious,
}: {
  readonly pair: FormalInformalPairView;
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

  return (
    <div className="flex flex-col gap-4 rounded-card border border-hairline bg-surface p-4 sm:p-6">
      <p className="num text-muted">
        {String(index + 1)} of {String(total)} on this page
        <span className="ml-2 font-bengali" lang="bn">
          এই পাতায়
        </span>
      </p>

      <div className="flex flex-col items-start gap-2">
        <p className="label">
          Informal <span className="font-bengali normal-case tracking-normal">অনানুষ্ঠানিক</span>
        </p>
        <p className="font-display text-3xl tracking-tight text-primary-900 sm:text-4xl">
          {pair.informal}
        </p>
        {supported && (
          <button
            aria-label={`Hear ${pair.informal}`}
            className="inline-flex min-h-9 items-center text-muted hover:text-primary-900"
            onClick={() => {
              say(
                pair.informal,
                pair.isInformalPhrase ? SENTENCE_RATE : DICTATION_RATE,
                lang,
              );
            }}
            type="button"
          >
            <Glyph name="play" />
          </button>
        )}
      </div>

      {revealed ? (
        <div className="flex flex-col gap-2 border-t border-hairline pt-4">
          <p className="label">
            Formal <span className="font-bengali normal-case tracking-normal">আনুষ্ঠানিক</span>
          </p>
          <p className="font-display text-2xl tracking-tight text-mastered">{pair.formal}</p>
          <p className="num text-[11px] text-muted">/{pair.formalIpa}/</p>
          <p className="font-bengali text-primary-900" lang="bn">
            {pair.formalBn}
          </p>
          <p className="font-bengali text-muted" lang="bn">
            {pair.informalBn}
          </p>
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

function Side({
  word,
  ipa,
  bangla,
  isPhrase,
  label,
  labelBn,
  say,
  lang,
  tone = 'informal',
}: {
  readonly word: string;
  readonly ipa: string;
  readonly bangla: string;
  readonly isPhrase: boolean;
  readonly label: string;
  readonly labelBn: string;
  readonly say: ((text: string, rate: number, lang: string) => void) | null;
  readonly lang: string;
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
              say(word, isPhrase ? SENTENCE_RATE : DICTATION_RATE, lang);
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
