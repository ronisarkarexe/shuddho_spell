import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { ExtraVocabProgress } from '../../domain/entities/extra-vocab-progress';
import { type IExtraVocabProgressRepository } from '../../domain/repositories/extra-vocab-progress-repository';
import { type IExtraVocabSource } from '../../domain/repositories/extra-vocab-source';
import { type IExtraVocabProgressView } from '../dto/extra-vocab-view';

export interface ISaveExtraVocabProgressInput {
  readonly userId: string;
  readonly page: number;
  readonly pageSize: number;
}

export class SaveExtraVocabProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: IExtraVocabProgressRepository,
    private readonly source: IExtraVocabSource,
  ) {}

  async execute(input: ISaveExtraVocabProgressInput): Promise<IExtraVocabProgressView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const all = this.source.listAll();
    const pageSize = Math.max(1, input.pageSize);
    const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
    const page = Math.min(totalPages, Math.max(1, input.page));
    const lastIndex = Math.min(all.length, page * pageSize) - 1;
    const pageLastSerial = lastIndex + 1;

    const stored = await this.progress.findByProfile(profile.id);
    const next = (stored ?? ExtraVocabProgress.empty(profile.id)).afterVisiting(
      page,
      pageLastSerial,
    );

    await this.progress.upsert(next);

    return {
      lastPage: next.lastPage,
      lastSerial: next.lastSerial,
      wordsRead: next.wordsRead,
      totalEntries: all.length,
    };
  }
}
