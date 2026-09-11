'use client';

import { useState, type ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { StatusBadge } from '@/components/primitives/status-badge';
import { cn } from '@/lib/cn';
import { type IProgramTrackView, type IUniversitySummaryView } from '../application/dto/education-catalog-view';
import { PHD_AVAILABILITY } from '../domain/phd-availability';
import { PROGRAM_LEVELS, type ProgramLevel } from '../domain/program-level';
import { formatBdt, formatLakh, formatUsd } from './format-money';

interface IProgramTracksProps {
  readonly university: IUniversitySummaryView;
}

interface ILevelTab {
  readonly level: ProgramLevel;
  readonly track: IProgramTrackView | null;
}

/**
 * Bachelor / Master's / PhD on one university.
 *
 * The three programmes share a screen because a family comparing cost is
 * almost always comparing levels, not paging between them. A missing PhD is a
 * labelled empty state, not a hidden tab — hiding it would look like the page
 * forgot the degree the catalogue promised.
 */
export function ProgramTracks({ university }: IProgramTracksProps): ReactElement {
  const t = useTranslations('education');
  const tabs: readonly ILevelTab[] = [
    { level: PROGRAM_LEVELS.BACHELOR, track: university.bachelor },
    { level: PROGRAM_LEVELS.MASTERS, track: university.masters },
    { level: PROGRAM_LEVELS.PHD, track: university.phd },
  ];
  const [level, setLevel] = useState<ProgramLevel>(PROGRAM_LEVELS.BACHELOR);
  const active = tabs.find((tab) => tab.level === level) ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1" role="tablist" aria-label={t('levels')}>
        {tabs.map((tab) => {
          const selected = tab.level === level;

          return (
            <button
              aria-selected={selected}
              className={cn(
                'rounded-control px-3 py-1.5 font-medium',
                selected ? 'bg-primary-900 text-surface' : 'bg-primary-100 text-primary-900',
              )}
              key={tab.level}
              onClick={() => {
                setLevel(tab.level);
              }}
              role="tab"
              type="button"
            >
              {t(`level.${tab.level}`)}
            </button>
          );
        })}
      </div>

      {active !== undefined && (
        <div className="mt-5" role="tabpanel">
          {active.track === null ? (
            <p className="text-muted">{t('phdNone')}</p>
          ) : (
            <TrackPanel
              phdNote={
                active.level === PROGRAM_LEVELS.PHD &&
                university.phdAvailability === PHD_AVAILABILITY.LIMITED
                  ? t('phdLimited')
                  : null
              }
              track={active.track}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TrackPanel({
  track,
  phdNote,
}: {
  readonly track: IProgramTrackView;
  readonly phdNote: string | null;
}): ReactElement {
  const t = useTranslations('education');

  return (
    <div className="flex flex-col gap-5">
      {phdNote !== null && <p className="text-muted">{phdNote}</p>}

      <dl className="grid gap-3 sm:grid-cols-3">
        <Stat label={t('gpa')} value={track.gpaMin.toFixed(2)} unit="/ 4.0" />
        <Stat label={t('ielts')} value={track.english.ieltsOverall.toFixed(1)} />
        <Stat
          label={t('yearlyTotal')}
          value={formatLakh(track.totalBdt)}
          unit={t('lakhTaka')}
        />
      </dl>
      <p className="text-muted">{t('gpaNote')}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        <CostCard
          label={t('tuition')}
          usd={track.tuitionUsd}
          bdt={track.tuitionBdt}
        />
        <CostCard label={t('living')} usd={track.livingUsd} bdt={track.livingBdt} />
        <CostCard
          accent
          label={t('yearlyTotal')}
          usd={track.totalUsd}
          bdt={track.totalBdt}
        />
      </div>

      <section>
        <h3 className="label">{t('englishScores')}</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-4">
          <ScoreChip label="IELTS" value={track.english.ieltsOverall.toFixed(1)} />
          <ScoreChip label="TOEFL iBT" value={String(track.english.toeflIbt)} />
          <ScoreChip label="Duolingo" value={String(track.english.duolingo)} />
          <ScoreChip label="PTE" value={String(track.english.pte)} />
        </ul>
      </section>

      <section>
        <h3 className="label">{t('tests')}</h3>
        <p className="mt-2 text-muted">
          GRE: {t(`testPolicy.${track.gre}`)} · GMAT: {t(`testPolicy.${track.gmat}`)}
        </p>
      </section>

      <section>
        <h3 className="label">{t('intakes')}</h3>
        <p className="mt-2 flex flex-wrap gap-1">
          {track.intakes.map((intake) => (
            <StatusBadge key={intake} label={t(`intake.${intake}`)} tone="active" />
          ))}
        </p>
      </section>

      <section>
        <h3 className="label">{t('documents')}</h3>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {track.documents.map((document) => (
            <li className="border-b border-hairline py-1.5 last:border-b-0" key={document}>
              {t(`document.${document}`)}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-muted">
          {t('applicationFee')}: {formatUsd(track.applicationFeeUsd)}
        </p>
      </section>

      <p className="text-muted">{t('scholarships')}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
}): ReactElement {
  return (
    <div className="card p-4">
      <dt className="label">{label}</dt>
      <dd className="num mt-1 text-2xl text-primary-900">
        {value}
        {unit !== undefined && (
          <span className="ml-1 font-sans text-sm text-muted">{unit}</span>
        )}
      </dd>
    </div>
  );
}

function CostCard({
  label,
  usd,
  bdt,
  accent = false,
}: {
  readonly label: string;
  readonly usd: number;
  readonly bdt: number;
  readonly accent?: boolean;
}): ReactElement {
  const t = useTranslations('education');

  return (
    <div className={cn('card p-4', accent && 'card-accent')}>
      <p className="label">{label}</p>
      <p className="num mt-1 text-lg text-primary-900">{formatBdt(bdt)}</p>
      <p className="mt-1 text-muted">
        {formatLakh(bdt)} {t('lakh')} · {formatUsd(usd)}
      </p>
    </div>
  );
}

function ScoreChip({ label, value }: { readonly label: string; readonly value: string }): ReactElement {
  return (
    <li className="flex items-baseline justify-between rounded-control border border-hairline px-3 py-2">
      <span className="text-muted">{label}</span>
      <span className="num text-primary-900">{value}</span>
    </li>
  );
}
