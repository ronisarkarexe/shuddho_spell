'use client';

import { type ReactElement } from 'react';

export interface INumberedPagerProps {
  readonly page: number;
  readonly totalPages: number;
  readonly jumpValue: string;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onJump: (page: number) => void;
  readonly onJumpValue: (value: string) => void;
}

/** Previous / jump / next — the pager Saifur's and informal/formal already share. */
export function NumberedPager({
  page,
  totalPages,
  jumpValue,
  onPrevious,
  onNext,
  onJump,
  onJumpValue,
}: INumberedPagerProps): ReactElement {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-muted disabled:opacity-40"
        disabled={page <= 1}
        onClick={onPrevious}
        type="button"
      >
        Previous page
        <span className="ml-1 font-bengali" lang="bn">
          আগের পাতা
        </span>
      </button>

      <form
        className="flex items-center justify-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const next = Number.parseInt(jumpValue, 10);

          if (Number.isFinite(next)) {
            onJump(Math.min(totalPages, Math.max(1, next)));
          }
        }}
      >
        <label className="flex items-center gap-2 text-muted">
          Page
          <span className="font-bengali" lang="bn">
            পাতা
          </span>
          <input
            className="num h-10 w-16 rounded-control border border-neutral-300 px-2 text-center"
            inputMode="numeric"
            max={totalPages}
            min={1}
            onChange={(event) => {
              onJumpValue(event.target.value);
            }}
            value={jumpValue}
          />
          of <span className="num">{totalPages}</span>
        </label>
        <button
          className="h-10 rounded-control border border-neutral-300 px-3 text-primary-900"
          type="submit"
        >
          Go
        </button>
      </form>

      <button
        className="min-h-11 rounded-control border border-neutral-300 px-3 py-2 text-primary-900 disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={onNext}
        type="button"
      >
        Next page
        <span className="ml-1 font-bengali" lang="bn">
          পরের পাতা
        </span>
      </button>
    </div>
  );
}
