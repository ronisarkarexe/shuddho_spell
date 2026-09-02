/**
 * One admission-style vocabulary card: the word, two accents, the Bangla
 * meaning, and the sentence that shows it in use.
 *
 * There is no learner state here. `review_items` is keyed on the 28-day
 * programme words, and attaching a mastery number to a reference list nobody
 * has been asked would put an invented figure on the screen.
 */
export class SaifursEntry {
  private constructor(
    readonly word: string,
    readonly partOfSpeech: string,
    readonly ipaBr: string,
    readonly ipaUs: string,
    readonly bangla: string,
    readonly synonyms: readonly string[],
    readonly antonyms: readonly string[],
    readonly exampleEn: string,
    readonly exampleBn: string,
    readonly needsReview: boolean,
  ) {}

  static create(input: {
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
  }): SaifursEntry {
    return new SaifursEntry(
      input.word,
      input.partOfSpeech,
      input.ipaBr,
      input.ipaUs,
      input.bangla,
      [...input.synonyms],
      [...input.antonyms],
      input.exampleEn,
      input.exampleBn,
      input.needsReview,
    );
  }

  get letter(): string {
    return this.word.charAt(0).toUpperCase();
  }

  get cursor(): string {
    return this.word;
  }

  /**
   * Whether the headword, a synonym, an antonym or the Bangla gloss matches.
   *
   * English is `startsWith` because a learner types the beginning of the word
   * they have. Bangla is `includes` because a meaning is what they search, not
   * a stem.
   */
  matches(prefix: string): boolean {
    const needle = prefix.trim().toLowerCase();

    if (needle === '') {
      return true;
    }

    if (
      this.word.startsWith(needle) ||
      this.synonyms.some((synonym) => synonym.startsWith(needle)) ||
      this.antonyms.some((antonym) => antonym.startsWith(needle))
    ) {
      return true;
    }

    const bangla = prefix.trim();

    if (/[\u0980-\u09FF]/u.test(bangla)) {
      return this.bangla.includes(bangla) || this.exampleBn.includes(bangla);
    }

    return false;
  }
}
