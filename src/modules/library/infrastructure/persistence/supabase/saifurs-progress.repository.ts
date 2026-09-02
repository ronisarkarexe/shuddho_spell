import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { DatabaseError } from '@/modules/shared/infrastructure/persistence/database-error';
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
    try {
      return toSaifursProgress(
        await this.db.selectOne({
          table: TABLE,
          columns: SAIFURS_PROGRESS_COLUMNS,
          eq: { profile_id: profileId },
        }),
      );
    } catch (error: unknown) {
      const missing =
        (error instanceof DatabaseError && error.isMissingRelation()) ||
        (error instanceof Error &&
          error.name === 'DatabaseError' &&
          'code' in error &&
          (error.code === 'PGRST205' || error.code === 'PGRST204' || error.code === '42P01'));

      if (missing) {
        return null;
      }

      throw error;
    }
  }

  async upsert(progress: SaifursProgress): Promise<void> {
    await this.db.upsert(TABLE, [toSaifursProgressRow(progress)], {
      onConflict: 'profile_id',
      ignoreDuplicates: false,
    });
  }
}
