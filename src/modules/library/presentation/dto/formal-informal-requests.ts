import { z } from 'zod';
import { FORMAL_INFORMAL_TOPICS } from '../../../../../content/formal-informal/schema';

/**
 * The informal → formal query string.
 *
 * `topic` is an enum over the corpus's own list rather than a free string, for
 * the reason `vocabularyQuerySchema` gives: an endpoint that accepts
 * `topic=anything` and answers with an empty page is indistinguishable from a
 * topic that exists and is empty.
 */
export const formalInformalQuerySchema = z.object({
  topic: z.enum(FORMAL_INFORMAL_TOPICS).optional(),
  startsWith: z.string().max(40).optional(),
  after: z.string().max(80).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type FormalInformalQuery = z.infer<typeof formalInformalQuerySchema>;
