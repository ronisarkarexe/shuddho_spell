import { type ReactElement } from 'react';

/**
 * The preposition reference — what the word *does*, the common list, and the
 * four questions that pick the right one.
 *
 * Literal content in a component, for the same reason as `verb-guide.tsx`: this
 * is a page of writing, not a corpus. A port, a source and a use case would be
 * four files to reach the same thirty rows.
 *
 * A Server Component. Nothing here is interactive.
 */

interface IPreposition {
  readonly word: string;
  readonly bangla: string;
}

interface IExample {
  readonly english: string;
  readonly bangla: string;
}

interface IGroup {
  readonly question: string;
  readonly words: string;
}

const PREPOSITIONS: readonly IPreposition[] = [
  { word: 'in', bangla: 'মধ্যে / ভিতরে' },
  { word: 'on', bangla: 'উপর' },
  { word: 'at', bangla: 'এ / তে' },
  { word: 'to', bangla: 'দিকে / তে' },
  { word: 'from', bangla: 'থেকে' },
  { word: 'for', bangla: 'জন্য' },
  { word: 'with', bangla: 'সাথে' },
  { word: 'by', bangla: 'দ্বারা / মাধ্যমে' },
  { word: 'of', bangla: 'এর / -এর' },
  { word: 'about', bangla: 'সম্পর্কে' },
  { word: 'above', bangla: 'উপরে' },
  { word: 'below', bangla: 'নিচে' },
  { word: 'under', bangla: 'নিচে' },
  { word: 'over', bangla: 'উপরে' },
  { word: 'between', bangla: 'দুটির মধ্যে' },
  { word: 'among', bangla: 'অনেকের মধ্যে' },
  { word: 'behind', bangla: 'পিছনে' },
  { word: 'beside', bangla: 'পাশে' },
  { word: 'near', bangla: 'কাছে' },
  { word: 'inside', bangla: 'ভিতরে' },
  { word: 'outside', bangla: 'বাইরে' },
  { word: 'before', bangla: 'আগে' },
  { word: 'after', bangla: 'পরে' },
  { word: 'during', bangla: 'চলাকালীন' },
  { word: 'since', bangla: 'থেকে' },
  { word: 'until', bangla: 'পর্যন্ত' },
  { word: 'through', bangla: 'মধ্য দিয়ে' },
  { word: 'across', bangla: 'এক পাশ থেকে অন্য পাশে' },
  { word: 'into', bangla: 'ভিতরে' },
  { word: 'onto', bangla: 'উপরে' },
  { word: 'against', bangla: 'বিপরীতে' },
  { word: 'without', bangla: 'ছাড়া' },
  { word: 'within', bangla: 'মধ্যে / নির্দিষ্ট সময়ের মধ্যে' },
  { word: 'despite', bangla: 'সত্ত্বেও' },
  { word: 'except', bangla: 'ব্যতীত / ছাড়া' },
];

const EXAMPLES: readonly IExample[] = [
  { english: 'The book is on the table.', bangla: 'বইটি টেবিলের উপরে।' },
  { english: 'I live in Bangladesh.', bangla: 'আমি বাংলাদেশে থাকি।' },
  { english: 'He came from India.', bangla: 'সে ভারত থেকে এসেছে।' },
  { english: 'I will go to school.', bangla: 'আমি স্কুলে যাব।' },
];

const GROUPS: readonly IGroup[] = [
  { question: 'Where?', words: 'in, on, at, under, behind' },
  { question: 'When?', words: 'before, after, during, since, until' },
  { question: 'Direction?', words: 'to, into, toward, across' },
  { question: 'Relationship?', words: 'with, for, about, of, from' },
];

const AFTER: readonly string[] = ['with me', 'for him', 'from Bangladesh', 'about English'];

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
 * What a preposition is, the common list, and the four questions that choose
 * one — the whole reference, in the order it has to be read.
 */
export function PrepositionGuide(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <p className="max-w-3xl text-neutral-700">
          A preposition is a small word that shows how a noun or a pronoun relates to another word —
          place, time, direction, cause, and the rest. The noun after it is the thing the
          relationship is <em>with</em>.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          Preposition হলো এমন একটি word, যা সাধারণত noun বা pronoun-এর সাথে অন্য word-এর সম্পর্ক
          বোঝায় — যেমন জায়গা, সময়, দিক, কারণ ইত্যাদি।
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Four sentences
        </h2>
        <ul className="flex flex-col gap-1.5">
          {EXAMPLES.map((example) => (
            <li className="flex flex-wrap items-baseline gap-x-3" key={example.english}>
              <span className="text-primary-900">{example.english}</span>
              <span className="font-bengali text-muted" lang="bn">
                {example.bangla}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          The common list
        </h2>
        <Table caption="Common English prepositions and their Bangla meanings" headings={['Preposition', 'বাংলা']}>
          {PREPOSITIONS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.word}>
              <td className="h-8 px-3 font-mono text-primary-900">{row.word}</td>
              <td className="h-8 px-3 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          Four questions that pick one
        </h2>
        <p className="max-w-3xl text-neutral-700">
          A preposition names a relationship. Ask what kind of relationship the sentence needs, and
          the short list below is the set you are choosing from.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          Preposition সম্পর্ক বোঝায়। বাক্যে কোন ধরনের সম্পর্ক লাগছে, সেই প্রশ্নটি করলে নিচের ছোট
          তালিকা থেকে বেছে নেওয়া যায়।
        </p>
        <Table
          caption="Which prepositions answer where, when, direction and relationship"
          headings={['Question', 'Prepositions']}
        >
          {GROUPS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.question}>
              <td className="h-8 px-3 text-primary-900">{row.question}</td>
              <td className="h-8 px-3 font-mono text-muted">{row.words}</td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-hairline pb-1 font-display text-lg tracking-tight text-primary-900">
          What follows a preposition
        </h2>
        <p className="max-w-3xl text-neutral-700">
          A noun or a pronoun sits after every preposition. The form is the object form:{' '}
          <span className="font-mono text-primary-900">me</span>,{' '}
          <span className="font-mono text-primary-900">him</span>,{' '}
          <span className="font-mono text-primary-900">her</span>,{' '}
          <span className="font-mono text-primary-900">us</span>,{' '}
          <span className="font-mono text-primary-900">them</span> — never{' '}
          <span className="font-mono text-tertiary-700">I</span> or{' '}
          <span className="font-mono text-tertiary-700">he</span>.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          সব preposition-এর পরে noun বা pronoun বসতে পারে।
        </p>
        <ul className="flex flex-wrap gap-2">
          {AFTER.map((phrase) => (
            <li
              className="rounded-control border border-hairline bg-surface px-3 py-1.5 font-mono text-primary-900"
              key={phrase}
            >
              {phrase}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
