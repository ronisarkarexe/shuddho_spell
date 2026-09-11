import { z } from 'zod';

export const adjVerbAdvEntrySchema = z.object({
  bookSerial: z.number(),
  serial: z.number(),
  word: z.string(),
  partOfSpeech: z.string(),
  bangla: z.string(),
  exampleEn: z.string(),
  letter: z.string(),
  cursor: z.string(),
});

export const adjVerbAdvPageSchema = z.object({
  entries: z.array(adjVerbAdvEntrySchema).readonly(),
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

export type AdjVerbAdvEntryView = z.infer<typeof adjVerbAdvEntrySchema>;
export type AdjVerbAdvPage = z.infer<typeof adjVerbAdvPageSchema>;

export const ADJ_VERB_ADV_PAGE_SIZE = 25;

export type AdjVerbAdvAccent = 'british' | 'american';
