import { FORMAL_INFORMAL_PAIRS } from '../../../../../../content/formal-informal/index';
import { FormalInformalPair } from '../../../domain/entities/formal-informal-pair';
import { type IFormalInformalSource } from '../../../domain/repositories/formal-informal-source';

/**
 * Informal → formal pairs, read from the compiled content module.
 *
 * Built once at construction, like the vocabulary source beside it: a few
 * hundred pairs that cannot change while the process is running.
 */
export class FormalInformalContentSource implements IFormalInformalSource {
  private readonly pairs: readonly FormalInformalPair[] = FORMAL_INFORMAL_PAIRS.map((pair) =>
    FormalInformalPair.create({
      informal: pair.informal,
      formal: pair.formal,
      informalIpa: pair.informalIpa,
      formalIpa: pair.formalIpa,
      informalBn: pair.informalBn,
      formalBn: pair.formalBn,
      topic: pair.topic,
      needsReview: pair.needsReview,
    }),
  );

  listAll(): readonly FormalInformalPair[] {
    return this.pairs;
  }
}
