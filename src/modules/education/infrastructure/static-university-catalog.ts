import { COUNTRY_CODES, type CountryCode } from '../domain/country-code';
import { PHD_AVAILABILITY } from '../domain/phd-availability';
import { PROGRAM_LEVELS } from '../domain/program-level';
import { type IUniversityCatalog } from '../domain/repositories/university-catalog';
import { type IStudyCountry } from '../domain/study-country';
import { type IProgramTrack, type IUniversity } from '../domain/university';
import {
  ADMISSION_PROFILES,
  LIVING_USD,
  type ITrackProfile,
} from './catalog/admission-profiles';
import { STUDY_COUNTRIES } from './catalog/study-countries';
import { US_UNIVERSITY_SEEDS, type IUniversitySeed } from './catalog/us-universities';

function expandTrack(
  profile: ITrackProfile,
  level: IProgramTrack['level'],
  livingUsd: number,
): IProgramTrack {
  return {
    level,
    gpaMin: profile.gpaMin,
    english: profile.english,
    gre: profile.gre,
    gmat: profile.gmat,
    tuitionUsd: profile.tuitionUsd,
    livingUsd,
    applicationFeeUsd: profile.applicationFeeUsd,
    documents: profile.documents,
    intakes: profile.intakes,
  };
}

function expandSeed(seed: IUniversitySeed): IUniversity {
  const profile = ADMISSION_PROFILES[seed.profile];
  const livingUsd = LIVING_USD[seed.living];

  return {
    slug: seed.slug,
    name: seed.name,
    city: seed.city,
    stateCode: seed.stateCode,
    stateName: seed.stateName,
    country: COUNTRY_CODES.US,
    website: seed.website,
    bachelor: expandTrack(profile.bachelor, PROGRAM_LEVELS.BACHELOR, livingUsd),
    masters: expandTrack(profile.masters, PROGRAM_LEVELS.MASTERS, livingUsd),
    phd:
      seed.phd === PHD_AVAILABILITY.NONE
        ? null
        : expandTrack(profile.phd, PROGRAM_LEVELS.PHD, livingUsd),
    phdAvailability: seed.phd,
    needsReview: true,
  };
}

const BY_COUNTRY: Readonly<Record<CountryCode, readonly IUniversity[]>> = {
  us: US_UNIVERSITY_SEEDS.map(expandSeed),
  gb: [],
  ca: [],
  au: [],
};

function universitiesIn(country: CountryCode): readonly IUniversity[] {
  switch (country) {
    case COUNTRY_CODES.US:
      return BY_COUNTRY.us;
    case COUNTRY_CODES.GB:
      return BY_COUNTRY.gb;
    case COUNTRY_CODES.CA:
      return BY_COUNTRY.ca;
    case COUNTRY_CODES.AU:
      return BY_COUNTRY.au;
  }
}

/**
 * Compiled study-abroad catalogue.
 *
 * Built once at construction. A country file that has not been written yet is
 * an empty list, not a missing key — the switcher can already name the
 * destination.
 */
export class StaticUniversityCatalog implements IUniversityCatalog {
  listCountries(): Promise<readonly IStudyCountry[]> {
    return Promise.resolve(STUDY_COUNTRIES);
  }

  listByCountry(country: CountryCode): Promise<readonly IUniversity[]> {
    return Promise.resolve(universitiesIn(country));
  }

  findBySlug(country: CountryCode, slug: string): Promise<IUniversity | null> {
    const match = universitiesIn(country).find((university) => university.slug === slug);

    return Promise.resolve(match ?? null);
  }
}
