import { type SaifursEntry } from '../entities/saifurs-entry';

export const SAIFURS_SOURCE = Symbol('SAIFURS_SOURCE');

/**
 * Where the Saifur's-style cards come from.
 *
 * A port over a compiled module rather than a table, for the reason
 * `IVocabularySource` gives: this content is written, reviewed and versioned
 * in the repository, it cannot change between deploys, and a table would add
 * a migration, a seed, a mapper and a round trip to reach an answer the
 * process already holds.
 *
 * `listAll` and not `search`. Filtering a few hundred cards in memory is
 * microseconds, and pushing predicates through the port would freeze the
 * vocabulary of every future filter to whatever the first one happened to need.
 */
export interface ISaifursSource {
  readonly listAll: () => readonly SaifursEntry[];
}
