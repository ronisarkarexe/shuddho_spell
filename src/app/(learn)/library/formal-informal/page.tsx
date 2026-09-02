import { type ReactElement } from 'react';
import { readFormalInformal } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { FormalInformalExplorer } from './formal-informal-explorer';

/**
 * Informal → formal vocabulary — the everyday word, and the letter word.
 *
 * A **reference**, not a lesson, on the same terms as the IELTS vocabulary
 * next door: nothing here is drilled into `review_items`, marked, or seeded
 * into `words`. Each pair carries British IPA and a Bangla gloss on both
 * sides, because the whole point of opening this screen is to hear the word
 * and know what it means.
 *
 * The first page is resolved on the server through the composition root.
 * Every page after that comes from `/api/v1/library/formal-informal` — the
 * same use case, reached the other way.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 24;

export default async function FormalInformalPage(): Promise<ReactElement> {
  await requireUser();

  const page = await readFormalInformal(PAGE_SIZE);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            Informal and formal
          </h1>
          <span className="font-bengali text-muted" lang="bn">
            অনানুষ্ঠানিক ও আনুষ্ঠানিক
          </span>
          <span className="num text-muted">{page.totalPairs} pairs</span>
        </div>
        <p className="max-w-3xl text-muted">
          The word you already say, and the word a letter, an exam or a stranger is waiting
          for — <span className="text-primary-900">ask</span> →{' '}
          <span className="text-mastered">enquire</span>,{' '}
          <span className="text-primary-900">kids</span> →{' '}
          <span className="text-mastered">children</span>. The meaning does not change; the
          register does.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতিটি শব্দের উচ্চারণ ও বাংলা অর্থ আছে। বোতাম চাপলে শব্দটি শোনা যাবে।
        </p>
      </header>

      <section className="col-span-12">
        <FormalInformalExplorer initialPage={page} />
      </section>
    </>
  );
}
