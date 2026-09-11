import { IELTS_SAIFURS_VOCABULARY } from '../../../../../../content/ielts-saifurs-vocabulary/index';
import { IeltsSaifursEntry } from '../../../domain/entities/ielts-saifurs-entry';
import { type IIeltsSaifursSource } from '../../../domain/repositories/ielts-saifurs-source';

/**
 * IELTS Saifur's-style cards, read from the compiled content module.
 */
export class IeltsSaifursContentSource implements IIeltsSaifursSource {
  private readonly entries: readonly IeltsSaifursEntry[] = IELTS_SAIFURS_VOCABULARY.map((entry) =>
    IeltsSaifursEntry.create({
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

  listAll(): readonly IeltsSaifursEntry[] {
    return this.entries;
  }
}
