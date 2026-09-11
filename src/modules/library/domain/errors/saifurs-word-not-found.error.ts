/**
 * A mark arrived for a headword the corpus does not contain.
 *
 * The word is in the request body, so any client can send any string. Without
 * this check a learner could fill the table with marks that never appear on
 * a page, and the Learning filter would count ghosts.
 */
export class SaifursWordNotFoundError extends Error {
  constructor(readonly word: string) {
    super(`no Saifur's card for ${word}`);
    this.name = 'SaifursWordNotFoundError';
  }
}
