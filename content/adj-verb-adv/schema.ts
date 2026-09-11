import { z } from 'zod';

/**
 * Adjective, verb and adverb study cards — the 3,000-entry list.
 *
 * One line, four fields, so a reviewer can scan a page of them:
 * `serial | word | bangla | exampleEn`
 *
 * Serials restart in each part of speech (1–1000). The same English word may
 * appear more than once: later rows are practice repetitions with a sentence,
 * not a second dictionary headword. The unique key is part-of-speech plus
 * serial, never the word alone.
 */

export const ADJ_VERB_ADV_POS = ['adjective', 'verb', 'adverb'] as const;

export type AdjVerbAdvPos = (typeof ADJ_VERB_ADV_POS)[number];

export const ADJ_VERB_ADV_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const;

export type AdjVerbAdvLetter = (typeof ADJ_VERB_ADV_LETTERS)[number];

const WORD = /^[a-z]+(?:-[a-z]+)*$/u;
const BANGLA = /[\u0980-\u09FF]/u;
const SERIAL = /^[1-9][0-9]{0,3}$/u;

export interface IAdjVerbAdvEntry {
  readonly serial: number;
  readonly word: string;
  readonly partOfSpeech: AdjVerbAdvPos;
  readonly bangla: string;
  readonly exampleEn: string;
}

export interface IRawAdjVerbAdvGroup {
  readonly partOfSpeech: AdjVerbAdvPos;
  readonly entries: readonly string[];
}

export const rawAdjVerbAdvGroupSchema = z.object({
  partOfSpeech: z.enum(ADJ_VERB_ADV_POS),
  entries: z.array(z.string().min(1)).length(1000),
});

export interface IParseFailure {
  readonly path: string;
  readonly message: string;
}

/**
 * Parses one study line, or reports why it cannot be.
 */
export function parseAdjVerbAdvEntry(
  line: string,
  partOfSpeech: AdjVerbAdvPos,
): { readonly entry: IAdjVerbAdvEntry | null; readonly issues: readonly IParseFailure[] } {
  const fields = line.split('|').map((field) => field.trim());
  const issues: IParseFailure[] = [];

  if (fields.length !== 4) {
    return {
      entry: null,
      issues: [
        {
          path: line,
          message: 'is not a "serial | word | bangla | exampleEn" line',
        },
      ],
    };
  }

  const serialField = fields[0] ?? '';
  const word = (fields[1] ?? '').toLowerCase();
  const bangla = fields[2] ?? '';
  const exampleEn = fields[3] ?? '';
  const path = word === '' ? line : `${partOfSpeech}:${serialField}`;

  if (!SERIAL.test(serialField)) {
    issues.push({ path, message: `"${serialField}" is not a serial from 1 to 1000` });
  }

  const serial = Number.parseInt(serialField, 10);

  if (Number.isFinite(serial) && (serial < 1 || serial > 1000)) {
    issues.push({ path, message: `serial ${serialField} is outside 1–1000` });
  }

  if (!WORD.test(word)) {
    issues.push({ path, message: `"${word}" is not a lower-case English headword` });
  }

  if (!BANGLA.test(bangla)) {
    issues.push({ path, message: 'Bangla meaning is missing real script' });
  }

  if (exampleEn === '') {
    issues.push({ path, message: 'English example is missing' });
  }

  if (issues.length > 0 || !Number.isFinite(serial)) {
    return { entry: null, issues };
  }

  return {
    entry: {
      serial,
      word,
      partOfSpeech,
      bangla,
      exampleEn,
    },
    issues: [],
  };
}
