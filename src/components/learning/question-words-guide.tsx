import { type ReactElement } from 'react';

/**
 * WH-question words — the words that open an IELTS question, and the How-
 * phrases that sit beside them.
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
 * The WH-words, the How-phrases, and the eight cues that name what a question
 * is asking — the whole reference, in that order.
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
    </div>
  );
}
