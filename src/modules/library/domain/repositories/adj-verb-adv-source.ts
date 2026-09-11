import { type AdjVerbAdvEntry } from '../entities/adj-verb-adv-entry';

export const ADJ_VERB_ADV_SOURCE = Symbol('ADJ_VERB_ADV_SOURCE');

/**
 * Where the adjective / verb / adverb study cards come from. A compiled
 * module, not a table.
 */
export interface IAdjVerbAdvSource {
  readonly listAll: () => readonly AdjVerbAdvEntry[];
}
