import { z } from 'zod';
import { EXTRA_VOCAB_LETTERS } from '../../../../../content/extra-vocabulary/schema';

export const extraVocabQuerySchema = z.object({
  letter: z.enum(EXTRA_VOCAB_LETTERS).optional(),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb']).optional(),
  startsWith: z.string().max(40).optional(),
  mark: z.enum(['learning', 'known']).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type ExtraVocabQuery = z.infer<typeof extraVocabQuerySchema>;

export const saveExtraVocabProgressBodySchema = z.object({
  page: z.number().int().min(1).max(500),
});

export type SaveExtraVocabProgressBody = z.infer<typeof saveExtraVocabProgressBodySchema>;

export const saveExtraVocabMarkBodySchema = z.object({
  word: z.string().min(1).max(80),
  status: z.enum(['learning', 'known']).nullable(),
});

export type SaveExtraVocabMarkBody = z.infer<typeof saveExtraVocabMarkBodySchema>;
