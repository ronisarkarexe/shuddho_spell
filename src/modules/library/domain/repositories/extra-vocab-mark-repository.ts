import { type ExtraVocabWordMark } from '../entities/extra-vocab-word-mark';

export const EXTRA_VOCAB_MARK_REPOSITORY = Symbol('EXTRA_VOCAB_MARK_REPOSITORY');

/**
 * Per-word Learning / Known marks for Extra vocabulary.
 */
export interface IExtraVocabMarkRepository {
  readonly findByProfile: (profileId: string) => Promise<readonly ExtraVocabWordMark[]>;
  readonly upsert: (mark: ExtraVocabWordMark) => Promise<void>;
  readonly deleteByProfileAndWord: (profileId: string, word: string) => Promise<void>;
}
