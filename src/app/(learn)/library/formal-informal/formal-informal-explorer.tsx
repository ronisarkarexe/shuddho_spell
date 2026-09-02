'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import {
  formalInformalPageSchema,
  type FormalInformalPage,
  type FormalInformalPairView,
} from '@/components/learning/formal-informal-contracts';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { DICTATION_RATE, SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';

export interface IFormalInformalExplorerProps {
  readonly initialPage: FormalInformalPage;
}

const PAGE_SIZE = 24;
const LANG = 'en-GB';

interface IFilters {
  readonly topic: string;
  readonly startsWith: string;
}

const NO_FILTERS: IFilters = { topic: '', startsWith: '' };

/**
 * Informal → formal reference: filter, page, and one row per pair.
 *
 * A Client Component because filtering is interaction. The first page arrives
 * from the server render already populated; every page and every filter after
 * that comes from `/api/v1/library/formal-informal`, which runs the same use
 * case the server just ran.
 *
 * **The search box matches informal, formal, and Bangla.** Half the reason to
 * open this screen is having the everyday word and wanting the letter word;
 * the other half is searching the meaning in Bangla.
 */
export function FormalInformalExplorer({
  initialPage,
}: IFormalInformalExplorerProps): ReactElement {
  const [page, setPage] = useState<FormalInformalPage>(initialPage);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilters>(NO_FILTERS);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({ ...current, startsWith: typed.trim() }));
      setCursor(null);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [typed]);

  useEffect(() => {
    if (cursor === null && filters === NO_FILTERS) {
      return;
    }

    let live = true;
    setLoading(true);
    setFailed(false);

    void apiFetch('/api/v1/library/formal-informal', {
      schema: formalInformalPageSchema,
      query: {
        pageSize: PAGE_SIZE,
        after: cursor ?? undefined,
        topic: filters.topic === '' ? undefined : filters.topic,
        startsWith: filters.startsWith === '' ? undefined : filters.startsWith,
      },
    })
      .then((next) => {
        if (live) {
          setPage(next);
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
  }, [cursor, filters]);

  const set = (patch: Partial<IFilters>): void => {
    setFilters((current) => ({ ...current, ...patch }));
    setCursor(null);
  };

  const filtered = filters !== NO_FILTERS;

  return (
    <div className="flex flex-col gap-5">
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
              set({ topic: event.target.value });
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
            onClick={() => {
              setTyped('');
              setFilters(NO_FILTERS);
              setCursor(null);
              setPage(initialPage);
            }}
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
        {loading ? ' · loading…' : ''}
      </p>

      {failed && (
        <p className="rounded-card border border-secondary-300 bg-secondary-100 p-4 text-primary-900">
          The list could not be loaded. The filters above still hold what you asked for — try
          again.
        </p>
      )}

      {page.pairs.length === 0 && !loading && (
        <p className="rounded-card border border-hairline bg-neutral-50 p-6 text-muted">
          Nothing matches that. The list holds {page.totalPairs} pairs — clear a filter and it
          comes back.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {page.pairs.map((pair) => (
          <PairRow key={pair.cursor} pair={pair} />
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <button
          className="rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
          disabled={cursor === null}
          onClick={() => {
            setCursor(null);
          }}
          type="button"
        >
          Back to the start
        </button>
        <button
          className="rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
          disabled={page.nextCursor === null}
          onClick={() => {
            setCursor(page.pairs[page.pairs.length - 1]?.cursor ?? null);
          }}
          type="button"
        >
          More pairs
        </button>
      </div>
    </div>
  );
}

function PairRow({ pair }: { readonly pair: FormalInformalPairView }): ReactElement {
  const { supported, say } = useSpeech();

  return (
    <li className="rounded-card border border-hairline bg-surface px-3 py-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Side
          bangla={pair.informalBn}
          ipa={pair.informalIpa}
          isPhrase={pair.isInformalPhrase}
          label="Informal"
          say={supported ? say : null}
          word={pair.informal}
        />
        <span className="text-muted">→</span>
        <Side
          bangla={pair.formalBn}
          ipa={pair.formalIpa}
          isPhrase={pair.isFormalPhrase}
          label="Formal"
          say={supported ? say : null}
          tone="formal"
          word={pair.formal}
        />
        <span className="ml-auto text-[11px] capitalize text-muted">{pair.topic}</span>
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
  say,
  tone = 'informal',
}: {
  readonly word: string;
  readonly ipa: string;
  readonly bangla: string;
  readonly isPhrase: boolean;
  readonly label: string;
  readonly say: ((text: string, rate: number, lang: string) => void) | null;
  readonly tone?: 'informal' | 'formal';
}): ReactElement {
  return (
    <div className="min-w-[10rem] flex-1">
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
        <span className="sr-only">{label}. </span>
        {bangla}
      </p>
    </div>
  );
}
