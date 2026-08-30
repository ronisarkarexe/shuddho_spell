import { type ReactElement } from 'react';
import { PrepositionGuide } from '@/components/learning/preposition-guide';
import { requireUser } from '@/lib/auth/current-user';

/**
 * Prepositions — the small words that name a relationship.
 *
 * A **reference**, on the same terms as verb forms next door: nothing here is
 * drilled into `review_items`, marked, or seeded into `words`. The 28-day
 * grammar course already teaches dependent prepositions on day 25; this is the
 * closed list a learner reaches for by name.
 *
 * A Server Component all the way down. There is nothing to fetch.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function PrepositionsPage(): Promise<ReactElement> {
  await requireUser();

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-xl tracking-tight text-primary-900">Prepositions</h1>
          <span className="font-bengali text-muted" lang="bn">
            অব্যয়
          </span>
        </div>
        <p className="max-w-3xl text-muted">
          The word that sits in front of a noun and tells you where, when, which way, or why —{' '}
          <span className="text-primary-900">on the table</span>,{' '}
          <span className="text-primary-900">in Bangladesh</span>,{' '}
          <span className="text-primary-900">from India</span>,{' '}
          <span className="text-primary-900">to school</span>.
        </p>
      </header>

      <section className="col-span-12">
        <PrepositionGuide />
      </section>
    </>
  );
}
