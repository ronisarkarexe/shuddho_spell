import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { FormalInformalProgress } from '../../domain/entities/formal-informal-progress';
import { type IFormalInformalProgressRepository } from '../../domain/repositories/formal-informal-progress-repository';
import { type IFormalInformalSource } from '../../domain/repositories/formal-informal-source';
import { type IFormalInformalProgressView } from '../dto/formal-informal-view';

export interface IGetFormalInformalProgressInput {
  readonly userId: string;
}

export class GetFormalInformalProgressUseCase {
  constructor(
    private readonly profiles: ILearnerProfileRepository,
    private readonly progress: IFormalInformalProgressRepository,
    private readonly source: IFormalInformalSource,
  ) {}

  async execute(input: IGetFormalInformalProgressInput): Promise<IFormalInformalProgressView> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const stored = await this.progress.findByProfile(profile.id);
    const row = stored ?? FormalInformalProgress.empty(profile.id);

    return {
      lastPage: row.lastPage,
      lastSerial: row.lastSerial,
      pairsRead: row.pairsRead,
      totalPairs: this.source.listAll().length,
    };
  }
}
