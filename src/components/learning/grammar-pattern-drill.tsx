'use client';

import { Fragment, useCallback, useMemo, useState, type ReactElement } from 'react';
import { Glyph } from '@/components/icons/glyph';
import { cn } from '@/lib/cn';

/**
 * The gap-fill decoder: a sentence with a hole, four kinds of word, and the
 * pattern that named the right kind.
 *
 * **The same component on the front door, the dashboard and the reference.**
 * A visitor is asked whether they can *see* the clue; a learner is asked the
 * same thing for thirty seconds before the day's lesson. Splitting it would
 * give two screens two different bugs.
 *
 * **It marks in the browser, and nothing is stored.** The answer arrives with
 * the question. No review item, no streak, no round trip — this is a closed
 * list of patterns, not a corpus, so a fresh round is a shuffle of the same
 * bank rather than a fetch.
 */

export interface IGrammarPatternDrillProps {
  /**
   * `dark` for a hero, `light` for a card on paper.
   *
   * A prop rather than two components: the two differ in colour tokens and in
   * nothing else.
   */
  readonly tone: 'dark' | 'light';
  /** How many questions a round asks. */
  readonly roundSize: number;
}

interface IGapQuestion {
  readonly id: string;
  readonly sentence: string;
  readonly options: readonly string[];
  readonly answerIndex: number;
  readonly clue: string;
  readonly filled: string;
  readonly why: string;
  readonly bangla: string;
}

const BANK: readonly IGapQuestion[] = [
  {
    id: 'plural-are',
    sentence: 'Moore turns to drawing because ______ for sculpting are not readily available.',
    options: ['singular noun', 'plural noun', 'base verb (V1)', 'adjective'],
    answerIndex: 1,
    clue: '______ are',
    filled: 'Moore turns to drawing because materials for sculpting are not readily available.',
    why: 'are takes a plural subject. for sculpting is a prepositional phrase after the blank, so the blank is the noun that phrase belongs to.',
    bangla: 'are আছে বলে blank-এ plural noun বসবে। for sculpting blank-এর পরে prepositional phrase।',
  },
  {
    id: 'very-adj',
    sentence: 'The problem is very ______.',
    options: ['plural noun', 'base verb (V1)', 'adjective', 'preposition'],
    answerIndex: 2,
    clue: 'very ______',
    filled: 'The problem is very difficult.',
    why: 'very sits in front of an adjective or an adverb. After is, the adjective is the one that describes the subject.',
    bangla: 'very-এর পরে সাধারণত adjective বা adverb। is-এর পরে এখানে adjective।',
  },
  {
    id: 'modal-v1',
    sentence: 'Students can ______ the library after six.',
    options: ['base verb (V1)', 'past simple (V2)', 'V-ing', 'plural noun'],
    answerIndex: 0,
    clue: 'can ______',
    filled: 'Students can use the library after six.',
    why: 'A modal (can, should, must, will, might) is always followed by the base form. can using and can used are both wrong.',
    bangla: 'can, should, must-এর পরে সবসময় V1।',
  },
  {
    id: 'have-v3',
    sentence: 'She has ______ her assignment.',
    options: ['base verb (V1)', 'past simple (V2)', 'past participle (V3)', 'adjective'],
    answerIndex: 2,
    clue: 'has ______',
    filled: 'She has finished her assignment.',
    why: 'have / has / had plus a past participle makes the perfect. has finished, not has finish or has finishing.',
    bangla: 'has/have/had-এর পরে V3 (past participle)।',
  },
  {
    id: 'by-ving',
    sentence: 'You can improve your English by ______ every day.',
    options: ['base verb (V1)', 'V-ing', 'infinitive (to + V1)', 'plural noun'],
    answerIndex: 1,
    clue: 'by ______',
    filled: 'You can improve your English by practising every day.',
    why: 'by names a method, and a preposition takes a noun or a gerund. by practising, not by practise.',
    bangla: 'by + V-ing — পদ্ধতি বোঝাতে।',
  },
  {
    id: 'many-plural',
    sentence: 'The report contains many ______.',
    options: ['singular noun', 'plural noun', 'uncountable noun', 'adjective'],
    answerIndex: 1,
    clue: 'many ______',
    filled: 'The report contains many errors.',
    why: 'many takes a plural countable noun. many error is the trap; much errors is the other one.',
    bangla: 'many-এর পরে plural countable noun।',
  },
  {
    id: 'every-singular',
    sentence: 'Every ______ has a unique code.',
    options: ['plural noun', 'singular noun', 'base verb (V1)', 'adverb'],
    answerIndex: 1,
    clue: 'every ______',
    filled: 'Every student has a unique code.',
    why: 'each and every take a singular noun, and the verb follows: every student has, not every students have.',
    bangla: 'every/each-এর পরে singular noun; verb-ও singular।',
  },
  {
    id: 'to-v1',
    sentence: 'She decided to ______ the course.',
    options: ['V-ing', 'past simple (V2)', 'base verb (V1)', 'adjective'],
    answerIndex: 2,
    clue: 'decided to ______',
    filled: 'She decided to leave the course.',
    why: 'After want, need, decide, plan, hope, the to is the infinitive marker, so the next word is V1. decided to leaving is wrong.',
    bangla: 'decide/want/need-এর পরে to + V1।',
  },
  {
    id: 'passive-v3',
    sentence: 'The products are ______ in Bangladesh.',
    options: ['base verb (V1)', 'V-ing', 'past participle (V3)', 'plural noun'],
    answerIndex: 2,
    clue: 'are ______ (no object after)',
    filled: 'The products are made in Bangladesh.',
    why: 'be + V3 is the passive. are making would need an object (they are making products); here the products are the thing being made.',
    bangla: 'be + V3 = passive. পণ্যগুলো তৈরি হয় — কর্তা নয়, কর্ম।',
  },
  {
    id: 'one-of',
    sentence: 'One of the ______ is missing.',
    options: ['singular noun', 'plural noun', 'uncountable noun', 'base verb (V1)'],
    answerIndex: 1,
    clue: 'one of the ______ is',
    filled: 'One of the students is missing.',
    why: 'one of the takes a plural noun, but the verb agrees with one, so it stays singular: one of the students is, not are.',
    bangla: 'one of the + plural noun, কিন্তু verb singular (is)।',
  },
  {
    id: 'too-adj',
    sentence: 'The question is too ______ to answer in a minute.',
    options: ['noun', 'adjective', 'V-ing', 'preposition'],
    answerIndex: 1,
    clue: 'too ______ to',
    filled: 'The question is too difficult to answer in a minute.',
    why: 'too + adjective + to + V1. too difficulty and too difficult answering both miss the pattern.',
    bangla: 'too + adjective + to + V1।',
  },
  {
    id: 'without-ving',
    sentence: 'He left without ______ goodbye.',
    options: ['base verb (V1)', 'to + V1', 'V-ing', 'past simple (V2)'],
    answerIndex: 2,
    clue: 'without ______',
    filled: 'He left without saying goodbye.',
    why: 'without is a preposition, so it takes a noun or a gerund. without say and without to say are both wrong.',
    bangla: 'without-এর পরে noun অথবা V-ing।',
  },
  {
    id: 'there-are',
    sentence: 'There are several ______ with the current design.',
    options: ['singular noun', 'plural noun', 'adjective', 'base verb (V1)'],
    answerIndex: 1,
    clue: 'there are several ______',
    filled: 'There are several problems with the current design.',
    why: 'there are takes a plural noun, and several does the same. there is several is the trap.',
    bangla: 'there are + plural noun; several-ও plural নেয়।',
  },
  {
    id: 'because-of',
    sentence: 'The flight was delayed because of ______.',
    options: ['a clause (subject + verb)', 'a noun', 'a base verb (V1)', 'an adjective alone'],
    answerIndex: 1,
    clue: 'because of ______',
    filled: 'The flight was delayed because of the storm.',
    why: 'because takes a clause (because it was raining). because of takes a noun (because of the rain). Mixing them is the trap.',
    bangla: 'because of-এর পরে noun; because-এর পরে subject + verb।',
  },
  {
    id: 'number-of',
    sentence: 'The number of ______ is increasing.',
    options: ['singular noun + are', 'plural noun + is', 'plural noun + are', 'uncountable noun + are'],
    answerIndex: 1,
    clue: 'the number of ______ is',
    filled: 'The number of students is increasing.',
    why: 'the number of takes a plural noun but a singular verb. a number of students are is the pair that flips it.',
    bangla: 'the number of + plural noun + is। a number of + plural noun + are।',
  },
  {
    id: 'did-v1',
    sentence: 'Did she ______ the lecture yesterday?',
    options: ['past simple (V2)', 'base verb (V1)', 'past participle (V3)', 'V-ing'],
    answerIndex: 1,
    clue: 'did ______',
    filled: 'Did she attend the lecture yesterday?',
    why: 'do / does / did already carry the tense, so the next verb stays in the base form. did attended is the trap.',
    bangla: 'do/does/did-এর পরে V1 — tense already করা।',
  },
];

function pickRound(bank: readonly IGapQuestion[], size: number): readonly IGapQuestion[] {
  const copy: IGapQuestion[] = [...bank];

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

function BlankSentence({
  text,
  dark,
}: {
  readonly text: string;
  readonly dark: boolean;
}): ReactElement {
  const parts = text.split('______');

  return (
    <p
      className={cn(
        'font-display text-xl leading-snug tracking-tight',
        dark ? 'text-surface' : 'text-primary-900',
      )}
    >
      {parts.map((part, index) => (
        <Fragment key={`${part}-${String(index)}`}>
          {part}
          {index < parts.length - 1 && (
            <span
              className={cn(
                'mx-1 inline-block min-w-[4.5rem] border-b-2 align-baseline',
                dark ? 'border-secondary-500' : 'border-primary-900',
              )}
            >
              &nbsp;
            </span>
          )}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * Six (or four) sentences with a hole. The job is not to guess the word — it
 * is to name the *kind* of word the grammar around the hole will accept.
 */
export function GrammarPatternDrill({
  tone,
  roundSize,
}: IGrammarPatternDrillProps): ReactElement {
  const [questions, setQuestions] = useState<readonly IGapQuestion[]>(() =>
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

  const shell = cn(
    'flex flex-col gap-4',
    dark ? 'text-surface' : 'text-primary-900',
  );

  return (
    <div className={shell}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={cn('label', dark && 'text-primary-100')}>
          {finished ? 'Round finished' : 'What kind of word fits?'}
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
  readonly question: IGapQuestion;
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

    return right
      ? `${answerLabel} — ${question.why}`
      : `The hole takes ${answerLabel}. ${question.why}`;
  }, [answerLabel, question.why, right]);

  return (
    <>
      <BlankSentence dark={dark} text={question.sentence} />

      <p className={cn('font-mono text-[11px]', dark ? 'text-primary-100' : 'text-muted')}>
        Clue: {question.clue}
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
            <p className={dark ? 'text-primary-100' : 'text-muted'}>{question.filled}</p>
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
          ? 'Every hole named. Read the words around the blank before you guess the word — that is the whole technique.'
          : 'The ones you missed are the patterns worth keeping. Another round draws a different set from the same bank.'}
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
