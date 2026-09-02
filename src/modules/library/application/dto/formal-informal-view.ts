/** One pair, ready to render. */
export interface IFormalInformalPairView {
  readonly informal: string;
  readonly formal: string;
  readonly informalIpa: string;
  readonly formalIpa: string;
  readonly informalBn: string;
  readonly formalBn: string;
  readonly topic: string;
  readonly needsReview: boolean;
  readonly isInformalPhrase: boolean;
  readonly isFormalPhrase: boolean;
  /** `informal::formal` — stable row key. */
  readonly cursor: string;
  /**
   * 1-based position in the whole corpus, not in the current filter.
   *
   * A learner who says "I stopped at 247" means pair 247 of the book, and a
   * filter that renumbered the page would make that sentence untrue.
   */
  readonly serial: number;
}

export interface IFormalInformalTopicTally {
  readonly topic: string;
  readonly pairs: number;
}

export interface IFormalInformalPage {
  readonly pairs: readonly IFormalInformalPairView[];
  /** 1-based page of the current filter. */
  readonly page: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly matchedPairs: number;
  readonly totalPairs: number;
  readonly topics: readonly IFormalInformalTopicTally[];
}

/** How far this learner has read in the unfiltered list. */
export interface IFormalInformalProgressView {
  readonly lastPage: number;
  readonly lastSerial: number;
  readonly pairsRead: number;
  readonly totalPairs: number;
}
