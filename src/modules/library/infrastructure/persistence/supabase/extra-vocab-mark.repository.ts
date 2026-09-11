import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { DatabaseError } from '@/modules/shared/infrastructure/persistence/database-error';
import { type ExtraVocabWordMark } from '../../../domain/entities/extra-vocab-word-mark';
import { type IExtraVocabMarkRepository } from '../../../domain/repositories/extra-vocab-mark-repository';
import {
  EXTRA_VOCAB_MARK_COLUMNS,
  toExtraVocabWordMarkRow,
  toExtraVocabWordMarks,
} from '../../mappers/extra-vocab-word-mark.mapper';

const TABLE = 'extra_vocabulary_marks';

export class SupabaseExtraVocabMarkRepository implements IExtraVocabMarkRepository {
  constructor(private readonly db: IDatabase) {}

  async findByProfile(profileId: string): Promise<readonly ExtraVocabWordMark[]> {
    try {
      return toExtraVocabWordMarks(
        await this.db.select({
          table: TABLE,
          columns: EXTRA_VOCAB_MARK_COLUMNS,
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

  async upsert(mark: ExtraVocabWordMark): Promise<void> {
    await this.db.upsert(TABLE, [toExtraVocabWordMarkRow(mark)], {
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
