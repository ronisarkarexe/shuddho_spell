import { type ReactElement } from 'react';
import { GrammarPatternDrill } from '@/components/learning/grammar-pattern-drill';
import { GrammarPatternGuide } from '@/components/learning/grammar-pattern-guide';
import { requireUser } from '@/lib/auth/current-user';

/**
 * Gap-fill clues — the grammatical patterns that name the word in a blank.
 *
 * A **reference**, on the same terms as prepositions and question words next
 * door: nothing here is drilled into `review_items`, marked, or seeded. The
 * 28-day grammar course already teaches the tenses; this is the closed chart a
 * learner reaches for by name when an IELTS sentence has a hole in it.
 *
 * The drill at the top is the same component the landing page and the
 * dashboard mount. A Server Component wraps it; the chart below has nothing to
 * fetch.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function GapFillPatternsPage(): Promise<ReactElement> {
  await requireUser();

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-xl tracking-tight text-primary-900">Gap-fill clues</h1>
          <span className="font-bengali text-muted" lang="bn">
            শূন্যস্থানের ইঙ্গিত
          </span>
        </div>
        <p className="max-w-3xl text-muted">
          The words around a blank name the kind of word that can sit there —{' '}
          <span className="text-primary-900">a teacher</span>,{' '}
          <span className="text-primary-900">many students</span>,{' '}
          <span className="text-primary-900">can go</span>,{' '}
          <span className="text-primary-900">has finished</span>,{' '}
          <span className="text-primary-900">by practising</span>. Read those first.
        </p>
      </header>

      <section className="card col-span-12 p-4">
        <GrammarPatternDrill roundSize={6} tone="light" />
      </section>

      <section className="col-span-12">
        <GrammarPatternGuide />
      </section>
    </>
  );
}
