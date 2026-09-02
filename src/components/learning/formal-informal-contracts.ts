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
  serial: z.number(),
});

export const formalInformalPageSchema = z.object({
  pairs: z.array(formalInformalPairSchema).readonly(),
  page: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  matchedPairs: z.number(),
  totalPairs: z.number(),
  topics: z.array(z.object({ topic: z.string(), pairs: z.number() })).readonly(),
});

export const formalInformalProgressSchema = z.object({
  lastPage: z.number(),
  lastSerial: z.number(),
  pairsRead: z.number(),
  totalPairs: z.number(),
});

export type FormalInformalPairView = z.infer<typeof formalInformalPairSchema>;
export type FormalInformalPage = z.infer<typeof formalInformalPageSchema>;
export type FormalInformalProgress = z.infer<typeof formalInformalProgressSchema>;

export const FORMAL_INFORMAL_PAGE_SIZE = 20;

/** Twenty-five pairs on a topic page, matching Saifur's. */
export const FORMAL_INFORMAL_TOPIC_PAGE_SIZE = 25;
