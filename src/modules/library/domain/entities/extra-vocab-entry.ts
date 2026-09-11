/**
 * One Extra vocabulary card: the word, two accents, the Bangla meaning, and
 * the sentence that shows it in use.
 */
export class ExtraVocabEntry {
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
  }): ExtraVocabEntry {
    return new ExtraVocabEntry(
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
