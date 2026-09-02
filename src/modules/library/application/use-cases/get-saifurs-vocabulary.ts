import { type SaifursEntry } from '../../domain/entities/saifurs-entry';
import { type ISaifursSource } from '../../domain/repositories/saifurs-source';
import {
  type ISaifursEntryView,
  type ISaifursLetterTally,
  type ISaifursPage,
  type ISaifursPosTally,
} from '../dto/saifurs-view';

export interface IGetSaifursVocabularyInput {
  readonly letter?: string;
  readonly partOfSpeech?: string;
  readonly startsWith?: string;
  /** 1-based. Out of range is clamped, never an error. */
  readonly page?: number;
  readonly pageSize: number;
}

const MAX_PAGE_SIZE = 100;

/**
 * A numbered page of Saifur's-style vocabulary cards.
 *
 * **Paging is by page number, not a keyset.** The learner needs to know
 * "I am on page 3 of 20" and to go back there; a cursor that only walks
 * forward cannot say that. The corpus is a compiled module, so offset is
 * cheap and stable.
 *
 * **Serials are over the whole corpus.** Filtering does not renumber them.
 */
export class GetSaifursVocabularyUseCase {
  constructor(private readonly source: ISaifursSource) {}

  async execute(input: IGetSaifursVocabularyInput): Promise<ISaifursPage> {
    const all = this.source.listAll();
    const serialOf = new Map<string, number>();

    for (let index = 0; index < all.length; index += 1) {
      const entry = all[index];
      if (entry !== undefined) {
        serialOf.set(entry.cursor, index + 1);
      }
    }

    const matched = all.filter((entry) => keeps(entry, input));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize));
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const requested = input.page ?? 1;
    const page = Math.min(totalPages, Math.max(1, requested));
    const start = (page - 1) * pageSize;
    const slice = matched.slice(start, start + pageSize);

    return Promise.resolve({
      entries: slice.map((entry) => view(entry, serialOf.get(entry.cursor) ?? 0)),
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

function view(entry: SaifursEntry, serial: number): ISaifursEntryView {
  return {
    word: entry.word,
    partOfSpeech: entry.partOfSpeech,
    ipaBr: entry.ipaBr,
    ipaUs: entry.ipaUs,
    bangla: entry.bangla,
    synonyms: entry.synonyms,
    antonyms: entry.antonyms,
    exampleEn: entry.exampleEn,
    exampleBn: entry.exampleBn,
    needsReview: entry.needsReview,
    letter: entry.letter,
    cursor: entry.cursor,
    serial,
  };
}

function keeps(entry: SaifursEntry, input: IGetSaifursVocabularyInput): boolean {
  if (input.letter !== undefined && entry.letter !== input.letter) {
    return false;
  }

  if (input.partOfSpeech !== undefined && entry.partOfSpeech !== input.partOfSpeech) {
    return false;
  }

  return input.startsWith === undefined || entry.matches(input.startsWith);
}

function byLetter(entries: readonly SaifursEntry[]): readonly ISaifursLetterTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.letter, (counts.get(entry.letter) ?? 0) + 1);
  }

  return Array.from(counts, ([letter, words]) => ({ letter, words })).sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );
}

function byPos(entries: readonly SaifursEntry[]): readonly ISaifursPosTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.partOfSpeech, (counts.get(entry.partOfSpeech) ?? 0) + 1);
  }

  return Array.from(counts, ([partOfSpeech, words]) => ({ partOfSpeech, words })).sort(
    (a, b) => b.words - a.words,
  );
}
