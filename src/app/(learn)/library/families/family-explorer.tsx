'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import { LearnStepper } from '@/components/learning/learn-stepper';
import {
  StudyToggles,
  studyLang,
  type StudyAccent,
  type StudyMode,
} from '@/components/learning/study-toggles';
import { apiFetch } from '@/lib/api/client';
import { useSpeech } from '@/lib/audio/use-speech';
import { SENTENCE_RATE } from '@/lib/audio/voices';
import { cn } from '@/lib/cn';
import {
  changeLabel,
  SKILLS,
  wordFamilyPageSchema,
  type FamilyMember,
  type Skill,
  type WordFamilyPage,
  type WordFamilyView,
} from './family-contracts';

export interface IFamilyExplorerProps {
  readonly initialPage: WordFamilyPage;
  readonly initialAccent?: StudyAccent;
  readonly lockedTopic?: string;
  readonly pageSize?: number;
}

const PAGE_SIZE = 12;

interface IFilters {
  readonly skill: Skill | '';
  readonly topic: string;
  readonly rule: string;
  readonly startsWith: string;
}

/**
 * The word-family reference: filter, page, and one card per root.
 *
 * A Client Component because filtering is interaction. The first page arrives
 * from the server render already populated — every page and every filter after
 * that comes from `/api/v1/library/families`, which runs the same use case the
 * server just ran. One implementation, two callers.
 *
 * **The page resets to the top of the list whenever a filter changes.** Keeping
 * the cursor would ask the server for "the families after `educate`" within a
 * filtered set `educate` may not be in, and the honest answer to that is the
 * first page — but the learner would read it as the filter having done nothing.
 */
export function FamilyExplorer({
  initialPage,
  initialAccent = 'british',
  lockedTopic,
  pageSize = PAGE_SIZE,
}: IFamilyExplorerProps): ReactElement {
  const idleFilters: IFilters = {
    skill: '',
    topic: lockedTopic ?? '',
    rule: '',
    startsWith: '',
  };
  const [page, setPage] = useState<WordFamilyPage>(initialPage);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilters>(idleFilters);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<StudyMode>('read');
  const [accent, setAccent] = useState<StudyAccent>(initialAccent);
  const [learnIndex, setLearnIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  /**
   * The search box is debounced, the other filters are not.
   *
   * Typing `environment` is eleven keystrokes and would be eleven requests; a
   * topic is one click. Debouncing the clicks too would put a quarter-second of
   * nothing between a press and its result, which reads as a broken button.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({ ...current, startsWith: typed.trim() }));
      setCursor(null);
    }, 250);

    return () => { clearTimeout(timer); };
  }, [typed]);

  useEffect(() => {
    // The unfiltered first page is already in state from the server render.
    const idle =
      filters.skill === '' &&
      filters.topic === (lockedTopic ?? '') &&
      filters.rule === '' &&
      filters.startsWith === '';

    if (cursor === null && idle) {
      return;
    }

    let live = true;
    setLoading(true);
    setFailed(false);

    void apiFetch('/api/v1/library/families', {
      schema: wordFamilyPageSchema,
      query: {
        pageSize,
        after: cursor ?? undefined,
        skill: filters.skill === '' ? undefined : filters.skill,
        topic: filters.topic === '' ? undefined : filters.topic,
        ruleFamily: filters.rule === '' ? undefined : filters.rule,
        startsWith: filters.startsWith === '' ? undefined : filters.startsWith,
      },
    })
      .then((next) => {
        if (live) {
          setPage(next);
          setLearnIndex(0);
          setRevealed(false);
        }
      })
      .catch(() => { if (live) { setFailed(true); } })
      .finally(() => { if (live) { setLoading(false); } });

    return () => { live = false; };
  }, [cursor, filters, lockedTopic, pageSize]);

  const set = (patch: Partial<IFilters>): void => {
    setFilters((current) => ({ ...current, ...patch }));
    setCursor(null);
  };

  const filtered =
    filters.skill !== '' ||
    filters.topic !== (lockedTopic ?? '') ||
    filters.rule !== '' ||
    filters.startsWith !== '';

  const current = page.families[learnIndex] ?? page.families[0] ?? null;

  return (
    <div className="flex flex-col gap-5">
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

      <Filters
        filters={filters}
        hideTopic={lockedTopic !== undefined}
        typed={typed}
        topics={page.topics}
        rules={page.rules}
        onTyped={setTyped}
        onSet={set}
        onClear={() => {
          setTyped('');
          setFilters({
            skill: '',
            topic: lockedTopic ?? '',
            rule: '',
            startsWith: '',
          });
          setCursor(null);
        }}
      />

      <p className="num text-sm text-muted" aria-live="polite">
        {filtered
          ? `${String(page.matchedFamilies)} families · ${String(page.matchedWords)} words match`
          : `${String(page.totalFamilies)} families · ${String(page.totalWords)} words`}
        {loading ? ' · loading…' : ''}
      </p>

      {failed ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          The families could not be loaded. The filters above still hold what you asked for — try
          again.
        </p>
      ) : null}

      {page.families.length === 0 && !loading ? (
        <p className="rounded-lg border border-hairline bg-neutral-50 p-6 text-sm text-muted">
          Nothing matches that. The corpus holds {page.totalWords} words across{' '}
          {page.totalFamilies} roots — clear a filter and it comes back.
        </p>
      ) : null}

      {mode === 'read' && (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {page.families.map((family) => (
            <li key={family.root}>
              <FamilyCard accent={accent} family={family} />
            </li>
          ))}
        </ul>
      )}

      {mode === 'learn' && current !== null && (
        <LearnFamilyCard
          accent={accent}
          family={current}
          index={learnIndex}
          onNext={() => {
            setLearnIndex((currentIndex) => Math.min(page.families.length - 1, currentIndex + 1));
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
          total={page.families.length}
        />
      )}

      <Pager
        hasPrevious={cursor !== null}
        hasNext={page.nextCursor !== null}
        onNext={() => {
          setCursor(page.families[page.families.length - 1]?.root ?? null);
        }}
        onRestart={() => { setCursor(null); }}
      />
    </div>
  );
}

interface IFiltersProps {
  readonly filters: IFilters;
  readonly typed: string;
  readonly topics: WordFamilyPage['topics'];
  readonly rules: WordFamilyPage['rules'];
  readonly hideTopic: boolean;
  readonly onTyped: (value: string) => void;
  readonly onSet: (patch: Partial<IFilters>) => void;
  readonly onClear: () => void;
}

function Filters({
  filters,
  typed,
  topics,
  rules,
  hideTopic,
  onTyped,
  onSet,
  onClear,
}: IFiltersProps): ReactElement {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[14rem]">
          <span className="sr-only">Find a word</span>
          <Glyph
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={typed}
            onChange={(event) => { onTyped(event.target.value); }}
            placeholder="Start typing a word — sustain, analys, environ…"
            className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 text-sm"
          />
        </label>

        {!hideTopic && (
          <div className="flex w-full flex-wrap gap-1" role="navigation" aria-label="Topics">
            {topics.map((topic) => (
              <Link
                className="min-h-8 rounded-chip border border-neutral-300 px-3 py-1 capitalize text-muted hover:text-primary-900"
                href={`/library/families/${topic.topic}`}
                key={topic.topic}
              >
                {topic.topic} <span className="num text-[11px]">{topic.words}</span>
              </Link>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-muted hover:text-primary-900"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">Paper</span>
        {SKILLS.map((skill) => (
          <button
            key={skill}
            type="button"
            aria-pressed={filters.skill === skill}
            onClick={() => { onSet({ skill: filters.skill === skill ? '' : skill }); }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize',
              filters.skill === skill
                ? 'border-primary-900 bg-primary-100 text-primary-900'
                : 'border-neutral-300 text-muted hover:text-primary-900',
            )}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">Spelling rule</span>
        <select
          value={filters.rule}
          onChange={(event) => { onSet({ rule: event.target.value }); }}
          className="min-w-[16rem] flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          aria-label="Spelling rule"
        >
          <option value="">Every rule, and the families that follow none</option>
          {rules.map((rule) => (
            <option key={rule.code} value={rule.code}>
              {rule.code.replaceAll('_', ' ')} — {String(rule.families)} families
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FamilyCard({
  family,
  accent,
}: {
  readonly family: WordFamilyView;
  readonly accent: StudyAccent;
}): ReactElement {
  const { supported, say } = useSpeech();
  const wordCount = family.members.length + 1;

  const grouped = useMemo(() => {
    const order = ['noun', 'verb', 'adjective', 'adverb'];

    return order
      .map((pos) => ({
        pos,
        members: family.members.filter((member) => member.partOfSpeech === pos),
      }))
      .filter((group) => group.members.length > 0);
  }, [family.members]);

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-lg tracking-tight text-primary-900">{family.root}</h3>
            {supported ? (
              <button
                type="button"
                onClick={() => { say(family.root, SENTENCE_RATE, studyLang(accent)); }}
                aria-label={`Hear ${family.root}`}
                className="text-muted hover:text-primary-900"
              >
                <Glyph name="play" />
              </button>
            ) : null}
          </div>
          <p className="font-bengali text-sm text-muted" lang="bn">
            {family.banglaMeaning}
          </p>
        </div>
        <div className="text-right">
          <p className="num text-sm text-primary-900">{wordCount} words</p>
          <p className="text-xs capitalize text-muted">{family.topic}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {family.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-hairline px-2 py-0.5 text-xs capitalize text-muted"
          >
            {skill}
          </span>
        ))}
      </div>

      {family.ruleStatement === null ? null : (
        <p className="rounded-lg bg-primary-50 p-3 text-sm text-primary-900">
          <span className="font-medium">The rule · </span>
          {family.ruleStatement}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {grouped.map((group) => (
          <div key={group.pos}>
            <p className="text-xs uppercase tracking-wide text-muted">{group.pos}</p>
            <ul className="mt-1 flex flex-col gap-1">
              {group.members.map((member) => (
              <MemberRow
                accent={accent}
                key={member.text}
                member={member}
                onSay={say}
                speakable={supported}
              />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {family.inCourseCount > 0 ? (
        <p className="num text-xs text-muted">
          {family.inCourseCount} of these are taught in the 28-day course.
        </p>
      ) : null}
    </article>
  );
}

function LearnFamilyCard({
  family,
  accent,
  index,
  total,
  revealed,
  onReveal,
  onNext,
  onPrevious,
}: {
  readonly family: WordFamilyView;
  readonly accent: StudyAccent;
  readonly index: number;
  readonly total: number;
  readonly revealed: boolean;
  readonly onReveal: () => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
}): ReactElement {
  const { supported, say } = useSpeech();

  return (
    <div className="flex flex-col gap-4 rounded-card border border-hairline bg-surface p-4 sm:p-6">
      <p className="num text-muted">
        {String(index + 1)} of {String(total)} on this page
        <span className="ml-2 font-bengali" lang="bn">
          এই পাতায়
        </span>
      </p>
      {revealed ? (
        <FamilyCard accent={accent} family={family} />
      ) : (
        <>
          <div className="flex flex-col items-start gap-2">
            <p className="font-display text-3xl tracking-tight text-primary-900 sm:text-4xl">
              {family.root}
            </p>
            {supported ? (
              <button
                aria-label={`Hear ${family.root}`}
                className="text-muted hover:text-primary-900"
                onClick={() => {
                  say(family.root, SENTENCE_RATE, studyLang(accent));
                }}
                type="button"
              >
                <Glyph name="play" />
              </button>
            ) : null}
          </div>
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
        </>
      )}
      <LearnStepper index={index} onNext={onNext} onPrevious={onPrevious} total={total} />
    </div>
  );
}

interface IMemberRowProps {
  readonly member: FamilyMember;
  readonly speakable: boolean;
  readonly accent: StudyAccent;
  readonly onSay: (text: string, rate: number, lang: string) => void;
}

/**
 * One derived word, and what it did to the root to become itself.
 *
 * The change is not decoration. `un- −e -ed` beside `uneducated` is the whole
 * reason this screen exists rather than a list: it is the same five characters
 * of information the learner will need for `unmotivated`, `undamaged` and
 * `uneducated` alike.
 */
function MemberRow({ member, speakable, onSay, accent }: IMemberRowProps): ReactElement {
  return (
    <li className="flex items-baseline justify-between gap-2 text-sm">
      <span className="flex items-baseline gap-1.5">
        <span className="text-primary-900">{member.text}</span>
        {speakable ? (
          <button
            type="button"
            onClick={() => { onSay(member.text, SENTENCE_RATE, studyLang(accent)); }}
            aria-label={`Hear ${member.text}`}
            className="text-neutral-300 hover:text-primary-900"
          >
            <Glyph name="play" />
          </button>
        ) : null}
        {member.inCourse ? (
          <span
            className="rounded bg-primary-100 px-1 text-[0.625rem] uppercase text-primary-900"
            title="Taught in the 28-day course"
          >
            course
          </span>
        ) : null}
      </span>
      <span className="flex items-baseline gap-1.5">
        {member.change.reversesMeaning ? (
          <span className="text-xs text-amber-700">opposite</span>
        ) : null}
        <span
          className={cn(
            'num text-xs',
            member.change.kind === 'irregular' ? 'text-amber-700' : 'text-muted',
          )}
        >
          {changeLabel(member.change)}
        </span>
      </span>
    </li>
  );
}

interface IPagerProps {
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
  readonly onNext: () => void;
  readonly onRestart: () => void;
}

/**
 * Next and back-to-the-start, not next and previous.
 *
 * A keyset cursor walks forward. A true "previous" would need the stack of
 * cursors already visited, and a Back button that silently returned to the
 * first page instead would be worse than not offering one.
 */
function Pager({ hasPrevious, hasNext, onNext, onRestart }: IPagerProps): ReactElement {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onRestart}
        disabled={!hasPrevious}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-muted disabled:opacity-40"
      >
        Back to the start
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-primary-900 disabled:opacity-40"
      >
        More families
      </button>
    </div>
  );
}
