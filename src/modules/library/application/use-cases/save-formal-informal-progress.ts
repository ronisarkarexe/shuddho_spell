import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { FormalInformalProgress } from '../../domain/entities/formal-informal-progress';
import { type IFormalInformalProgressRepository } from '../../domain/repositories/formal-informal-progress-repository';
import { type IFormalInformalSource } from '../../domain/repositories/formal-informal-source';
import { type IFormalInformalProgressView } from '../dto/formal-informal-view';

export interface ISaveFormalInformalProgressInput {
  readonly userId: string;
  /** 1-based page of the unfiltered list. */
  readonly page: number;
  readonly pageSize: number;
}

/**
 * Records that this learner stood on this page of the unfiltered list.
 *
 * The page number is what the client may send. The serial is computed here
 * from the corpus, so a client cannot claim they have read pair 1000 by
 * posting a number.
 */
export class SaveFormalInformalProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: IFormalInformalProgressRepository,
    private readonly source: IFormalInformalSource,
  ) {}

  async execute(input: ISaveFormalInformalProgressInput): Promise<IFormalInformalProgressView> {
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
    const next = (stored ?? FormalInformalProgress.empty(profile.id)).afterVisiting(
      page,
      pageLastSerial,
    );

    await this.progress.upsert(next);

    return {
      lastPage: next.lastPage,
      lastSerial: next.lastSerial,
      pairsRead: next.pairsRead,
      totalPairs: all.length,
    };
  }
}
