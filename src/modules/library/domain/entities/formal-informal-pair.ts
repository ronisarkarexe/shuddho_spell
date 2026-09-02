/**
 * One informal word and the formal word that replaces it.
 *
 * The entity's job is the **pairing**, not either word: a `FormalInformalPair`
 * is an assertion that a learner who wrote the informal side could have written
 * the formal side and been more precise for it. That is why both sides carry
 * IPA and Bangla — the screen has to say the word and name the meaning, and
 * inventing either at render time would put an unchecked claim on a register
 * lesson.
 *
 * There is no learner state here. `review_items` is keyed on the 3,000
 * programme words, and attaching a mastery number to a reference list nobody
 * has been asked would put an invented figure on the screen.
 */
export class FormalInformalPair {
  private constructor(
    readonly informal: string,
    readonly formal: string,
    readonly informalIpa: string,
    readonly formalIpa: string,
    readonly informalBn: string,
    readonly formalBn: string,
    readonly topic: string,
    readonly needsReview: boolean,
  ) {}

  static create(input: {
    readonly informal: string;
    readonly formal: string;
    readonly informalIpa: string;
    readonly formalIpa: string;
    readonly informalBn: string;
    readonly formalBn: string;
    readonly topic: string;
    readonly needsReview: boolean;
  }): FormalInformalPair {
    return new FormalInformalPair(
      input.informal,
      input.formal,
      input.informalIpa,
      input.formalIpa,
      input.informalBn,
      input.formalBn,
      input.topic,
      input.needsReview,
    );
  }

  /** Stable key for paging — informal is not unique across topics. */
  get cursor(): string {
    return `${this.informal}::${this.formal}`;
  }

  get isInformalPhrase(): boolean {
    return this.informal.includes(' ');
  }

  get isFormalPhrase(): boolean {
    return this.formal.includes(' ');
  }

  /**
   * Whether either English side begins with `prefix`, or either Bangla side
   * contains it.
   *
   * English is `startsWith` for the reason `VocabularyEntry.matches` gives: a
   * learner types the beginning of the word they have. Bangla is `includes`
   * because a meaning is what they search, not a stem.
   */
  matches(prefix: string): boolean {
    const needle = prefix.trim().toLowerCase();

    if (needle === '') {
      return true;
    }

    if (this.informal.startsWith(needle) || this.formal.startsWith(needle)) {
      return true;
    }

    const bangla = prefix.trim();

    if (/[\u0980-\u09FF]/u.test(bangla)) {
      return this.informalBn.includes(bangla) || this.formalBn.includes(bangla);
    }

    return false;
  }
}
