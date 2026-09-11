import { ADJ_VERB_ADV } from '../../../../../../content/adj-verb-adv/index';
import { AdjVerbAdvEntry } from '../../../domain/entities/adj-verb-adv-entry';
import { type IAdjVerbAdvSource } from '../../../domain/repositories/adj-verb-adv-source';

/**
 * Adjective, verb and adverb study cards, read from the compiled content module.
 */
export class AdjVerbAdvContentSource implements IAdjVerbAdvSource {
  private readonly entries: readonly AdjVerbAdvEntry[] = ADJ_VERB_ADV.map((entry) =>
    AdjVerbAdvEntry.create({
      bookSerial: entry.bookSerial,
      serial: entry.serial,
      word: entry.word,
      partOfSpeech: entry.partOfSpeech,
      bangla: entry.bangla,
      exampleEn: entry.exampleEn,
    }),
  );

  listAll(): readonly AdjVerbAdvEntry[] {
    return this.entries;
  }
}
