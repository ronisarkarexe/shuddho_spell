import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { SaifursWordMark } from '../../domain/entities/saifurs-word-mark';
import { SaifursWordNotFoundError } from '../../domain/errors/saifurs-word-not-found.error';
import { type ISaifursMarkRepository } from '../../domain/repositories/saifurs-mark-repository';
import { type ISaifursSource } from '../../domain/repositories/saifurs-source';
import { type SaifursMarkStatus } from '../../domain/value-objects/saifurs-mark-status';
import { type ISaifursMarkView } from '../dto/saifurs-view';

export interface ISaveSaifursMarkInput {
  readonly userId: string;
  readonly word: string;
  /** `null` clears the mark. */
  readonly status: SaifursMarkStatus | null;
}

/**
 * Sets or clears this learner's Learning / Known mark on one card.
 *
 * The word is taken from the corpus, never trusted from the client beyond
 * identity: a string that is not a headword is rejected rather than stored.
 */
export class SaveSaifursMarkUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly marks: ISaifursMarkRepository,
    private readonly source: ISaifursSource,
  ) {}

  async execute(input: ISaveSaifursMarkInput): Promise<ISaifursMarkView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const exists = this.source.listAll().some((entry) => entry.cursor === input.word);

    if (!exists) {
      throw new SaifursWordNotFoundError(input.word);
    }

    if (input.status === null) {
      await this.marks.deleteByProfileAndWord(profile.id, input.word);
    } else {
      await this.marks.upsert(
        SaifursWordMark.create({
          profileId: profile.id,
          word: input.word,
          status: input.status,
        }),
      );
    }

    const stored = await this.marks.findByProfile(profile.id);
    let learningCount = 0;
    let knownCount = 0;

    for (const mark of stored) {
      if (mark.status === 'learning') {
        learningCount += 1;
      } else {
        knownCount += 1;
      }
    }

    return {
      word: input.word,
      mark: input.status,
      learningCount,
      knownCount,
    };
  }
}
