import { ADJECTIVES } from './adjectives';
import { ADVERBS } from './adverbs';
import { VERBS } from './verbs';
import {
  parseAdjVerbAdvEntry,
  rawAdjVerbAdvGroupSchema,
  type AdjVerbAdvPos,
  type IAdjVerbAdvEntry,
  type IRawAdjVerbAdvGroup,
} from './schema';

/**
 * Adjectives, verbs and adverbs — 3,000 study entries in book order.
 *
 * Validated at module load the way the other library corpora are:
 * `pnpm content:validate` runs in `prebuild`, so a malformed line or a corpus
 * that quietly shrank below 3,000 fails the build.
 */
const GROUPS: readonly IRawAdjVerbAdvGroup[] = [ADJECTIVES, VERBS, ADVERBS];

export const ADJ_VERB_ADV_MINIMUM_ENTRIES = 3000;
export const ADJ_VERB_ADV_ENTRIES_PER_POS = 1000;

export interface IAdjVerbAdvIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface IAdjVerbAdvCounts {
  readonly entries: number;
  readonly adjectives: number;
  readonly verbs: number;
  readonly adverbs: number;
}

export interface IAdjVerbAdvValidation {
  readonly issues: readonly IAdjVerbAdvIssue[];
  readonly counts: IAdjVerbAdvCounts;
}

export interface IAdjVerbAdvStudyEntry extends IAdjVerbAdvEntry {
  readonly bookSerial: number;
}

const CONTENT_FILES: Readonly<Record<AdjVerbAdvPos, string>> = {
  adjective: 'content/adj-verb-adv/adjectives.ts',
  verb: 'content/adj-verb-adv/verbs.ts',
  adverb: 'content/adj-verb-adv/adverbs.ts',
};

function read(): {
  readonly entries: readonly IAdjVerbAdvStudyEntry[];
  readonly issues: readonly IAdjVerbAdvIssue[];
} {
  const entries: IAdjVerbAdvStudyEntry[] = [];
  const issues: IAdjVerbAdvIssue[] = [];
  let bookSerial = 0;

  for (const group of GROUPS) {
    const file = CONTENT_FILES[group.partOfSpeech];
    const shape = rawAdjVerbAdvGroupSchema.safeParse(group);

    if (!shape.success) {
      for (const issue of shape.error.issues) {
        issues.push({ file, path: issue.path.join('.'), message: issue.message });
      }
      continue;
    }

    const owner = new Map<number, string>();

    for (const line of group.entries) {
      const { entry, issues: failures } = parseAdjVerbAdvEntry(line, group.partOfSpeech);

      for (const failure of failures) {
        issues.push({ file, path: failure.path, message: failure.message });
      }

      if (entry === null) {
        continue;
      }

      const existing = owner.get(entry.serial);

      if (existing !== undefined) {
        issues.push({
          file,
          path: `${group.partOfSpeech}:${String(entry.serial)}`,
          message: `serial ${String(entry.serial)} already used for "${existing}"`,
        });
        continue;
      }

      owner.set(entry.serial, entry.word);
      bookSerial += 1;
      entries.push({ ...entry, bookSerial });
    }
  }

  return { entries, issues };
}

const parsed = read();

/** The corpus, parsed and frozen, in book order. */
export const ADJ_VERB_ADV: readonly IAdjVerbAdvStudyEntry[] = Object.freeze(parsed.entries);

export function validateAdjVerbAdv(): IAdjVerbAdvValidation {
  const issues = [...parsed.issues];
  const adjectives = parsed.entries.filter((entry) => entry.partOfSpeech === 'adjective').length;
  const verbs = parsed.entries.filter((entry) => entry.partOfSpeech === 'verb').length;
  const adverbs = parsed.entries.filter((entry) => entry.partOfSpeech === 'adverb').length;

  if (parsed.entries.length < ADJ_VERB_ADV_MINIMUM_ENTRIES) {
    issues.push({
      file: 'content/adj-verb-adv/index.ts',
      path: 'ADJ_VERB_ADV_MINIMUM_ENTRIES',
      message: `the corpus promises ${String(ADJ_VERB_ADV_MINIMUM_ENTRIES)} study entries and holds ${String(parsed.entries.length)}`,
    });
  }

  if (adjectives !== ADJ_VERB_ADV_ENTRIES_PER_POS) {
    issues.push({
      file: 'content/adj-verb-adv/index.ts',
      path: 'adjectives',
      message: `promises ${String(ADJ_VERB_ADV_ENTRIES_PER_POS)} adjectives and holds ${String(adjectives)}`,
    });
  }

  if (verbs !== ADJ_VERB_ADV_ENTRIES_PER_POS) {
    issues.push({
      file: 'content/adj-verb-adv/index.ts',
      path: 'verbs',
      message: `promises ${String(ADJ_VERB_ADV_ENTRIES_PER_POS)} verbs and holds ${String(verbs)}`,
    });
  }

  if (adverbs !== ADJ_VERB_ADV_ENTRIES_PER_POS) {
    issues.push({
      file: 'content/adj-verb-adv/index.ts',
      path: 'adverbs',
      message: `promises ${String(ADJ_VERB_ADV_ENTRIES_PER_POS)} adverbs and holds ${String(adverbs)}`,
    });
  }

  return {
    issues,
    counts: {
      entries: parsed.entries.length,
      adjectives,
      verbs,
      adverbs,
    },
  };
}

export { type IAdjVerbAdvEntry } from './schema';
