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
}

/** How far this learner has read in the unfiltered list. */
export interface ISaifursProgressView {
  readonly lastPage: number;
  readonly lastSerial: number;
  readonly wordsRead: number;
  readonly totalEntries: number;
}
