import { PAIRS_ABBREVIATIONS } from './pairs-abbreviations';
import { PAIRS_ACADEMIC } from './pairs-academic';
import { PAIRS_ADJECTIVES } from './pairs-adjectives';
import { PAIRS_BUSINESS } from './pairs-business';
import { PAIRS_COMMON } from './pairs-common';
import { PAIRS_MORE } from './pairs-more';
import { PAIRS_NOUNS } from './pairs-nouns';
import { PAIRS_SLANG } from './pairs-slang';
import { PAIRS_SOCIAL } from './pairs-social';
import { PAIRS_VARIETY } from './pairs-variety';
import { PAIRS_VERBS } from './pairs-verbs';
import {
  parseFormalInformalPair,
  rawFormalInformalGroupSchema,
  type IFormalInformalPair,
  type IRawFormalInformalGroup,
} from './schema';

/**
 * Informal → formal pairs, assembled and parsed once.
 *
 * Validated at module load the way the IELTS vocabulary is: `pnpm content:validate`
 * runs in `prebuild`, so a malformed line, a pair that repeats, or a corpus
 * that has quietly shrunk below the size the product claims fails the build.
 */
const GROUPS: readonly IRawFormalInformalGroup[] = [
  PAIRS_COMMON,
  PAIRS_VERBS,
  PAIRS_NOUNS,
  PAIRS_ADJECTIVES,
  PAIRS_SLANG,
  PAIRS_ABBREVIATIONS,
  PAIRS_BUSINESS,
  PAIRS_ACADEMIC,
  PAIRS_SOCIAL,
  PAIRS_VARIETY,
  PAIRS_MORE,
];

/**
 * The floor this corpus promises.
 *
 * Asserted rather than described: the size is a claim the product prints on a
 * screen a learner reads, and a corpus that fell to 200 after a de-duplication
 * would leave the claim standing and untrue.
 */
export const FORMAL_INFORMAL_MINIMUM_PAIRS = 1000;

export interface IFormalInformalIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

export interface IFormalInformalCounts {
  readonly pairs: number;
  readonly topics: number;
  readonly needsReview: number;
}

export interface IFormalInformalValidation {
  readonly issues: readonly IFormalInformalIssue[];
  readonly counts: IFormalInformalCounts;
}

function fileFor(topic: string): string {
  return `content/formal-informal/pairs-${topic}.ts`;
}

function pairKey(pair: IFormalInformalPair): string {
  return `${pair.informal}::${pair.formal}`;
}

function read(): {
  readonly pairs: readonly IFormalInformalPair[];
  readonly issues: readonly IFormalInformalIssue[];
} {
  const pairs: IFormalInformalPair[] = [];
  const issues: IFormalInformalIssue[] = [];
  const owner = new Map<string, string>();

  for (const group of GROUPS) {
    const file = fileFor(group.topic);
    const shape = rawFormalInformalGroupSchema.safeParse(group);

    if (!shape.success) {
      for (const issue of shape.error.issues) {
        issues.push({ file, path: issue.path.join('.'), message: issue.message });
      }
      continue;
    }

    for (const line of group.entries) {
      const { pair, issues: failures } = parseFormalInformalPair(line, group.topic);

      for (const failure of failures) {
        issues.push({ file, path: failure.path, message: failure.message });
      }

      if (pair === null) {
        continue;
      }

      const key = pairKey(pair);
      const existing = owner.get(key);

      if (existing !== undefined) {
        issues.push({
          file,
          path: key,
          message: `already filed under "${existing}" — a pair has one home`,
        });
        continue;
      }

      owner.set(key, group.topic);
      pairs.push(pair);
    }
  }

  return { pairs, issues };
}

const parsed = read();

/** The corpus, parsed and frozen. */
export const FORMAL_INFORMAL_PAIRS: readonly IFormalInformalPair[] = Object.freeze(parsed.pairs);

export function validateFormalInformal(): IFormalInformalValidation {
  const issues = [...parsed.issues];

  if (parsed.pairs.length < FORMAL_INFORMAL_MINIMUM_PAIRS) {
    issues.push({
      file: 'content/formal-informal/index.ts',
      path: 'FORMAL_INFORMAL_MINIMUM_PAIRS',
      message: `the corpus promises at least ${String(FORMAL_INFORMAL_MINIMUM_PAIRS)} pairs and holds ${String(parsed.pairs.length)}`,
    });
  }

  return {
    issues,
    counts: {
      pairs: parsed.pairs.length,
      topics: new Set(parsed.pairs.map((pair) => pair.topic)).size,
      needsReview: parsed.pairs.filter((pair) => pair.needsReview).length,
    },
  };
}

export { type IFormalInformalPair } from './schema';
