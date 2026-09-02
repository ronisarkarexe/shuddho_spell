'use client';

import { type ReactElement } from 'react';
import { cn } from '@/lib/cn';

export type StudyMode = 'read' | 'learn';
export type StudyAccent = 'british' | 'american';

export interface IStudyTogglesProps {
  readonly mode: StudyMode;
  readonly accent: StudyAccent;
  readonly onMode: (mode: StudyMode) => void;
  readonly onAccent: (accent: StudyAccent) => void;
}

const ACCENT_LANG: Readonly<Record<StudyAccent, string>> = {
  british: 'en-GB',
  american: 'en-US',
};

export function studyLang(accent: StudyAccent): string {
  return ACCENT_LANG[accent];
}

/**
 * Read / Learn and British / American, the same two controls Saifur's uses.
 *
 * Shared so every library list speaks with the same hands rather than three
 * slightly different copies of the same pair of buttons.
 */
export function StudyToggles({
  mode,
  accent,
  onMode,
  onAccent,
}: IStudyTogglesProps): ReactElement {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div
        aria-label="Read or learn"
        className="grid grid-cols-2 gap-1 rounded-control border border-neutral-300 p-1 sm:inline-grid"
        role="group"
      >
        <ToggleButton
          active={mode === 'read'}
          label="Read"
          labelBn="পড়ুন"
          onClick={() => {
            onMode('read');
          }}
        />
        <ToggleButton
          active={mode === 'learn'}
          label="Learn"
          labelBn="শিখুন"
          onClick={() => {
            onMode('learn');
          }}
        />
      </div>
      <div
        aria-label="Accent"
        className="grid grid-cols-2 gap-1 rounded-control border border-neutral-300 p-1 sm:inline-grid sm:max-w-xs sm:flex-1"
        role="group"
      >
        <ToggleButton
          active={accent === 'british'}
          label="British"
          labelBn="ব্রিটিশ"
          onClick={() => {
            onAccent('british');
          }}
        />
        <ToggleButton
          active={accent === 'american'}
          label="American"
          labelBn="আমেরিকান"
          onClick={() => {
            onAccent('american');
          }}
        />
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  label,
  labelBn,
  onClick,
}: {
  readonly active: boolean;
  readonly label: string;
  readonly labelBn: string;
  readonly onClick: () => void;
}): ReactElement {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'min-h-10 rounded-control px-3 py-1.5',
        active ? 'bg-primary-900 text-surface' : 'text-muted hover:text-primary-900',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
      <span className="ml-1 font-bengali text-[11px]" lang="bn">
        {labelBn}
      </span>
    </button>
  );
}
