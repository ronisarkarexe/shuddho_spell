import { USD_TO_BDT_AS_OF, USD_TO_BDT_RATE, usdToBdt } from '../domain/usd-to-bdt';
import { type IProgramTrack, type IUniversity } from '../domain/university';
import { type IStudyCountry } from '../domain/study-country';
import {
  type ICountryView,
  type IFxRateView,
  type IProgramTrackView,
  type IStateView,
  type IUniversitySummaryView,
} from './dto/education-catalog-view';

export function fxRateView(): IFxRateView {
  return { usdToBdt: USD_TO_BDT_RATE, asOf: USD_TO_BDT_AS_OF };
}

export function countryView(country: IStudyCountry, universityCount: number): ICountryView {
  return {
    code: country.code,
    nameEn: country.nameEn,
    nameBn: country.nameBn,
    available: country.available,
    universityCount,
  };
}

export function programTrackView(track: IProgramTrack): IProgramTrackView {
  const totalUsd = track.tuitionUsd + track.livingUsd;

  return {
    level: track.level,
    gpaMin: track.gpaMin,
    english: track.english,
    gre: track.gre,
    gmat: track.gmat,
    tuitionUsd: track.tuitionUsd,
    tuitionBdt: usdToBdt(track.tuitionUsd),
    livingUsd: track.livingUsd,
    livingBdt: usdToBdt(track.livingUsd),
    totalUsd,
    totalBdt: usdToBdt(totalUsd),
    applicationFeeUsd: track.applicationFeeUsd,
    documents: track.documents,
    intakes: track.intakes,
  };
}

export function universitySummaryView(university: IUniversity): IUniversitySummaryView {
  return {
    slug: university.slug,
    name: university.name,
    city: university.city,
    stateCode: university.stateCode,
    stateName: university.stateName,
    website: university.website,
    phdAvailability: university.phdAvailability,
    needsReview: university.needsReview,
    bachelor: programTrackView(university.bachelor),
    masters: programTrackView(university.masters),
    phd: university.phd === null ? null : programTrackView(university.phd),
  };
}

export function stateViews(universities: readonly IUniversity[]): readonly IStateView[] {
  const counts = new Map<string, IStateView>();

  for (const university of universities) {
    const existing = counts.get(university.stateCode);

    if (existing === undefined) {
      counts.set(university.stateCode, {
        code: university.stateCode,
        name: university.stateName,
        universityCount: 1,
      });
    } else {
      counts.set(university.stateCode, {
        ...existing,
        universityCount: existing.universityCount + 1,
      });
    }
  }

  return [...counts.values()].sort((left, right) => left.name.localeCompare(right.name));
}
