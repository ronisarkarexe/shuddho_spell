import { type DocumentId } from './document-id';
import { type PhdAvailability } from './phd-availability';
import { type ProgramLevel } from './program-level';
import { type TestPolicy } from './test-policy';
import { type CountryCode } from './country-code';

export interface IEnglishRequirement {
  readonly ieltsOverall: number;
  readonly toeflIbt: number;
  readonly duolingo: number;
  readonly pte: number;
}

export interface IProgramTrack {
  readonly level: ProgramLevel;
  /** Minimum GPA on the US 4.0 scale. */
  readonly gpaMin: number;
  readonly english: IEnglishRequirement;
  readonly gre: TestPolicy;
  readonly gmat: TestPolicy;
  /** International tuition, one academic year, USD. */
  readonly tuitionUsd: number;
  /** Typical living cost for one academic year, USD. */
  readonly livingUsd: number;
  readonly applicationFeeUsd: number;
  readonly documents: readonly DocumentId[];
  readonly intakes: readonly IntakeSeason[];
}

export const INTAKE_SEASONS = Object.freeze({
  FALL: 'fall',
  SPRING: 'spring',
  SUMMER: 'summer',
} as const);

export type IntakeSeason = (typeof INTAKE_SEASONS)[keyof typeof INTAKE_SEASONS];

export interface IUniversity {
  readonly slug: string;
  readonly name: string;
  readonly city: string;
  readonly stateCode: string;
  readonly stateName: string;
  readonly country: CountryCode;
  readonly website: string;
  readonly bachelor: IProgramTrack;
  readonly masters: IProgramTrack;
  readonly phd: IProgramTrack | null;
  readonly phdAvailability: PhdAvailability;
  /**
   * Numeric admission figures are typical published ranges, not a live scrape.
   * The screen must not present them as a guarantee.
   */
  readonly needsReview: boolean;
}
