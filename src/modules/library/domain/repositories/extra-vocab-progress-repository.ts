import { type ExtraVocabProgress } from '../entities/extra-vocab-progress';

export const EXTRA_VOCAB_PROGRESS_REPOSITORY = Symbol('EXTRA_VOCAB_PROGRESS_REPOSITORY');

/**
 * One bookmark row per learner for Extra vocabulary.
 */
export interface IExtraVocabProgressRepository {
  readonly findByProfile: (profileId: string) => Promise<ExtraVocabProgress | null>;
  readonly upsert: (progress: ExtraVocabProgress) => Promise<void>;
}
