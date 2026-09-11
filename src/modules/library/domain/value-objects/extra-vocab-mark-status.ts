/** What a learner has decided about one Extra vocabulary card. */
export const EXTRA_VOCAB_MARK_STATUSES = Object.freeze(['learning', 'known'] as const);

export type ExtraVocabMarkStatus = (typeof EXTRA_VOCAB_MARK_STATUSES)[number];
