import { type SaifursMarkStatus } from '../value-objects/saifurs-mark-status';

/**
 * One learner's decision on one Saifur's card.
 *
 * Not mastery — the list is a reference, and nobody has been asked this word
 * in a lesson. The row only remembers *I am learning this* or *I know this*,
 * so tomorrow they can open the twenty-five they marked rather than the whole
 * book.
 */
export class SaifursWordMark {
  private constructor(
    readonly profileId: string,
    readonly word: string,
    readonly status: SaifursMarkStatus,
  ) {}

  static create(input: {
    readonly profileId: string;
    readonly word: string;
    readonly status: SaifursMarkStatus;
  }): SaifursWordMark {
    return new SaifursWordMark(input.profileId, input.word, input.status);
  }
}
