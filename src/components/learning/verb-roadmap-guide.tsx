import { type ReactElement } from 'react';
import { FormKey } from './verb-guide';

/**
 * The complete verb roadmap — every piece a learner needs, in the order it
 * has to be learnt: what a verb is, the five forms, the kinds, agreement,
 * the twelve tenses, the passive, modals, gerunds, conditionals, and the
 * mistakes that cost marks.
 *
 * Literal content in a component, for the same reason as `verb-guide.tsx` and
 * `grammar-pattern-guide.tsx`: this is a page of writing, not a corpus. A
 * port, a source and a use case would be four files to reach the same
 * tables. The 998-verb list next door is the corpus; this is the system
 * those rows sit inside.
 *
 * A Server Component. The drill beside it is the only client island.
 */

interface ITocEntry {
  readonly id: string;
  readonly label: string;
}

interface IKind {
  readonly name: string;
  readonly bangla: string;
  readonly job: string;
  readonly example: string;
}

interface IBeCell {
  readonly person: string;
  readonly present: string;
  readonly past: string;
}

interface IAgreement {
  readonly subject: string;
  readonly verb: string;
  readonly example: string;
  readonly trap: string;
}

interface IRoadmapTense {
  readonly tense: string;
  readonly bangla: string;
  readonly formula: string;
  readonly use: string;
  readonly example: string;
  readonly negative: string;
  readonly question: string;
}

interface IChooser {
  readonly ask: string;
  readonly answer: string;
}

interface IDoSupport {
  readonly tense: string;
  readonly negative: string;
  readonly question: string;
}

interface IPassiveTense {
  readonly tense: string;
  readonly formula: string;
  readonly example: string;
}

interface IModal {
  readonly word: string;
  readonly bangla: string;
  readonly use: string;
  readonly example: string;
}

interface IVerbPattern {
  readonly pattern: string;
  readonly takes: string;
  readonly example: string;
  readonly trap: string;
}

interface IConditional {
  readonly name: string;
  readonly formula: string;
  readonly use: string;
  readonly example: string;
}

interface ICausative {
  readonly pattern: string;
  readonly meaning: string;
  readonly example: string;
}

interface IMistake {
  readonly wrong: string;
  readonly right: string;
  readonly why: string;
}

interface IMasterLine {
  readonly clue: string;
  readonly tense: string;
}

const TOC: readonly ITocEntry[] = [
  { id: 'what', label: '1. What a verb is' },
  { id: 'forms', label: '2. Five forms' },
  { id: 'kinds', label: '3. Kinds of verb' },
  { id: 'regular', label: '4. Regular and irregular' },
  { id: 'be-have-do', label: '5. Be, have, do' },
  { id: 'agreement', label: '6. Agreement' },
  { id: 'built', label: '7. How a tense is built' },
  { id: 'tenses', label: '8. Twelve tenses' },
  { id: 'choose', label: '9. How to choose' },
  { id: 'questions', label: '10. Questions and negatives' },
  { id: 'passive', label: '11. Passive' },
  { id: 'modals', label: '12. Modals' },
  { id: 'patterns', label: '13. Gerund and infinitive' },
  { id: 'conditionals', label: '14. Conditionals' },
  { id: 'causatives', label: '15. Causatives' },
  { id: 'mistakes', label: '16. Mistakes' },
  { id: 'master', label: '17. Master chart' },
];

const KINDS: readonly IKind[] = [
  {
    name: 'Main verb',
    bangla: 'মূল ক্রিয়া',
    job: 'The action or state itself.',
    example: 'walk, eat, live, know',
  },
  {
    name: 'Auxiliary — be',
    bangla: 'সহায়ক — be',
    job: 'Builds continuous and passive.',
    example: 'She is walking. The letter was written.',
  },
  {
    name: 'Auxiliary — have',
    bangla: 'সহায়ক — have',
    job: 'Builds the perfect.',
    example: 'She has walked. She had left.',
  },
  {
    name: 'Auxiliary — do',
    bangla: 'সহায়ক — do',
    job: 'Builds questions and negatives in the simple tenses.',
    example: 'Do you walk? She does not walk.',
  },
  {
    name: 'Modal',
    bangla: 'মোডাল',
    job: 'Adds ability, permission, obligation, possibility. Always takes V1.',
    example: 'can, could, will, would, shall, should, may, might, must',
  },
  {
    name: 'Linking',
    bangla: 'সংযোগকারী',
    job: 'Joins the subject to a description. Not an action.',
    example: 'She is a teacher. He became tired. It looks easy.',
  },
];

const BE: readonly IBeCell[] = [
  { person: 'I', present: 'am', past: 'was' },
  { person: 'he / she / it', present: 'is', past: 'was' },
  { person: 'you / we / they', present: 'are', past: 'were' },
];

const HAVE: readonly IBeCell[] = [
  { person: 'I / you / we / they', present: 'have', past: 'had' },
  { person: 'he / she / it', present: 'has', past: 'had' },
];

const DO: readonly IBeCell[] = [
  { person: 'I / you / we / they', present: 'do', past: 'did' },
  { person: 'he / she / it', present: 'does', past: 'did' },
];

const AGREEMENT: readonly IAgreement[] = [
  {
    subject: 'I / you / we / they',
    verb: 'V1',
    example: 'They walk. I live here.',
    trap: 'They walks.',
  },
  {
    subject: 'he / she / it',
    verb: 'V5',
    example: 'She walks. It works.',
    trap: 'She walk.',
  },
  {
    subject: 'every / each + singular',
    verb: 'singular',
    example: 'Every student has a book.',
    trap: 'Every student have a book.',
  },
  {
    subject: 'one of the + plural noun',
    verb: 'singular',
    example: 'One of the students is absent.',
    trap: 'One of the students are absent.',
  },
  {
    subject: 'a number of + plural',
    verb: 'plural',
    example: 'A number of students are absent.',
    trap: 'A number of students is absent.',
  },
  {
    subject: 'the number of + plural',
    verb: 'singular',
    example: 'The number of students is increasing.',
    trap: 'The number of students are increasing.',
  },
];

const TENSES: readonly IRoadmapTense[] = [
  {
    tense: 'Present simple',
    bangla: 'সাধারণ বর্তমান',
    formula: 'V1 / V5',
    use: 'Habits, facts, timetables.',
    example: 'She walks to school every day.',
    negative: 'She does not walk.',
    question: 'Does she walk?',
  },
  {
    tense: 'Present continuous',
    bangla: 'ঘটমান বর্তমান',
    formula: 'am / is / are + V4',
    use: 'Happening now, or a temporary plan around now.',
    example: 'She is walking to school now.',
    negative: 'She is not walking.',
    question: 'Is she walking?',
  },
  {
    tense: 'Present perfect',
    bangla: 'পুরাঘটিত বর্তমান',
    formula: 'have / has + V3',
    use: 'Finished, but still connected to now. already, yet, ever, never, just.',
    example: 'She has walked to school already.',
    negative: 'She has not walked.',
    question: 'Has she walked?',
  },
  {
    tense: 'Present perfect continuous',
    bangla: 'পুরাঘটিত ঘটমান বর্তমান',
    formula: 'have / has been + V4',
    use: 'Started in the past, still going. for / since names the duration.',
    example: 'She has been walking for an hour.',
    negative: 'She has not been walking.',
    question: 'Has she been walking?',
  },
  {
    tense: 'Past simple',
    bangla: 'সাধারণ অতীত',
    formula: 'V2',
    use: 'Finished in a finished time. yesterday, last week, in 2019.',
    example: 'She walked to school yesterday.',
    negative: 'She did not walk.',
    question: 'Did she walk?',
  },
  {
    tense: 'Past continuous',
    bangla: 'ঘটমান অতীত',
    formula: 'was / were + V4',
    use: 'In progress at a past moment, or the background of another past action.',
    example: 'She was walking when it started to rain.',
    negative: 'She was not walking.',
    question: 'Was she walking?',
  },
  {
    tense: 'Past perfect',
    bangla: 'পুরাঘটিত অতীত',
    formula: 'had + V3',
    use: 'The earlier of two past actions. before, after, by the time.',
    example: 'She had walked home before sunset.',
    negative: 'She had not walked.',
    question: 'Had she walked?',
  },
  {
    tense: 'Past perfect continuous',
    bangla: 'পুরাঘটিত ঘটমান অতীত',
    formula: 'had been + V4',
    use: 'A duration already running when another past event arrived.',
    example: 'She had been walking for an hour when the bus arrived.',
    negative: 'She had not been walking.',
    question: 'Had she been walking?',
  },
  {
    tense: 'Future simple',
    bangla: 'সাধারণ ভবিষ্যৎ',
    formula: 'will + V1',
    use: 'A decision, a prediction, or a fact about later. tomorrow, next week.',
    example: 'She will walk to school tomorrow.',
    negative: 'She will not walk.',
    question: 'Will she walk?',
  },
  {
    tense: 'Future continuous',
    bangla: 'ঘটমান ভবিষ্যৎ',
    formula: 'will be + V4',
    use: 'In progress at a point in the future.',
    example: 'She will be walking to school at eight.',
    negative: 'She will not be walking.',
    question: 'Will she be walking?',
  },
  {
    tense: 'Future perfect',
    bangla: 'পুরাঘটিত ভবিষ্যৎ',
    formula: 'will have + V3',
    use: 'Already finished at a future deadline. by noon, by next year.',
    example: 'She will have walked five miles by noon.',
    negative: 'She will not have walked.',
    question: 'Will she have walked?',
  },
  {
    tense: 'Future perfect continuous',
    bangla: 'পুরাঘটিত ঘটমান ভবিষ্যৎ',
    formula: 'will have been + V4',
    use: 'A duration that will already have been running at a future point.',
    example: 'By June she will have been walking to school for a year.',
    negative: 'She will not have been walking.',
    question: 'Will she have been walking?',
  },
];

const CHOOSER: readonly IChooser[] = [
  { ask: 'Is it a habit, a fact, or a timetable?', answer: 'Present simple — V1 / V5.' },
  { ask: 'Is it happening now?', answer: 'Present continuous — am / is / are + V4.' },
  { ask: 'Is it finished, but still about now?', answer: 'Present perfect — have / has + V3.' },
  {
    ask: 'Did it start earlier and is it still going?',
    answer: 'Present perfect continuous — have / has been + V4.',
  },
  { ask: 'Is the time finished? yesterday, last year, in 2019?', answer: 'Past simple — V2.' },
  {
    ask: 'Was it in progress when something else happened?',
    answer: 'Past continuous — was / were + V4.',
  },
  {
    ask: 'Was it already finished before another past moment?',
    answer: 'Past perfect — had + V3.',
  },
  { ask: 'Is it a later fact or decision?', answer: 'Future simple — will + V1.' },
  { ask: 'Will it already be finished by a deadline?', answer: 'Future perfect — will have + V3.' },
];

const DO_SUPPORT: readonly IDoSupport[] = [
  {
    tense: 'Present simple',
    negative: 'do / does + not + V1',
    question: 'Do / Does + subject + V1',
  },
  {
    tense: 'Past simple',
    negative: 'did + not + V1',
    question: 'Did + subject + V1',
  },
  {
    tense: 'Any tense that already has be, have, will, or a modal',
    negative: 'Put not after that word.',
    question: 'Move that word in front of the subject.',
  },
];

const PASSIVE: readonly IPassiveTense[] = [
  { tense: 'Present simple', formula: 'am / is / are + V3', example: 'English is spoken here.' },
  {
    tense: 'Present continuous',
    formula: 'am / is / are being + V3',
    example: 'The road is being repaired.',
  },
  {
    tense: 'Present perfect',
    formula: 'have / has been + V3',
    example: 'The work has been finished.',
  },
  {
    tense: 'Past simple',
    formula: 'was / were + V3',
    example: 'The letter was written yesterday.',
  },
  {
    tense: 'Past continuous',
    formula: 'was / were being + V3',
    example: 'The letter was being written.',
  },
  { tense: 'Past perfect', formula: 'had been + V3', example: 'The letter had been written.' },
  {
    tense: 'Future simple',
    formula: 'will be + V3',
    example: 'The letter will be written tomorrow.',
  },
  {
    tense: 'Future perfect',
    formula: 'will have been + V3',
    example: 'The letter will have been written by noon.',
  },
  {
    tense: 'Modal',
    formula: 'modal + be + V3',
    example: 'The letter must be written. It can be sent.',
  },
];

const MODALS: readonly IModal[] = [
  {
    word: 'can',
    bangla: 'পারা',
    use: 'Ability now, or informal permission.',
    example: 'She can swim. Can I sit here?',
  },
  {
    word: 'could',
    bangla: 'পারতাম / পারতে পারি',
    use: 'Past ability, or a polite request.',
    example: 'She could swim at five. Could you help me?',
  },
  {
    word: 'will',
    bangla: 'হবে',
    use: 'Future fact, a promise, a decision.',
    example: 'I will call you.',
  },
  {
    word: 'would',
    bangla: 'হত',
    use: 'Unreal present, or a polite request.',
    example: 'I would travel if I had money. Would you wait?',
  },
  {
    word: 'shall',
    bangla: 'কি করব',
    use: 'An offer or a suggestion, usually with I / we.',
    example: 'Shall we start?',
  },
  {
    word: 'should',
    bangla: 'উচিত',
    use: 'Advice, or the expected thing.',
    example: 'You should study. The train should arrive at six.',
  },
  {
    word: 'may',
    bangla: 'হতে পারে / অনুমতি',
    use: 'Possibility, or formal permission.',
    example: 'It may rain. May I come in?',
  },
  {
    word: 'might',
    bangla: 'হতেও পারে',
    use: 'A weaker possibility.',
    example: 'It might rain later.',
  },
  {
    word: 'must',
    bangla: 'অবশ্যই',
    use: 'Strong obligation, or a sure conclusion.',
    example: 'You must wear a helmet. She must be tired.',
  },
];

const VERB_PATTERNS: readonly IVerbPattern[] = [
  {
    pattern: 'enjoy / avoid / finish / keep / suggest / mind / practise',
    takes: 'V-ing',
    example: 'enjoy reading, avoid talking, finish working',
    trap: 'enjoy to read',
  },
  {
    pattern: 'want / need / decide / hope / plan / learn / agree / refuse',
    takes: 'to + V1',
    example: 'want to go, decided to leave, plan to travel',
    trap: 'want going, decided to left',
  },
  {
    pattern: 'make / let + object',
    takes: 'V1 — no to',
    example: 'make him work, let me go',
    trap: 'make him to work',
  },
  {
    pattern: 'allow / want / ask / tell + object',
    takes: 'to + V1',
    example: 'allow him to go, I want her to come',
    trap: 'allow him go',
  },
  {
    pattern: 'look forward to / object to / be used to / be accustomed to',
    takes: 'V-ing — that to is a preposition',
    example: 'look forward to meeting you, be used to waking early',
    trap: 'look forward to meet',
  },
  {
    pattern: 'V-ing as a noun',
    takes: 'the -ing form names the activity',
    example: 'Swimming is good exercise. I enjoy reading.',
    trap: 'Swim is good exercise.',
  },
];

const CONDITIONALS: readonly IConditional[] = [
  {
    name: 'Zero',
    formula: 'if + present, present',
    use: 'A fact. Always true.',
    example: 'If you heat ice, it melts.',
  },
  {
    name: 'First',
    formula: 'if + present, will + V1',
    use: 'A real future. Possible.',
    example: 'If you study, you will pass.',
  },
  {
    name: 'Second',
    formula: 'if + V2, would + V1',
    use: 'Unreal present. Imagined now.',
    example: 'If I had money, I would travel.',
  },
  {
    name: 'Third',
    formula: 'if + had + V3, would have + V3',
    use: 'Unreal past. Too late to change.',
    example: 'If I had studied, I would have passed.',
  },
];

const CAUSATIVES: readonly ICausative[] = [
  {
    pattern: 'make + object + V1',
    meaning: 'Force. No choice.',
    example: 'The teacher made us rewrite the essay.',
  },
  {
    pattern: 'let + object + V1',
    meaning: 'Allow. No to.',
    example: 'Let me explain. They let him leave early.',
  },
  {
    pattern: 'have + object + V3',
    meaning: 'Arrange for someone else to do it.',
    example: 'I had my hair cut. We had the house painted.',
  },
  {
    pattern: 'get + object + V3',
    meaning: 'The same as have, often more informal.',
    example: 'I got my phone repaired.',
  },
  {
    pattern: 'get + object + to + V1',
    meaning: 'Persuade them to do it.',
    example: 'I got him to help me.',
  },
];

const MISTAKES: readonly IMistake[] = [
  {
    wrong: 'I have went to school.',
    right: 'I have gone to school.',
    why: 'have takes V3, not V2.',
  },
  { wrong: 'She don’t like it.', right: 'She doesn’t like it.', why: 'he / she / it takes does.' },
  { wrong: 'He taked the bus.', right: 'He took the bus.', why: 'take is irregular — V2 is took.' },
  { wrong: 'I am agree.', right: 'I agree.', why: 'agree is already a verb; it needs no am.' },
  {
    wrong: 'She is speaks English.',
    right: 'She speaks English.',
    why: 'One tense at a time — is + V4, or V5 alone.',
  },
  {
    wrong: 'They have ate dinner.',
    right: 'They have eaten dinner.',
    why: 'V3 is eaten. ate is V2.',
  },
  {
    wrong: 'The letter was wrote by Tom.',
    right: 'The letter was written by Tom.',
    why: 'The passive takes V3.',
  },
  {
    wrong: 'If you will study, you will pass.',
    right: 'If you study, you will pass.',
    why: 'The if-clause of the first conditional stays in the present.',
  },
  {
    wrong: 'I did went there.',
    right: 'I went there. / I did go there.',
    why: 'did already carries the past, so the next verb stays V1.',
  },
  { wrong: 'She can to swim.', right: 'She can swim.', why: 'A modal takes V1, never to + V1.' },
  {
    wrong: 'I look forward to meet you.',
    right: 'I look forward to meeting you.',
    why: 'That to is a preposition, so it takes V-ing.',
  },
  {
    wrong: 'I am live in Dhaka.',
    right: 'I live in Dhaka.',
    why: 'Present simple for a fact. am live mixes be with a main verb that does not need it.',
  },
];

const MASTER: readonly IMasterLine[] = [
  { clue: 'every day / usually / always / never', tense: 'Present simple — V1 / V5' },
  { clue: 'now / at the moment / Look!', tense: 'Present continuous — am / is / are + V4' },
  {
    clue: 'already / yet / ever / never / just / since / for (to now)',
    tense: 'Present perfect — have / has + V3',
  },
  { clue: 'for / since + still going', tense: 'Present perfect continuous — have / has been + V4' },
  { clue: 'yesterday / last … / ago / in 2019', tense: 'Past simple — V2' },
  {
    clue: 'at 8 o’clock (past) / while / when + interruption',
    tense: 'Past continuous — was / were + V4',
  },
  { clue: 'before / by the time (two pasts)', tense: 'Past perfect — had + V3' },
  { clue: 'tomorrow / next … / I think', tense: 'Future simple — will + V1' },
  { clue: 'at 8 o’clock (future)', tense: 'Future continuous — will be + V4' },
  { clue: 'by + future time', tense: 'Future perfect — will have + V3' },
  { clue: 'can / should / must / may / might / will / would', tense: 'Modal + V1' },
  { clue: 'be + V3, and the subject receives the action', tense: 'Passive' },
];

function Table({
  caption,
  headings,
  children,
}: {
  readonly caption: string;
  readonly headings: readonly string[];
  readonly children: ReactElement | readonly ReactElement[];
}): ReactElement {
  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th className="label h-8 border-b border-hairline px-3" key={heading}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Heading({
  id,
  children,
}: {
  readonly id: string;
  readonly children: string;
}): ReactElement {
  return (
    <h2
      className="scroll-mt-4 border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900"
      id={id}
    >
      {children}
    </h2>
  );
}

function Section({
  id,
  title,
  bangla,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly bangla: string;
  readonly children: ReactElement | readonly ReactElement[];
}): ReactElement {
  return (
    <section className="flex flex-col gap-3">
      <Heading id={id}>{title}</Heading>
      <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
        {bangla}
      </p>
      {children}
    </section>
  );
}

/**
 * The whole roadmap, in the order it has to be read.
 */
export function VerbRoadmapGuide(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <p className="max-w-3xl text-neutral-700">
          English verbs look like a pile of tenses until they are a system: five forms, three
          auxiliaries, and a formula for each slot. Read this page in order. The drill at the top
          asks whether the formula is visible; everything below is the chart that makes it visible.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          ইংরেজি verb একটা ব্যবস্থা: পাঁচটা form, তিনটা auxiliary, আর প্রতিটা tense-এর একটা formula।
          আগে form, তারপর tense, তারপর passive আর conditional — এই ক্রমে পড়ো।
        </p>
      </section>

      <nav aria-label="Sections of the roadmap">
        <p className="label mb-2">On this page</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
          {TOC.map((entry) => (
            <li key={entry.id}>
              <a className="text-primary-900 hover:underline" href={`#${entry.id}`}>
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section
        bangla="Verb হলো এমন word যা কাজ, অবস্থা বা ঘটনা বোঝায়। Without a verb there is no sentence."
        id="what"
        title="1. What a verb is"
      >
        <p className="text-muted">
          A verb is the word that says what happens — an action (
          <span className="font-mono text-primary-900">walk, write, eat</span>), a state (
          <span className="font-mono text-primary-900">know, live, own</span>), or a change (
          <span className="font-mono text-primary-900">become, grow</span>). Every English sentence
          that is a sentence has one. The rest of this page is how that one word changes.
        </p>
        <ul className="flex flex-col gap-1 text-muted">
          <li>
            <span className="text-primary-900">Action:</span> She{' '}
            <span className="font-mono">writes</span> every morning.
          </li>
          <li>
            <span className="text-primary-900">State:</span> He{' '}
            <span className="font-mono">lives</span> in Dhaka.
          </li>
          <li>
            <span className="text-primary-900">Linking:</span> The exam{' '}
            <span className="font-mono">is</span> difficult.
          </li>
        </ul>
      </Section>

      <Section
        bangla="একটা verb-এর পাঁচটা form: V1 মূল, V2 অতীত, V3 past participle, V4 -ing, V5 he/she/it-এর present."
        id="forms"
        title="2. The five forms"
      >
        <FormKey />
        <p className="text-muted">
          Regular example: work → worked → worked → working → works. Irregular example: go → went →
          gone → going → goes. The tense chart never asks you to invent a third form — it asks you
          to recognise which slot the sentence has opened. The thousand-row list at Verb forms is
          those five columns filled in.
        </p>
      </Section>

      <Section
        bangla="মূল ক্রিয়া কাজটা বলে। be, have, do tense গড়ে। Modal সামর্থ্য, অনুমতি, বাধ্যবাধকতা যোগ করে।"
        id="kinds"
        title="3. Kinds of verb"
      >
        <Table
          caption="The kinds of English verb, what each one does, and an example"
          headings={['Kind', 'বাংলা', 'What it does', 'Example']}
        >
          {KINDS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.name}>
              <td className="px-3 py-2 font-medium text-primary-900">{row.name}</td>
              <td className="px-3 py-2 font-bengali" lang="bn">
                {row.bangla}
              </td>
              <td className="px-3 py-2 text-muted">{row.job}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="Regular verb-এর V2 আর V3-এ -ed বসে। Irregular নিজের form রাখে — go/went/gone, take/took/taken."
        id="regular"
        title="4. Regular and irregular"
      >
        <p className="text-muted">
          A regular verb builds V2 and V3 by adding -ed: work → worked → worked. An irregular verb
          keeps its own shapes: go → went → gone, take → took → taken, cut → cut → cut. V4 and V5
          still follow the spelling rules for almost every verb, regular or not. The list next door
          marks a row irregular when any form refuses the rule — so the table and the thousand verbs
          never contradict each other.
        </p>
      </Section>

      <Section
        bangla="be দিয়ে continuous আর passive। have দিয়ে perfect। do দিয়ে simple tense-এর প্রশ্ন ও না-বোধক।"
        id="be-have-do"
        title="5. Be, have, do"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-base tracking-tight text-primary-900">be</h3>
            <Table caption="Present and past of be" headings={['Person', 'Present', 'Past']}>
              {BE.map((row) => (
                <tr className="border-b border-hairline last:border-b-0" key={row.person}>
                  <td className="px-3 py-2 text-muted">{row.person}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.present}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.past}</td>
                </tr>
              ))}
            </Table>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-base tracking-tight text-primary-900">have</h3>
            <Table caption="Present and past of have" headings={['Person', 'Present', 'Past']}>
              {HAVE.map((row) => (
                <tr className="border-b border-hairline last:border-b-0" key={row.person}>
                  <td className="px-3 py-2 text-muted">{row.person}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.present}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.past}</td>
                </tr>
              ))}
            </Table>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-base tracking-tight text-primary-900">do</h3>
            <Table caption="Present and past of do" headings={['Person', 'Present', 'Past']}>
              {DO.map((row) => (
                <tr className="border-b border-hairline last:border-b-0" key={row.person}>
                  <td className="px-3 py-2 text-muted">{row.person}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.present}</td>
                  <td className="px-3 py-2 font-mono text-primary-900">{row.past}</td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
        <p className="text-muted">
          be, have and do are also main verbs:{' '}
          <span className="font-mono text-primary-900">
            She is a teacher. I have a car. They do their homework.
          </span>{' '}
          The chart below treats them as auxiliaries — the job that builds a tense.
        </p>
      </Section>

      <Section
        bangla="he/she/it-এর সাথে present-এ V5। I/you/we/they-এর সাথে V1। every/each singular।"
        id="agreement"
        title="6. Subject–verb agreement"
      >
        <Table
          caption="Which verb form each kind of subject takes"
          headings={['Subject', 'Takes', 'Example', 'The trap']}
        >
          {AGREEMENT.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.subject}>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.subject}</td>
              <td className="px-3 py-2 text-primary-900">{row.verb}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-tertiary-700">{row.trap}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="প্রতিটা tense = auxiliary + একটা form। Auxiliary বদলায় সময়; form বদলায় কাজের অবস্থা।"
        id="built"
        title="7. How a tense is built"
      >
        <p className="text-muted">
          A tense is not a new verb. It is{' '}
          <span className="text-primary-900">one of the five forms</span>, sometimes with{' '}
          <span className="text-primary-900">be</span>,{' '}
          <span className="text-primary-900">have</span> or{' '}
          <span className="text-primary-900">will</span> in front of it.
        </p>
        <ul className="flex flex-col gap-1 font-mono text-[13px] text-primary-900">
          <li>walk</li>
          <li>walked</li>
          <li>is walking</li>
          <li>has walked</li>
          <li>has been walking</li>
          <li>will walk</li>
          <li>will have walked</li>
        </ul>
        <p className="text-muted">
          That is seven shapes of one verb, and they are all the twelve tenses plus the simple past.
          Once the formula is visible, the name of the tense is just a label for it.
        </p>
      </Section>

      <Section
        bangla="বারোটা tense: simple, continuous, perfect, perfect continuous — present, past, future। প্রতিটার formula মুখস্থ নয়, চিনতে হবে।"
        id="tenses"
        title="8. The twelve tenses"
      >
        <Table
          caption="The twelve tenses with formula, use, example, negative and question"
          headings={['Tense', 'বাংলা', 'Formula', 'When', 'Example']}
        >
          {TENSES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.tense}>
              <td className="px-3 py-2 font-medium text-primary-900">{row.tense}</td>
              <td className="px-3 py-2 font-bengali" lang="bn">
                {row.bangla}
              </td>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.formula}</td>
              <td className="px-3 py-2 text-muted">{row.use}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
            </tr>
          ))}
        </Table>
        <h3 className="font-display text-base tracking-tight text-primary-900">
          Negative and question, same twelve
        </h3>
        <Table
          caption="How each tense makes a negative and a question"
          headings={['Tense', 'Negative', 'Question']}
        >
          {TENSES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={`${row.tense}-nq`}>
              <td className="px-3 py-2 text-primary-900">{row.tense}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-muted">{row.negative}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-muted">{row.question}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="আগে সময় বলো — এখন, অতীত, ভবিষ্যৎ। তারপর বলো কাজটা শেষ কি চলছে, এখনো কি প্রাসঙ্গিক।"
        id="choose"
        title="9. How to choose a tense"
      >
        <Table caption="The questions that pick a tense" headings={['Ask this', 'Take this']}>
          {CHOOSER.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.ask}>
              <td className="px-3 py-2 text-primary-900">{row.ask}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-muted">{row.answer}</td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          The pair that costs the most marks:{' '}
          <span className="font-mono text-primary-900">yesterday</span> takes V2, never have;{' '}
          <span className="font-mono text-primary-900">already / yet / ever</span> take have + V3,
          even when the action feels like the past.
        </p>
      </Section>

      <Section
        bangla="Simple tense-এ do/does/did এনে V1 রাখো। be, have, will, modal থাকলে সেটাই সামনে যায়।"
        id="questions"
        title="10. Questions and negatives"
      >
        <Table
          caption="How questions and negatives are built"
          headings={['When', 'Negative', 'Question']}
        >
          {DO_SUPPORT.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.tense}>
              <td className="px-3 py-2 text-primary-900">{row.tense}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-muted">{row.negative}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-muted">{row.question}</td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          did already carries the past, so the next verb stays in the base form:{' '}
          <span className="font-mono text-mastered">Did she go?</span> not{' '}
          <span className="font-mono text-tertiary-700">Did she went?</span>
        </p>
      </Section>

      <Section
        bangla="Passive = be + V3। কর্তা কাজ করে না, কাজটা তার উপর হয়। The letter was written."
        id="passive"
        title="11. The passive"
      >
        <p className="text-muted">
          Use the passive when the receiver of the action matters more than the doer, or when the
          doer is unknown. The formula is always{' '}
          <span className="font-mono text-primary-900">be + V3</span>. Change the tense of be; V3
          does not move.
        </p>
        <Table
          caption="Passive formulas across the tenses"
          headings={['Tense', 'Formula', 'Example']}
        >
          {PASSIVE.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.tense}>
              <td className="px-3 py-2 text-primary-900">{row.tense}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.formula}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="Modal-এর পরে সবসময় V1। can পারা, should উচিত, must অবশ্যই, may/might সম্ভাবনা, will ভবিষ্যৎ।"
        id="modals"
        title="12. Modals"
      >
        <Table
          caption="The nine core modals, what they add, and an example"
          headings={['Modal', 'বাংলা', 'Use', 'Example']}
        >
          {MODALS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="px-3 py-2 font-mono text-primary-900">{row.word}</td>
              <td className="px-3 py-2 font-bengali" lang="bn">
                {row.bangla}
              </td>
              <td className="px-3 py-2 text-muted">{row.use}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          Two more shapes sit beside must:{' '}
          <span className="font-mono text-primary-900">have to</span> for obligation from outside,{' '}
          <span className="font-mono text-primary-900">don&apos;t have to</span> for &quot;not
          necessary&quot; — the opposite of mustn&apos;t, which forbids.
        </p>
      </Section>

      <Section
        bangla="কিছু verb-এর পরে V-ing, কিছু verb-এর পরে to + V1। make/let-এর পরে to নেই।"
        id="patterns"
        title="13. Gerund and infinitive"
      >
        <Table
          caption="What common verbs take after them"
          headings={['After these', 'Take', 'Example', 'The trap']}
        >
          {VERB_PATTERNS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.pattern}>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.pattern}</td>
              <td className="px-3 py-2 text-primary-900">{row.takes}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-tertiary-700">{row.trap}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="Zero = সত্য। First = বাস্তব ভবিষ্যৎ। Second = এখনকার কল্পনা। Third = অতীতের অনুশোচনা।"
        id="conditionals"
        title="14. Conditionals"
      >
        <Table caption="The four conditionals" headings={['Name', 'Formula', 'When', 'Example']}>
          {CONDITIONALS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.name}>
              <td className="px-3 py-2 font-medium text-primary-900">{row.name}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.formula}</td>
              <td className="px-3 py-2 text-muted">{row.use}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          The trap in the first:{' '}
          <span className="font-mono text-tertiary-700">If you will study</span> puts will in the
          if-clause. <span className="font-mono text-mastered">If you study, you will pass</span>{' '}
          keeps the present there. The trap in the third is mixing it with the second:{' '}
          <span className="font-mono text-tertiary-700">If I studied, I would have passed</span>{' '}
          names the wrong time.
        </p>
      </Section>

      <Section
        bangla="make বাধ্য করে, let অনুমতি দেয়, have/get অন্যকে দিয়ে কাজ করায়।"
        id="causatives"
        title="15. Causatives — make, let, have, get"
      >
        <Table caption="Causative patterns" headings={['Pattern', 'Meaning', 'Example']}>
          {CAUSATIVES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.pattern}>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.pattern}</td>
              <td className="px-3 py-2 text-muted">{row.meaning}</td>
              <td className="px-3 py-2 text-muted">{row.example}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="have-এর পরে V3, did-এর পরে V1, modal-এর পরে to নেই, if will নয়।"
        id="mistakes"
        title="16. Mistakes worth checking"
      >
        <Table
          caption="Twelve common verb mistakes and their corrections"
          headings={['Written', 'Meant', 'Why']}
        >
          {MISTAKES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.wrong}>
              <td className="px-3 py-2 font-mono text-[12px] text-tertiary-700">{row.wrong}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-mastered">{row.right}</td>
              <td className="px-3 py-2 text-muted">{row.why}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        bangla="সময়ের word আর auxiliary দেখো — সেগুলোই tense বলে দেয়।"
        id="master"
        title="17. Master chart — the words that name the tense"
      >
        <Table
          caption="Time words and auxiliaries and the tense each one opens"
          headings={['The words in the sentence', 'The tense they name']}
        >
          {MASTER.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.clue}>
              <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.clue}</td>
              <td className="px-3 py-2 text-muted">{row.tense}</td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          The five-form list — every verb in V1 to V5 — is next door at Verb forms. This page is the
          system those rows sit inside. Read a sentence, find the auxiliary and the time word, and
          the formula is already there.
        </p>
      </Section>
    </div>
  );
}
