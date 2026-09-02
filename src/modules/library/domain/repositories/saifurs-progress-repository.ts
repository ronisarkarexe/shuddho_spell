import { type SaifursProgress } from '../entities/saifurs-progress';

export const SAIFURS_PROGRESS_REPOSITORY = Symbol('SAIFURS_PROGRESS_REPOSITORY');

/**
 * One bookmark row per learner for Saifur's vocabulary.
 *
 * A table rather than a cookie: the place they stopped has to follow them
 * across devices, and a client-written local store would be a second source
 * of truth for a fact the server already owns.
 */
export interface ISaifursProgressRepository {
  readonly findByProfile: (profileId: string) => Promise<SaifursProgress | null>;
  readonly upsert: (progress: SaifursProgress) => Promise<void>;
}
