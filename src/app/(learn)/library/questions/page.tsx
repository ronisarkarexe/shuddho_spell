import { type ReactElement } from 'react';
import { QuestionWordsGuide } from '@/components/learning/question-words-guide';
import { requireUser } from '@/lib/auth/current-user';

/**
 * WH-question words — what, who, when, where, why, how — and the pointing
 * words that sit in the answers: this, that, these, those.
 *
 * A **reference**, on the same terms as prepositions next door: nothing here is
 * drilled, marked, or seeded. IELTS Speaking and Reading open most of their
 * questions with the nine WH-words; the four pointing words are what a learner
 * uses to answer them while pointing. Below that sit the sentence words a
 * learner actually needs to write — something, anyone, wherever, another, it.
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
          <span className="text-primary-900">what</span> a thing. The answer often points:{' '}
          <span className="text-primary-900">this</span>,{' '}
          <span className="text-primary-900">that</span>,{' '}
          <span className="text-primary-900">these</span>,{' '}
          <span className="text-primary-900">those</span>. The same stems write the sentence:{' '}
          <span className="text-primary-900">something</span>,{' '}
          <span className="text-primary-900">anyone</span>,{' '}
          <span className="text-primary-900">wherever</span>.
        </p>
      </header>

      <section className="col-span-12">
        <QuestionWordsGuide />
      </section>
    </>
  );
}
