import { type CountryCode } from '../country-code';
import { type IStudyCountry } from '../study-country';
import { type IUniversity } from '../university';

export const UNIVERSITY_CATALOG = Symbol('UNIVERSITY_CATALOG');

/**
 * Where the study-abroad catalogue comes from.
 *
 * A port even though today's adapter is a compiled module. The next country is
 * another file in the same adapter; a later CMS would replace the adapter and
 * leave every use case and screen unchanged.
 */
export interface IUniversityCatalog {
  readonly listCountries: () => Promise<readonly IStudyCountry[]>;

  readonly listByCountry: (country: CountryCode) => Promise<readonly IUniversity[]>;

  readonly findBySlug: (
    country: CountryCode,
    slug: string,
  ) => Promise<IUniversity | null>;
}
