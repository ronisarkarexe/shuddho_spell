/**
 * How far one learner has read in the informal → formal list.
 *
 * A bookmark, not mastery. The list is a reference; this row only remembers
 * the page they last stood on and the furthest pair they have reached, so
 * they can come back tomorrow without starting at 1 again.
 */
export class FormalInformalProgress {
  private constructor(
    readonly profileId: string,
    readonly lastPage: number,
    readonly lastSerial: number,
    readonly pairsRead: number,
  ) {}

  static create(input: {
    readonly profileId: string;
    readonly lastPage: number;
    readonly lastSerial: number;
    readonly pairsRead: number;
  }): FormalInformalProgress {
    return new FormalInformalProgress(
      input.profileId,
      input.lastPage,
      input.lastSerial,
      input.pairsRead,
    );
  }

  static empty(profileId: string): FormalInformalProgress {
    return new FormalInformalProgress(profileId, 1, 0, 0);
  }

  /**
   * Visiting an unfiltered page. `pairsRead` only rises — going back to page
   * 1 does not forget that they had already reached page 10.
   */
  afterVisiting(page: number, pageLastSerial: number): FormalInformalProgress {
    const pairsRead = Math.max(this.pairsRead, pageLastSerial);

    return new FormalInformalProgress(this.profileId, page, pageLastSerial, pairsRead);
  }
}
