import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { type ReactElement } from 'react';
import { VOCABULARY_PAGE_SIZE } from '@/components/learning/vocabulary-contracts';
import { readAudioPreferences, readVocabulary } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { parseVocabularyTopic } from '@/modules/library/presentation/dto/vocabulary-requests';
import { VocabularyExplorer } from '../vocabulary-explorer';

/**
 * One IELTS vocabulary topic — the same Read / Learn screen as the mixed list,
 * locked to the topic in the URL so the rail can send a learner straight here.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function VocabularyTopicPage({
  params,
}: {
  readonly params: Promise<{ readonly topic: string }>;
}): Promise<ReactElement> {
  const [user, resolved] = await Promise.all([requireUser(), params]);
  const topic = parseVocabularyTopic(resolved.topic);

  if (topic === null) {
    notFound();
  }

  const [page, audio, t] = await Promise.all([
    readVocabulary(VOCABULARY_PAGE_SIZE, 1, topic),
    readAudioPreferences(user.userId),
    getTranslations('nav'),
  ]);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            {t(`vocabTopic.${topic}`)}
          </h1>
          <span className="num text-muted">{page.matchedEntries} pairs</span>
        </div>
        <p className="max-w-3xl text-muted">
          Twenty-five pairs on a page. Read the list, or flip the cards to learn the better word.
          Press a word to hear it in British or American English.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          প্রতি পাতায় পঁচিশটি জোড়া। পড়ুন, অথবা কার্ড উল্টে শিখুন। ব্রিটিশ ও আমেরিকান উচ্চারণ
          শুনতে পারেন।
        </p>
      </header>

      <section className="col-span-12">
        <VocabularyExplorer
          initialAccent={audio.accent}
          initialPage={page}
          lockedTopic={topic}
          pageSize={VOCABULARY_PAGE_SIZE}
        />
      </section>
    </>
  );
}
