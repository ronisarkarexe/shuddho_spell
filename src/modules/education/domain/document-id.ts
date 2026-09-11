export const DOCUMENT_IDS = Object.freeze({
  TRANSCRIPTS_SECONDARY: 'transcriptsSecondary',
  TRANSCRIPTS_BACHELOR: 'transcriptsBachelor',
  TRANSCRIPTS_MASTERS: 'transcriptsMasters',
  PASSPORT: 'passport',
  ENGLISH_SCORE: 'englishScore',
  FUNDS: 'funds',
  APPLICATION_FEE: 'applicationFee',
  PERSONAL_STATEMENT: 'personalStatement',
  SOP: 'sop',
  RECOMMENDATIONS: 'recommendations',
  CV: 'cv',
  RESEARCH_PROPOSAL: 'researchProposal',
  GRE: 'gre',
} as const);

export type DocumentId = (typeof DOCUMENT_IDS)[keyof typeof DOCUMENT_IDS];
