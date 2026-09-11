import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { DatabaseError } from '@/modules/shared/infrastructure/persistence/database-error';
import { type ExtraVocabProgress } from '../../../domain/entities/extra-vocab-progress';
import { type IExtraVocabProgressRepository } from '../../../domain/repositories/extra-vocab-progress-repository';
import {
  EXTRA_VOCAB_PROGRESS_COLUMNS,
  toExtraVocabProgress,
  toExtraVocabProgressRow,
} from '../../mappers/extra-vocab-progress.mapper';

const TABLE = 'extra_vocabulary_progress';

export class SupabaseExtraVocabProgressRepository implements IExtraVocabProgressRepository {
  constructor(private readonly db: IDatabase) {}

  async findByProfile(profileId: string): Promise<ExtraVocabProgress | null> {
    try {
      return toExtraVocabProgress(
        await this.db.selectOne({
          table: TABLE,
          columns: EXTRA_VOCAB_PROGRESS_COLUMNS,
          eq: { profile_id: profileId },
        }),
      );
    } catch (error: unknown) {
      if (isMissingRelation(error)) {
        return null;
      }

      throw error;
    }
  }

  async upsert(progress: ExtraVocabProgress): Promise<void> {
    await this.db.upsert(TABLE, [toExtraVocabProgressRow(progress)], {
      onConflict: 'profile_id',
      ignoreDuplicates: false,
    });
  }
}

function isMissingRelation(error: unknown): boolean {
  if (error instanceof DatabaseError) {
    return error.isMissingRelation();
  }

  return (
    error instanceof Error &&
    error.name === 'DatabaseError' &&
    'code' in error &&
    (error.code === 'PGRST205' || error.code === 'PGRST204' || error.code === '42P01')
  );
}
