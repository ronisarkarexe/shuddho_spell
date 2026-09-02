import { type FormalInformalPair } from '../../domain/entities/formal-informal-pair';
import { type IFormalInformalSource } from '../../domain/repositories/formal-informal-source';
import {
  type IFormalInformalPage,
  type IFormalInformalPairView,
  type IFormalInformalTopicTally,
} from '../dto/formal-informal-view';

export interface IGetFormalInformalInput {
  readonly topic?: string;
  readonly startsWith?: string;
  readonly after?: string;
  readonly pageSize: number;
}

const MAX_PAGE_SIZE = 100;

/**
 * A page of informal → formal pairs.
 *
 * **The tallies are over the whole corpus, and the match count is not.** Both
 * numbers are on the screen at once and they answer different questions —
 * "how much of this is in here" and "how much of it matches what I asked for".
 * The topic index is navigation; a door that vanishes because the current
 * filter excluded it is a door the learner cannot find their way back through.
 *
 * **The order is the corpus's own order**, common first, then the named
 * lists. Paging is a keyset over that order, so a page boundary is stable.
 *
 * No query at all: the corpus is a compiled module.
 */
export class GetFormalInformalUseCase {
  constructor(private readonly source: IFormalInformalSource) {}

  async execute(input: IGetFormalInformalInput): Promise<IFormalInformalPage> {
    const all = this.source.listAll();
    const matched = all.filter((pair) => keeps(pair, input));

    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize));
    const start =
      input.after === undefined
        ? 0
        : matched.findIndex((pair) => pair.cursor === input.after) + 1;
    const page = matched.slice(start, start + pageSize);

    return Promise.resolve({
      pairs: page.map(view),
      nextCursor:
        start + pageSize < matched.length ? (page[page.length - 1]?.cursor ?? null) : null,
      matchedPairs: matched.length,
      totalPairs: all.length,
      topics: byTopic(all),
    });
  }
}

function view(pair: FormalInformalPair): IFormalInformalPairView {
  return {
    informal: pair.informal,
    formal: pair.formal,
    informalIpa: pair.informalIpa,
    formalIpa: pair.formalIpa,
    informalBn: pair.informalBn,
    formalBn: pair.formalBn,
    topic: pair.topic,
    needsReview: pair.needsReview,
    isInformalPhrase: pair.isInformalPhrase,
    isFormalPhrase: pair.isFormalPhrase,
    cursor: pair.cursor,
  };
}

function keeps(pair: FormalInformalPair, input: IGetFormalInformalInput): boolean {
  if (input.topic !== undefined && pair.topic !== input.topic) {
    return false;
  }

  return input.startsWith === undefined || pair.matches(input.startsWith);
}

function byTopic(pairs: readonly FormalInformalPair[]): readonly IFormalInformalTopicTally[] {
  const counts = new Map<string, number>();

  for (const pair of pairs) {
    counts.set(pair.topic, (counts.get(pair.topic) ?? 0) + 1);
  }

  return Array.from(counts, ([topic, count]) => ({ topic, pairs: count })).sort(
    (a, b) => b.pairs - a.pairs,
  );
}
