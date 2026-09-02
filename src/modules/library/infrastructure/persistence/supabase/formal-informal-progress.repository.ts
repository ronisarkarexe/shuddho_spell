import { type IDatabase } from '@/modules/shared/infrastructure/persistence/database';
import { type FormalInformalProgress } from '../../../domain/entities/formal-informal-progress';
import { type IFormalInformalProgressRepository } from '../../../domain/repositories/formal-informal-progress-repository';
import {
  FORMAL_INFORMAL_PROGRESS_COLUMNS,
  toFormalInformalProgress,
  toFormalInformalProgressRow,
} from '../../mappers/formal-informal-progress.mapper';

const TABLE = 'formal_informal_progress';

export class SupabaseFormalInformalProgressRepository
  implements IFormalInformalProgressRepository
{
  constructor(private readonly db: IDatabase) {}

  async findByProfile(profileId: string): Promise<FormalInformalProgress | null> {
    return toFormalInformalProgress(
      await this.db.selectOne({
        table: TABLE,
        columns: FORMAL_INFORMAL_PROGRESS_COLUMNS,
        eq: { profile_id: profileId },
      }),
    );
  }

  async upsert(progress: FormalInformalProgress): Promise<void> {
    await this.db.upsert(TABLE, [toFormalInformalProgressRow(progress)], {
      onConflict: 'profile_id',
      ignoreDuplicates: false,
    });
  }
}
