import { type Metadata } from 'next';
import { type ReactElement } from 'react';
import { getTranslations } from 'next-intl/server';
import { readEducationCatalog } from '@/composition/reads';
import { EducationCatalog } from '@/modules/education/presentation/education-catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Education · ShuddhoSpell',
  description:
    'US universities where Bangladeshi students can apply for Bachelor, Master’s and PhD study, with typical admission scores and yearly cost in taka.',
};

interface IEducationPageProps {
  readonly searchParams: Promise<Record<string, string | readonly string[] | undefined>>;
}

/**
 * Public study-abroad catalogue. No session.
 *
 * Outside every authenticated route group on purpose: a family researching
 * universities is not a learner yet, and sending them through Google would
 * make the page a brochure they cannot open.
 */
export default async function EducationPage(props: IEducationPageProps): Promise<ReactElement> {
  const t = await getTranslations('education');
  const searchParams = await props.searchParams;
  const raw = searchParams['country'];
  const country = typeof raw === 'string' ? raw : 'us';
  const catalog = await readEducationCatalog(country);

  return (
    <main>
      <section className="bg-primary-900 text-surface">
        <div className="mx-auto max-w-content px-5 py-12 sm:px-6 sm:py-16">
          <p className="label text-primary-100">{t('kicker')}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight text-surface sm:text-5xl">
            {t('heading')}
          </h1>
          <p className="mt-6 max-w-2xl text-primary-100">{t('lede')}</p>
          <p className="mt-4 max-w-2xl font-bengali text-primary-100" lang="bn">
            {t('ledeBn')}
          </p>
          <p className="mt-4 max-w-2xl font-bengali text-secondary-300" lang="bn">
            {t('service')}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-content px-5 sm:px-6">
          <p className="mb-8 max-w-3xl text-muted">{t('disclaimer')}</p>
          <EducationCatalog catalog={catalog} />
        </div>
      </section>
    </main>
  );
}
