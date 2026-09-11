import { type ExtraVocabMarkStatus } from '../../domain/value-objects/extra-vocab-mark-status';

export interface IExtraVocabEntryView {
  readonly word: string;
  readonly partOfSpeech: string;
  readonly ipaBr: string;
  readonly ipaUs: string;
  readonly bangla: string;
  readonly synonyms: readonly string[];
  readonly antonyms: readonly string[];
  readonly exampleEn: string;
  readonly exampleBn: string;
  readonly needsReview: boolean;
  readonly letter: string;
  readonly cursor: string;
  readonly serial: number;
  readonly mark: ExtraVocabMarkStatus | null;
}

export interface IExtraVocabLetterTally {
  readonly letter: string;
  readonly words: number;
}

export interface IExtraVocabPosTally {
  readonly partOfSpeech: string;
  readonly words: number;
}

export interface IExtraVocabPage {
  readonly entries: readonly IExtraVocabEntryView[];
  readonly page: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly matchedEntries: number;
  readonly totalEntries: number;
  readonly letters: readonly IExtraVocabLetterTally[];
  readonly partsOfSpeech: readonly IExtraVocabPosTally[];
  readonly learningCount: number;
  readonly knownCount: number;
}

export interface IExtraVocabMarkView {
  readonly word: string;
  readonly mark: ExtraVocabMarkStatus | null;
  readonly learningCount: number;
  readonly knownCount: number;
}

export interface IExtraVocabProgressView {
  readonly lastPage: number;
  readonly lastSerial: number;
  readonly wordsRead: number;
  readonly totalEntries: number;
}
