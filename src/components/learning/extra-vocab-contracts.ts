import { z } from 'zod';

export const extraVocabMarkStatusSchema = z.enum(['learning', 'known']);

export const extraVocabEntrySchema = z.object({
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
  mark: extraVocabMarkStatusSchema.nullable(),
});

export const extraVocabPageSchema = z.object({
  entries: z.array(extraVocabEntrySchema).readonly(),
  page: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  matchedEntries: z.number(),
  totalEntries: z.number(),
  letters: z.array(z.object({ letter: z.string(), words: z.number() })).readonly(),
  partsOfSpeech: z
    .array(z.object({ partOfSpeech: z.string(), words: z.number() }))
    .readonly(),
  learningCount: z.number(),
  knownCount: z.number(),
});

export const extraVocabProgressSchema = z.object({
  lastPage: z.number(),
  lastSerial: z.number(),
  wordsRead: z.number(),
  totalEntries: z.number(),
});

export const extraVocabMarkSchema = z.object({
  word: z.string(),
  mark: extraVocabMarkStatusSchema.nullable(),
  learningCount: z.number(),
  knownCount: z.number(),
});

export type ExtraVocabEntryView = z.infer<typeof extraVocabEntrySchema>;
export type ExtraVocabPage = z.infer<typeof extraVocabPageSchema>;
export type ExtraVocabProgress = z.infer<typeof extraVocabProgressSchema>;
export type ExtraVocabMark = z.infer<typeof extraVocabMarkSchema>;
export type ExtraVocabMarkStatus = z.infer<typeof extraVocabMarkStatusSchema>;

export const EXTRA_VOCAB_PAGE_SIZE = 25;

export type ExtraVocabMode = 'read' | 'learn';
export type ExtraVocabAccent = 'british' | 'american';
export type ExtraVocabMarkFilter = '' | ExtraVocabMarkStatus;
