import { SAIFURS_VOCABULARY } from '../../../../../../content/saifurs-vocabulary/index';
import { SaifursEntry } from '../../../domain/entities/saifurs-entry';
import { type ISaifursSource } from '../../../domain/repositories/saifurs-source';

/**
 * Saifur's-style cards, read from the compiled content module.
 *
 * Built once at construction, like the vocabulary source beside it: a few
 * hundred cards that cannot change while the process is running.
 */
export class SaifursContentSource implements ISaifursSource {
  private readonly entries: readonly SaifursEntry[] = SAIFURS_VOCABULARY.map((entry) =>
    SaifursEntry.create({
      word: entry.word,
      partOfSpeech: entry.partOfSpeech,
      ipaBr: entry.ipaBr,
      ipaUs: entry.ipaUs,
      bangla: entry.bangla,
      synonyms: entry.synonyms,
      antonyms: entry.antonyms,
      exampleEn: entry.exampleEn,
      exampleBn: entry.exampleBn,
      needsReview: entry.needsReview,
    }),
  );

  listAll(): readonly SaifursEntry[] {
    return this.entries;
  }
}
