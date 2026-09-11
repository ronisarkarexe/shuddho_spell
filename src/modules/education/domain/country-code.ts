export const COUNTRY_CODES = Object.freeze({
  US: 'us',
  GB: 'gb',
  CA: 'ca',
  AU: 'au',
} as const);

export type CountryCode = (typeof COUNTRY_CODES)[keyof typeof COUNTRY_CODES];

const CODES: readonly string[] = Object.values(COUNTRY_CODES);

export function isCountryCode(value: string): value is CountryCode {
  return CODES.includes(value);
}
