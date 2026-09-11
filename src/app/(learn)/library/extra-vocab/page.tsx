import { type ReactElement } from 'react';
import { EXTRA_VOCAB_PAGE_SIZE } from '@/components/learning/extra-vocab-contracts';
import {
  readAudioPreferences,
  readExtraVocab,
  readExtraVocabProgress,
} from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { ExtraVocabExplorer } from './extra-vocab-explorer';

/**
 * Extra vocabulary — a separate list from Saifur's. Twenty-five words a page,
 * British and American speech, and a Learning / Known mark on each card.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function ExtraVocabPage(): Promise<ReactElement> {
  const user = await requireUser();

  const [audio, opening] = await Promise.all([
    readAudioPreferences(user.userId),
    readExtraVocab(user.userId, EXTRA_VOCAB_PAGE_SIZE, 1),
  ]);

  const progress = await readExtraVocabProgress(user.userId);
  const page =
    progress.wordsRead > 0
      ? await readExtraVocab(user.userId, EXTRA_VOCAB_PAGE_SIZE, progress.lastPage)
      : opening;

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            Extra vocabulary
          </h1>
          <span className="font-bengali text-muted" lang="bn">
            অতিরিক্ত শব্দভাণ্ডার
          </span>
          <span className="num text-muted">{page.totalEntries} words</span>
        </div>
        <p className="max-w-3xl text-muted">
          Twenty-five words on a page. Press a word to hear it in British or American
          English. Mark the ones you are learning, then open Learning to study just
          those.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতি পাতায় পঁচিশটি শব্দ। ব্রিটিশ ও আমেরিকান উচ্চারণ শুনতে পারেন। যেগুলো শিখছেন
          সেগুলো চিহ্নিত করুন, তারপর শিখছি খুলে শুধু সেগুলো পড়ুন।
        </p>
      </header>

      <section className="col-span-12">
        <ExtraVocabExplorer
          initialAccent={audio.accent}
          initialPage={page}
          initialProgress={progress}
        />
      </section>
    </>
  );
}
