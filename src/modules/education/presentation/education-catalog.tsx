'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Glyph } from '@/components/icons/glyph';
import { StatusBadge } from '@/components/primitives/status-badge';
import { cn } from '@/lib/cn';
import {
  type IEducationCatalogView,
  type IUniversitySummaryView,
} from '../application/dto/education-catalog-view';
import { PROGRAM_LEVELS } from '../domain/program-level';
import { formatBdt, formatLakh } from './format-money';
import { ProgramTracks } from './program-tracks';

const LEVEL_FILTERS = Object.freeze(['all', 'bachelor', 'masters', 'phd'] as const);

type LevelFilter = (typeof LEVEL_FILTERS)[number];

const SORTS = Object.freeze(['name', 'cost', 'ielts'] as const);

type SortKey = (typeof SORTS)[number];

interface IEducationCatalogProps {
  readonly catalog: IEducationCatalogView;
}

/**
 * Country switcher, filters, and the expandable university list.
 *
 * Search and sort stay in the client because the selected country is already
 * on the page — a hundred rows. The country itself is a link, so a reload and
 * a shared URL land on the same destination.
 */
export function EducationCatalog({ catalog }: IEducationCatalogProps): ReactElement {
  const t = useTranslations('education');
  const [query, setQuery] = useState('');
  const [state, setState] = useState('all');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [sort, setSort] = useState<SortKey>('name');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const universities = useMemo(
    () => filterUniversities(catalog.universities, query, state, level, sort),
    [catalog.universities, query, state, level, sort],
  );

  const ieltsFloor = minIelts(universities);
  const costFloor = minMastersTotal(universities);

  return (
    <div className="flex flex-col gap-8">
      <div
        aria-label={t('countries')}
        className="flex flex-wrap gap-2"
        role="tablist"
      >
        {catalog.countries.map((country) => {
          const selected = country.code === catalog.country.code;
          const href = `/education?country=${country.code}`;

          return (
            <Link
              aria-selected={selected}
              className={cn(
                'rounded-control border px-4 py-2',
                selected
                  ? 'border-primary-900 bg-primary-900 text-surface'
                  : 'border-hairline bg-surface text-primary-900 hover:border-primary-900',
              )}
              href={href}
              key={country.code}
              role="tab"
            >
              <span className="block font-medium">{country.nameEn}</span>
              <span className="mt-0.5 block font-bengali text-[11px] opacity-80" lang="bn">
                {country.nameBn}
              </span>
              <span className="num mt-1 block text-[11px] opacity-80">
                {country.available ? country.universityCount : t('comingSoon')}
              </span>
            </Link>
          );
        })}
      </div>

      {!catalog.country.available ? (
        <div className="card p-6">
          <h2 className="font-display text-xl tracking-tight text-primary-900">
            {t('comingSoonTitle', { country: catalog.country.nameEn })}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">{t('comingSoonBody')}</p>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={t('statUniversities')} value={String(universities.length)} />
            <Stat label={t('statStates')} value={String(catalog.states.length)} />
            <Stat
              label={t('statIelts')}
              value={ieltsFloor === null ? '—' : ieltsFloor.toFixed(1)}
            />
            <Stat
              label={t('statFrom')}
              value={costFloor === null ? '—' : formatLakh(costFloor)}
              unit={t('lakhTaka')}
            />
          </dl>

          <div className="card p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="label">{t('search')}</span>
                <span className="relative">
                  <Glyph className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" name="search" />
                  <input
                    className="h-10 w-full rounded-control border border-hairline bg-surface pl-9 pr-3 text-primary-900"
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder={t('searchPlaceholder')}
                    type="search"
                    value={query}
                  />
                </span>
              </label>
              <label className="flex flex-col gap-1 lg:w-44">
                <span className="label">{t('state')}</span>
                <select
                  className="h-10 rounded-control border border-hairline bg-surface px-3 text-primary-900"
                  onChange={(event) => {
                    setState(event.target.value);
                  }}
                  value={state}
                >
                  <option value="all">{t('allStates')}</option>
                  {catalog.states.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name} ({entry.universityCount})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 lg:w-40">
                <span className="label">{t('program')}</span>
                <select
                  className="h-10 rounded-control border border-hairline bg-surface px-3 text-primary-900"
                  onChange={(event) => {
                    const next = LEVEL_FILTERS.find((item) => item === event.target.value);

                    setLevel(next ?? 'all');
                  }}
                  value={level}
                >
                  {LEVEL_FILTERS.map((item) => (
                    <option key={item} value={item}>
                      {item === 'all' ? t('allPrograms') : t(`level.${item}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 lg:w-40">
                <span className="label">{t('sort')}</span>
                <select
                  className="h-10 rounded-control border border-hairline bg-surface px-3 text-primary-900"
                  onChange={(event) => {
                    const next = SORTS.find((item) => item === event.target.value);

                    setSort(next ?? 'name');
                  }}
                  value={sort}
                >
                  {SORTS.map((item) => (
                    <option key={item} value={item}>
                      {t(`sortOption.${item}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {universities.length === 0 ? (
            <p className="text-muted">{t('empty')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {universities.map((university) => (
                <UniversityRow
                  country={catalog.country.code}
                  fxAsOf={catalog.fx.asOf}
                  fxRate={catalog.fx.usdToBdt}
                  key={university.slug}
                  onToggle={() => {
                    setOpenSlug((current) =>
                      current === university.slug ? null : university.slug,
                    );
                  }}
                  open={openSlug === university.slug}
                  university={university}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function UniversityRow({
  university,
  country,
  open,
  onToggle,
  fxRate,
  fxAsOf,
}: {
  readonly university: IUniversitySummaryView;
  readonly country: string;
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly fxRate: number;
  readonly fxAsOf: string;
}): ReactElement {
  const t = useTranslations('education');
  const panelId = `university-${university.slug}`;

  return (
    <li className="card overflow-hidden">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full flex-col gap-2 px-4 py-3 text-left sm:flex-row sm:items-center sm:gap-6"
        onClick={onToggle}
        type="button"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base tracking-tight text-primary-900">
            {university.name}
          </span>
          <span className="mt-0.5 block text-muted">
            {university.city}, {university.stateName}
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-2 text-muted sm:justify-end">
          <StatusBadge label={`IELTS ${university.masters.english.ieltsOverall.toFixed(1)}`} tone="active" />
          <span className="num">
            {formatBdt(university.masters.totalBdt)}
            <span className="ml-1 font-sans">{t('perYear')}</span>
          </span>
          <Glyph
            className={cn('text-primary-900', open && 'rotate-180')}
            name="chevron-down"
          />
        </span>
      </button>

      {open && (
        <div className="border-t border-hairline px-4 py-5" id={panelId}>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <a
              className="text-primary-900 underline decoration-hairline underline-offset-2 hover:decoration-primary-900"
              href={university.website}
              rel="noreferrer"
              target="_blank"
            >
              {t('website')}
            </a>
            <Link
              className="rounded-control bg-primary-100 px-3 py-1.5 font-medium text-primary-900"
              href={`/education/${country}/${university.slug}`}
            >
              {t('openPage')}
            </Link>
            {university.needsReview && (
              <StatusBadge label={t('indicative')} tone="due" />
            )}
          </div>
          <ProgramTracks university={university} />
          <p className="mt-5 text-muted">
            {t('fxNote', { rate: fxRate, asOf: fxAsOf })}
          </p>
        </div>
      )}
    </li>
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

function filterUniversities(
  universities: readonly IUniversitySummaryView[],
  query: string,
  state: string,
  level: LevelFilter,
  sort: SortKey,
): readonly IUniversitySummaryView[] {
  const needle = query.trim().toLowerCase();

  const filtered = universities.filter((university) => {
    if (state !== 'all' && university.stateCode !== state) {
      return false;
    }

    if (level === 'phd' && university.phd === null) {
      return false;
    }

    if (needle === '') {
      return true;
    }

    return (
      university.name.toLowerCase().includes(needle) ||
      university.city.toLowerCase().includes(needle) ||
      university.stateName.toLowerCase().includes(needle) ||
      university.stateCode.toLowerCase().includes(needle)
    );
  });

  const sorted = [...filtered].sort((left, right) => compareUniversities(left, right, sort, level));

  return sorted;
}

function compareUniversities(
  left: IUniversitySummaryView,
  right: IUniversitySummaryView,
  sort: SortKey,
  level: LevelFilter,
): number {
  if (sort === 'name') {
    return left.name.localeCompare(right.name);
  }

  const leftTrack = trackForSort(left, level);
  const rightTrack = trackForSort(right, level);

  if (leftTrack === null && rightTrack === null) {
    return left.name.localeCompare(right.name);
  }

  if (leftTrack === null) {
    return 1;
  }

  if (rightTrack === null) {
    return -1;
  }

  if (sort === 'cost') {
    return leftTrack.totalUsd - rightTrack.totalUsd;
  }

  return leftTrack.english.ieltsOverall - rightTrack.english.ieltsOverall;
}

function trackForSort(university: IUniversitySummaryView, level: LevelFilter) {
  if (level === PROGRAM_LEVELS.BACHELOR) {
    return university.bachelor;
  }

  if (level === PROGRAM_LEVELS.PHD) {
    return university.phd;
  }

  return university.masters;
}

function minIelts(universities: readonly IUniversitySummaryView[]): number | null {
  if (universities.length === 0) {
    return null;
  }

  return universities.reduce(
    (floor, university) => Math.min(floor, university.bachelor.english.ieltsOverall),
    universities[0]?.bachelor.english.ieltsOverall ?? 0,
  );
}

function minMastersTotal(universities: readonly IUniversitySummaryView[]): number | null {
  if (universities.length === 0) {
    return null;
  }

  return universities.reduce(
    (floor, university) => Math.min(floor, university.masters.totalBdt),
    universities[0]?.masters.totalBdt ?? 0,
  );
}
