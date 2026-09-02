'use client';

import { useCallback, useMemo, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import { cn } from '@/lib/cn';

/**
 * The tense decoder: a sentence, four tense names, and the formula that
 * named the right one.
 *
 * **The same component on the dashboard and the roadmap.** Splitting it would
 * give two screens two different bugs.
 *
 * **It marks in the browser, and nothing is stored.** The answer arrives with
 * the question. No review item, no streak, no round trip — this is a closed
 * chart of tenses, not a corpus, so a fresh round is a shuffle of the same
 * bank rather than a fetch.
 */

export interface IVerbRoadmapDrillProps {
  readonly tone: 'dark' | 'light';
  readonly roundSize: number;
}

interface ITenseQuestion {
  readonly id: string;
  readonly sentence: string;
  readonly options: readonly string[];
  readonly answerIndex: number;
  readonly formula: string;
  readonly why: string;
  readonly bangla: string;
}

const BANK: readonly ITenseQuestion[] = [
  {
    id: 'present-simple',
    sentence: 'She walks to school every day.',
    options: ['Present simple', 'Present continuous', 'Present perfect', 'Past simple'],
    answerIndex: 0,
    formula: 'V1 / V5',
    why: 'every day names a habit. Habits take the present simple: V5 after he / she / it, V1 after I / you / we / they.',
    bangla: 'every day মানে অভ্যাস। অভ্যাসে present simple — she-এর পরে V5।',
  },
  {
    id: 'present-continuous',
    sentence: 'She is walking to school now.',
    options: ['Present simple', 'Present continuous', 'Present perfect', 'Past continuous'],
    answerIndex: 1,
    formula: 'am / is / are + V4',
    why: 'now names something happening at this moment. is + walking is the continuous: be + V-ing.',
    bangla: 'now মানে এখন ঘটছে। is + V4 = present continuous।',
  },
  {
    id: 'present-perfect',
    sentence: 'She has walked to school already.',
    options: ['Past simple', 'Present perfect', 'Present perfect continuous', 'Past perfect'],
    answerIndex: 1,
    formula: 'have / has + V3',
    why: 'already ties a finished action to now. has + walked is the perfect: have / has + past participle.',
    bangla: 'already মানে কাজ শেষ, কিন্তু এখনো প্রাসঙ্গিক। has + V3 = present perfect।',
  },
  {
    id: 'present-perfect-continuous',
    sentence: 'She has been walking for an hour.',
    options: [
      'Present continuous',
      'Present perfect',
      'Present perfect continuous',
      'Past perfect continuous',
    ],
    answerIndex: 2,
    formula: 'have / has been + V4',
    why: 'for an hour names a duration that started in the past and has not stopped. has been + walking.',
    bangla: 'for an hour মানে শুরু হয়ে এখনো চলছে। has been + V4।',
  },
  {
    id: 'past-simple',
    sentence: 'She walked to school yesterday.',
    options: ['Past simple', 'Past continuous', 'Present perfect', 'Past perfect'],
    answerIndex: 0,
    formula: 'V2',
    why: 'yesterday names a finished time. A finished past takes V2, and does not take have.',
    bangla: 'yesterday মানে শেষ হয়ে যাওয়া অতীত। V2 — have লাগে না।',
  },
  {
    id: 'past-continuous',
    sentence: 'She was walking when it started to rain.',
    options: ['Past simple', 'Past continuous', 'Past perfect', 'Present continuous'],
    answerIndex: 1,
    formula: 'was / were + V4',
    why: 'was walking is the background; started is the interruption. The longer action takes was / were + V-ing.',
    bangla: 'লম্বা কাজটা চলছিল, ছোট কাজটা মাঝে এসেছে। was + V4।',
  },
  {
    id: 'past-perfect',
    sentence: 'She had walked home before sunset.',
    options: ['Past simple', 'Past perfect', 'Present perfect', 'Past perfect continuous'],
    answerIndex: 1,
    formula: 'had + V3',
    why: 'before sunset puts one past action in front of another. The earlier one takes had + V3.',
    bangla: 'অতীতের আরেকটা মুহূর্তের আগে শেষ। had + V3 = past perfect।',
  },
  {
    id: 'past-perfect-continuous',
    sentence: 'She had been walking for an hour when the bus arrived.',
    options: [
      'Past continuous',
      'Past perfect',
      'Past perfect continuous',
      'Present perfect continuous',
    ],
    answerIndex: 2,
    formula: 'had been + V4',
    why: 'A duration in the past, already running when another past event arrived. had been + walking.',
    bangla: 'অতীতে একটা সময় ধরে চলছিল, তারপর অন্য ঘটনা। had been + V4।',
  },
  {
    id: 'future-simple',
    sentence: 'She will walk to school tomorrow.',
    options: ['Future simple', 'Future continuous', 'Present simple', 'Future perfect'],
    answerIndex: 0,
    formula: 'will + V1',
    why: 'tomorrow names a future fact or decision. will takes the base form, never V2 or V-ing.',
    bangla: 'tomorrow মানে ভবিষ্যৎ সিদ্ধান্ত বা তথ্য। will + V1।',
  },
  {
    id: 'future-continuous',
    sentence: 'She will be walking to school at eight.',
    options: ['Future simple', 'Future continuous', 'Present continuous', 'Future perfect'],
    answerIndex: 1,
    formula: 'will be + V4',
    why: 'at eight names a point in the future when the action will already be in progress.',
    bangla: 'ভবিষ্যতের একটা নির্দিষ্ট সময়ে কাজ চলবে। will be + V4।',
  },
  {
    id: 'future-perfect',
    sentence: 'She will have walked five miles by noon.',
    options: ['Future simple', 'Future perfect', 'Present perfect', 'Future perfect continuous'],
    answerIndex: 1,
    formula: 'will have + V3',
    why: 'by noon names a deadline. The action will already be finished at that future point: will have + V3.',
    bangla: 'by noon মানে সেই সময়ের আগে শেষ হয়ে যাবে। will have + V3।',
  },
  {
    id: 'future-perfect-continuous',
    sentence: 'By June she will have been walking to school for a year.',
    options: [
      'Future continuous',
      'Future perfect',
      'Future perfect continuous',
      'Present perfect continuous',
    ],
    answerIndex: 2,
    formula: 'will have been + V4',
    why: 'A duration that will already have been running at a future point. will have been + walking.',
    bangla: 'ভবিষ্যতের একটা সময় পর্যন্ত কতক্ষণ ধরে চলবে। will have been + V4।',
  },
  {
    id: 'passive',
    sentence: 'The letter was written in English.',
    options: ['Past simple active', 'Past simple passive', 'Present perfect', 'Past continuous'],
    answerIndex: 1,
    formula: 'was / were + V3',
    why: 'The subject receives the action. The passive is be + V3: was written, not was wrote.',
    bangla: 'কর্তা কাজটা করেনি, কাজটা তার উপর হয়েছে। be + V3 = passive।',
  },
  {
    id: 'modal',
    sentence: 'She can walk to school.',
    options: ['Present simple', 'Modal + V1', 'Present continuous', 'Future simple'],
    answerIndex: 1,
    formula: 'modal + V1',
    why: 'can is a modal. Every modal takes the base form: can walk, not can walks or can walking.',
    bangla: 'can, should, must-এর পরে সবসময় V1।',
  },
  {
    id: 'conditional-1',
    sentence: 'If you study, you will pass.',
    options: ['Zero conditional', 'First conditional', 'Second conditional', 'Third conditional'],
    answerIndex: 1,
    formula: 'if + present, will + V1',
    why: 'A real future. The if-clause stays in the present simple; the result takes will + V1. If you will study is the trap.',
    bangla: 'বাস্তব ভবিষ্যৎ। if-এর পরে present, ফলাফলে will + V1।',
  },
  {
    id: 'conditional-2',
    sentence: 'If I had money, I would travel.',
    options: ['First conditional', 'Second conditional', 'Third conditional', 'Past simple'],
    answerIndex: 1,
    formula: 'if + V2, would + V1',
    why: 'Unreal present. had here is V2, not the past perfect. The result takes would + V1.',
    bangla: 'এখনকার অবাস্তব কল্পনা। if + V2, would + V1।',
  },
];

function pickRound(bank: readonly ITenseQuestion[], size: number): readonly ITenseQuestion[] {
  const copy: ITenseQuestion[] = [...bank];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapAt = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    const swapped = copy[swapAt];

    if (current === undefined || swapped === undefined) {
      continue;
    }

    copy[index] = swapped;
    copy[swapAt] = current;
  }

  return copy.slice(0, Math.min(size, copy.length));
}

function optionTone(
  dark: boolean,
  answered: boolean,
  isAnswer: boolean,
  isChosen: boolean,
): string {
  if (!answered) {
    return dark
      ? 'border-primary-500 bg-primary-900 text-surface hover:border-secondary-500'
      : 'border-hairline text-primary-900 hover:border-primary-900 hover:bg-primary-50';
  }

  if (isAnswer) {
    return 'border-mastered bg-mastered/10 text-mastered';
  }

  if (isChosen) {
    return 'border-tertiary-700 bg-tertiary-700/10 text-tertiary-700';
  }

  return dark
    ? 'border-primary-500 text-primary-100 opacity-60'
    : 'border-hairline text-muted opacity-60';
}

/**
 * Four (or six) sentences. The job is not to translate them — it is to name
 * the tense the formula in the sentence has already opened.
 */
export function VerbRoadmapDrill({ tone, roundSize }: IVerbRoadmapDrillProps): ReactElement {
  const [questions, setQuestions] = useState<readonly ITenseQuestion[]>(() =>
    pickRound(BANK, roundSize),
  );
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const dark = tone === 'dark';
  const question = questions[index];
  const finished = question === undefined;

  const answer = useCallback(
    (option: number) => {
      if (chosen !== null || question === undefined) {
        return;
      }

      setChosen(option);

      if (option === question.answerIndex) {
        setCorrect((count) => count + 1);
      }
    },
    [chosen, question],
  );

  const next = useCallback(() => {
    setChosen(null);
    setIndex((current) => current + 1);
  }, []);

  const again = useCallback(() => {
    setQuestions(pickRound(BANK, roundSize));
    setIndex(0);
    setChosen(null);
    setCorrect(0);
  }, [roundSize]);

  return (
    <div className={cn('flex flex-col gap-4', dark ? 'text-surface' : 'text-primary-900')}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={cn('label', dark && 'text-primary-100')}>
          {finished ? 'Round finished' : 'Which tense is this?'}
        </p>
        <p className={cn('num text-[11px]', dark ? 'text-primary-100' : 'text-muted')}>
          {finished
            ? `${String(correct)} / ${String(questions.length)}`
            : `${String(index + 1)} / ${String(questions.length)}`}
        </p>
      </div>

      {finished ? (
        <Finished correct={correct} dark={dark} total={questions.length} onAgain={again} />
      ) : (
        <Question
          chosen={chosen}
          dark={dark}
          isLast={index === questions.length - 1}
          question={question}
          onAnswer={answer}
          onNext={next}
        />
      )}
    </div>
  );
}

interface IQuestionProps {
  readonly question: ITenseQuestion;
  readonly chosen: number | null;
  readonly dark: boolean;
  readonly isLast: boolean;
  readonly onAnswer: (option: number) => void;
  readonly onNext: () => void;
}

function Question({
  question,
  chosen,
  dark,
  isLast,
  onAnswer,
  onNext,
}: IQuestionProps): ReactElement {
  const answered = chosen !== null;
  const right = chosen === question.answerIndex;
  const answerLabel = question.options[question.answerIndex];

  const verdict = useMemo(() => {
    if (answerLabel === undefined) {
      return '';
    }

    return right ? `${answerLabel} — ${question.why}` : `This is ${answerLabel}. ${question.why}`;
  }, [answerLabel, question.why, right]);

  return (
    <>
      <p
        className={cn(
          'font-display text-xl leading-snug tracking-tight',
          dark ? 'text-surface' : 'text-primary-900',
        )}
      >
        {question.sentence}
      </p>

      <p className={cn('font-mono text-[11px]', dark ? 'text-primary-100' : 'text-muted')}>
        Formula: {question.formula}
      </p>

      <ul className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option, position) => (
          <li key={option}>
            <button
              aria-pressed={chosen === position}
              className={cn(
                'flex h-10 w-full items-center justify-between gap-2 rounded-control border px-3 text-left',
                optionTone(dark, answered, position === question.answerIndex, chosen === position),
              )}
              disabled={answered}
              onClick={() => {
                onAnswer(position);
              }}
              type="button"
            >
              <span>{option}</span>
              {answered && position === question.answerIndex && <Glyph name="check" />}
              {answered && chosen === position && position !== question.answerIndex && (
                <Glyph name="close" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="min-h-[4.5rem]">
        {answered && (
          <div className="flex flex-col gap-1.5">
            <p className={right ? 'text-mastered' : 'text-tertiary-700'}>{verdict}</p>
            <p className="font-bengali" lang="bn">
              {question.bangla}
            </p>
            <button
              className={cn(
                'mt-1 h-8 self-start rounded-control px-3',
                dark ? 'bg-secondary-500 text-primary-900' : 'bg-primary-900 text-surface',
              )}
              onClick={onNext}
              type="button"
            >
              {isLast ? 'See the score' : 'Next sentence'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

interface IFinishedProps {
  readonly correct: number;
  readonly total: number;
  readonly dark: boolean;
  readonly onAgain: () => void;
}

function Finished({ correct, total, dark, onAgain }: IFinishedProps): ReactElement {
  return (
    <>
      <p
        className={cn(
          'font-display text-3xl tracking-tight',
          dark ? 'text-surface' : 'text-primary-900',
        )}
      >
        {correct} of {total}
      </p>
      <p className={dark ? 'text-primary-100' : 'text-muted'}>
        {correct === total
          ? 'Every sentence named. Read the time words and the auxiliary first — that is the whole technique.'
          : 'The ones you missed are the formulas worth keeping. Another round draws a different set from the same bank.'}
      </p>
      <button
        className={cn(
          'h-9 self-start rounded-control px-4',
          dark ? 'bg-secondary-500 text-primary-900' : 'bg-primary-900 text-surface',
        )}
        onClick={onAgain}
        type="button"
      >
        Another round
      </button>
    </>
  );
}
