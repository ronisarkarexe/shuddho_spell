export const PHD_AVAILABILITY = Object.freeze({
  BROAD: 'broad',
  LIMITED: 'limited',
  NONE: 'none',
} as const);

export type PhdAvailability = (typeof PHD_AVAILABILITY)[keyof typeof PHD_AVAILABILITY];
