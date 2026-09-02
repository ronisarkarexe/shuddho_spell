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
  /** 1-based. Out of range is clamped, never an error. */
  readonly page?: number;
  readonly pageSize: number;
}

const MAX_PAGE_SIZE = 100;

/**
 * A numbered page of informal → formal pairs.
 *
 * **Paging is by page number, not a keyset.** The learner needs to know
 * "I am on page 3 of 50" and to go back there; a cursor that only walks
 * forward cannot say that. The corpus is a compiled module of a thousand
 * rows, so offset is cheap and stable.
 *
 * **Serials are over the whole corpus.** Filtering does not renumber them.
 */
export class GetFormalInformalUseCase {
  constructor(private readonly source: IFormalInformalSource) {}

  async execute(input: IGetFormalInformalInput): Promise<IFormalInformalPage> {
    const all = this.source.listAll();
    const serialOf = new Map<string, number>();

    for (let index = 0; index < all.length; index += 1) {
      const pair = all[index];
      if (pair !== undefined) {
        serialOf.set(pair.cursor, index + 1);
      }
    }

    const matched = all.filter((pair) => keeps(pair, input));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize));
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const requested = input.page ?? 1;
    const page = Math.min(totalPages, Math.max(1, requested));
    const start = (page - 1) * pageSize;
    const slice = matched.slice(start, start + pageSize);

    return Promise.resolve({
      pairs: slice.map((pair) => view(pair, serialOf.get(pair.cursor) ?? 0)),
      page,
      totalPages,
      pageSize,
      matchedPairs: matched.length,
      totalPairs: all.length,
      topics: byTopic(all),
    });
  }
}

function view(pair: FormalInformalPair, serial: number): IFormalInformalPairView {
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
    serial,
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
