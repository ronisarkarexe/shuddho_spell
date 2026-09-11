/** What a learner has decided about one Saifur's card. */
export const SAIFURS_MARK_STATUSES = Object.freeze(['learning', 'known'] as const);

export type SaifursMarkStatus = (typeof SAIFURS_MARK_STATUSES)[number];
