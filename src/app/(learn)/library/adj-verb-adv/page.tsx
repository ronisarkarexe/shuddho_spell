import { type ReactElement } from 'react';
import { ADJ_VERB_ADV_PAGE_SIZE } from '@/components/learning/adj-verb-adv-contracts';
import { readAdjVerbAdv, readAudioPreferences } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { AdjVerbAdvExplorer } from './adj-verb-adv-explorer';

/**
 * Adjectives, verbs and adverbs — three thousand study entries, twenty-five
 * a page, in book order. A separate shelf from Extra vocabulary and Saifur's.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdjVerbAdvPage(): Promise<ReactElement> {
  const user = await requireUser();

  const [audio, page] = await Promise.all([
    readAudioPreferences(user.userId),
    readAdjVerbAdv(ADJ_VERB_ADV_PAGE_SIZE, 1),
  ]);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">Adj+Verb+Ad</h1>
          <span className="font-bengali text-muted" lang="bn">
            বিশেষণ, ক্রিয়া ও ক্রিয়াবিশেষণ
          </span>
          <span className="num text-muted">{page.totalEntries} entries</span>
        </div>
        <p className="max-w-3xl text-muted">
          Twenty-five on a page. Filter by adjective, verb or adverb. Press a word
          to hear it in British or American English.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতি পাতায় পঁচিশটি। বিশেষণ, ক্রিয়া বা ক্রিয়াবিশেষণ দিয়ে ছাঁকুন। শব্দ চাপলে
          ব্রিটিশ বা আমেরিকান উচ্চারণ শুনতে পাবেন।
        </p>
      </header>

      <section className="col-span-12">
        <AdjVerbAdvExplorer initialAccent={audio.accent} initialPage={page} />
      </section>
    </>
  );
}
