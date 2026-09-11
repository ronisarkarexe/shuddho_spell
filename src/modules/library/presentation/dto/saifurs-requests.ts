import { z } from 'zod';
import { SAIFURS_LETTERS } from '../../../../../content/saifurs-vocabulary/schema';

export const saifursQuerySchema = z.object({
  letter: z.enum(SAIFURS_LETTERS).optional(),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb']).optional(),
  startsWith: z.string().max(40).optional(),
  mark: z.enum(['learning', 'known']).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type SaifursQuery = z.infer<typeof saifursQuerySchema>;

export const saveSaifursProgressBodySchema = z.object({
  page: z.number().int().min(1).max(500),
});

export type SaveSaifursProgressBody = z.infer<typeof saveSaifursProgressBodySchema>;

export const saveSaifursMarkBodySchema = z.object({
  word: z.string().min(1).max(80),
  status: z.enum(['learning', 'known']).nullable(),
});

export type SaveSaifursMarkBody = z.infer<typeof saveSaifursMarkBodySchema>;
