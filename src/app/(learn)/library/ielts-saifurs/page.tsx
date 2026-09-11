import { type ReactElement } from 'react';
import { IELTS_SAIFURS_PAGE_SIZE } from '@/components/learning/ielts-saifurs-contracts';
import { readAudioPreferences, readIeltsSaifurs } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { IeltsSaifursExplorer } from './ielts-saifurs-explorer';

/**
 * IELTS Saifur's vocabulary — a separate shelf from the admission Saifur's
 * list. Twenty-five words a page, British and American speech, Read or Learn.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function IeltsSaifursVocabularyPage(): Promise<ReactElement> {
  const user = await requireUser();

  const [audio, page] = await Promise.all([
    readAudioPreferences(user.userId),
    readIeltsSaifurs(IELTS_SAIFURS_PAGE_SIZE, 1),
  ]);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            IELTS Saifur&apos;s vocabulary
          </h1>
          <span className="font-bengali text-muted" lang="bn">
            আইইএলটিএস সাইফুরের শব্দভাণ্ডার
          </span>
          <span className="num text-muted">{page.totalEntries} words</span>
        </div>
        <p className="max-w-3xl text-muted">
          Twenty-five words on a page. Press a word to hear it in British or American
          English. Read the list, or flip the cards to learn — meaning, synonym, antonym
          and a sentence sit on the same card.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতি পাতায় পঁচিশটি শব্দ। ব্রিটিশ ও আমেরিকান উচ্চারণ শুনতে পারেন। পড়ুন, অথবা কার্ড
          উল্টে শিখুন — অর্থ, প্রতিশব্দ, বিপরীত শব্দ ও বাক্য একই জায়গায়।
        </p>
      </header>

      <section className="col-span-12">
        <IeltsSaifursExplorer initialAccent={audio.accent} initialPage={page} />
      </section>
    </>
  );
}
