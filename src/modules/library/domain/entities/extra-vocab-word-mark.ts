import { type ExtraVocabMarkStatus } from '../value-objects/extra-vocab-mark-status';

/**
 * One learner's decision on one Extra vocabulary card.
 *
 * Not mastery — the list is a reference. The row only remembers *I am
 * learning this* or *I know this*, so tomorrow they can open the twenty-five
 * they marked rather than the whole list.
 */
export class ExtraVocabWordMark {
  private constructor(
    readonly profileId: string,
    readonly word: string,
    readonly status: ExtraVocabMarkStatus,
  ) {}

  static create(input: {
    readonly profileId: string;
    readonly word: string;
    readonly status: ExtraVocabMarkStatus;
  }): ExtraVocabWordMark {
    return new ExtraVocabWordMark(input.profileId, input.word, input.status);
  }
}
