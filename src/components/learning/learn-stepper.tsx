'use client';

import { type ReactElement } from 'react';

export interface ILearnStepperProps {
  readonly index: number;
  readonly total: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

/** Previous / next inside Learn mode, one card at a time on the current page. */
export function LearnStepper({
  index,
  total,
  onPrevious,
  onNext,
}: ILearnStepperProps): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
        disabled={index <= 0}
        onClick={onPrevious}
        type="button"
      >
        Previous
        <span className="ml-1 font-bengali" lang="bn">
          আগেরটি
        </span>
      </button>
      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
        disabled={index >= total - 1}
        onClick={onNext}
        type="button"
      >
        Next
        <span className="ml-1 font-bengali" lang="bn">
          পরেরটি
        </span>
      </button>
    </div>
  );
}
