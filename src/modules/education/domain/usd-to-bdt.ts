/**
 * Indicative Bangladesh Bank-style mid-market rate, not a live quote.
 *
 * Tuition is published in USD. The page shows taka so a family can size the
 * year, and a rate baked into the module is honest about being a snapshot —
 * a live FX feed would imply a precision this catalogue does not have.
 */
export const USD_TO_BDT_RATE = 122;

export const USD_TO_BDT_AS_OF = '2026-09';

export function usdToBdt(usd: number): number {
  return Math.round(usd * USD_TO_BDT_RATE);
}
