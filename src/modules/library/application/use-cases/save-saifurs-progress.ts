import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { SaifursProgress } from '../../domain/entities/saifurs-progress';
import { type ISaifursProgressRepository } from '../../domain/repositories/saifurs-progress-repository';
import { type ISaifursSource } from '../../domain/repositories/saifurs-source';
import { type ISaifursProgressView } from '../dto/saifurs-view';

export interface ISaveSaifursProgressInput {
  readonly userId: string;
  /** 1-based page of the unfiltered list. */
  readonly page: number;
  readonly pageSize: number;
}

/**
 * Records that this learner stood on this page of the unfiltered list.
 *
 * The page number is what the client may send. The serial is computed here
 * from the corpus, so a client cannot claim they have read word 1000 by
 * posting a number.
 */
export class SaveSaifursProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: ISaifursProgressRepository,
    private readonly source: ISaifursSource,
  ) {}

  async execute(input: ISaveSaifursProgressInput): Promise<ISaifursProgressView> {
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
    const next = (stored ?? SaifursProgress.empty(profile.id)).afterVisiting(
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
