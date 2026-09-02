import { z } from 'zod';

/**
 * Saifur's-style admission vocabulary — one headword, two accents, a Bangla
 * gloss, and the rest of a study card.
 *
 * **What this is, and why it is not the IELTS vocabulary.** That corpus answers
 * "which synonym earns the band". This answers a different question: *I am
 * learning this word the way a Bangladeshi admission book teaches it* — meaning,
 * synonyms, antonyms, a sentence, and how it is said in British and American
 * English. Mixing the two lists would put a band-swap lesson on a study card.
 *
 * **Why this is not a copy of a printed book.** The *shape* is the one learners
 * already know (word, pronunciation, Bangla, synonym, antonym, sentence). The
 * entries are original: public-dictionary words with checked IPA and real
 * Bangla script, not a transcription of any copyrighted list.
 *
 * **Why an entry is one string.** Nine fields on one line so a reviewer can
 * scan a hundred of them. Written as an object literal this corpus would be
 * five thousand lines of punctuation.
 *
 * Line: `word | pos | ipaBr | ipaUs | bangla | synonyms | antonyms | exampleEn | exampleBn`
 * Synonyms and antonyms are comma-separated. An antonym field of `-` means
 * the word has no useful opposite. An optional tenth field `review` flags a
 * transcription that is a standard reading rather than a checked pull.
 */

export const SAIFURS_POS_TAGS = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
} as const;

export type SaifursPosTag = keyof typeof SAIFURS_POS_TAGS;
export type SaifursPos = (typeof SAIFURS_POS_TAGS)[SaifursPosTag];

export const SAIFURS_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const;

export type SaifursLetter = (typeof SAIFURS_LETTERS)[number];

const WORD = /^[a-z]+(?:-[a-z]+)*$/u;
const POS = /^(n|v|adj|adv)$/u;
/**
 * British RP and General American. Slash brackets are added on the screen.
 * Rhotic vowels (ɚ ɝ), the flap (ɾ) and the length mark are allowed so one
 * character class covers both accents.
 */
const IPA = /^[a-zɪɛæɑɒɔʊʌəɜɚɝːˈˌθðʃʒŋɡʲɾɨ\s.\-()]+$/u;
const BANGLA = /[\u0980-\u09FF]/u;
const TERM = /^[a-z]+(?:[ -][a-z]+)*$/u;

export interface ISaifursEntry {
  readonly word: string;
  readonly partOfSpeech: SaifursPos;
  readonly ipaBr: string;
  readonly ipaUs: string;
  readonly bangla: string;
  readonly synonyms: readonly string[];
  readonly antonyms: readonly string[];
  readonly exampleEn: string;
  readonly exampleBn: string;
  readonly needsReview: boolean;
}

export interface IRawSaifursGroup {
  readonly letter: SaifursLetter;
  readonly entries: readonly string[];
}

export const rawSaifursGroupSchema = z.object({
  letter: z.enum(SAIFURS_LETTERS),
  entries: z.array(z.string().min(1)).min(1),
});

export interface IParseFailure {
  readonly path: string;
  readonly message: string;
}

function splitTerms(raw: string): readonly string[] {
  return raw
    .split(',')
    .map((term) => term.trim().toLowerCase().replace(/\s+/gu, ' '))
    .filter((term) => term !== '');
}

/**
 * Parses one line into an entry, or reports why it cannot be.
 */
export function parseSaifursEntry(
  line: string,
  letter: SaifursLetter,
): { readonly entry: ISaifursEntry | null; readonly issues: readonly IParseFailure[] } {
  const fields = line.split('|').map((field) => field.trim());
  const issues: IParseFailure[] = [];

  if (fields.length !== 9 && fields.length !== 10) {
    return {
      entry: null,
      issues: [
        {
          path: line,
          message:
            'is not a "word | pos | ipaBr | ipaUs | bangla | synonyms | antonyms | exampleEn | exampleBn" line',
        },
      ],
    };
  }

  const word = (fields[0] ?? '').trim().toLowerCase();
  const posTag = (fields[1] ?? '').trim().toLowerCase();
  const ipaBr = (fields[2] ?? '').trim();
  const ipaUs = (fields[3] ?? '').trim();
  const bangla = (fields[4] ?? '').trim();
  const synonymField = (fields[5] ?? '').trim();
  const antonymField = (fields[6] ?? '').trim();
  const exampleEn = (fields[7] ?? '').trim();
  const exampleBn = (fields[8] ?? '').trim();
  const flag = (fields[9] ?? '').trim().toLowerCase();
  const path = word === '' ? line : word;

  if (!WORD.test(word)) {
    issues.push({ path, message: `"${word}" is not a lower-case English headword` });
  }

  if (!POS.test(posTag)) {
    issues.push({ path, message: `"${posTag}" is not n, v, adj or adv` });
  }

  const expectedLetter = word.charAt(0).toUpperCase();

  if (word !== '' && expectedLetter !== letter) {
    issues.push({
      path,
      message: `begins with "${expectedLetter}" but is filed under ${letter}`,
    });
  }

  if (!IPA.test(ipaBr)) {
    issues.push({ path, message: `British IPA "${ipaBr}" is not a valid transcription` });
  }

  if (!IPA.test(ipaUs)) {
    issues.push({ path, message: `American IPA "${ipaUs}" is not a valid transcription` });
  }

  if (!BANGLA.test(bangla)) {
    issues.push({ path, message: 'Bangla meaning is missing real script' });
  }

  const synonyms = splitTerms(synonymField);

  if (synonyms.length === 0) {
    issues.push({ path, message: 'needs at least one synonym' });
  }

  for (const synonym of synonyms) {
    if (!TERM.test(synonym)) {
      issues.push({ path, message: `synonym "${synonym}" is not a lower-case English term` });
    }
  }

  const antonyms = antonymField === '-' ? [] : splitTerms(antonymField);

  if (antonymField !== '-' && antonyms.length === 0) {
    issues.push({ path, message: 'antonyms are empty — use "-" when there is no opposite' });
  }

  for (const antonym of antonyms) {
    if (!TERM.test(antonym)) {
      issues.push({ path, message: `antonym "${antonym}" is not a lower-case English term` });
    }
  }

  if (exampleEn === '') {
    issues.push({ path, message: 'English example is missing' });
  } else if (word !== '' && !new RegExp(`\\b${word}\\b`, 'iu').test(exampleEn)) {
    issues.push({ path, message: `English example does not contain "${word}"` });
  }

  if (!BANGLA.test(exampleBn)) {
    issues.push({ path, message: 'Bangla example is missing real script' });
  }

  if (flag !== '' && flag !== 'review') {
    issues.push({ path, message: `tenth field must be "review" or empty, not "${flag}"` });
  }

  if (issues.length > 0 || !POS.test(posTag)) {
    return { entry: null, issues };
  }

  const partOfSpeech = SAIFURS_POS_TAGS[posTag as SaifursPosTag];

  return {
    entry: {
      word,
      partOfSpeech,
      ipaBr,
      ipaUs,
      bangla,
      synonyms,
      antonyms,
      exampleEn,
      exampleBn,
      needsReview: flag === 'review',
    },
    issues: [],
  };
}
