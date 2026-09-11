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
  WORDS_Z,
} from './words';
import {
  parseIeltsSaifursEntry,
  rawIeltsSaifursGroupSchema,
  type IIeltsSaifursEntry,
  type IRawIeltsSaifursGroup,
} from './schema';

/**
 * IELTS Saifur's-style vocabulary — a separate shelf from the admission
 * Saifur's list. Original study cards in that shape: word, two accents,
 * Bangla, synonym, antonym, and a sentence.
 *
 * Validated at module load: `pnpm content:validate` runs in `prebuild`.
 */
const GROUPS: readonly IRawIeltsSaifursGroup[] = [
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
  WORDS_Z,
];

export const IELTS_SAIFURS_MINIMUM_ENTRIES = 400;

export interface IIeltsSaifursIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface IIeltsSaifursCounts {
  readonly entries: number;
  readonly letters: number;
  readonly needsReview: number;
}

export interface IIeltsSaifursValidation {
  readonly issues: readonly IIeltsSaifursIssue[];
  readonly counts: IIeltsSaifursCounts;
}

const CONTENT_FILE = 'content/ielts-saifurs-vocabulary/words.ts';

function read(): {
  readonly entries: readonly IIeltsSaifursEntry[];
  readonly issues: readonly IIeltsSaifursIssue[];
} {
  const entries: IIeltsSaifursEntry[] = [];
  const issues: IIeltsSaifursIssue[] = [];
  const owner = new Map<string, string>();

  for (const group of GROUPS) {
    const shape = rawIeltsSaifursGroupSchema.safeParse(group);

    if (!shape.success) {
      for (const issue of shape.error.issues) {
        issues.push({ file: CONTENT_FILE, path: issue.path.join('.'), message: issue.message });
      }
      continue;
    }

    for (const line of group.entries) {
      const { entry, issues: failures } = parseIeltsSaifursEntry(line, group.letter);

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
export const IELTS_SAIFURS_VOCABULARY: readonly IIeltsSaifursEntry[] = Object.freeze(parsed.entries);

export function validateIeltsSaifursVocabulary(): IIeltsSaifursValidation {
  const issues = [...parsed.issues];

  if (parsed.entries.length < IELTS_SAIFURS_MINIMUM_ENTRIES) {
    issues.push({
      file: 'content/ielts-saifurs-vocabulary/index.ts',
      path: 'IELTS_SAIFURS_MINIMUM_ENTRIES',
      message: `the corpus promises at least ${String(IELTS_SAIFURS_MINIMUM_ENTRIES)} words and holds ${String(parsed.entries.length)}`,
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

export { type IIeltsSaifursEntry } from './schema';
