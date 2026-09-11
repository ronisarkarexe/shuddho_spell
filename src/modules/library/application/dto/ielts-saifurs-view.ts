/** One card, ready to render. */
export interface IIeltsSaifursEntryView {
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
   */
  readonly serial: number;
}

export interface IIeltsSaifursLetterTally {
  readonly letter: string;
  readonly words: number;
}

export interface IIeltsSaifursPosTally {
  readonly partOfSpeech: string;
  readonly words: number;
}

export interface IIeltsSaifursPage {
  readonly entries: readonly IIeltsSaifursEntryView[];
  readonly page: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly matchedEntries: number;
  readonly totalEntries: number;
  readonly letters: readonly IIeltsSaifursLetterTally[];
  readonly partsOfSpeech: readonly IIeltsSaifursPosTally[];
}
