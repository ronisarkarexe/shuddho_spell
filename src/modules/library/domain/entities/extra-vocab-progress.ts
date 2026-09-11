/**
 * How far one learner has read in Extra vocabulary.
 */
export class ExtraVocabProgress {
  private constructor(
    readonly profileId: string,
    readonly lastPage: number,
    readonly lastSerial: number,
    readonly wordsRead: number,
  ) {}

  static create(input: {
    readonly profileId: string;
    readonly lastPage: number;
    readonly lastSerial: number;
    readonly wordsRead: number;
  }): ExtraVocabProgress {
    return new ExtraVocabProgress(
      input.profileId,
      input.lastPage,
      input.lastSerial,
      input.wordsRead,
    );
  }

  static empty(profileId: string): ExtraVocabProgress {
    return new ExtraVocabProgress(profileId, 1, 0, 0);
  }

  afterVisiting(page: number, pageLastSerial: number): ExtraVocabProgress {
    const wordsRead = Math.max(this.wordsRead, pageLastSerial);

    return new ExtraVocabProgress(this.profileId, page, pageLastSerial, wordsRead);
  }
}
