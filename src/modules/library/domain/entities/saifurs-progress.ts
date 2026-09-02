/**
 * How far one learner has read in Saifur's vocabulary.
 *
 * A bookmark, not mastery. The list is a reference; this row only remembers
 * the page they last stood on and the furthest word they have reached, so
 * they can come back tomorrow without starting at 1 again.
 */
export class SaifursProgress {
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
  }): SaifursProgress {
    return new SaifursProgress(
      input.profileId,
      input.lastPage,
      input.lastSerial,
      input.wordsRead,
    );
  }

  static empty(profileId: string): SaifursProgress {
    return new SaifursProgress(profileId, 1, 0, 0);
  }

  /**
   * Visiting an unfiltered page. `wordsRead` only rises — going back to page
   * 1 does not forget that they had already reached page 10.
   */
  afterVisiting(page: number, pageLastSerial: number): SaifursProgress {
    const wordsRead = Math.max(this.wordsRead, pageLastSerial);

    return new SaifursProgress(this.profileId, page, pageLastSerial, wordsRead);
  }
}
