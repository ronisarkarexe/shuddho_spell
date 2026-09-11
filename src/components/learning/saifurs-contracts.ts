import { z } from 'zod';

export const saifursEntrySchema = z.object({
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

export const saifursPageSchema = z.object({
  entries: z.array(saifursEntrySchema).readonly(),
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

export const saifursProgressSchema = z.object({
  lastPage: z.number(),
  lastSerial: z.number(),
  wordsRead: z.number(),
  totalEntries: z.number(),
});

export type SaifursEntryView = z.infer<typeof saifursEntrySchema>;
export type SaifursPage = z.infer<typeof saifursPageSchema>;
export type SaifursProgress = z.infer<typeof saifursProgressSchema>;

export const SAIFURS_PAGE_SIZE = 25;

export type SaifursMode = 'read' | 'learn';
export type SaifursAccent = 'british' | 'american';
