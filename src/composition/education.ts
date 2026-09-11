import { GetUniversityUseCase } from '@/modules/education/application/use-cases/get-university';
import { ListEducationCatalogUseCase } from '@/modules/education/application/use-cases/list-education-catalog';
import { COUNTRY_CODES, isCountryCode } from '@/modules/education/domain/country-code';
import { type IEducationCatalogView, type IUniversityDetailView } from '@/modules/education/application/dto/education-catalog-view';
import { StaticUniversityCatalog } from '@/modules/education/infrastructure/static-university-catalog';

/**
 * Study-abroad catalogue wiring.
 *
 * Same reasoning as `grammar.ts`: this module has no cookies, no learner and no
 * database. A request-scoped container would imply a scope it does not have.
 *
 * Country arrives as a URL string. Invalid codes fall back to the United
 * States rather than 404ing the switcher — a mistyped `?country=` still has a
 * page, and the US list is the only one that exists today.
 */
const catalog = new StaticUniversityCatalog();

export function educationCatalog(country: string): Promise<IEducationCatalogView> {
  const code = isCountryCode(country) ? country : COUNTRY_CODES.US;

  return new ListEducationCatalogUseCase(catalog).execute({ country: code });
}

export function educationUniversity(
  country: string,
  slug: string,
): Promise<IUniversityDetailView | null> {
  if (!isCountryCode(country)) {
    return Promise.resolve(null);
  }

  return new GetUniversityUseCase(catalog).execute({ country, slug });
}
