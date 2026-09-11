'use client';

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import {
  SAIFURS_PAGE_SIZE,
  saifursPageSchema,
  saifursProgressSchema,
  type SaifursAccent,
  type SaifursEntryView,
  type SaifursMode,
  type SaifursPage,
  type SaifursProgress,
} from '@/components/learning/saifurs-contracts';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface ISaifursExplorerProps {
  readonly initialPage: SaifursPage;
  readonly initialProgress: SaifursProgress;
  readonly initialAccent: SaifursAccent;
}

interface IFilters {
  readonly letter: string;
  readonly partOfSpeech: string;
  readonly startsWith: string;
}

const NO_FILTERS: IFilters = { letter: '', partOfSpeech: '', startsWith: '' };

const ACCENT_LANG: Readonly<Record<SaifursAccent, string>> = {
  british: 'en-GB',
  american: 'en-US',
};

/**
 * Saifur's vocabulary: read the book, or learn the page, twenty-five at a time.
 *
 * Progress is written to the database, never to localStorage: the place they
 * stopped has to follow them across devices, and the serial is computed on
 * the server from the page they opened.
 */
export function SaifursExplorer({
  initialPage,
  initialProgress,
  initialAccent,
}: ISaifursExplorerProps): ReactElement {
  const [page, setPage] = useState<SaifursPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(initialPage.page);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState<SaifursProgress>(initialProgress);
  const [jumpValue, setJumpValue] = useState(String(initialPage.page));
  const [mode, setMode] = useState<SaifursMode>('read');
  const [accent, setAccent] = useState<SaifursAccent>(initialAccent);
  const [learnIndex, setLearnIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const skipFirstFetch = useRef(true);
  const appliedSearch = useRef('');

  const filtered = filters.letter !== '' || filters.partOfSpeech !== '' || filters.startsWith !== '';

  const saveProgress = useCallback((pageToSave: number): void => {
    void apiFetch('/api/v1/library/saifurs/progress', {
      schema: saifursProgressSchema,
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

    void apiFetch('/api/v1/library/saifurs', {
      schema: saifursPageSchema,
      query: {
        pageSize: SAIFURS_PAGE_SIZE,
        page: pageNumber,
        letter: filters.letter === '' ? undefined : filters.letter,
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

        if (filters.letter === '' && filters.partOfSpeech === '' && filters.startsWith === '') {
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

  const current = page.entries[learnIndex] ?? page.entries[0] ?? null;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <ProgressBanner
        onContinue={() => {
          appliedSearch.current = '';
          setTyped('');
          setFilters(NO_FILTERS);
          goTo(progress.lastPage);
        }}
        progress={progress}
      />

      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <ModeToggle
            mode={mode}
            onChange={(next) => {
              setMode(next);
              setRevealed(false);
              setLearnIndex(0);
            }}
          />
          <AccentToggle accent={accent} onChange={setAccent} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-0 flex-1 sm:min-w-[14rem]">
            <span className="sr-only">Find a word or a Bangla meaning</span>
            <Glyph
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              name="search"
            />
            <input
              className="w-full rounded-control border border-neutral-300 py-2.5 pl-10 pr-3"
              onChange={(event) => {
                setTyped(event.target.value);
              }}
              placeholder="abandon, পরিত্যাগ…"
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

        <LetterStrip
          letters={page.letters}
          selected={filters.letter}
          onSelect={(letter) => {
            setFilters((current) => ({
              ...current,
              letter: current.letter === letter ? '' : letter,
            }));
            setPageNumber(1);
          }}
        />

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
                setFilters((current) => ({
                  ...current,
                  partOfSpeech:
                    current.partOfSpeech === entry.partOfSpeech ? '' : entry.partOfSpeech,
                }));
                setPageNumber(1);
              }}
              type="button"
            >
              {entry.partOfSpeech} <span className="num text-[11px]">{entry.words}</span>
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="num text-muted">
        {filtered
          ? `${String(page.matchedEntries)} of ${String(page.totalEntries)} words match`
          : `${String(page.totalEntries)} words`}
        {` · page ${String(page.page)} of ${String(page.totalPages)} · ${String(page.pageSize)} per page`}
        {loading ? ' · loading…' : ''}
      </p>

      {failed && (
        <p className="rounded-card border border-secondary-300 bg-secondary-100 p-4 text-primary-900">
          The list could not be loaded. Try the page again.
        </p>
      )}

      {page.entries.length === 0 && !loading && (
        <p className="rounded-card border border-hairline bg-neutral-50 p-6 text-muted">
          Nothing matches that. Clear a filter and the list comes back.
        </p>
      )}

      {mode === 'read' && page.entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {page.entries.map((entry) => (
            <WordCard accent={accent} entry={entry} key={entry.cursor} />
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

function ModeToggle({
  mode,
  onChange,
}: {
  readonly mode: SaifursMode;
  readonly onChange: (mode: SaifursMode) => void;
}): ReactElement {
  return (
    <div
      aria-label="Read or learn"
      className="grid grid-cols-2 gap-1 rounded-control border border-neutral-300 p-1 sm:inline-grid"
      role="group"
    >
      <ToggleButton
        active={mode === 'read'}
        label="Read"
        labelBn="পড়ুন"
        onClick={() => {
          onChange('read');
        }}
      />
      <ToggleButton
        active={mode === 'learn'}
        label="Learn"
        labelBn="শিখুন"
        onClick={() => {
          onChange('learn');
        }}
      />
    </div>
  );
}

function AccentToggle({
  accent,
  onChange,
}: {
  readonly accent: SaifursAccent;
  readonly onChange: (accent: SaifursAccent) => void;
}): ReactElement {
  return (
    <div
      aria-label="Accent"
      className="grid grid-cols-2 gap-1 rounded-control border border-neutral-300 p-1 sm:inline-grid sm:flex-1 sm:max-w-xs"
      role="group"
    >
      <ToggleButton
        active={accent === 'british'}
        label="British"
        labelBn="ব্রিটিশ"
        onClick={() => {
          onChange('british');
        }}
      />
      <ToggleButton
        active={accent === 'american'}
        label="American"
        labelBn="আমেরিকান"
        onClick={() => {
          onChange('american');
        }}
      />
    </div>
  );
}

function ToggleButton({
  active,
  label,
  labelBn,
  onClick,
}: {
  readonly active: boolean;
  readonly label: string;
  readonly labelBn: string;
  readonly onClick: () => void;
}): ReactElement {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'min-h-10 rounded-control px-3 py-1.5',
        active ? 'bg-primary-900 text-surface' : 'text-muted hover:text-primary-900',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
      <span className="ml-1 font-bengali text-[11px]" lang="bn">
        {labelBn}
      </span>
    </button>
  );
}

function LetterStrip({
  letters,
  selected,
  onSelect,
}: {
  readonly letters: SaifursPage['letters'];
  readonly selected: string;
  readonly onSelect: (letter: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Letter">
      {letters.map((entry) => (
        <button
          aria-pressed={selected === entry.letter}
          className={cn(
            'min-h-9 min-w-9 rounded-control border px-2 text-sm',
            selected === entry.letter
              ? 'border-primary-900 bg-primary-50 text-primary-900'
              : 'border-neutral-300 text-muted hover:text-primary-900',
          )}
          key={entry.letter}
          onClick={() => {
            onSelect(entry.letter);
          }}
          title={`${entry.letter} · ${String(entry.words)}`}
          type="button"
        >
          {entry.letter}
        </button>
      ))}
    </div>
  );
}

function ProgressBanner({
  progress,
  onContinue,
}: {
  readonly progress: SaifursProgress;
  readonly onContinue: () => void;
}): ReactElement {
  if (progress.wordsRead === 0) {
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
    <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div>
        <p className="text-primary-900">
          You have read <span className="num">{progress.wordsRead}</span> of{' '}
          <span className="num">{progress.totalEntries}</span> words. Last page{' '}
          <span className="num">{progress.lastPage}</span>, up to word{' '}
          <span className="num">{progress.lastSerial}</span>.
        </p>
        <p className="font-bengali text-muted" lang="bn">
          {progress.wordsRead}টি পড়া হয়েছে। শেষ পাতা {progress.lastPage}। সেই পাতায় ফিরে যেতে
          পারেন।
        </p>
      </div>
      <button
        className="h-10 shrink-0 rounded-control bg-primary-900 px-3 text-surface"
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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
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
        className="flex items-center justify-center gap-2"
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
            className="num h-10 w-16 rounded-control border border-neutral-300 px-2 text-center"
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
        <button
          className="h-10 rounded-control border border-neutral-300 px-3 text-primary-900"
          type="submit"
        >
          Go
        </button>
      </form>

      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
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

function WordCard({
  entry,
  accent,
}: {
  readonly entry: SaifursEntryView;
  readonly accent: SaifursAccent;
}): ReactElement {
  return (
    <li className="rounded-card border border-hairline bg-surface px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="num text-muted">{entry.serial}</span>
        <span className="font-medium text-primary-900">{entry.word}</span>
        <span className="num text-[11px] capitalize text-muted">{entry.partOfSpeech}</span>
        <HearButtons accent={accent} entry={entry} />
      </div>
      <IpaLine accent={accent} ipaBr={entry.ipaBr} ipaUs={entry.ipaUs} />
      <p className="mt-1 font-bengali text-primary-900" lang="bn">
        {entry.bangla}
      </p>
      <MeaningBlock entry={entry} />
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
  readonly entry: SaifursEntryView;
  readonly accent: SaifursAccent;
  readonly index: number;
  readonly total: number;
  readonly revealed: boolean;
  readonly onReveal: () => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
}): ReactElement {
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
        <IpaLine accent={accent} ipaBr={entry.ipaBr} ipaUs={entry.ipaUs} />
        <HearButtons accent={accent} entry={entry} />
      </div>

      {revealed ? (
        <div className="flex flex-col gap-2 border-t border-hairline pt-4">
          <p className="font-bengali text-lg text-primary-900" lang="bn">
            {entry.bangla}
          </p>
          <MeaningBlock entry={entry} />
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

      <div className="grid grid-cols-2 gap-2">
        <button
          className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
          disabled={index <= 0}
          onClick={onPrevious}
          type="button"
        >
          Previous
          <span className="ml-1 font-bengali" lang="bn">
            আগেরটি
          </span>
        </button>
        <button
          className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
          disabled={index >= total - 1}
          onClick={onNext}
          type="button"
        >
          Next
          <span className="ml-1 font-bengali" lang="bn">
            পরেরটি
          </span>
        </button>
      </div>
    </div>
  );
}

function HearButtons({
  entry,
  accent,
}: {
  readonly entry: SaifursEntryView;
  readonly accent: SaifursAccent;
}): ReactElement | null {
  const { supported, say } = useSpeech();

  if (!supported) {
    return null;
  }

  const lang = ACCENT_LANG[accent];

  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <button
        aria-label={`Hear ${entry.word}`}
        className="inline-flex min-h-9 min-w-9 items-center justify-center text-neutral-300 hover:text-primary-900"
        onClick={() => {
          say(entry.word, DICTATION_RATE, lang);
        }}
        type="button"
      >
        <Glyph name="play" />
      </button>
      <button
        aria-label={`Hear ${entry.word} in British English`}
        className={cn(
          'rounded-chip border px-2 py-0.5 text-[11px]',
          accent === 'british'
            ? 'border-primary-900 text-primary-900'
            : 'border-neutral-300 text-muted',
        )}
        onClick={() => {
          say(entry.word, DICTATION_RATE, 'en-GB');
        }}
        type="button"
      >
        UK
      </button>
      <button
        aria-label={`Hear ${entry.word} in American English`}
        className={cn(
          'rounded-chip border px-2 py-0.5 text-[11px]',
          accent === 'american'
            ? 'border-primary-900 text-primary-900'
            : 'border-neutral-300 text-muted',
        )}
        onClick={() => {
          say(entry.word, DICTATION_RATE, 'en-US');
        }}
        type="button"
      >
        US
      </button>
      <button
        aria-label={`Hear the example sentence`}
        className="rounded-chip border border-neutral-300 px-2 py-0.5 text-[11px] text-muted hover:text-primary-900"
        onClick={() => {
          say(entry.exampleEn, SENTENCE_RATE, lang);
        }}
        type="button"
      >
        Sentence
      </button>
    </span>
  );
}

function IpaLine({
  ipaBr,
  ipaUs,
  accent,
}: {
  readonly ipaBr: string;
  readonly ipaUs: string;
  readonly accent: SaifursAccent;
}): ReactElement {
  const same = ipaBr === ipaUs;

  if (same) {
    return <p className="num text-[11px] text-muted">/{ipaBr}/</p>;
  }

  return (
    <p className="flex flex-wrap gap-x-3 text-[11px] text-muted">
      <span className={accent === 'british' ? 'text-primary-900' : ''}>
        Br <span className="num">/{ipaBr}/</span>
      </span>
      <span className={accent === 'american' ? 'text-primary-900' : ''}>
        US <span className="num">/{ipaUs}/</span>
      </span>
    </p>
  );
}

function MeaningBlock({ entry }: { readonly entry: SaifursEntryView }): ReactElement {
  return (
    <div className="mt-2 flex flex-col gap-1 text-muted">
      <p>
        <span className="text-[11px] uppercase tracking-wider">Syn</span>{' '}
        {entry.synonyms.join(', ')}
      </p>
      {entry.antonyms.length > 0 && (
        <p>
          <span className="text-[11px] uppercase tracking-wider">Ant</span>{' '}
          {entry.antonyms.join(', ')}
        </p>
      )}
      <p className="text-primary-900">{entry.exampleEn}</p>
      <p className="font-bengali" lang="bn">
        {entry.exampleBn}
      </p>
    </div>
  );
}
