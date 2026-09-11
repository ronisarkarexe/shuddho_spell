import {
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
} from './words';
import {
  parseExtraVocabEntry,
  rawExtraVocabGroupSchema,
  type IExtraVocabEntry,
  type IRawExtraVocabGroup,
} from './schema';

/**
 * Academic extra vocabulary, assembled and parsed once.
 *
 * Validated at module load the way the Saifur's vocabulary is: `pnpm content:validate`
 * runs in `prebuild`, so a malformed line, a word that repeats, or a corpus
 * that has quietly shrunk below the size the product claims fails the build.
 */
const GROUPS: readonly IRawExtraVocabGroup[] = [
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
 * screen a learner reads, and a corpus that fell below 200 after a de-duplication
 * would leave the claim standing and untrue.
 */
export const EXTRA_VOCAB_MINIMUM_ENTRIES = 200;

export interface IExtraVocabIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface IExtraVocabCounts {
  readonly entries: number;
  readonly letters: number;
  readonly needsReview: number;
}

export interface IExtraVocabValidation {
  readonly issues: readonly IExtraVocabIssue[];
  readonly counts: IExtraVocabCounts;
}

const CONTENT_FILE = 'content/extra-vocabulary/words.ts';

function read(): {
  readonly entries: readonly IExtraVocabEntry[];
  readonly issues: readonly IExtraVocabIssue[];
} {
  const entries: IExtraVocabEntry[] = [];
  const issues: IExtraVocabIssue[] = [];
  const owner = new Map<string, string>();

  for (const group of GROUPS) {
    const shape = rawExtraVocabGroupSchema.safeParse(group);

    if (!shape.success) {
      for (const issue of shape.error.issues) {
        issues.push({ file: CONTENT_FILE, path: issue.path.join('.'), message: issue.message });
      }
      continue;
    }

    for (const line of group.entries) {
      const { entry, issues: failures } = parseExtraVocabEntry(line, group.letter);

      for (const failure of failures) {
        issues.push({ file: CONTENT_FILE, path: failure.path, message: failure.message });
      }

      if (entry === null) {
        continue;
      }

      const existing = owner.get(entry.word);

      if (existing !== undefined) {
        issues.push({
          file: CONTENT_FILE,
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
export const EXTRA_VOCABULARY: readonly IExtraVocabEntry[] = Object.freeze(parsed.entries);

export function validateExtraVocabulary(): IExtraVocabValidation {
  const issues = [...parsed.issues];

  if (parsed.entries.length < EXTRA_VOCAB_MINIMUM_ENTRIES) {
    issues.push({
      file: 'content/extra-vocabulary/index.ts',
      path: 'EXTRA_VOCAB_MINIMUM_ENTRIES',
      message: `the corpus promises at least ${String(EXTRA_VOCAB_MINIMUM_ENTRIES)} words and holds ${String(parsed.entries.length)}`,
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

export { type IExtraVocabEntry } from './schema';
