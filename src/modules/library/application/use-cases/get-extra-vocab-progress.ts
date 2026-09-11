import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { ExtraVocabProgress } from '../../domain/entities/extra-vocab-progress';
import { type IExtraVocabProgressRepository } from '../../domain/repositories/extra-vocab-progress-repository';
import { type IExtraVocabSource } from '../../domain/repositories/extra-vocab-source';
import { type IExtraVocabProgressView } from '../dto/extra-vocab-view';

export interface IGetExtraVocabProgressInput {
  readonly userId: string;
}

export class GetExtraVocabProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: IExtraVocabProgressRepository,
    private readonly source: IExtraVocabSource,
  ) {}

  async execute(input: IGetExtraVocabProgressInput): Promise<IExtraVocabProgressView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const stored = await this.progress.findByProfile(profile.id);
    const row = stored ?? ExtraVocabProgress.empty(profile.id);

    return {
      lastPage: row.lastPage,
      lastSerial: row.lastSerial,
      wordsRead: row.wordsRead,
      totalEntries: this.source.listAll().length,
    };
  }
}
