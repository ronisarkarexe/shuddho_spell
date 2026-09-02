import { WORDS_A } from './words-a';
import { WORDS_B } from './words-b';
import { WORDS_C } from './words-c';
import { WORDS_D } from './words-d';
import { WORDS_E } from './words-e';
import { WORDS_F, WORDS_G, WORDS_H } from './words-fgh';
import { WORDS_I } from './words-i';
import {
  WORDS_J,
  WORDS_K,
  WORDS_L,
  WORDS_M,
  WORDS_N,
  WORDS_O,
  WORDS_P,
  WORDS_Q,
  WORDS_R,
  WORDS_S,
  WORDS_T,
  WORDS_U,
  WORDS_V,
  WORDS_W,
  WORDS_X,
  WORDS_Y,
  WORDS_Z,
} from './words-j-z';
import {
  parseSaifursEntry,
  rawSaifursGroupSchema,
  type IRawSaifursGroup,
  type ISaifursEntry,
} from './schema';

/**
 * Saifur's-style vocabulary, assembled and parsed once.
 *
 * Validated at module load the way the IELTS vocabulary is: `pnpm content:validate`
 * runs in `prebuild`, so a malformed line, a word that repeats, or a corpus
 * that has quietly shrunk below the size the product claims fails the build.
 */
const GROUPS: readonly IRawSaifursGroup[] = [
  WORDS_A,
  WORDS_B,
  WORDS_C,
  WORDS_D,
  WORDS_E,
  WORDS_F,
  WORDS_G,
  WORDS_H,
  WORDS_I,
  WORDS_J,
  WORDS_K,
  WORDS_L,
  WORDS_M,
  WORDS_N,
  WORDS_O,
  WORDS_P,
  WORDS_Q,
  WORDS_R,
  WORDS_S,
  WORDS_T,
  WORDS_U,
  WORDS_V,
  WORDS_W,
  WORDS_X,
  WORDS_Y,
  WORDS_Z,
];

/**
 * The floor this corpus promises.
 *
 * Asserted rather than described: the size is a claim the product prints on a
 * screen a learner reads, and a corpus that fell to 200 after a de-duplication
 * would leave the claim standing and untrue.
 */
export const SAIFURS_MINIMUM_ENTRIES = 500;

export interface ISaifursIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface ISaifursCounts {
  readonly entries: number;
  readonly letters: number;
  readonly needsReview: number;
}

export interface ISaifursValidation {
  readonly issues: readonly ISaifursIssue[];
  readonly counts: ISaifursCounts;
}

function fileFor(letter: string): string {
  return `content/saifurs-vocabulary/words-${letter.toLowerCase()}.ts`;
}

function read(): {
  readonly entries: readonly ISaifursEntry[];
  readonly issues: readonly ISaifursIssue[];
} {
  const entries: ISaifursEntry[] = [];
  const issues: ISaifursIssue[] = [];
  const owner = new Map<string, string>();

  for (const group of GROUPS) {
    const file = fileFor(group.letter);
    const shape = rawSaifursGroupSchema.safeParse(group);

    if (!shape.success) {
      for (const issue of shape.error.issues) {
        issues.push({ file, path: issue.path.join('.'), message: issue.message });
      }
      continue;
    }

    for (const line of group.entries) {
      const { entry, issues: failures } = parseSaifursEntry(line, group.letter);

      for (const failure of failures) {
        issues.push({ file, path: failure.path, message: failure.message });
      }

      if (entry === null) {
        continue;
      }

      const existing = owner.get(entry.word);

      if (existing !== undefined) {
        issues.push({
          file,
          path: entry.word,
          message: `already filed under "${existing}" — a word has one home`,
        });
        continue;
      }

      owner.set(entry.word, group.letter);
      entries.push(entry);
    }
  }

  entries.sort((a, b) => a.word.localeCompare(b.word));

  return { entries, issues };
}

const parsed = read();

/** The corpus, parsed and frozen. */
export const SAIFURS_VOCABULARY: readonly ISaifursEntry[] = Object.freeze(parsed.entries);

export function validateSaifursVocabulary(): ISaifursValidation {
  const issues = [...parsed.issues];

  if (parsed.entries.length < SAIFURS_MINIMUM_ENTRIES) {
    issues.push({
      file: 'content/saifurs-vocabulary/index.ts',
      path: 'SAIFURS_MINIMUM_ENTRIES',
      message: `the corpus promises at least ${String(SAIFURS_MINIMUM_ENTRIES)} words and holds ${String(parsed.entries.length)}`,
    });
  }

  return {
    issues,
    counts: {
      entries: parsed.entries.length,
      letters: new Set(parsed.entries.map((entry) => entry.word.charAt(0).toUpperCase())).size,
      needsReview: parsed.entries.filter((entry) => entry.needsReview).length,
    },
  };
}

export { type ISaifursEntry } from './schema';
