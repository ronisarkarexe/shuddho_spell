import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { ExtraVocabWordMark } from '../../domain/entities/extra-vocab-word-mark';
import { ExtraVocabWordNotFoundError } from '../../domain/errors/extra-vocab-word-not-found.error';
import { type IExtraVocabMarkRepository } from '../../domain/repositories/extra-vocab-mark-repository';
import { type IExtraVocabSource } from '../../domain/repositories/extra-vocab-source';
import { type ExtraVocabMarkStatus } from '../../domain/value-objects/extra-vocab-mark-status';
import { type IExtraVocabMarkView } from '../dto/extra-vocab-view';

export interface ISaveExtraVocabMarkInput {
  readonly userId: string;
  readonly word: string;
  readonly status: ExtraVocabMarkStatus | null;
}

export class SaveExtraVocabMarkUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly marks: IExtraVocabMarkRepository,
    private readonly source: IExtraVocabSource,
  ) {}

  async execute(input: ISaveExtraVocabMarkInput): Promise<IExtraVocabMarkView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const exists = this.source.listAll().some((entry) => entry.cursor === input.word);

    if (!exists) {
      throw new ExtraVocabWordNotFoundError(input.word);
    }

    if (input.status === null) {
      await this.marks.deleteByProfileAndWord(profile.id, input.word);
    } else {
      await this.marks.upsert(
        ExtraVocabWordMark.create({
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
