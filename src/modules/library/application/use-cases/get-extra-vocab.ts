import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type ILearnerProfileRepository } from '@/modules/auth/domain/repositories/learner-profile-repository';
import { type ExtraVocabEntry } from '../../domain/entities/extra-vocab-entry';
import { type IExtraVocabMarkRepository } from '../../domain/repositories/extra-vocab-mark-repository';
import { type IExtraVocabSource } from '../../domain/repositories/extra-vocab-source';
import { type ExtraVocabMarkStatus } from '../../domain/value-objects/extra-vocab-mark-status';
import {
  type IExtraVocabEntryView,
  type IExtraVocabLetterTally,
  type IExtraVocabPage,
  type IExtraVocabPosTally,
} from '../dto/extra-vocab-view';

export interface IGetExtraVocabInput {
  readonly userId: string;
  readonly letter?: string;
  readonly partOfSpeech?: string;
  readonly startsWith?: string;
  readonly mark?: ExtraVocabMarkStatus;
  readonly page?: number;
  readonly pageSize: number;
}

const MAX_PAGE_SIZE = 100;

/**
 * A numbered page of Extra vocabulary cards, with this learner's marks.
 */
export class GetExtraVocabUseCase {
  constructor(
    private readonly source: IExtraVocabSource,
    private readonly profiles: ILearnerProfileRepository,
    private readonly marks: IExtraVocabMarkRepository,
  ) {}

  async execute(input: IGetExtraVocabInput): Promise<IExtraVocabPage> {
    const profile = await this.profiles.findByUserId(input.userId);

    if (profile === null) {
      throw new ProfileNotFoundError(input.userId);
    }

    const stored = await this.marks.findByProfile(profile.id);
    const markOf = new Map<string, ExtraVocabMarkStatus>();
    let learningCount = 0;
    let knownCount = 0;

    for (const mark of stored) {
      markOf.set(mark.word, mark.status);

      if (mark.status === 'learning') {
        learningCount += 1;
      } else {
        knownCount += 1;
      }
    }

    const all = this.source.listAll();
    const serialOf = new Map<string, number>();

    for (let index = 0; index < all.length; index += 1) {
      const entry = all[index];
      if (entry !== undefined) {
        serialOf.set(entry.cursor, index + 1);
      }
    }

    const matched = all.filter((entry) => keeps(entry, input, markOf.get(entry.cursor) ?? null));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize));
    const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
    const requested = input.page ?? 1;
    const page = Math.min(totalPages, Math.max(1, requested));
    const start = (page - 1) * pageSize;
    const slice = matched.slice(start, start + pageSize);

    return {
      entries: slice.map((entry) =>
        view(entry, serialOf.get(entry.cursor) ?? 0, markOf.get(entry.cursor) ?? null),
      ),
      page,
      totalPages,
      pageSize,
      matchedEntries: matched.length,
      totalEntries: all.length,
      letters: byLetter(all),
      partsOfSpeech: byPos(all),
      learningCount,
      knownCount,
    };
  }
}

function view(
  entry: ExtraVocabEntry,
  serial: number,
  mark: ExtraVocabMarkStatus | null,
): IExtraVocabEntryView {
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
    mark,
  };
}

function keeps(
  entry: ExtraVocabEntry,
  input: IGetExtraVocabInput,
  mark: ExtraVocabMarkStatus | null,
): boolean {
  if (input.letter !== undefined && entry.letter !== input.letter) {
    return false;
  }

  if (input.partOfSpeech !== undefined && entry.partOfSpeech !== input.partOfSpeech) {
    return false;
  }

  if (input.mark !== undefined && mark !== input.mark) {
    return false;
  }

  return input.startsWith === undefined || entry.matches(input.startsWith);
}

function byLetter(entries: readonly ExtraVocabEntry[]): readonly IExtraVocabLetterTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.letter, (counts.get(entry.letter) ?? 0) + 1);
  }

  return Array.from(counts, ([letter, words]) => ({ letter, words })).sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );
}

function byPos(entries: readonly ExtraVocabEntry[]): readonly IExtraVocabPosTally[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.partOfSpeech, (counts.get(entry.partOfSpeech) ?? 0) + 1);
  }

  return Array.from(counts, ([partOfSpeech, words]) => ({ partOfSpeech, words })).sort(
    (a, b) => b.words - a.words,
  );
}
