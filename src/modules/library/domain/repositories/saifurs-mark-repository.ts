import { type SaifursWordMark } from '../entities/saifurs-word-mark';

export const SAIFURS_MARK_REPOSITORY = Symbol('SAIFURS_MARK_REPOSITORY');

/**
 * Per-word Learning / Known marks for Saifur's vocabulary.
 *
 * A table rather than a cookie: the twenty-five they chose have to follow
 * them across devices, and a client-written local store would be a second
 * source of truth for a fact the server already owns.
 */
export interface ISaifursMarkRepository {
  readonly findByProfile: (profileId: string) => Promise<readonly SaifursWordMark[]>;
  readonly upsert: (mark: SaifursWordMark) => Promise<void>;
  readonly deleteByProfileAndWord: (profileId: string, word: string) => Promise<void>;
}
