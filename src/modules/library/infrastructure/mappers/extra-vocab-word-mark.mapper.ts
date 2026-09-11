import { z } from 'zod';
import { parseRows } from '@/modules/shared/infrastructure/persistence/parse-rows';
import { ExtraVocabWordMark } from '../../domain/entities/extra-vocab-word-mark';
import { EXTRA_VOCAB_MARK_STATUSES } from '../../domain/value-objects/extra-vocab-mark-status';

const rowSchema = z.object({
  profile_id: z.string(),
  word: z.string(),
  status: z.enum(EXTRA_VOCAB_MARK_STATUSES),
});

export const EXTRA_VOCAB_MARK_COLUMNS = 'profile_id, word, status';

export function toExtraVocabWordMarks(rows: readonly unknown[]): readonly ExtraVocabWordMark[] {
  return parseRows(rowSchema, rows).map((parsed) =>
    ExtraVocabWordMark.create({
      profileId: parsed.profile_id,
      word: parsed.word,
      status: parsed.status,
    }),
  );
}

export function toExtraVocabWordMarkRow(
  mark: ExtraVocabWordMark,
): Readonly<Record<string, unknown>> {
  return {
    profile_id: mark.profileId,
    word: mark.word,
    status: mark.status,
  };
}
