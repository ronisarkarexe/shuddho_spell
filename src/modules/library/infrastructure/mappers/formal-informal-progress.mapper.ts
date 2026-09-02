import { z } from 'zod';
import { parseRow } from '@/modules/shared/infrastructure/persistence/parse-rows';
import { FormalInformalProgress } from '../../domain/entities/formal-informal-progress';

const rowSchema = z.object({
  profile_id: z.string(),
  last_page: z.number().int(),
  last_serial: z.number().int(),
  pairs_read: z.number().int(),
});

export const FORMAL_INFORMAL_PROGRESS_COLUMNS =
  'profile_id, last_page, last_serial, pairs_read';

export function toFormalInformalProgress(row: unknown): FormalInformalProgress | null {
  const parsed = parseRow(rowSchema, row);

  if (parsed === null) {
    return null;
  }

  return FormalInformalProgress.create({
    profileId: parsed.profile_id,
    lastPage: parsed.last_page,
    lastSerial: parsed.last_serial,
    pairsRead: parsed.pairs_read,
  });
}

export function toFormalInformalProgressRow(
  progress: FormalInformalProgress,
): Readonly<Record<string, unknown>> {
  return {
    profile_id: progress.profileId,
    last_page: progress.lastPage,
    last_serial: progress.lastSerial,
    pairs_read: progress.pairsRead,
  };
}
