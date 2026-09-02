import { type FormalInformalProgress } from '../entities/formal-informal-progress';

export const FORMAL_INFORMAL_PROGRESS_REPOSITORY = Symbol('FORMAL_INFORMAL_PROGRESS_REPOSITORY');

/**
 * One bookmark row per learner for the informal → formal list.
 *
 * A table rather than a cookie: the place they stopped has to follow them
 * across devices, and a client-written local store would be a second source
 * of truth for a fact the server already owns.
 */
export interface IFormalInformalProgressRepository {
  readonly findByProfile: (profileId: string) => Promise<FormalInformalProgress | null>;
  readonly upsert: (progress: FormalInformalProgress) => Promise<void>;
}
