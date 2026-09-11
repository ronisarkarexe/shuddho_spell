export const TEST_POLICIES = Object.freeze({
  NOT_REQUIRED: 'notRequired',
  OFTEN_WAIVED: 'oftenWaived',
  REQUIRED: 'required',
} as const);

export type TestPolicy = (typeof TEST_POLICIES)[keyof typeof TEST_POLICIES];
