export interface IAdjVerbAdvEntryView {
  readonly bookSerial: number;
  readonly serial: number;
  readonly word: string;
  readonly partOfSpeech: string;
  readonly bangla: string;
  readonly exampleEn: string;
  readonly letter: string;
  readonly cursor: string;
}

export interface IAdjVerbAdvLetterTally {
  readonly letter: string;
  readonly words: number;
}

export interface IAdjVerbAdvPosTally {
  readonly partOfSpeech: string;
  readonly words: number;
}

export interface IAdjVerbAdvPage {
  readonly entries: readonly IAdjVerbAdvEntryView[];
  readonly page: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly matchedEntries: number;
  readonly totalEntries: number;
  readonly letters: readonly IAdjVerbAdvLetterTally[];
  readonly partsOfSpeech: readonly IAdjVerbAdvPosTally[];
}
