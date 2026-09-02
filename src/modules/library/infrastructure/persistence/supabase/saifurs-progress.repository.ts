import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { type SaifursProgress } from '../../../domain/entities/saifurs-progress';
import { type ISaifursProgressRepository } from '../../../domain/repositories/saifurs-progress-repository';
import {
  SAIFURS_PROGRESS_COLUMNS,
  toSaifursProgress,
  toSaifursProgressRow,
} from '../../mappers/saifurs-progress.mapper';

const TABLE = 'saifurs_vocabulary_progress';

export class SupabaseSaifursProgressRepository implements ISaifursProgressRepository {
  constructor(private readonly db: IDatabase) {}

  async findByProfile(profileId: string): Promise<SaifursProgress | null> {
    return toSaifursProgress(
      await this.db.selectOne({
        table: TABLE,
        columns: SAIFURS_PROGRESS_COLUMNS,
        eq: { profile_id: profileId },
      }),
    );
  }

  async upsert(progress: SaifursProgress): Promise<void> {
    await this.db.upsert(TABLE, [toSaifursProgressRow(progress)], {
      onConflict: 'profile_id',
      ignoreDuplicates: false,
    });
  }
}
