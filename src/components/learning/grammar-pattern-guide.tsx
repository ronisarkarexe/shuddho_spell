import { type ReactElement } from 'react';

/**
 * The gap-fill pattern chart — every grammatical clue a blank can give.
 *
 * Literal content in a component, for the same reason as `verb-guide.tsx` and
 * `preposition-guide.tsx`: this is a page of writing, not a corpus. A port, a
 * source and a use case would be four files to reach the same tables.
 *
 * A Server Component. Nothing here is interactive — the drill lives next to
 * this chart, on the page that mounts both.
 */

interface IPosRow {
  readonly name: string;
  readonly bangla: string;
  readonly job: string;
  readonly example: string;
}

interface IPatternRow {
  readonly clue: string;
  readonly fills: string;
  readonly example: string;
  readonly wrong?: string;
}

interface IPair {
  readonly english: string;
  readonly bangla: string;
}

interface ITocEntry {
  readonly id: string;
  readonly label: string;
}

interface IMasterClue {
  readonly clue: string;
  readonly fills: string;
}

interface IBreakdown {
  readonly word: string;
  readonly role: string;
}

const TOC: readonly ITocEntry[] = [
  { id: 'parts-of-speech', label: 'Parts of speech' },
  { id: 'nouns', label: 'Nouns' },
  { id: 'agreement', label: 'Subject–verb' },
  { id: 'verbs', label: 'Verb forms' },
  { id: 'auxiliaries', label: 'Modals and auxiliaries' },
  { id: 'to', label: 'to + V1' },
  { id: 'adjectives', label: 'Adjectives and adverbs' },
  { id: 'determiners', label: 'Articles and determiners' },
  { id: 'prepositions', label: 'Prepositions' },
  { id: 'pronouns', label: 'Pronouns' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'conjunctions', label: 'Conjunctions' },
  { id: 'verb-patterns', label: 'Verb patterns' },
  { id: 'degree', label: 'too / enough / so / such' },
  { id: 'quantity', label: 'Quantity traps' },
  { id: 'compounds', label: 'Noun and adjective compounds' },
  { id: 'passive', label: 'Passive' },
  { id: 'conditionals', label: 'Conditionals' },
  { id: 'questions', label: 'Question words' },
  { id: 'how-to-read', label: 'How to read a blank' },
  { id: 'worked', label: 'Worked sentence' },
  { id: 'master', label: 'Master formula' },
];

const PARTS: readonly IPosRow[] = [
  { name: 'Noun', bangla: 'বিশেষ্য', job: 'Names a person, place, thing or idea', example: 'student, book, Dhaka, education' },
  { name: 'Pronoun', bangla: 'সর্বনাম', job: 'Stands in for a noun', example: 'he, she, they, it, them' },
  { name: 'Verb', bangla: 'ক্রিয়া', job: 'Names an action or a state', example: 'go, eat, work, is, become' },
  { name: 'Adjective', bangla: 'বিশেষণ', job: 'Describes a noun', example: 'good, expensive, available' },
  { name: 'Adverb', bangla: 'ক্রিয়াবিশেষণ', job: 'Describes a verb, adjective or adverb', example: 'quickly, very, carefully' },
  { name: 'Preposition', bangla: 'অব্যয়', job: 'Names a relationship or a place', example: 'in, on, at, for, by' },
  { name: 'Conjunction', bangla: 'অব্যয় / সংযোজক', job: 'Joins words, phrases or clauses', example: 'and, but, because, if' },
  { name: 'Determiner', bangla: 'নির্দেশক', job: 'Sits in front of a noun and specifies it', example: 'a, the, this, my, some' },
];

const NOUN_TYPES: readonly IPatternRow[] = [
  { clue: 'common noun', fills: 'a general thing', example: 'city, student, country' },
  { clue: 'proper noun', fills: 'a named thing — capital letter', example: 'Dhaka, Bangladesh, London' },
  { clue: 'countable', fills: 'can be one / two / many', example: 'one book, two books' },
  { clue: 'uncountable', fills: 'not counted with one / two', example: 'water, money, information, advice' },
];

const NOUN_CLUES: readonly IPatternRow[] = [
  { clue: 'a / an + ______', fills: 'singular countable noun', example: 'a teacher, an apple', wrong: 'a teachers, an informations' },
  { clue: 'the + ______', fills: 'noun, or adjective + noun', example: 'the car, the new policy' },
  { clue: 'many + ______', fills: 'plural countable noun', example: 'many books, many students', wrong: 'many book' },
  { clue: 'much + ______', fills: 'uncountable noun', example: 'much money, much information', wrong: 'much informations' },
  { clue: 'several + ______', fills: 'plural countable noun', example: 'several problems' },
  { clue: 'each / every + ______', fills: 'singular noun', example: 'each student, every day', wrong: 'every students' },
  { clue: 'both + ______', fills: 'plural noun', example: 'both countries, both students' },
  { clue: 'either / neither + ______', fills: 'singular noun', example: 'either option, neither answer' },
  { clue: 'a lot of / lots of + ______', fills: 'countable plural or uncountable', example: 'a lot of books, a lot of money' },
  { clue: 'few / a few + ______', fills: 'plural countable noun', example: 'few students, a few questions' },
  { clue: 'little / a little + ______', fills: 'uncountable noun', example: 'little money, a little water' },
  { clue: 'all + ______', fills: 'plural countable or uncountable', example: 'all students, all information' },
  { clue: 'no + ______', fills: 'noun — singular, plural or uncountable', example: 'no money, no students, no problem' },
  { clue: 'some / any + ______', fills: 'plural countable or uncountable', example: 'some books, some water, any questions' },
  { clue: 'two / three / five + ______', fills: 'plural countable noun', example: 'two books, five years', wrong: 'two book' },
  { clue: 'this / that + ______', fills: 'singular noun', example: 'this book, that car' },
  { clue: 'these / those + ______', fills: 'plural noun', example: 'these books, those cars' },
  { clue: 'my / your / his / her / its / our / their + ______', fills: 'noun', example: 'my book, their house' },
];

const AGREEMENT: readonly IPatternRow[] = [
  { clue: '______ is / was', fills: 'singular subject', example: 'The student is happy. The car was expensive.' },
  { clue: '______ are / were', fills: 'plural subject', example: 'The students are happy. The cars were expensive.' },
  { clue: 'is / was + ______', fills: 'adjective, or a / an + noun', example: 'He is happy. He is a teacher.' },
  { clue: 'are / were + ______', fills: 'adjective, or a plural noun', example: 'They are happy. They are students.' },
  { clue: 'there is + ______', fills: 'singular noun', example: 'There is a problem.' },
  { clue: 'there are + ______', fills: 'plural noun', example: 'There are many problems.' },
  { clue: 'every student + ______', fills: 'singular verb', example: 'Every student has a book.', wrong: 'Every student have a book.' },
];

const VERB_FORMS: readonly IPatternRow[] = [
  { clue: 'V1 — base', fills: 'the dictionary form', example: 'go, work, eat, write' },
  { clue: 'V2 — past simple', fills: 'finished, in the past', example: 'went, worked, ate, wrote' },
  { clue: 'V3 — past participle', fills: 'after have / has / had, and in the passive', example: 'gone, worked, eaten, written' },
  { clue: 'V-ing — gerund or continuous', fills: 'after be, after a preposition, or as a noun', example: 'going, working, eating' },
  { clue: 'V-s / es', fills: 'present simple, he / she / it', example: 'goes, works, eats, writes' },
];

const AUXILIARIES: readonly IPatternRow[] = [
  { clue: 'can / could / will / would / shall / should / may / might / must + ______', fills: 'base verb (V1)', example: 'can go, should study, must finish, might happen', wrong: 'can going, should studied, must working' },
  { clue: 'do / does / did + ______', fills: 'base verb (V1)', example: 'does work, do help, did go', wrong: 'does works, did went' },
  { clue: 'have / has / had + ______', fills: 'past participle (V3), or a noun', example: 'has finished, have gone, had completed — or has a car' },
  { clue: 'am / is / are / was / were + ______', fills: 'V-ing (continuous), V3 (passive), or an adjective / noun', example: 'is working, was constructed, is happy, is a teacher' },
];

const TO_ROWS: readonly IPatternRow[] = [
  { clue: 'want / need / decide / plan / hope / learn + to + ______', fills: 'base verb (V1) — infinitive', example: 'want to go, decided to leave, plan to travel', wrong: 'want to going, decided to left' },
  { clue: 'look forward to / object to / be used to + ______', fills: 'noun or V-ing — here to is a preposition', example: 'look forward to meeting, object to paying' },
];

const ADJECTIVES: readonly IPatternRow[] = [
  { clue: 'a / an + ______ + noun', fills: 'adjective', example: 'a beautiful city, an expensive car' },
  { clue: 'be + ______', fills: 'adjective (or noun)', example: 'The city is beautiful. The car is expensive.' },
  { clue: 'very + ______', fills: 'adjective or adverb', example: 'very good, very quickly' },
  { clue: 'too + ______', fills: 'adjective or adverb', example: 'too expensive, too quickly' },
  { clue: 'extremely / highly / really + ______', fills: 'adjective', example: 'extremely difficult, highly successful' },
  { clue: 'verb + ______', fills: 'adverb', example: 'work quickly, speak clearly, study hard' },
  { clue: 'adjective → adverb', fills: 'often add -ly', example: 'quick → quickly, careful → carefully', wrong: 'He speaks good. → He speaks well.' },
];

const PREPOSITIONS: readonly IPatternRow[] = [
  { clue: 'in / on / at / for / by / with / from / about / of + ______', fills: 'noun, pronoun or V-ing', example: 'in London, with friends, about education, by working' },
  { clue: 'for + ______', fills: 'noun, or V-ing (purpose)', example: 'a room for students, a machine for cutting' },
  { clue: 'by + ______', fills: 'V-ing when it names a method', example: 'learn English by practising' },
  { clue: 'without + ______', fills: 'noun or V-ing', example: 'without money, without speaking' },
  { clue: 'before / after + ______', fills: 'noun or V-ing', example: 'after lunch, after finishing, before leaving' },
  { clue: 'during / into / through / over / under / between / among + ______', fills: 'noun', example: 'during the lecture, between the two cities' },
];

const PRONOUNS: readonly IPair[] = [
  { english: 'I / you / he / she / it / we / they', bangla: 'কর্তা — He likes football.' },
  { english: 'me / you / him / her / it / us / them', bangla: 'কর্ম — I called him. They helped us.' },
];

const COMPARISON: readonly IPatternRow[] = [
  { clue: '______ than', fills: 'comparative adjective', example: 'bigger than, better than, more expensive than' },
  { clue: 'more + ______', fills: 'long adjective', example: 'more important, more difficult, more beautiful' },
  { clue: 'less + ______', fills: 'adjective', example: 'less expensive, less important' },
  { clue: 'the + ______', fills: 'superlative', example: 'the biggest, the best, the most expensive' },
];

const CONJUNCTIONS: readonly IPatternRow[] = [
  { clue: 'and / as well as', fills: 'addition — joins two of the same kind', example: 'students and teachers' },
  { clue: 'but / although / however', fills: 'contrast', example: 'Although he was tired, he continued.' },
  { clue: 'because + ______', fills: 'a clause — subject + verb', example: 'because it was raining' },
  { clue: 'because of + ______', fills: 'a noun', example: 'because of the rain', wrong: 'because of it was raining' },
  { clue: 'so / therefore', fills: 'result', example: 'It rained, so I stayed home.' },
  { clue: 'if + ______', fills: 'a clause', example: 'If it rains, I will stay home.' },
  { clue: 'unless + ______', fills: 'a clause — unless = if not', example: "Unless you study, you will not improve." },
  { clue: 'despite / in spite of + ______', fills: 'noun or V-ing', example: 'despite the rain, despite being tired', wrong: 'despite he was tired' },
  { clue: 'despite the fact that + ______', fills: 'a clause', example: 'despite the fact that he was tired' },
];

const RELATIVES: readonly IPatternRow[] = [
  { clue: 'who', fills: 'people', example: 'The man who helped me…' },
  { clue: 'which', fills: 'things', example: 'The book which I bought…' },
  { clue: 'that', fills: 'people or things', example: 'The car that I bought…' },
  { clue: 'whom', fills: 'people as the object', example: 'The person whom I called…' },
  { clue: 'whose', fills: 'possession', example: 'The student whose book was lost…' },
];

const VERB_PATTERNS: readonly IPatternRow[] = [
  { clue: 'enjoy / avoid / finish / keep / suggest + ______', fills: 'V-ing', example: 'enjoy reading, avoid talking, finish working' },
  { clue: 'want / need / decide / hope / plan / learn + ______', fills: 'to + V1', example: 'want to go, hope to win, learn to speak' },
  { clue: 'make / let + object + ______', fills: 'base verb (V1) — no to', example: 'make him work, let me go', wrong: 'make him to work' },
  { clue: 'allow + object + ______', fills: 'to + V1', example: 'allow him to go, allow students to use phones' },
  { clue: 'want + object + ______', fills: 'to + V1', example: 'I want him to come. She wants me to help.' },
  { clue: '______ (as subject or object)', fills: 'V-ing as a noun — gerund', example: 'Swimming is good exercise. I enjoy reading.' },
];

const DEGREE: readonly IPatternRow[] = [
  { clue: 'too + adjective + to + ______', fills: 'V1', example: 'too difficult to understand, too expensive to buy' },
  { clue: 'adjective + enough + to + ______', fills: 'V1', example: 'strong enough to carry, old enough to drive' },
  { clue: 'enough + ______', fills: 'noun', example: 'enough money, enough time' },
  { clue: 'so + adjective + that + ______', fills: 'a clause', example: 'so expensive that I could not buy it' },
  { clue: 'such + (a / an) + adjective + noun + that', fills: 'a clause', example: 'such a difficult problem that nobody finished' },
];

const QUANTITY: readonly IPatternRow[] = [
  { clue: 'one of the + ______', fills: 'plural noun', example: 'one of the students, one of the best books' },
  { clue: 'one of the + plural noun + ______', fills: 'singular verb', example: 'One of the students is absent.', wrong: 'One of the students are absent.' },
  { clue: 'a number of + ______', fills: 'plural noun + plural verb', example: 'A number of students are absent.' },
  { clue: 'the number of + ______', fills: 'plural noun + singular verb', example: 'The number of students is increasing.' },
  { clue: 'few', fills: 'almost none — negative', example: 'few students came' },
  { clue: 'a few', fills: 'some — enough', example: 'a few students came' },
  { clue: 'little', fills: 'almost none — uncountable, negative', example: 'little money, little time' },
  { clue: 'a little', fills: 'some — uncountable', example: 'a little water, a little time' },
];

const COMPOUNDS: readonly IPatternRow[] = [
  { clue: 'noun + noun', fills: 'the first noun describes the second', example: 'school bus, coffee shop, computer science' },
  { clue: 'adjective + noun', fills: 'the adjective describes the noun', example: 'beautiful city, important decision' },
  { clue: 'an expensive ______', fills: 'singular countable noun', example: 'an expensive car' },
  { clue: 'adverb + adjective', fills: 'the adverb modifies the adjective', example: 'very important, extremely difficult' },
  { clue: 'a five-year-old ______', fills: 'singular noun — the measure stays singular inside the compound adjective', example: 'a five-year-old child', wrong: 'a five-years-old child' },
];

const PASSIVE: readonly IPatternRow[] = [
  { clue: 'be + ______', fills: 'V3', example: 'The building was constructed. The product is made in China.' },
  { clue: 'modal + be + ______', fills: 'V3', example: 'can be used, should be completed, must be done' },
  { clue: 'has / have / had + been + ______', fills: 'V3', example: 'has been completed, have been built' },
  { clue: 'be + being + ______', fills: 'V3', example: 'is being built, are being developed' },
];

const CONDITIONALS: readonly IPatternRow[] = [
  { clue: 'zero — if + present, present', fills: 'a fact', example: 'If you heat ice, it melts.' },
  { clue: 'first — if + present, will + V1', fills: 'a real future', example: 'If you study, you will pass.' },
  { clue: 'second — if + V2, would + V1', fills: 'unreal present', example: 'If I had money, I would travel.' },
  { clue: 'third — if + had + V3, would have + V3', fills: 'unreal past', example: 'If I had studied, I would have passed.' },
];

const QUESTIONS: readonly IPatternRow[] = [
  { clue: 'what', fills: 'a thing or a subject', example: 'What do you want?' },
  { clue: 'who', fills: 'a person', example: 'Who called you?' },
  { clue: 'whom', fills: 'a person as the object', example: 'Whom did you call?' },
  { clue: 'whose', fills: 'ownership', example: 'Whose book is this?' },
  { clue: 'which', fills: 'a choice among a few', example: 'Which one do you like?' },
  { clue: 'where', fills: 'a place', example: 'Where do you live?' },
  { clue: 'when', fills: 'a time', example: 'When did he arrive?' },
  { clue: 'why', fills: 'a reason', example: 'Why did you leave?' },
  { clue: 'how', fills: 'a manner, or an amount', example: 'How did you do it? How many students came?' },
];

const BLANK_BEFORE: readonly IPatternRow[] = [
  { clue: 'a / an ______', fills: 'singular countable noun', example: 'He is a ______.' },
  { clue: 'very ______', fills: 'adjective or adverb', example: 'The problem is very ______.' },
  { clue: 'my / your / their ______', fills: 'noun', example: 'my ______' },
  { clue: 'many / several / both / few / these ______', fills: 'plural noun', example: 'many ______' },
  { clue: 'much / little / this ______', fills: 'uncountable or singular', example: 'much ______' },
  { clue: 'each / every / either / neither ______', fills: 'singular noun', example: 'every ______' },
  { clue: 'can / should / must / did ______', fills: 'V1', example: 'can ______' },
  { clue: 'to ______ (after want / decide)', fills: 'V1', example: 'want to ______' },
  { clue: 'has / have / had ______', fills: 'V3, or a noun', example: 'has ______' },
  { clue: 'by / without / before / after ______', fills: 'V-ing or a noun', example: 'by ______' },
];

const BLANK_AFTER: readonly IPatternRow[] = [
  { clue: '______ are / were', fills: 'plural subject', example: '______ are available.' },
  { clue: '______ is / was', fills: 'singular subject', example: '______ is available.' },
  { clue: '______ students / books', fills: 'adjective, or a determiner', example: 'new students, these students' },
  { clue: 'verb + ______', fills: 'adverb', example: 'speak clearly, work quickly' },
];

const MASTER_CLUES: readonly IMasterClue[] = [
  { clue: 'a / an + ______', fills: 'singular countable noun' },
  { clue: 'the + ______', fills: 'noun, or adjective + noun' },
  { clue: 'many / several / both / few / these / those / two + ______', fills: 'plural noun' },
  { clue: 'much / little + ______', fills: 'uncountable noun' },
  { clue: 'each / every / either / neither / this / that / one + ______', fills: 'singular noun' },
  { clue: 'my / your / his / her / its / our / their + ______', fills: 'noun' },
  { clue: 'can / could / will / would / should / must / may / might + ______', fills: 'V1' },
  { clue: 'do / does / did + ______', fills: 'V1' },
  { clue: 'to + ______ (infinitive)', fills: 'V1' },
  { clue: 'have / has / had + ______', fills: 'V3 (or a noun)' },
  { clue: 'am / is / are / was / were + ______', fills: 'V-ing, adjective, or V3' },
  { clue: 'very / too / extremely + ______', fills: 'adjective or adverb' },
  { clue: 'preposition + ______', fills: 'noun or V-ing' },
  { clue: 'by / without / before / after + ______', fills: 'V-ing (or a noun)' },
  { clue: 'because + ______', fills: 'subject + verb' },
  { clue: 'because of / despite + ______', fills: 'noun or V-ing' },
  { clue: 'one of the + ______', fills: 'plural noun + singular verb' },
  { clue: 'a number of + ______', fills: 'plural noun + plural verb' },
  { clue: 'the number of + ______', fills: 'plural noun + singular verb' },
  { clue: 'there is / there are + ______', fills: 'singular noun / plural noun' },
  { clue: '______ is', fills: 'singular subject' },
  { clue: '______ are', fills: 'plural subject' },
];

const WORKED: readonly IBreakdown[] = [
  { word: 'because', role: 'conjunction — a clause starts here' },
  { word: 'materials', role: 'plural noun — the subject of are' },
  { word: 'for', role: 'preposition' },
  { word: 'sculpting', role: 'gerund (V-ing as a noun) — the object of for' },
  { word: 'are', role: 'plural verb — agrees with materials' },
  { word: 'not', role: 'negation' },
  { word: 'readily', role: 'adverb — modifies available' },
  { word: 'available', role: 'adjective — complement of are' },
];

const PRIORITY: readonly string[] = [
  'a / an + noun',
  'the + noun',
  'many + plural noun',
  'much + uncountable noun',
  'each / every + singular noun',
  'both + plural noun',
  'can / should / must + V1',
  'to + V1',
  'do / does / did + V1',
  'have / has / had + V3',
  'very + adjective / adverb',
  'preposition + noun / V-ing',
  '______ + is → singular subject',
  '______ + are → plural subject',
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

function PatternTable({
  caption,
  rows,
}: {
  readonly caption: string;
  readonly rows: readonly IPatternRow[];
}): ReactElement {
  const hasWrong = rows.some((row) => row.wrong !== undefined);

  return (
    <Table
      caption={caption}
      headings={hasWrong ? ['Pattern', 'The blank takes', 'Example', 'The trap'] : ['Pattern', 'The blank takes', 'Example']}
    >
      {rows.map((row) => (
        <tr className="border-b border-hairline last:border-b-0" key={row.clue}>
          <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.clue}</td>
          <td className="px-3 py-2 text-primary-900">{row.fills}</td>
          <td className="px-3 py-2 text-muted">{row.example}</td>
          {hasWrong && (
            <td className="px-3 py-2 font-mono text-[12px] text-tertiary-700">{row.wrong ?? '—'}</td>
          )}
        </tr>
      ))}
    </Table>
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
 * The twenty-two most useful clues, as a table a landing page can show without
 * the rest of the chart. Same rows the reference ends on — one source.
 *
 * `limit` is for the marketing page, which wants a sample rather than the
 * whole formula. The reference page omits it.
 */
export function MasterClueTable({ limit }: { readonly limit?: number }): ReactElement {
  const rows = limit === undefined ? MASTER_CLUES : MASTER_CLUES.slice(0, limit);

  return (
    <Table caption="The gap-fill clues that name the word in the blank" headings={['The words around the blank', 'What fits']}>
      {rows.map((row) => (
        <tr className="border-b border-hairline last:border-b-0" key={row.clue}>
          <td className="px-3 py-2 font-mono text-[12px] text-primary-900">{row.clue}</td>
          <td className="px-3 py-2 text-muted">{row.fills}</td>
        </tr>
      ))}
    </Table>
  );
}

/**
 * The sentence that started this chart, taken apart so the method is visible.
 */
export function WorkedGapExample(): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-base tracking-tight text-primary-900">
        Moore turns to drawing because{' '}
        <span className="border-b-2 border-primary-900">materials</span> for sculpting are not
        readily available.
      </p>
      <p className="font-bengali text-primary-900" lang="bn">
        are আছে বলে blank-এর subject plural। for sculpting blank-এর পরে prepositional phrase — তাই
        blank-এ একটি plural noun, materials।
      </p>
      <Table caption="Word-by-word breakdown of the worked gap-fill sentence" headings={['Word', 'Job in the sentence']}>
        {WORKED.map((row) => (
          <tr className="border-b border-hairline last:border-b-0" key={row.word}>
            <td className="px-3 py-2 font-mono text-primary-900">{row.word}</td>
            <td className="px-3 py-2 text-muted">{row.role}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

/**
 * The whole reference, in the order it has to be read: what the parts of
 * speech *are*, then every pattern that names one of them from the words
 * around a blank, then how to walk a sentence when the exam puts a hole in it.
 */
export function GrammarPatternGuide(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <p className="max-w-3xl text-neutral-700">
          In IELTS gap-fill — sentence completion, summary completion, notes — the blank is not a
          guess. The words on either side of it name the kind of word that can sit there: a
          singular noun, a plural, a base verb, a gerund, an adjective. Read those words first.
        </p>
        <p className="max-w-3xl font-bengali text-primary-900" lang="bn">
          IELTS gap-fill-এ blank দেখেই বোঝা যায় কোন ধরনের word বসবে — noun, verb, adjective,
          singular, plural, V1, V-ing, V3। আগে চারপাশের word পড়ো, তারপর উত্তর খোঁজো।
        </p>
      </section>

      <nav aria-label="Sections of the chart">
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
        bangla="English-এর word-গুলোকে তাদের কাজ অনুযায়ী ভাগ করা হয়। এগুলোকে বলে Parts of Speech।"
        id="parts-of-speech"
        title="1. Parts of speech"
      >
        <Table
          caption="The eight parts of speech, what each one does, and an example"
          headings={['Part of speech', 'বাংলা', 'What it does', 'Example']}
        >
          {PARTS.map((row) => (
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
        bangla="Noun হলো ব্যক্তি, জায়গা, জিনিস, প্রাণী বা ধারণার নাম। IELTS-এ countable আর uncountable আলাদা করা সবচেয়ে দরকারি।"
        id="nouns"
        title="2. Nouns — types, number, and the clues that name them"
      >
        <h3 className="font-display text-base tracking-tight text-primary-900">Kinds of noun</h3>
        <PatternTable caption="The four kinds of noun that matter in a gap-fill" rows={NOUN_TYPES} />
        <p className="text-muted">
          Uncountable nouns do not take a plural -s, and they do not take{' '}
          <span className="font-mono text-primary-900">a / an</span> or a number.{' '}
          <span className="font-mono text-tertiary-700">two informations</span> is the trap;{' '}
          <span className="font-mono text-mastered">two pieces of information</span> is the repair.
        </p>
        <h3 className="font-display text-base tracking-tight text-primary-900">Singular and plural</h3>
        <p className="text-muted">
          Regular plurals add -s or -es: book → books, box → boxes. A y after a consonant becomes
          ies: city → cities, country → countries. The exam uses number more often than spelling —
          if the verb is <span className="font-mono text-primary-900">are</span>, the noun in the
          blank is already plural.
        </p>
        <h3 className="font-display text-base tracking-tight text-primary-900">Clues in front of a noun</h3>
        <PatternTable caption="Determiners and quantifiers and the noun each one requires" rows={NOUN_CLUES} />
      </Section>

      <Section
        bangla="Singular subject-এর সাথে is/was, plural-এর সাথে are/were। Blank-এর পরে are থাকলে blank-এ plural subject।"
        id="agreement"
        title="3. Subject–verb agreement"
      >
        <PatternTable caption="How the verb next to a blank names the number of the subject" rows={AGREEMENT} />
      </Section>

      <Section
        bangla="একটা verb-এর পাঁচটা form: V1, V2, V3, V-ing, V-s/es। Gap-fill-এ চারপাশের auxiliary বলে কোন form লাগবে।"
        id="verbs"
        title="4. Verb forms"
      >
        <PatternTable caption="The five forms of an English verb" rows={VERB_FORMS} />
        <p className="text-muted">
          Regular example: work → worked → worked → working → works. Irregular example: go → went →
          gone → going → goes. The chart never asks you to invent a third form — it asks you to
          recognise which slot the sentence has opened.
        </p>
      </Section>

      <Section
        bangla="Modal-এর পরে V1। do/does/did-এর পরেও V1। have/has/had-এর পরে V3 অথবা noun। be-এর পরে V-ing, adjective, অথবা V3।"
        id="auxiliaries"
        title="5. Modals and auxiliaries"
      >
        <PatternTable
          caption="What follows a modal, do/does/did, have/has/had, and be"
          rows={AUXILIARIES}
        />
      </Section>

      <Section
        bangla="to সবসময় V1 নেয় না। Infinitive হলে V1; preposition হলে noun বা V-ing। Context দেখতে হবে।"
        id="to"
        title="6. to — infinitive or preposition"
      >
        <PatternTable caption="When to takes a base verb and when it takes a gerund" rows={TO_ROWS} />
        <p className="text-muted">
          Do not memorise &quot;to = V1&quot;. Read the verb in front of it. want / decide / plan
          take the infinitive. look forward to / object to / be used to take a gerund, because that
          to is a preposition.
        </p>
      </Section>

      <Section
        bangla="Adjective noun-কে describe করে। Adverb verb/adjective-কে। very ও too-এর পরে adjective বা adverb।"
        id="adjectives"
        title="7. Adjectives and adverbs"
      >
        <PatternTable caption="Where an adjective sits, and where an adverb does" rows={ADJECTIVES} />
        <p className="text-muted">
          Many adverbs end in -ly, but not all of them: hard, fast, well. The pair that costs marks
          is good / well — <span className="font-mono text-tertiary-700">He speaks good</span> is
          the adjective where the adverb belongs;{' '}
          <span className="font-mono text-mastered">He speaks well</span> is the repair.
        </p>
      </Section>

      <Section
        bangla="a/an singular countable। the noun-এর আগে। this/that singular, these/those plural। some/any plural বা uncountable।"
        id="determiners"
        title="8. Articles and other determiners"
      >
        <p className="text-muted">
          The noun-clue table above is the whole of this section — a / an, the, this / that / these
          / those, some / any / no, my / your / their. They are listed there because they all do
          the same job: they sit in front of a noun and tell you its number. What remains is one
          compound-adjective trap: a number plus a unit inside a hyphenated adjective stays
          singular — <span className="font-mono text-mastered">a five-year-old child</span>, not{' '}
          <span className="font-mono text-tertiary-700">a five-years-old child</span> — even though{' '}
          <span className="font-mono text-primary-900">five years</span> is plural on its own.
        </p>
      </Section>

      <Section
        bangla="Preposition-এর পরে noun, pronoun অথবা V-ing। by + V-ing পদ্ধতি বোঝায়। for + noun/V-ing উদ্দেশ্য বোঝায়।"
        id="prepositions"
        title="9. Prepositions"
      >
        <PatternTable caption="What a preposition takes after it" rows={PREPOSITIONS} />
      </Section>

      <Section
        bangla="Pronoun noun-এর জায়গায় বসে। Subject আর object আলাদা। Possessive-এর পরে noun।"
        id="pronouns"
        title="10. Pronouns and possessives"
      >
        <Table caption="Subject and object pronouns" headings={['Forms', 'Role']}>
          {PRONOUNS.map((row) => (
            <tr className="border-b border-hairline last:border-b-0" key={row.english}>
              <td className="px-3 py-2 font-mono text-primary-900">{row.english}</td>
              <td className="px-3 py-2 font-bengali text-muted" lang="bn">
                {row.bangla}
              </td>
            </tr>
          ))}
        </Table>
        <p className="text-muted">
          Possessives — my, your, his, her, its, our, their — take a noun:{' '}
          <span className="font-mono text-primary-900">my book, their house</span>. its is the
          possessive; it&apos;s is it is. The exam uses that pair.
        </p>
      </Section>

      <Section
        bangla="দুই জিনিস compare করলে comparative। তিন বা তার বেশি হলে the + superlative। Long adjective-এ more/most।"
        id="comparison"
        title="11. Comparison"
      >
        <PatternTable caption="Comparative and superlative patterns" rows={COMPARISON} />
      </Section>

      <Section
        bangla="because-এর পরে clause। because of-এর পরে noun। although-এর পরে clause। despite-এর পরে noun বা V-ing।"
        id="conjunctions"
        title="12. Conjunctions and clause connectors"
      >
        <PatternTable caption="What each conjunction or prepositional connector takes after it" rows={CONJUNCTIONS} />
        <h3 className="font-display text-base tracking-tight text-primary-900">Relative pronouns</h3>
        <PatternTable caption="who, which, that, whom, whose and what they attach to" rows={RELATIVES} />
      </Section>

      <Section
        bangla="কিছু verb-এর পরে V-ing, কিছু verb-এর পরে to + V1। make/let-এর পরে object + V1 (to নেই)। allow/want-এর পরে object + to V1।"
        id="verb-patterns"
        title="13. Verb patterns — gerund, infinitive, make / let / allow"
      >
        <PatternTable caption="What common verbs take after them" rows={VERB_PATTERNS} />
      </Section>

      <Section
        bangla="too + adjective + to V1। adjective + enough + to V1। enough + noun। so + adjective + that। such + noun + that।"
        id="degree"
        title="14. too, enough, so, such"
      >
        <PatternTable caption="Degree patterns that open a blank" rows={DEGREE} />
      </Section>

      <Section
        bangla="one of the + plural noun + singular verb। a number of + are। the number of + is। few/a few plural; little/a little uncountable।"
        id="quantity"
        title="15. Quantity traps — one of, a number of, few / little"
      >
        <PatternTable caption="Quantity phrases and the verb each one requires" rows={QUANTITY} />
        <p className="text-muted">
          The pair the exam writes on purpose:{' '}
          <span className="font-mono text-primary-900">a number of students are</span> against{' '}
          <span className="font-mono text-primary-900">the number of students is</span>. The noun
          after of is plural in both; only the article in front of number changes the verb.
        </p>
      </Section>

      <Section
        bangla="Noun অন্য noun-কে describe করতে পারে: school bus। Adjective + noun খুব common। Adverb adjective-কে modify করে।"
        id="compounds"
        title="16. Noun + noun, adjective + noun"
      >
        <PatternTable caption="How one word describes another without a verb" rows={COMPOUNDS} />
      </Section>

      <Section
        bangla="Passive: be + V3। Modal passive: modal + be + V3। Perfect: has been + V3। Continuous: is being + V3।"
        id="passive"
        title="17. Passive voice"
      >
        <PatternTable caption="The four passive shapes that appear in gap-fill" rows={PASSIVE} />
      </Section>

      <Section
        bangla="Zero: সত্য। First: বাস্তব ভবিষ্যৎ। Second: কল্পিত বর্তমান। Third: কল্পিত অতীত।"
        id="conditionals"
        title="18. Conditionals"
      >
        <PatternTable caption="The four conditional patterns" rows={CONDITIONALS} />
      </Section>

      <Section
        bangla="প্রশ্নের প্রথম word বলে উত্তর কী ধরনের — ব্যক্তি, জায়গা, সময়, কারণ, জিনিস।"
        id="questions"
        title="19. Question words"
      >
        <PatternTable caption="WH-words and the kind of answer each one names" rows={QUESTIONS} />
      </Section>

      <Section
        bangla="Blank দেখলে এই ক্রমে check করো: আগে কী আছে, পরে কী আছে, verb-এর clue, তারপর number-এর clue।"
        id="how-to-read"
        title="20. How to read a blank"
      >
        <ol className="flex max-w-3xl list-decimal flex-col gap-2 pl-5 text-neutral-700">
          <li>
            <span className="font-medium text-primary-900">What is in front of the hole?</span>{' '}
            a, many, can, has, very, my, by — each one already names a part of speech.
          </li>
          <li>
            <span className="font-medium text-primary-900">What is after the hole?</span> are, is,
            quickly, students — the verb&apos;s number, or the noun the blank is describing.
          </li>
          <li>
            <span className="font-medium text-primary-900">Is there an auxiliary?</span> can / should
            / did → V1. has / have / had → V3. is / are + no object → adjective, V-ing, or passive
            V3. Read the rest of the clause before you choose among those three.
          </li>
          <li>
            <span className="font-medium text-primary-900">Is there a number word?</span> a / an /
            one / each / every / this / that → singular. many / several / both / few / two / these /
            those → plural.
          </li>
        </ol>
        <h3 className="font-display text-base tracking-tight text-primary-900">Clues before the blank</h3>
        <PatternTable caption="What the word in front of a blank usually requires" rows={BLANK_BEFORE} />
        <h3 className="font-display text-base tracking-tight text-primary-900">Clues after the blank</h3>
        <PatternTable caption="What the word after a blank usually requires" rows={BLANK_AFTER} />
        <p className="text-muted">
          These are strong clues, not mechanical laws. to is V1 after decide and V-ing after look
          forward to. is can be an adjective, a continuous, or a passive. Always finish the
          sentence before you lock the answer.
        </p>
      </Section>

      <Section
        bangla="মূল বাক্যটা ভেঙে দেখা — materials for sculpting are not readily available।"
        id="worked"
        title="21. One sentence, taken apart"
      >
        <WorkedGapExample />
      </Section>

      <Section
        bangla="এগুলো আগে মুখস্থ করার মতো নয় — চেনার মতো। Screenshot করে রাখতে পারো। Context অনুযায়ী কিছু pattern বদলায়।"
        id="master"
        title="22. Master formula"
      >
        <p className="text-muted">Learn these first. They cover most of the holes the paper actually writes.</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {PRIORITY.map((item) => (
            <li className="font-mono text-[12px] text-primary-900" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <MasterClueTable />
      </Section>
    </div>
  );
}
