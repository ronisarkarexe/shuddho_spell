import { z } from 'zod';
import { IELTS_SAIFURS_LETTERS } from '../../../../../content/ielts-saifurs-vocabulary/schema';

export const ieltsSaifursQuerySchema = z.object({
  letter: z.enum(IELTS_SAIFURS_LETTERS).optional(),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb']).optional(),
  startsWith: z.string().max(40).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type IeltsSaifursQuery = z.infer<typeof ieltsSaifursQuerySchema>;
