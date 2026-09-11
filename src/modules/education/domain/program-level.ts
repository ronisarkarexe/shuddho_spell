export const PROGRAM_LEVELS = Object.freeze({
  BACHELOR: 'bachelor',
  MASTERS: 'masters',
  PHD: 'phd',
} as const);

export type ProgramLevel = (typeof PROGRAM_LEVELS)[keyof typeof PROGRAM_LEVELS];

const LEVELS: readonly string[] = Object.values(PROGRAM_LEVELS);

export function isProgramLevel(value: string): value is ProgramLevel {
  return LEVELS.includes(value);
}
