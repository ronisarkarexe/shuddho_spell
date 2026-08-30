import { type ReactElement } from 'react';
import { QuestionWordsGuide } from '@/components/learning/question-words-guide';
import { requireUser } from '@/lib/auth/current-user';

/**
 * WH-question words — what, who, when, where, why, how.
 *
 * A **reference**, on the same terms as prepositions next door: nothing here is
 * drilled, marked, or seeded. IELTS Speaking and Reading open most of their
 * questions with these nine words; this is the list a learner reaches for by
 * name.
 *
 * A Server Component all the way down. There is nothing to fetch.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function QuestionWordsPage(): Promise<ReactElement> {
  await requireUser();

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-xl tracking-tight text-primary-900">Question words</h1>
          <span className="font-bengali text-muted" lang="bn">
            প্রশ্নশব্দ
          </span>
        </div>
        <p className="max-w-3xl text-muted">
          The first word of the question names the kind of answer —{' '}
          <span className="text-primary-900">who</span> a person,{' '}
          <span className="text-primary-900">where</span> a place,{' '}
          <span className="text-primary-900">when</span> a time,{' '}
          <span className="text-primary-900">why</span> a reason,{' '}
          <span className="text-primary-900">what</span> a thing.
        </p>
      </header>

      <section className="col-span-12">
        <QuestionWordsGuide />
      </section>
    </>
  );
}
