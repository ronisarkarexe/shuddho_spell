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
  /** `informal::formal` — the keyset cursor and the row key. */
  readonly cursor: string;
}

export interface IFormalInformalTopicTally {
  readonly topic: string;
  readonly pairs: number;
}

export interface IFormalInformalPage {
  readonly pairs: readonly IFormalInformalPairView[];
  /** The cursor to pass as `after` for the next page, or null at the end. */
  readonly nextCursor: string | null;
  readonly matchedPairs: number;
  readonly totalPairs: number;
  readonly topics: readonly IFormalInformalTopicTally[];
}
