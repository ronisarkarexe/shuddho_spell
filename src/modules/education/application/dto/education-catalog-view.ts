import { type CountryCode } from '../../domain/country-code';
import { type DocumentId } from '../../domain/document-id';
import { type PhdAvailability } from '../../domain/phd-availability';
import { type ProgramLevel } from '../../domain/program-level';
import { type TestPolicy } from '../../domain/test-policy';
import { type IntakeSeason } from '../../domain/university';

export interface IFxRateView {
  readonly usdToBdt: number;
  readonly asOf: string;
}

export interface ICountryView {
  readonly code: CountryCode;
  readonly nameEn: string;
  readonly nameBn: string;
  readonly available: boolean;
  readonly universityCount: number;
}

export interface IStateView {
  readonly code: string;
  readonly name: string;
  readonly universityCount: number;
}

export interface IEnglishRequirementView {
  readonly ieltsOverall: number;
  readonly toeflIbt: number;
  readonly duolingo: number;
  readonly pte: number;
}

export interface IProgramTrackView {
  readonly level: ProgramLevel;
  readonly gpaMin: number;
  readonly english: IEnglishRequirementView;
  readonly gre: TestPolicy;
  readonly gmat: TestPolicy;
  readonly tuitionUsd: number;
  readonly tuitionBdt: number;
  readonly livingUsd: number;
  readonly livingBdt: number;
  readonly totalUsd: number;
  readonly totalBdt: number;
  readonly applicationFeeUsd: number;
  readonly documents: readonly DocumentId[];
  readonly intakes: readonly IntakeSeason[];
}

export interface IUniversitySummaryView {
  readonly slug: string;
  readonly name: string;
  readonly city: string;
  readonly stateCode: string;
  readonly stateName: string;
  readonly website: string;
  readonly phdAvailability: PhdAvailability;
  readonly needsReview: boolean;
  readonly bachelor: IProgramTrackView;
  readonly masters: IProgramTrackView;
  readonly phd: IProgramTrackView | null;
}

export interface IEducationCatalogView {
  readonly countries: readonly ICountryView[];
  readonly country: ICountryView;
  readonly universities: readonly IUniversitySummaryView[];
  readonly states: readonly IStateView[];
  readonly fx: IFxRateView;
}

export interface IUniversityDetailView {
  readonly university: IUniversitySummaryView;
  readonly country: ICountryView;
  readonly fx: IFxRateView;
}
