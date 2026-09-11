import { z } from 'zod';

export const ieltsSaifursEntrySchema = z.object({
  word: z.string(),
  partOfSpeech: z.string(),
  ipaBr: z.string(),
  ipaUs: z.string(),
  bangla: z.string(),
  synonyms: z.array(z.string()).readonly(),
  antonyms: z.array(z.string()).readonly(),
  exampleEn: z.string(),
  exampleBn: z.string(),
  needsReview: z.boolean(),
  letter: z.string(),
  cursor: z.string(),
  serial: z.number(),
});

export const ieltsSaifursPageSchema = z.object({
  entries: z.array(ieltsSaifursEntrySchema).readonly(),
  page: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  matchedEntries: z.number(),
  totalEntries: z.number(),
  letters: z.array(z.object({ letter: z.string(), words: z.number() })).readonly(),
  partsOfSpeech: z
    .array(z.object({ partOfSpeech: z.string(), words: z.number() }))
    .readonly(),
});

export type IeltsSaifursEntryView = z.infer<typeof ieltsSaifursEntrySchema>;
export type IeltsSaifursPage = z.infer<typeof ieltsSaifursPageSchema>;

export const IELTS_SAIFURS_PAGE_SIZE = 25;

export type IeltsSaifursMode = 'read' | 'learn';
export type IeltsSaifursAccent = 'british' | 'american';
