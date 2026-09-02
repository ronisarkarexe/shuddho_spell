import { type ReactElement } from 'react';
import { VerbRoadmapDrill } from '@/components/learning/verb-roadmap-drill';
import { VerbRoadmapGuide } from '@/components/learning/verb-roadmap-guide';
import { requireUser } from '@/lib/auth/current-user';

/**
 * Verb complete roadmap — the system the five forms sit inside.
 *
 * A **reference**, on the same terms as gap-fill clues and prepositions next
 * door: nothing here is drilled into `review_items`, marked, or seeded. The
 * 998-verb list at `/library/verbs` is the corpus; this is the order a learner
 * has to meet the system in — forms, auxiliaries, the twelve tenses, the
 * passive, modals, gerunds, conditionals — before a row of go / went / gone
 * means anything.
 *
 * The drill at the top is the same component the dashboard mounts. A Server
 * Component wraps it; the chart below has nothing to fetch.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function VerbRoadmapPage(): Promise<ReactElement> {
  await requireUser();

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            Verb complete roadmap
          </h1>
          <span className="font-bengali text-muted" lang="bn">
            ক্রিয়ার সম্পূর্ণ পথ
          </span>
        </div>
        <p className="max-w-3xl text-muted">
          Five forms, three auxiliaries, twelve tenses — then the passive, the modals, and the four
          conditionals. Read them in that order. <span className="text-primary-900">She walks</span>
          , <span className="text-primary-900">she is walking</span>,{' '}
          <span className="text-primary-900">she has walked</span>,{' '}
          <span className="text-primary-900">she will have walked</span> are the same verb in four
          slots, not four verbs.
        </p>
      </header>

      <section className="card col-span-12 p-4">
        <VerbRoadmapDrill roundSize={6} tone="light" />
      </section>

      <section className="col-span-12">
        <VerbRoadmapGuide />
      </section>
    </>
  );
}
