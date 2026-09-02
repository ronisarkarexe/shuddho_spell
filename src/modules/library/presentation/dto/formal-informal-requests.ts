import { z } from 'zod';
import { FORMAL_INFORMAL_TOPICS } from '../../../../../content/formal-informal/schema';

export const formalInformalQuerySchema = z.object({
  topic: z.enum(FORMAL_INFORMAL_TOPICS).optional(),
  startsWith: z.string().max(40).optional(),
  page: z.coerce.number().int().min(1).max(500).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type FormalInformalQuery = z.infer<typeof formalInformalQuerySchema>;

export const saveFormalInformalProgressBodySchema = z.object({
  page: z.number().int().min(1).max(500),
});

export type SaveFormalInformalProgressBody = z.infer<typeof saveFormalInformalProgressBodySchema>;
