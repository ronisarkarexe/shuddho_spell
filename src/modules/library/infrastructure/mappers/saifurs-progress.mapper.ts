import { z } from 'zod';
import { parseRow } from '@/modules/shared/infrastructure/persistence/parse-rows';
import { SaifursProgress } from '../../domain/entities/saifurs-progress';

const rowSchema = z.object({
  profile_id: z.string(),
  last_page: z.number().int(),
  last_serial: z.number().int(),
  words_read: z.number().int(),
});

export const SAIFURS_PROGRESS_COLUMNS = 'profile_id, last_page, last_serial, words_read';

export function toSaifursProgress(row: unknown): SaifursProgress | null {
  const parsed = parseRow(rowSchema, row);

  if (parsed === null) {
    return null;
  }

  return SaifursProgress.create({
    profileId: parsed.profile_id,
    lastPage: parsed.last_page,
    lastSerial: parsed.last_serial,
    wordsRead: parsed.words_read,
  });
}

export function toSaifursProgressRow(progress: SaifursProgress): Readonly<Record<string, unknown>> {
  return {
    profile_id: progress.profileId,
    last_page: progress.lastPage,
    last_serial: progress.lastSerial,
    words_read: progress.wordsRead,
  };
}
