import { type CountryCode } from './country-code';

export interface IStudyCountry {
  readonly code: CountryCode;
  readonly nameEn: string;
  readonly nameBn: string;
  readonly available: boolean;
}
