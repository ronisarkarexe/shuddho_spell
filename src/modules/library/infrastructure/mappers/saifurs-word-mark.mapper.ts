import { z } from 'zod';
import { parseRows } from '@/modules/shared/infrastructure/persistence/parse-rows';
import { SaifursWordMark } from '../../domain/entities/saifurs-word-mark';
import { SAIFURS_MARK_STATUSES } from '../../domain/value-objects/saifurs-mark-status';

const rowSchema = z.object({
  profile_id: z.string(),
  word: z.string(),
  status: z.enum(SAIFURS_MARK_STATUSES),
});

export const SAIFURS_MARK_COLUMNS = 'profile_id, word, status';

export function toSaifursWordMarks(rows: readonly unknown[]): readonly SaifursWordMark[] {
  return parseRows(rowSchema, rows).map((parsed) =>
    SaifursWordMark.create({
      profileId: parsed.profile_id,
      word: parsed.word,
      status: parsed.status,
    }),
  );
}

export function toSaifursWordMarkRow(mark: SaifursWordMark): Readonly<Record<string, unknown>> {
  return {
    profile_id: mark.profileId,
    word: mark.word,
    status: mark.status,
  };
}
