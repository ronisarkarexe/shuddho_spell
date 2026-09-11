import { z } from 'zod';
import { ADJ_VERB_ADV_LETTERS, ADJ_VERB_ADV_POS } from '../../../../../content/adj-verb-adv/schema';

export const adjVerbAdvQuerySchema = z.object({
  letter: z.enum(ADJ_VERB_ADV_LETTERS).optional(),
  partOfSpeech: z.enum(ADJ_VERB_ADV_POS).optional(),
  startsWith: z.string().max(40).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type AdjVerbAdvQuery = z.infer<typeof adjVerbAdvQuerySchema>;
