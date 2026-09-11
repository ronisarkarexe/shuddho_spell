import { type SaifursMarkStatus } from '../../domain/value-objects/saifurs-mark-status';

/** One card, ready to render. */
export interface ISaifursEntryView {
  readonly word: string;
  readonly partOfSpeech: string;
  readonly ipaBr: string;
  readonly ipaUs: string;
  readonly bangla: string;
  readonly synonyms: readonly string[];
  readonly antonyms: readonly string[];
  readonly exampleEn: string;
  readonly exampleBn: string;
  readonly needsReview: boolean;
  readonly letter: string;
  readonly cursor: string;
  /**
   * 1-based position in the whole corpus, not in the current filter.
   *
   * A learner who says "I stopped at 247" means word 247 of the book, and a
   * filter that renumbered the page would make that sentence untrue.
   */
  readonly serial: number;
  /**
   * This learner's mark, or null when they have not decided yet.
   *
   * A page bookmark cannot say which of the twenty-five they are actually
   * studying. The mark lives on the card so Read, Learn and the Learning
   * filter all see the same fact.
   */
  readonly mark: SaifursMarkStatus | null;
}

export interface ISaifursLetterTally {
  readonly letter: string;
  readonly words: number;
}

export interface ISaifursPosTally {
  readonly partOfSpeech: string;
  readonly words: number;
}

export interface ISaifursPage {
  readonly entries: readonly ISaifursEntryView[];
  /** 1-based page of the current filter. */
  readonly page: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly matchedEntries: number;
  readonly totalEntries: number;
  readonly letters: readonly ISaifursLetterTally[];
  readonly partsOfSpeech: readonly ISaifursPosTally[];
  /** Marks across the whole book, not the current filter. */
  readonly learningCount: number;
  readonly knownCount: number;
}

/** The result of setting or clearing one mark. */
export interface ISaifursMarkView {
  readonly word: string;
  readonly mark: SaifursMarkStatus | null;
  readonly learningCount: number;
  readonly knownCount: number;
}

/** How far this learner has read in the unfiltered list. */
export interface ISaifursProgressView {
  readonly lastPage: number;
  readonly lastSerial: number;
  readonly wordsRead: number;
  readonly totalEntries: number;
}
