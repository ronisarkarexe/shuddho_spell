import { z } from 'zod';

export const formalInformalPairSchema = z.object({
  informal: z.string(),
  formal: z.string(),
  informalIpa: z.string(),
  formalIpa: z.string(),
  informalBn: z.string(),
  formalBn: z.string(),
  topic: z.string(),
  needsReview: z.boolean(),
  isInformalPhrase: z.boolean(),
  isFormalPhrase: z.boolean(),
  cursor: z.string(),
});

export const formalInformalPageSchema = z.object({
  pairs: z.array(formalInformalPairSchema).readonly(),
  nextCursor: z.string().nullable(),
  matchedPairs: z.number(),
  totalPairs: z.number(),
  topics: z.array(z.object({ topic: z.string(), pairs: z.number() })).readonly(),
});

export type FormalInformalPairView = z.infer<typeof formalInformalPairSchema>;
export type FormalInformalPage = z.infer<typeof formalInformalPageSchema>;
