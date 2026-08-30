import { type ReactElement } from 'react';

/**
 * WH-question words — the words that open an IELTS question, the How-
 * phrases that sit beside them, and the pointing words that answer them
 * (this, that, these, those), and the sentence words built from the same
 * stems — something, anyone, wherever — that a learner actually needs to
 * write a sentence.
 *
 * Literal content in a component, for the same reason as `verb-guide.tsx`: a
 * page of writing, not a corpus. A Server Component; nothing here is
 * interactive.
 */

interface IQuestionWord {
  readonly word: string;
  readonly bangla: string;
  readonly asks: string;
  readonly example: string;
}

interface IHowPhrase {
  readonly phrase: string;
  readonly bangla: string;
  readonly example: string;
}

interface ICue {
  readonly word: string;
  readonly asks: string;
  readonly example: string;
}

interface IPointer {
  readonly word: string;
  readonly bangla: string;
  readonly number: string;
  readonly distance: string;
  readonly example: string;
}

interface IPlacePointer {
  readonly word: string;
  readonly bangla: string;
  readonly pairsWith: string;
  readonly example: string;
}

interface IPointerFrame {
  readonly english: string;
  readonly bangla: string;
  readonly note: string;
}

interface ISentenceWord {
  readonly word: string;
  readonly bangla: string;
  readonly kind: string;
  readonly example: string;
}

interface ISomeAnyRule {
  readonly word: string;
  readonly when: string;
  readonly example: string;
}

interface IEverWord {
  readonly word: string;
  readonly bangla: string;
  readonly example: string;
}

interface IOtherWord {
  readonly word: string;
  readonly bangla: string;
  readonly example: string;
}

interface IItUse {
  readonly english: string;
  readonly bangla: string;
  readonly when: string;
}

interface IRelative {
  readonly word: string;
  readonly bangla: string;
  readonly example: string;
}

const WORDS: readonly IQuestionWord[] = [
  { word: 'What', bangla: 'কী / কীসের', asks: 'A thing or a subject', example: 'What is your name?' },
  { word: 'Who', bangla: 'কে', asks: 'A person', example: 'Who is he?' },
  { word: 'Whom', bangla: 'কাকে', asks: 'A person as the object', example: 'Whom did you call?' },
  { word: 'Whose', bangla: 'কার', asks: 'Ownership', example: 'Whose book is this?' },
  { word: 'Which', bangla: 'কোনটি / কোন', asks: 'A choice among a few', example: 'Which one do you like?' },
  { word: 'When', bangla: 'কখন', asks: 'Time', example: 'When will you come?' },
  { word: 'Where', bangla: 'কোথায়', asks: 'Place', example: 'Where do you live?' },
  { word: 'Why', bangla: 'কেন', asks: 'A reason', example: 'Why are you late?' },
  { word: 'How', bangla: 'কীভাবে / কেমন', asks: 'A method or a condition', example: 'How did you do it?' },
];

const HOW_PHRASES: readonly IHowPhrase[] = [
  { phrase: 'How much', bangla: 'কত (অগণনীয়)', example: 'How much water?' },
  { phrase: 'How many', bangla: 'কতগুলো (গণনীয়)', example: 'How many books?' },
  { phrase: 'How long', bangla: 'কতক্ষণ / কত লম্বা', example: 'How long will it take?' },
  { phrase: 'How often', bangla: 'কত ঘন ঘন', example: 'How often do you exercise?' },
  { phrase: 'How far', bangla: 'কত দূর', example: 'How far is your home?' },
  { phrase: 'How old', bangla: 'কত বছর বয়স', example: 'How old are you?' },
  { phrase: 'How fast', bangla: 'কত দ্রুত', example: 'How fast can you run?' },
  { phrase: 'How much time', bangla: 'কত সময়', example: 'How much time do you need?' },
];

const CUES: readonly ICue[] = [
  { word: 'Who', asks: 'Person', example: 'Who called you?' },
  { word: 'What', asks: 'Thing', example: 'What did you buy?' },
  { word: 'Where', asks: 'Place', example: 'Where do you live?' },
  { word: 'When', asks: 'Time', example: 'When did you arrive?' },
  { word: 'Why', asks: 'Reason', example: 'Why did you go?' },
  { word: 'Which', asks: 'Choice', example: 'Which one do you like?' },
  { word: 'Whose', asks: 'Possession', example: 'Whose book is this?' },
  { word: 'How', asks: 'Method or condition', example: 'How did you do it?' },
];

const POINTERS: readonly IPointer[] = [
  {
    word: 'this',
    bangla: 'এই / এটা',
    number: 'One',
    distance: 'Near',
    example: 'This book is mine.',
  },
  {
    word: 'that',
    bangla: 'সেই / ওটা',
    number: 'One',
    distance: 'Far',
    example: 'That book is yours.',
  },
  {
    word: 'these',
    bangla: 'এইগুলো / এগুলো',
    number: 'More than one',
    distance: 'Near',
    example: 'These books are mine.',
  },
  {
    word: 'those',
    bangla: 'সেইগুলো / ওগুলো',
    number: 'More than one',
    distance: 'Far',
    example: 'Those books are yours.',
  },
];

const PLACE_POINTERS: readonly IPlacePointer[] = [
  { word: 'here', bangla: 'এখানে', pairsWith: 'this, these', example: 'Come here. This seat is free.' },
  { word: 'there', bangla: 'সেখানে / ওখানে', pairsWith: 'that, those', example: 'Look there. That is the bus.' },
];

const POINTER_FRAMES: readonly IPointerFrame[] = [
  { english: 'What is this?', bangla: 'এটা কী?', note: 'Near, one thing' },
  { english: 'What is that?', bangla: 'ওটা কী?', note: 'Far, one thing' },
  { english: 'What are these?', bangla: 'এগুলো কী?', note: 'Near, more than one' },
  { english: 'What are those?', bangla: 'ওগুলো কী?', note: 'Far, more than one' },
  { english: 'Which of these do you want?', bangla: 'এগুলোর মধ্যে কোনটি চান?', note: 'A choice among things near you' },
  { english: 'Whose is that?', bangla: 'ওটা কার?', note: 'Ownership of one thing far off' },
  { english: 'How much is this?', bangla: 'এটার দাম কত?', note: 'Price of one thing you can point at' },
  { english: 'This one, not that one.', bangla: 'এইটা, ওটা নয়।', note: 'one after this / that when the noun is already known' },
];

const SENTENCE_WORDS: readonly ISentenceWord[] = [
  { word: 'something', bangla: 'কিছু একটা', kind: 'a thing', example: 'I need something to write with.' },
  { word: 'anything', bangla: 'কিছু (প্রশ্ন বা না)', kind: 'a thing', example: 'Do you need anything?' },
  { word: 'nothing', bangla: 'কিছুই না', kind: 'no thing', example: 'I need nothing else.' },
  { word: 'everything', bangla: 'সবকিছু', kind: 'all things', example: 'Everything is ready.' },
  { word: 'someone / somebody', bangla: 'কেউ', kind: 'a person', example: 'Someone is at the door.' },
  { word: 'anyone / anybody', bangla: 'কেউ (প্রশ্ন বা না)', kind: 'a person', example: 'Is anyone there?' },
  { word: 'no one / nobody', bangla: 'কেউ না', kind: 'no person', example: 'No one called.' },
  { word: 'everyone / everybody', bangla: 'সবাই', kind: 'all people', example: 'Everyone agreed.' },
  { word: 'somewhere', bangla: 'কোথাও', kind: 'a place', example: 'I left it somewhere.' },
  { word: 'anywhere', bangla: 'কোথাও (প্রশ্ন বা না)', kind: 'a place', example: 'Did you go anywhere?' },
  { word: 'nowhere', bangla: 'কোথাও না', kind: 'no place', example: 'It is nowhere in this room.' },
  { word: 'everywhere', bangla: 'সব জায়গায়', kind: 'all places', example: 'I looked everywhere.' },
];

const SOME_ANY: readonly ISomeAnyRule[] = [
  { word: 'some', when: 'A yes-sentence, or an offer', example: 'I have some time. Would you like some tea?' },
  { word: 'any', when: 'A question, or after no / not', example: 'Do you have any time? I do not have any tea.' },
];

const EVER_WORDS: readonly IEverWord[] = [
  { word: 'whatever', bangla: 'যা-ই হোক / যা কিছু', example: 'Take whatever you need.' },
  { word: 'whoever', bangla: 'যে-ই হোক', example: 'Whoever arrives first can start.' },
  { word: 'whenever', bangla: 'যখনই', example: 'Come whenever you are free.' },
  { word: 'wherever', bangla: 'যেখানেই', example: 'Sit wherever you like.' },
  { word: 'whichever', bangla: 'যেটাই / যেকোনোটি', example: 'Take whichever seat is free.' },
  { word: 'however', bangla: 'যেভাবেই', example: 'Finish it however you can.' },
];

const OTHER_WORDS: readonly IOtherWord[] = [
  { word: 'another', bangla: 'আর একটা', example: 'I need another pen.' },
  { word: 'the other', bangla: 'অন্যটা — দুটোর বাকিটা', example: 'One is red. The other is blue.' },
  { word: 'others', bangla: 'অন্যরা / অন্যগুলো', example: 'Some stayed. Others left.' },
  { word: 'the others', bangla: 'বাকিরা', example: 'Two came. The others were late.' },
  { word: 'each other', bangla: 'একে অপরকে', example: 'They help each other.' },
];

const IT_USES: readonly IItUse[] = [
  { english: 'It is raining.', bangla: 'বৃষ্টি হচ্ছে।', when: 'Weather — nothing to point at' },
  { english: 'It is Monday.', bangla: 'আজ সোমবার।', when: 'A day or a time' },
  { english: 'It is two kilometres.', bangla: 'দুই কিলোমিটার।', when: 'A distance' },
  { english: 'The book is new. It is useful.', bangla: 'বইটি নতুন। এটা কাজে লাগে।', when: 'A thing already named — not this, because you are not pointing' },
];

const RELATIVES: readonly IRelative[] = [
  { word: 'who', bangla: 'যে (ব্যক্তি)', example: 'The man who called you is here.' },
  { word: 'which', bangla: 'যা (জিনিস বা পশু)', example: 'The bus which I take is late.' },
  { word: 'that', bangla: 'যা / যে', example: 'The book that I bought is useful.' },
  { word: 'whose', bangla: 'যার', example: 'The girl whose bag was lost is waiting.' },
  { word: 'where', bangla: 'যেখানে', example: 'The city where I live is busy.' },
  { word: 'when', bangla: 'যখন', example: 'I remember the day when we met.' },
  { word: 'why', bangla: 'যে কারণে', example: 'That is the reason why I left.' },
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

/**
 * The WH-words, the How-phrases, the eight cues, then this / that / these /
 * those — the pointing words that sit in the answers and inside the questions.
 */
export function QuestionWordsGuide(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <p className="max-w-3xl text-neutral-700">
          Question words — what, when, where, why, who — open most of the questions IELTS Speaking
          and Reading actually ask. Hear the first word and you already know whether the answer is
          a person, a place, a time, a reason, or a thing.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          প্রশ্নবোধক শব্দ — what, when, where, why, who — IELTS Speaking ও Reading-এর বেশিরভাগ
          প্রশ্ন এগুলো দিয়েই শুরু হয়।
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          WH-question words
        </h2>
        <Table
          caption="WH-question words, what they ask for, and an example"
          headings={['Word', 'বাংলা', 'Asks for', 'Example']}
        >
          {WORDS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-muted">{row.asks}</td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          How, and the phrases built on it
        </h2>
        <Table
          caption="Question phrases built on How, with Bangla and an example"
          headings={['Phrase', 'বাংলা', 'Example']}
        >
          {HOW_PHRASES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.phrase}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.phrase}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Hear the first word
        </h2>
        <p className="max-w-3xl text-neutral-700">
          The first word of the question names the kind of answer. Read the question, name the
          kind, and the rest of the sentence is detail.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          প্রশ্নের প্রথম শব্দটিই বলে উত্তর কোন ধরনের হবে। প্রশ্নটি দেখেই সেই ধরনটি নাম দিন — বাকিটা
          বিস্তারিত।
        </p>
        <Table
          caption="What each question word is asking for, with an example"
          headings={['Word', 'Asks for', 'Example']}
        >
          {CUES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 text-muted">{row.asks}</td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          This, that, these, those
        </h2>
        <p className="max-w-3xl text-neutral-700">
          These four are not question words. They point. A WH-word asks; this and that name the
          thing the finger is on. Near or far, one or more than one — that is the whole choice.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          this, that, these, those প্রশ্ন করে না — এগুলো আঙুল তুলে দেখায়। কাছে না দূরে, একটা না
          অনেকগুলো — বেছে নেওয়ার কাজ এই দুটো প্রশ্নই।
        </p>
        <Table
          caption="This, that, these and those by number, distance, Bangla and example"
          headings={['Word', 'বাংলা', 'Number', 'Distance', 'Example']}
        >
          {POINTERS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-muted">{row.number}</td>
              <td className="h-8 px-3 text-muted">{row.distance}</td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Here and there
        </h2>
        <p className="max-w-3xl text-neutral-700">
          The same near / far split, for a place rather than a thing.{' '}
          <span className="font-mono text-primary-900">here</span> travels with{' '}
          <span className="font-mono text-primary-900">this</span> and{' '}
          <span className="font-mono text-primary-900">these</span>.{' '}
          <span className="font-mono text-primary-900">there</span> travels with{' '}
          <span className="font-mono text-primary-900">that</span> and{' '}
          <span className="font-mono text-primary-900">those</span>.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          here কাছের জায়গা, there দূরের জায়গা — this/these-এর সাথে here, that/those-এর সাথে
          there।
        </p>
        <Table
          caption="Here and there, which pointing words they travel with, and an example"
          headings={['Word', 'বাংলা', 'Travels with', 'Example']}
        >
          {PLACE_POINTERS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 font-mono text-muted">{row.pairsWith}</td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          In front of a noun, or standing alone
        </h2>
        <p className="max-w-3xl text-neutral-700">
          In front of a noun they point at it:{' '}
          <span className="font-mono text-primary-900">this book</span>,{' '}
          <span className="font-mono text-primary-900">those chairs</span>. Alone they{' '}
          <em>are</em> the noun:{' '}
          <span className="font-mono text-primary-900">This is my book</span>,{' '}
          <span className="font-mono text-primary-900">Those are expensive</span>. The form does
          not change. When the noun is already known,{' '}
          <span className="font-mono text-primary-900">one</span> stands in for it —{' '}
          <span className="font-mono text-primary-900">this one</span>,{' '}
          <span className="font-mono text-primary-900">that one</span>.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          noun-এর আগে বসলে নির্দেশ করে — this book, those chairs। একা বসলে নিজেরাই সেই জিনিস —
          This is my book। noun আগে থেকে জানা থাকলে this one, that one।
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Inside a question
        </h2>
        <p className="max-w-3xl text-neutral-700">
          A WH-word opens the question; this or that names what is being asked about. Learn the
          pair as one sentence, the way you learned the WH-word alone.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          প্রশ্নশব্দ প্রশ্ন খোলে, this বা that বলে কোন জিনিস নিয়ে প্রশ্ন — দুটো একসাথে একটি বাক্য
          হিসেবে শিখুন।
        </p>
        <Table
          caption="Question frames that join a WH-word with this, that, these or those"
          headings={['English', 'বাংলা', 'Why this one']}
        >
          {POINTER_FRAMES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.english}>
              <td className="h-8 px-3 text-primary-900">{row.english}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="px-3 py-2 text-muted">{row.note}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Words used in the sentence, not only the question
        </h2>
        <p className="max-w-3xl text-neutral-700">
          The same stems build words that sit in ordinary sentences:{' '}
          <span className="font-mono text-primary-900">some / any / no / every</span> plus{' '}
          <span className="font-mono text-primary-900">thing</span>,{' '}
          <span className="font-mono text-primary-900">one</span> /{' '}
          <span className="font-mono text-primary-900">body</span>, or{' '}
          <span className="font-mono text-primary-900">where</span>. These are the ones a learner
          actually needs to write.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          প্রশ্নশব্দের একই গোড়া থেকে বাক্যে ব্যবহারের শব্দ তৈরি হয় — something, anyone,
          nowhere। লেখার সময় এগুলোই লাগে।
        </p>
        <Table
          caption="Indefinite words built from thing, one and where, with Bangla and an example"
          headings={['Word', 'বাংলা', 'Stands for', 'Example']}
        >
          {SENTENCE_WORDS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-muted">{row.kind}</td>
              <td className="px-3 py-2 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Some and any
        </h2>
        <p className="max-w-3xl text-neutral-700">
          <span className="font-mono text-primary-900">some</span> belongs in a yes-sentence and in
          an offer.{' '}
          <span className="font-mono text-primary-900">any</span> belongs in a question and after{' '}
          <span className="font-mono text-primary-900">no</span> or{' '}
          <span className="font-mono text-primary-900">not</span>. The compounds above follow the
          same split: something with some, anything with any.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          some ইতিবাচক বাক্যে ও অফারে। any প্রশ্নে ও না-বোধক বাক্যে। something = some-এর দিক,
          anything = any-এর দিক।
        </p>
        <Table caption="When to use some and when to use any" headings={['Word', 'When', 'Example']}>
          {SOME_ANY.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 text-muted">{row.when}</td>
              <td className="px-3 py-2 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Whatever, whoever, whenever
        </h2>
        <p className="max-w-3xl text-neutral-700">
          Add <span className="font-mono text-primary-900">-ever</span> and the question word means
          “any of that kind, it does not matter which”.{' '}
          <span className="font-mono text-primary-900">however</span> after a verb still means “in
          whatever way”. At the start of a sentence it often means “but” — a different word that
          happens to look the same.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          -ever যোগ করলে অর্থ হয় “যে-ই হোক, কোনটি হোক তাতে যায় আসে না”। however ক্রিয়ার পরে =
          যেভাবেই; বাক্যের শুরুতে প্রায়ই “তবে”।
        </p>
        <Table
          caption="Question words with -ever, Bangla and an example"
          headings={['Word', 'বাংলা', 'Example']}
        >
          {EVER_WORDS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Another, the other, others
        </h2>
        <p className="max-w-3xl text-neutral-700">
          When the noun is already in the conversation, these four pick the next one, the remaining
          one, or the rest of the group.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          noun আগে থেকে জানা থাকলে — আর একটা, দুটোর বাকিটা, বা দলের বাকিরা।
        </p>
        <Table
          caption="Another, the other, others and each other, with Bangla and an example"
          headings={['Word', 'বাংলা', 'Example']}
        >
          {OTHER_WORDS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          It — when you are not pointing
        </h2>
        <p className="max-w-3xl text-neutral-700">
          <span className="font-mono text-primary-900">this</span> and{' '}
          <span className="font-mono text-primary-900">that</span> need a finger.{' '}
          <span className="font-mono text-primary-900">it</span> does not. Weather, time, distance,
          and a thing already named all take it.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          this ও that-এ আঙুল লাগে। it-এ লাগে না — আবহাওয়া, সময়, দূরত্ব, বা আগে বলা কোনো জিনিস।
        </p>
        <Table
          caption="When a sentence takes it rather than this or that"
          headings={['English', 'বাংলা', 'When']}
        >
          {IT_USES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.english}>
              <td className="h-8 px-3 text-primary-900">{row.english}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="px-3 py-2 text-muted">{row.when}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          The same words inside a sentence
        </h2>
        <p className="max-w-3xl text-neutral-700">
          Who, which, that, whose, where, when and why also join two facts. They stop being a
          question. The word order stays ordinary — no do / did swap.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          who, which, that — এগুলো প্রশ্ন না হয়ে দুটো তথ্য জোড়া দেয়। শব্দের সাধারণ ক্রম থাকে,
          do/did হয় না।
        </p>
        <Table
          caption="Question words used as relative words inside a sentence"
          headings={['Word', 'বাংলা', 'Example']}
        >
          {RELATIVES.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
              <td className="h-8 px-3 text-primary-900">{row.example}</td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
