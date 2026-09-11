import { type CountryCode } from '../../domain/country-code';
import { type IUniversityCatalog } from '../../domain/repositories/university-catalog';
import { type IEducationCatalogView } from '../dto/education-catalog-view';
import { countryView, fxRateView, stateViews, universitySummaryView } from '../map-university-view';

export interface IListEducationCatalogInput {
  readonly country: CountryCode;
}

/**
 * One country's universities, plus the destination switcher.
 *
 * Filtering by search, state and programme stays on the screen: the whole US
 * list is a hundred rows, and a second request to narrow it would be latency
 * for a sort the browser can do in a millisecond.
 */
export class ListEducationCatalogUseCase {
  constructor(private readonly catalog: IUniversityCatalog) {}

  async execute(input: IListEducationCatalogInput): Promise<IEducationCatalogView> {
    const countries = await this.catalog.listCountries();
    const selected = countries.find((country) => country.code === input.country) ?? countries[0];

    if (selected === undefined) {
      return {
        countries: [],
        country: {
          code: input.country,
          nameEn: '',
          nameBn: '',
          available: false,
          universityCount: 0,
        },
        universities: [],
        states: [],
        fx: fxRateView(),
      };
    }

    const universities = selected.available ? await this.catalog.listByCountry(selected.code) : [];

    const countryViews = await Promise.all(
      countries.map(async (country) => {
        const list = country.available ? await this.catalog.listByCountry(country.code) : [];

        return countryView(country, list.length);
      }),
    );

    return {
      countries: countryViews,
      country: countryView(selected, universities.length),
      universities: universities.map(universitySummaryView),
      states: stateViews(universities),
      fx: fxRateView(),
    };
  }
}
