import { type ExtraVocabEntry } from '../entities/extra-vocab-entry';

export const EXTRA_VOCAB_SOURCE = Symbol('EXTRA_VOCAB_SOURCE');

/**
 * Where Extra vocabulary cards come from. A compiled module, not a table.
 */
export interface IExtraVocabSource {
  readonly listAll: () => readonly ExtraVocabEntry[];
}
