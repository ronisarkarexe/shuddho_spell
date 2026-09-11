import { EXTRA_VOCABULARY } from '../../../../../../content/extra-vocabulary/index';
import { ExtraVocabEntry } from '../../../domain/entities/extra-vocab-entry';
import { type IExtraVocabSource } from '../../../domain/repositories/extra-vocab-source';

/**
 * Extra vocabulary cards, read from the compiled content module.
 */
export class ExtraVocabContentSource implements IExtraVocabSource {
  private readonly entries: readonly ExtraVocabEntry[] = EXTRA_VOCABULARY.map((entry) =>
    ExtraVocabEntry.create({
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

  listAll(): readonly ExtraVocabEntry[] {
    return this.entries;
  }
}
