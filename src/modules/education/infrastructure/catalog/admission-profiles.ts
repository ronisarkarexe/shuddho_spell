import { DOCUMENT_IDS, type DocumentId } from '../../domain/document-id';
import { INTAKE_SEASONS, type IEnglishRequirement, type IntakeSeason } from '../../domain/university';
import { TEST_POLICIES, type TestPolicy } from '../../domain/test-policy';

export const ADMISSION_PROFILE_IDS = Object.freeze({
  REGIONAL_PUBLIC: 'regional-public',
  RESEARCH_PUBLIC: 'research-public',
  PRIVATE: 'private',
  PRIVATE_STEM: 'private-stem',
  CAL_STATE: 'cal-state',
} as const);

export type AdmissionProfileId =
  (typeof ADMISSION_PROFILE_IDS)[keyof typeof ADMISSION_PROFILE_IDS];

export const LIVING_BANDS = Object.freeze({
  LOW: 'low',
  MID: 'mid',
  HIGH: 'high',
  METRO: 'metro',
} as const);

export type LivingBand = (typeof LIVING_BANDS)[keyof typeof LIVING_BANDS];

export const LIVING_USD: Readonly<Record<LivingBand, number>> = {
  low: 12_000,
  mid: 15_000,
  high: 19_000,
  metro: 24_000,
};

export interface ITrackProfile {
  readonly gpaMin: number;
  readonly english: IEnglishRequirement;
  readonly gre: TestPolicy;
  readonly gmat: TestPolicy;
  readonly tuitionUsd: number;
  readonly applicationFeeUsd: number;
  readonly documents: readonly DocumentId[];
  readonly intakes: readonly IntakeSeason[];
}

export interface IAdmissionProfile {
  readonly bachelor: ITrackProfile;
  readonly masters: ITrackProfile;
  readonly phd: ITrackProfile;
}

const FALL_SPRING: readonly IntakeSeason[] = [INTAKE_SEASONS.FALL, INTAKE_SEASONS.SPRING];

const BACHELOR_DOCS: readonly DocumentId[] = [
  DOCUMENT_IDS.TRANSCRIPTS_SECONDARY,
  DOCUMENT_IDS.PASSPORT,
  DOCUMENT_IDS.ENGLISH_SCORE,
  DOCUMENT_IDS.FUNDS,
  DOCUMENT_IDS.APPLICATION_FEE,
  DOCUMENT_IDS.PERSONAL_STATEMENT,
];

const MASTERS_DOCS: readonly DocumentId[] = [
  DOCUMENT_IDS.TRANSCRIPTS_BACHELOR,
  DOCUMENT_IDS.PASSPORT,
  DOCUMENT_IDS.ENGLISH_SCORE,
  DOCUMENT_IDS.SOP,
  DOCUMENT_IDS.RECOMMENDATIONS,
  DOCUMENT_IDS.CV,
  DOCUMENT_IDS.FUNDS,
  DOCUMENT_IDS.APPLICATION_FEE,
];

const PHD_DOCS: readonly DocumentId[] = [
  DOCUMENT_IDS.TRANSCRIPTS_BACHELOR,
  DOCUMENT_IDS.TRANSCRIPTS_MASTERS,
  DOCUMENT_IDS.PASSPORT,
  DOCUMENT_IDS.ENGLISH_SCORE,
  DOCUMENT_IDS.SOP,
  DOCUMENT_IDS.RESEARCH_PROPOSAL,
  DOCUMENT_IDS.RECOMMENDATIONS,
  DOCUMENT_IDS.CV,
  DOCUMENT_IDS.GRE,
  DOCUMENT_IDS.FUNDS,
  DOCUMENT_IDS.APPLICATION_FEE,
];

function english(
  ieltsOverall: number,
  toeflIbt: number,
  duolingo: number,
  pte: number,
): IEnglishRequirement {
  return { ieltsOverall, toeflIbt, duolingo, pte };
}

function track(
  gpaMin: number,
  scores: IEnglishRequirement,
  tuitionUsd: number,
  documents: readonly DocumentId[],
  gre: TestPolicy,
  gmat: TestPolicy,
  applicationFeeUsd: number,
): ITrackProfile {
  return {
    gpaMin,
    english: scores,
    gre,
    gmat,
    tuitionUsd,
    applicationFeeUsd,
    documents,
    intakes: FALL_SPRING,
  };
}

export const ADMISSION_PROFILES: Readonly<Record<AdmissionProfileId, IAdmissionProfile>> = {
  'regional-public': {
    bachelor: track(2.5, english(6.0, 71, 95, 48), 19_000, BACHELOR_DOCS, TEST_POLICIES.NOT_REQUIRED, TEST_POLICIES.NOT_REQUIRED, 50),
    masters: track(2.75, english(6.0, 79, 105, 53), 17_000, MASTERS_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.OFTEN_WAIVED, 60),
    phd: track(3.0, english(6.5, 80, 110, 58), 15_500, PHD_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.NOT_REQUIRED, 60),
  },
  'research-public': {
    bachelor: track(2.75, english(6.0, 79, 105, 53), 25_000, BACHELOR_DOCS, TEST_POLICIES.NOT_REQUIRED, TEST_POLICIES.NOT_REQUIRED, 60),
    masters: track(3.0, english(6.5, 80, 110, 58), 22_000, MASTERS_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.OFTEN_WAIVED, 75),
    phd: track(3.2, english(6.5, 90, 120, 62), 18_000, PHD_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.NOT_REQUIRED, 75),
  },
  private: {
    bachelor: track(2.5, english(6.0, 71, 95, 48), 38_000, BACHELOR_DOCS, TEST_POLICIES.NOT_REQUIRED, TEST_POLICIES.NOT_REQUIRED, 50),
    masters: track(2.75, english(6.5, 80, 110, 58), 28_000, MASTERS_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.OFTEN_WAIVED, 50),
    phd: track(3.0, english(6.5, 80, 110, 58), 28_000, PHD_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.NOT_REQUIRED, 50),
  },
  'private-stem': {
    bachelor: track(3.0, english(6.5, 80, 110, 58), 50_000, BACHELOR_DOCS, TEST_POLICIES.NOT_REQUIRED, TEST_POLICIES.NOT_REQUIRED, 75),
    masters: track(3.0, english(6.5, 80, 110, 58), 32_000, MASTERS_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.OFTEN_WAIVED, 75),
    phd: track(3.2, english(6.5, 90, 120, 62), 32_000, PHD_DOCS, TEST_POLICIES.REQUIRED, TEST_POLICIES.NOT_REQUIRED, 75),
  },
  'cal-state': {
    bachelor: track(2.5, english(6.0, 61, 95, 47), 18_500, BACHELOR_DOCS, TEST_POLICIES.NOT_REQUIRED, TEST_POLICIES.NOT_REQUIRED, 70),
    masters: track(2.75, english(6.5, 80, 105, 58), 17_500, MASTERS_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.OFTEN_WAIVED, 70),
    phd: track(3.0, english(6.5, 80, 110, 58), 17_500, PHD_DOCS, TEST_POLICIES.OFTEN_WAIVED, TEST_POLICIES.NOT_REQUIRED, 70),
  },
};
