import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { SaifursProgress } from '../../domain/entities/saifurs-progress';
import { type ISaifursProgressRepository } from '../../domain/repositories/saifurs-progress-repository';
import { type ISaifursSource } from '../../domain/repositories/saifurs-source';
import { type ISaifursProgressView } from '../dto/saifurs-view';

export interface IGetSaifursProgressInput {
  readonly userId: string;
}

export class GetSaifursProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: ISaifursProgressRepository,
    private readonly source: ISaifursSource,
  ) {}

  async execute(input: IGetSaifursProgressInput): Promise<ISaifursProgressView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const stored = await this.progress.findByProfile(profile.id);
    const row = stored ?? SaifursProgress.empty(profile.id);

    return {
      lastPage: row.lastPage,
      lastSerial: row.lastSerial,
      wordsRead: row.wordsRead,
      totalEntries: this.source.listAll().length,
    };
  }
}
