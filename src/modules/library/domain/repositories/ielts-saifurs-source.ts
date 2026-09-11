import { type IeltsSaifursEntry } from '../entities/ielts-saifurs-entry';

export const IELTS_SAIFURS_SOURCE = Symbol('IELTS_SAIFURS_SOURCE');

/**
 * Where the IELTS Saifur's-style cards come from. A compiled module, not a
 * table, and a separate corpus from the admission Saifur's list.
 */
export interface IIeltsSaifursSource {
  readonly listAll: () => readonly IeltsSaifursEntry[];
}
