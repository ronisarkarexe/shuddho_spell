import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { type ReactElement } from 'react';
import { FORMAL_INFORMAL_TOPIC_PAGE_SIZE } from '@/components/learning/formal-informal-contracts';
import { readAudioPreferences, readFormalInformal } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { parseFormalInformalTopic } from '@/modules/library/presentation/dto/formal-informal-requests';
import { FormalInformalExplorer } from '../formal-informal-explorer';

/**
 * One informal → formal topic, twenty-five pairs a page, with Read / Learn.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function FormalInformalTopicPage({
  params,
}: {
  readonly params: Promise<{ readonly topic: string }>;
}): Promise<ReactElement> {
  const [user, resolved] = await Promise.all([requireUser(), params]);
  const topic = parseFormalInformalTopic(resolved.topic);

  if (topic === null) {
    notFound();
  }

  const [page, audio, t] = await Promise.all([
    readFormalInformal(FORMAL_INFORMAL_TOPIC_PAGE_SIZE, 1, topic),
    readAudioPreferences(user.userId),
    getTranslations('nav'),
  ]);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            {t(`formalTopic.${topic}`)}
          </h1>
          <span className="num text-muted">{page.matchedPairs} pairs</span>
        </div>
        <p className="max-w-3xl text-muted">
          Left is informal, right is formal. Twenty-five pairs on a page. Read, or learn one card
          at a time.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          বামে অনানুষ্ঠানিক, ডানে আনুষ্ঠানিক। প্রতি পাতায় পঁচিশটি জোড়া। পড়ুন, অথবা কার্ড উল্টে
          শিখুন।
        </p>
      </header>

      <section className="col-span-12">
        <FormalInformalExplorer
          initialAccent={audio.accent}
          initialPage={page}
          initialProgress={{ lastPage: 1, lastSerial: 0, pairsRead: 0, totalPairs: page.totalPairs }}
          lockedTopic={topic}
          pageSize={FORMAL_INFORMAL_TOPIC_PAGE_SIZE}
        />
      </section>
    </>
  );
}
