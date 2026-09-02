import { type ReactElement } from 'react';
import { FORMAL_INFORMAL_PAGE_SIZE } from '@/components/learning/formal-informal-contracts';
import { readFormalInformal, readFormalInformalProgress } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { FormalInformalExplorer } from './formal-informal-explorer';

/**
 * Informal → formal vocabulary — numbered, paged, and bookmarked.
 *
 * The first page and the bookmark are resolved on the server. Later pages
 * and the bookmark write go through `/api/v1/library/formal-informal`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function FormalInformalPage(): Promise<ReactElement> {
  const user = await requireUser();

  const progress = await readFormalInformalProgress(user.userId);
  const page = await readFormalInformal(
    FORMAL_INFORMAL_PAGE_SIZE,
    progress.pairsRead > 0 ? progress.lastPage : 1,
  );

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
          Left is the word you already say —{' '}
          <span className="text-primary-900">informal</span>. Right is the word a letter
          or an exam is waiting for — <span className="text-mastered">formal</span>.{' '}
          <span className="text-primary-900">ask</span> →{' '}
          <span className="text-mastered">enquire</span>.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          বামে অনানুষ্ঠানিক, ডানে আনুষ্ঠানিক। প্রতিটি শব্দের উচ্চারণ ও বাংলা অর্থ আছে। আপনি যে
          পাতায় ছিলেন সেটি মনে রাখা হয়।
        </p>
      </header>

      <section className="col-span-12">
        <FormalInformalExplorer initialPage={page} initialProgress={progress} />
      </section>
    </>
  );
}
