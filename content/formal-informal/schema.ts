import { z } from 'zod';

/**
 * Informal → formal register pairs, with British IPA and a Bangla gloss each side.
 *
 * **What this is, and why it is not the IELTS vocabulary.** That corpus answers
 * "which synonym earns the band". This answers a different question: *I said
 * **ask** to a stranger and I should have said **enquire***. The pairing is
 * register, not synonymy — `ask` and `enquire` mean the same thing; one is
 * what you say to a friend and the other is what you write in a letter. Mixing
 * the two lists would put two lessons on one card.
 *
 * **Why this is not another week of the course.** Nothing here is drilled,
 * marked, or seeded into `words`. Folding three hundred untaught pairs into
 * the exam pool is the same reason the IELTS vocabulary stays apart.
 *
 * **Why an entry is one string.** Six fields on one line so a reviewer can
 * scan a hundred of them. Written as an object literal this corpus would be
 * four thousand lines of punctuation. The string is parsed here, at load.
 *
 * **IPA is British RP**, matching `accent_preference`'s default and the
 * 28-day corpus. Slash brackets are added on the screen, never stored.
 * Bangla is the meaning of that side of the pair, in real script — the two
 * sides often share a meaning and still get their own column, because the
 * formal word is the one a learner is reaching for and they look it up by
 * the informal one they already have.
 *
 * Line: `informal | formal | informalIpa | formalIpa | informalBn | formalBn`
 * An optional seventh field `review` flags a transcription that is a
 * standard reading rather than a checked dictionary pull.
 */

export const FORMAL_INFORMAL_TOPICS = [
  'common',
  'verbs',
  'nouns',
  'adjectives',
  'slang',
  'abbreviations',
  'business',
  'academic',
  'social',
  'variety',
  'more',
] as const;

export type FormalInformalTopic = (typeof FORMAL_INFORMAL_TOPICS)[number];

/**
 * A word or a short phrase, or a spoken abbreviation.
 *
 * Letters, digits, an internal hyphen, space, apostrophe, ampersand or
 * full stop — `ask out`, `y'all`, `r&d`, `misc.`  Upper case is folded
 * before parse so `ASAP` and `asap` cannot become two entries.
 */
const TERM = /^[a-z0-9]+(?:[- '&./][a-z0-9]+)*\.?$/u;

/**
 * British IPA as the course stores it: no slashes, stress marks allowed,
 * spaces so a phrase can be transcribed as the phrase it is.
 */
const IPA = /^[a-zɪɛæɑɒɔʊʌəɜːˈˌθðʃʒŋɡʲ\s.\-()]+$/u;

const BANGLA = /[\u0980-\u09FF]/u;

export interface IFormalInformalPair {
  readonly informal: string;
  readonly formal: string;
  readonly informalIpa: string;
  readonly formalIpa: string;
  readonly informalBn: string;
  readonly formalBn: string;
  readonly topic: FormalInformalTopic;
  readonly needsReview: boolean;
}

export interface IRawFormalInformalGroup {
  readonly topic: FormalInformalTopic;
  readonly entries: readonly string[];
}

export const rawFormalInformalGroupSchema = z.object({
  topic: z.enum(FORMAL_INFORMAL_TOPICS),
  entries: z.array(z.string().min(1)).min(1),
});

export interface IParseFailure {
  readonly path: string;
  readonly message: string;
}

function cleanTerm(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/gu, ' ');
}

/**
 * Parses one line into a pair, or reports why it cannot be.
 *
 * The checks that matter are the ones a careless edit slips past: a formal
 * that *is* the informal (which renders as a card teaching that `ask` means
 * `ask`), an empty IPA, Bangla that is Latin, and a line with the wrong
 * number of fields. None of these throw — the caller collects every issue.
 */
export function parseFormalInformalPair(
  line: string,
  topic: FormalInformalTopic,
): { readonly pair: IFormalInformalPair | null; readonly issues: readonly IParseFailure[] } {
  const fields = line.split('|').map((field) => field.trim());
  const issues: IParseFailure[] = [];

  if (fields.length !== 6 && fields.length !== 7) {
    return {
      pair: null,
      issues: [
        {
          path: line,
          message: 'is not an "informal | formal | informalIpa | formalIpa | informalBn | formalBn" line',
        },
      ],
    };
  }

  const informal = cleanTerm(fields[0] ?? '');
  const formal = cleanTerm(fields[1] ?? '');
  const informalIpa = (fields[2] ?? '').trim();
  const formalIpa = (fields[3] ?? '').trim();
  const informalBn = (fields[4] ?? '').trim();
  const formalBn = (fields[5] ?? '').trim();
  const flag = (fields[6] ?? '').trim().toLowerCase();
  const path = informal === '' ? line : informal;

  if (!TERM.test(informal)) {
    issues.push({ path, message: `"${informal}" is not a lower-case English term` });
  }

  if (!TERM.test(formal)) {
    issues.push({ path, message: `"${formal}" is not a lower-case English term` });
  }

  if (informal !== '' && informal === formal) {
    issues.push({ path, message: 'the formal side is the informal side' });
  }

  if (!IPA.test(informalIpa)) {
    issues.push({ path, message: `informal IPA "${informalIpa}" is not a British transcription` });
  }

  if (!IPA.test(formalIpa)) {
    issues.push({ path, message: `formal IPA "${formalIpa}" is not a British transcription` });
  }

  if (!BANGLA.test(informalBn)) {
    issues.push({ path, message: 'informal Bangla is missing real script' });
  }

  if (!BANGLA.test(formalBn)) {
    issues.push({ path, message: 'formal Bangla is missing real script' });
  }

  if (flag !== '' && flag !== 'review') {
    issues.push({ path, message: `seventh field must be "review" or empty, not "${flag}"` });
  }

  if (issues.length > 0) {
    return { pair: null, issues };
  }

  return {
    pair: {
      informal,
      formal,
      informalIpa,
      formalIpa,
      informalBn,
      formalBn,
      topic,
      needsReview: flag === 'review',
    },
    issues: [],
  };
}
