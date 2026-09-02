import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { type ReactElement } from 'react';
import { readAudioPreferences, readWordFamilies } from '@/composition/reads';
import { requireUser } from '@/lib/auth/current-user';
import { parseWordFamilyTopic } from '@/modules/library/presentation/dto/word-family-requests';
import { FAMILY_TOPIC_PAGE_SIZE } from '../family-contracts';
import { FamilyExplorer } from '../family-explorer';

/**
 * One word-family topic — roots filed under a single IELTS subject.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function WordFamilyTopicPage({
  params,
}: {
  readonly params: Promise<{ readonly topic: string }>;
}): Promise<ReactElement> {
  const [user, resolved] = await Promise.all([requireUser(), params]);
  const topic = parseWordFamilyTopic(resolved.topic);

  if (topic === null) {
    notFound();
  }

  const [page, audio, t] = await Promise.all([
    readWordFamilies(FAMILY_TOPIC_PAGE_SIZE, topic),
    readAudioPreferences(user.userId),
    getTranslations('nav'),
  ]);

  return (
    <>
      <header className="col-span-12 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-display text-xl tracking-tight text-primary-900">
            {t(`familyTopic.${topic}`)}
          </h1>
          <span className="num text-muted">
            {page.matchedWords} words, from {page.matchedFamilies} roots
          </span>
        </div>
        <p className="max-w-3xl text-muted">
          One root, and everything English builds from it. Read the families, or learn one root at
          a time. Press a word to hear it in British or American English.
        </p>
        <p className="max-w-3xl font-bengali text-muted" lang="bn">
          একটি মূল শব্দ, আর যা ইংরেজি তা থেকে গড়ে। পড়ুন, অথবা একটি করে শিখুন। ব্রিটিশ ও
          আমেরিকান উচ্চারণ শুনতে পারেন।
        </p>
      </header>

      <section className="col-span-12">
        <FamilyExplorer
          initialAccent={audio.accent}
          initialPage={page}
          lockedTopic={topic}
          pageSize={FAMILY_TOPIC_PAGE_SIZE}
        />
      </section>
    </>
  );
}
