import { type ReactElement } from 'react';
import { SAIFURS_PAGE_SIZE } from '@/components/learning/saifurs-contracts';
import { readAudioPreferences, readSaifursProgress, readSaifursVocabulary } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { SaifursExplorer } from './saifurs-explorer';

/**
 * Saifur's vocabulary — numbered, paged, spoken in two accents, and readable
 * or learnable on the same screen.
 *
 * The first page and the bookmark are resolved on the server. Later pages
 * and the bookmark write go through `/api/v1/library/saifurs`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function SaifursVocabularyPage(): Promise<ReactElement> {
  const user = await requireUser();

  const [audio, opening] = await Promise.all([
    readAudioPreferences(user.userId),
    readSaifursVocabulary(user.userId, SAIFURS_PAGE_SIZE, 1),
  ]);

  const progress = await readSaifursProgress(user.userId);
  const page =
    progress.wordsRead > 0
      ? await readSaifursVocabulary(user.userId, SAIFURS_PAGE_SIZE, progress.lastPage)
      : opening;

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            Saifur&apos;s vocabulary
          </h1>
          <span className="font-bengali text-muted" lang="bn">
            সাইফুরের শব্দভাণ্ডার
          </span>
          <span className="num text-muted">{page.totalEntries} words</span>
        </div>
        <p className="max-w-3xl text-muted">
          Twenty-five words on a page. Press a word to hear it in British or American
          English. Mark the ones you are learning, then open Learning to study just
          those. Read the list, or flip the cards — meaning, synonym, antonym and a
          sentence sit on the same card.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতি পাতায় পঁচিশটি শব্দ। ব্রিটিশ ও আমেরিকান উচ্চারণ শুনতে পারেন। যেগুলো শিখছেন
          সেগুলো চিহ্নিত করুন, তারপর শিখছি খুলে শুধু সেগুলো পড়ুন। পড়ুন, অথবা কার্ড উল্টে
          শিখুন — অর্থ, প্রতিশব্দ, বিপরীত শব্দ ও বাক্য একই জায়গায়।
        </p>
      </header>

      <section className="col-span-12">
        <SaifursExplorer
          initialAccent={audio.accent}
          initialPage={page}
          initialProgress={progress}
        />
      </section>
    </>
  );
}
