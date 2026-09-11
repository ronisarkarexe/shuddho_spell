import Link from 'next/link';
import { type ReactElement } from 'react';
import { getTranslations } from 'next-intl/server';
import { StatusBadge } from '@/components/primitives/status-badge';
import { type IUniversityDetailView } from '../application/dto/education-catalog-view';
import { ProgramTracks } from './program-tracks';

interface IUniversityDetailProps {
  readonly detail: IUniversityDetailView;
}

/**
 * One university, fully opened.
 *
 * The catalogue row shows the same tracks; this page exists so a family can
 * share a link to a single school without the rest of the hundred.
 */
export async function UniversityDetail({ detail }: IUniversityDetailProps): Promise<ReactElement> {
  const t = await getTranslations('education');
  const { university, country, fx } = detail;

  return (
    <article className="flex flex-col gap-8">
      <p>
        <Link className="text-muted hover:text-primary-900" href={`/education?country=${country.code}`}>
          ← {t('backToList')}
        </Link>
      </p>

      <header className="flex flex-col gap-3">
        <p className="label">
          {country.nameEn} · {university.stateName}
        </p>
        <h1 className="font-display text-3xl tracking-tight text-primary-900 sm:text-4xl">
          {university.name}
        </h1>
        <p className="text-muted">
          {university.city}, {university.stateName}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            className="rounded-control bg-primary-900 px-4 py-2 font-medium text-surface"
            href={university.website}
            rel="noreferrer"
            target="_blank"
          >
            {t('website')}
          </a>
          {university.needsReview && <StatusBadge label={t('indicative')} tone="due" />}
        </div>
      </header>

      <p className="max-w-3xl text-muted">{t('disclaimer')}</p>

      <ProgramTracks university={university} />

      <p className="text-muted">{t('fxNote', { rate: fx.usdToBdt, asOf: fx.asOf })}</p>
    </article>
  );
}
