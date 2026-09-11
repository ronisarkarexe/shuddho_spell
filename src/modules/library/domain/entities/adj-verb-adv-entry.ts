/**
 * One adjective, verb or adverb study card: the word, the Bangla meaning, and
 * the sentence that shows it in use.
 */
export class AdjVerbAdvEntry {
  private constructor(
    readonly bookSerial: number,
    readonly serial: number,
    readonly word: string,
    readonly partOfSpeech: string,
    readonly bangla: string,
    readonly exampleEn: string,
  ) {}

  static create(input: {
    readonly bookSerial: number;
    readonly serial: number;
    readonly word: string;
    readonly partOfSpeech: string;
    readonly bangla: string;
    readonly exampleEn: string;
  }): AdjVerbAdvEntry {
    return new AdjVerbAdvEntry(
      input.bookSerial,
      input.serial,
      input.word,
      input.partOfSpeech,
      input.bangla,
      input.exampleEn,
    );
  }

  get letter(): string {
    return this.word.charAt(0).toUpperCase();
  }

  get cursor(): string {
    return `${this.partOfSpeech}:${String(this.serial)}`;
  }

  matches(prefix: string): boolean {
    const needle = prefix.trim().toLowerCase();

    if (needle === '') {
      return true;
    }

    if (this.word.startsWith(needle) || this.exampleEn.toLowerCase().includes(needle)) {
      return true;
    }

    const bangla = prefix.trim();

    if (/[\u0980-\u09FF]/u.test(bangla)) {
      return this.bangla.includes(bangla);
    }

    return false;
  }
}
