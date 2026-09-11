import { type CountryCode } from '../../domain/country-code';
import { type IUniversityCatalog } from '../../domain/repositories/university-catalog';
import { type IUniversityDetailView } from '../dto/education-catalog-view';
import { countryView, fxRateView, universitySummaryView } from '../map-university-view';

export interface IGetUniversityInput {
  readonly country: CountryCode;
  readonly slug: string;
}

/**
 * One university's admission tracks, or null when the slug is not in this
 * country — the page turns that into a 404 rather than an empty card.
 */
export class GetUniversityUseCase {
  constructor(private readonly catalog: IUniversityCatalog) {}

  async execute(input: IGetUniversityInput): Promise<IUniversityDetailView | null> {
    const [university, countries] = await Promise.all([
      this.catalog.findBySlug(input.country, input.slug),
      this.catalog.listCountries(),
    ]);

    if (university === null) {
      return null;
    }

    const country = countries.find((entry) => entry.code === university.country);

    if (country === undefined) {
      return null;
    }

    const list = await this.catalog.listByCountry(country.code);

    return {
      university: universitySummaryView(university),
      country: countryView(country, list.length),
      fx: fxRateView(),
    };
  }
}
