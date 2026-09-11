import { COUNTRY_CODES } from '../../domain/country-code';
import { type IStudyCountry } from '../../domain/study-country';

/**
 * Destinations the Education page can grow into.
 *
 * Only the United States has a university file today. The others are listed so
 * the country switcher is a real control, not a US-only heading that would have
 * to be redesigned when the second country lands.
 */
export const STUDY_COUNTRIES: readonly IStudyCountry[] = [
  {
    code: COUNTRY_CODES.US,
    nameEn: 'United States',
    nameBn: 'যুক্তরাষ্ট্র',
    available: true,
  },
  {
    code: COUNTRY_CODES.GB,
    nameEn: 'United Kingdom',
    nameBn: 'যুক্তরাজ্য',
    available: false,
  },
  {
    code: COUNTRY_CODES.CA,
    nameEn: 'Canada',
    nameBn: 'কানাডা',
    available: false,
  },
  {
    code: COUNTRY_CODES.AU,
    nameEn: 'Australia',
    nameBn: 'অস্ট্রেলিয়া',
    available: false,
  },
];
