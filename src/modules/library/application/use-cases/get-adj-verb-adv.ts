import { type AdjVerbAdvEntry } from '../../domain/entities/adj-verb-adv-entry';
import { type IAdjVerbAdvSource } from '../../domain/repositories/adj-verb-adv-source';
import {
  type IAdjVerbAdvEntryView,
  type IAdjVerbAdvLetterTally,
  type IAdjVerbAdvPage,
  type IAdjVerbAdvPosTally,
} from '../dto/adj-verb-adv-view';

export interface IGetAdjVerbAdvInput {
  readonly letter?: string;
  readonly partOfSpeech?: string;
  readonly startsWith?: string;
  readonly page?: number;
  readonly pageSize: number;
}

const MAX_PAGE_SIZE = 100;

/**
 * A numbered page of adjective, verb and adverb study cards.
 *
 * Book order, not alphabetical: the list runs basic to advanced inside each
 * part of speech, then adjectives, then verbs, then adverbs. A learner paging
 * through twenty-five at a time is reading the book, not looking up a word.
 */
export class GetAdjVerbAdvUseCase {
  constructor(private readonly source: IAdjVerbAdvSource) {}

  execute(input: IGetAdjVerbAdvInput): Promise<IAdjVerbAdvPage> {
    const all = this.source.listAll();
    const matched = all.filter((entry) => keeps(entry, input));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize));
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const requested = input.page ?? 1;
    const page = Math.min(totalPages, Math.max(1, requested));
    const start = (page - 1) * pageSize;
    const slice = matched.slice(start, start + pageSize);

    return Promise.resolve({
      entries: slice.map(view),
      page,
      totalPages,
      pageSize,
      matchedEntries: matched.length,
      totalEntries: all.length,
      letters: byLetter(all),
      partsOfSpeech: byPos(all),
    });
  }
}

function view(entry: AdjVerbAdvEntry): IAdjVerbAdvEntryView {
  return {
    bookSerial: entry.bookSerial,
    serial: entry.serial,
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    bangla: entry.bangla,
    exampleEn: entry.exampleEn,
    letter: entry.letter,
    cursor: entry.cursor,
  };
}

function keeps(entry: AdjVerbAdvEntry, input: IGetAdjVerbAdvInput): boolean {
  if (input.letter !== undefined && entry.letter !== input.letter) {
    return false;
  }

  if (input.partOfSpeech !== undefined && entry.partOfSpeech !== input.partOfSpeech) {
    return false;
  }

  return input.startsWith === undefined || entry.matches(input.startsWith);
}

function byLetter(entries: readonly AdjVerbAdvEntry[]): readonly IAdjVerbAdvLetterTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.letter, (counts.get(entry.letter) ?? 0) + 1);
  }

  return Array.from(counts, ([letter, words]) => ({ letter, words })).sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );
}

function byPos(entries: readonly AdjVerbAdvEntry[]): readonly IAdjVerbAdvPosTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.partOfSpeech, (counts.get(entry.partOfSpeech) ?? 0) + 1);
  }

  const order = ['adjective', 'verb', 'adverb'];

  return Array.from(counts, ([partOfSpeech, words]) => ({ partOfSpeech, words })).sort(
    (a, b) => order.indexOf(a.partOfSpeech) - order.indexOf(b.partOfSpeech),
  );
}
