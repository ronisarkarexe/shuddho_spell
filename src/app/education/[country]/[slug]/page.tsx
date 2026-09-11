import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ReactElement } from 'react';
import { readEducationUniversity } from '@/composition/reads';
import { UniversityDetail } from '@/modules/education/presentation/university-detail';

export const dynamic = 'force-dynamic';

interface IUniversityPageProps {
  readonly params: Promise<{ readonly country: string; readonly slug: string }>;
}

export async function generateMetadata(props: IUniversityPageProps): Promise<Metadata> {
  const { country, slug } = await props.params;
  const detail = await readEducationUniversity(country, slug);

  if (detail === null) {
    return { title: 'Education · ShuddhoSpell' };
  }

  return {
    title: `${detail.university.name} · Education · ShuddhoSpell`,
    description: `Admission requirements, English scores and yearly cost for ${detail.university.name}.`,
  };
}

/**
 * One university. Same catalogue the list page uses; a missing slug is a 404
 * rather than an empty card that looks like a loading failure.
 */
export default async function EducationUniversityPage(
  props: IUniversityPageProps,
): Promise<ReactElement> {
  const { country, slug } = await props.params;
  const detail = await readEducationUniversity(country, slug);

  if (detail === null) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-content px-5 py-10 sm:px-6 sm:py-14">
      <UniversityDetail detail={detail} />
    </main>
  );
}
