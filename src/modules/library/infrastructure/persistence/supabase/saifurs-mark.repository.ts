import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { DatabaseError } from '@/modules/shared/infrastructure/persistence/database-error';
import { type SaifursWordMark } from '../../../domain/entities/saifurs-word-mark';
import { type ISaifursMarkRepository } from '../../../domain/repositories/saifurs-mark-repository';
import {
  SAIFURS_MARK_COLUMNS,
  toSaifursWordMarkRow,
  toSaifursWordMarks,
} from '../../mappers/saifurs-word-mark.mapper';

const TABLE = 'saifurs_word_marks';

export class SupabaseSaifursMarkRepository implements ISaifursMarkRepository {
  constructor(private readonly db: IDatabase) {}

  async findByProfile(profileId: string): Promise<readonly SaifursWordMark[]> {
    try {
      return toSaifursWordMarks(
        await this.db.select({
          table: TABLE,
          columns: SAIFURS_MARK_COLUMNS,
          eq: { profile_id: profileId },
        }),
      );
    } catch (error: unknown) {
      if (isMissingRelation(error)) {
        return [];
      }

      throw error;
    }
  }

  async upsert(mark: SaifursWordMark): Promise<void> {
    await this.db.upsert(TABLE, [toSaifursWordMarkRow(mark)], {
      onConflict: 'profile_id,word',
      ignoreDuplicates: false,
    });
  }

  async deleteByProfileAndWord(profileId: string, word: string): Promise<void> {
    await this.db.delete(TABLE, { profile_id: profileId, word });
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
