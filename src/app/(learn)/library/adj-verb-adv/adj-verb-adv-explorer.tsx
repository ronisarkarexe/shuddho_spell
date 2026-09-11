'use client';

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import {
  ADJ_VERB_ADV_PAGE_SIZE,
  adjVerbAdvPageSchema,
  type AdjVerbAdvAccent,
  type AdjVerbAdvEntryView,
  type AdjVerbAdvPage,
} from '@/components/learning/adj-verb-adv-contracts';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface IAdjVerbAdvExplorerProps {
  readonly initialPage: AdjVerbAdvPage;
  readonly initialAccent: AdjVerbAdvAccent;
}

interface IFilters {
  readonly letter: string;
  readonly partOfSpeech: string;
  readonly startsWith: string;
}

const NO_FILTERS: IFilters = { letter: '', partOfSpeech: '', startsWith: '' };

const ACCENT_LANG: Readonly<Record<AdjVerbAdvAccent, string>> = {
  british: 'en-GB',
  american: 'en-US',
};

const POS_LABEL_BN: Readonly<Record<string, string>> = {
  adjective: 'বিশেষণ',
  verb: 'ক্রিয়া',
  adverb: 'ক্রিয়াবিশেষণ',
};

/**
 * Three thousand study entries, twenty-five a page. Search, letter and part of
 * speech shrink the book; the pager jumps across the rest.
 */
export function AdjVerbAdvExplorer({
  initialPage,
  initialAccent,
}: IAdjVerbAdvExplorerProps): ReactElement {
  const [page, setPage] = useState<AdjVerbAdvPage>(initialPage);
  const [pageNumber, setPageNumber] = useState(initialPage.page);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [jumpValue, setJumpValue] = useState(String(initialPage.page));
  const [accent, setAccent] = useState<AdjVerbAdvAccent>(initialAccent);
  const skipFirstFetch = useRef(true);
  const appliedSearch = useRef('');

  const filtered =
    filters.letter !== '' || filters.partOfSpeech !== '' || filters.startsWith !== '';

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

    void apiFetch('/api/v1/library/adj-verb-adv', {
      schema: adjVerbAdvPageSchema,
      query: {
        pageSize: ADJ_VERB_ADV_PAGE_SIZE,
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
  }, [pageNumber, filters]);

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
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <AccentToggle accent={accent} onChange={setAccent} />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Part of speech">
          {page.partsOfSpeech.map((entry) => (
            <button
              aria-pressed={filters.partOfSpeech === entry.partOfSpeech}
              className={cn(
                'min-h-10 rounded-control border px-3 py-1.5 capitalize',
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
              {entry.partOfSpeech}
              <span className="ml-1 font-bengali text-[11px]" lang="bn">
                {POS_LABEL_BN[entry.partOfSpeech] ?? ''}
              </span>{' '}
              <span className="num text-[11px]">{entry.words}</span>
            </button>
          ))}
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
              placeholder="big, খুশি, quickly…"
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
      </div>

      <p aria-live="polite" className="num text-muted">
        {filtered
          ? `${String(page.matchedEntries)} of ${String(page.totalEntries)} match`
          : `${String(page.totalEntries)} entries`}
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

      {page.entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {page.entries.map((entry) => (
            <WordCard accent={accent} entry={entry} key={entry.cursor} />
          ))}
        </ul>
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

function AccentToggle({
  accent,
  onChange,
}: {
  readonly accent: AdjVerbAdvAccent;
  readonly onChange: (accent: AdjVerbAdvAccent) => void;
}): ReactElement {
  return (
    <div
      aria-label="Accent"
      className="grid grid-cols-2 gap-1 rounded-control border border-neutral-300 p-1 sm:inline-grid sm:max-w-xs sm:flex-1"
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
  readonly letters: AdjVerbAdvPage['letters'];
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
            max={totalPages}
            min={1}
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
  readonly entry: AdjVerbAdvEntryView;
  readonly accent: AdjVerbAdvAccent;
}): ReactElement {
  return (
    <li className="rounded-card border border-hairline bg-surface px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="num text-muted">{entry.bookSerial}</span>
        <SpokenWord accent={accent} word={entry.word} />
        <span className="num text-[11px] capitalize text-muted">{entry.partOfSpeech}</span>
        <HearButtons accent={accent} entry={entry} />
      </div>
      <p className="mt-1 font-bengali text-primary-900" lang="bn">
        {entry.bangla}
      </p>
      <p className="mt-1 text-muted">{entry.exampleEn}</p>
    </li>
  );
}

function SpokenWord({
  word,
  accent,
}: {
  readonly word: string;
  readonly accent: AdjVerbAdvAccent;
}): ReactElement {
  const { supported, say } = useSpeech();
  const lang = ACCENT_LANG[accent];

  if (!supported) {
    return <span className="font-medium text-primary-900">{word}</span>;
  }

  return (
    <button
      aria-label={`Hear ${word}`}
      className="font-medium text-primary-900 hover:underline"
      onClick={() => {
        say(word, DICTATION_RATE, lang);
      }}
      type="button"
    >
      {word}
    </button>
  );
}

function HearButtons({
  entry,
  accent,
}: {
  readonly entry: AdjVerbAdvEntryView;
  readonly accent: AdjVerbAdvAccent;
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
        aria-label="Hear the example sentence"
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
