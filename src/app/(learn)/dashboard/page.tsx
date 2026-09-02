import Link from 'next/link';
import { type ReactElement } from 'react';
import { MasteryMatrix, type IMasteryMatrixCell } from '@/components/data/mastery-matrix';
import { GrammarPatternDrill } from '@/components/learning/grammar-pattern-drill';
import { VerbDrill } from '@/components/learning/verb-drill';
import { VocabularyDrill } from '@/components/learning/vocabulary-drill';
import { PushPermissionBanner } from '@/components/notifications/push-permission-banner';
import { HeatCell } from '@/components/primitives/heat-cell';
import { MonoValue } from '@/components/primitives/mono-value';
import { PanelHeader } from '@/components/primitives/panel-header';
import { Sparkline } from '@/components/primitives/sparkline';
import { StatCell } from '@/components/primitives/stat-cell';
import { StatusBadge } from '@/components/primitives/status-badge';
import {
  readDueReviews,
  readLearnerDashboard,
  readMasterySnapshot,
  readNextExam,
  readProgressSummary,
  readActivity,
  readWordsPractised,
  readVocabularyDrill,
  readVerbDrill,
  readFormalInformal,
  readFormalInformalProgress,
} from '@/composition/reads';
import { FORMAL_INFORMAL_PAGE_SIZE } from '@/components/learning/formal-informal-contracts';
import { FormalInformalExplorer } from '../library/formal-informal/formal-informal-explorer';
import { requireUser } from '@/lib/auth/current-user';
import { publicEnv } from '@/lib/env.public';
import { PractisedWords } from './practised-words';
import { ReviewTable } from './review-table';

/**
 * The dashboard — one question, "what should I do now", answered above the
 * fold.
 *
 * **Ten reads, issued together, zero N+1.** Each is one use case that returns
 * its whole answer in one shape; none of them is called per row, and the six
 * run in a single `Promise.all` rather than serially. That is the acceptance
 * criterion for this feature and it is a property of the read path, not of the
 * markup: `readLearnerDashboard` and `readProgressSummary` both need the
 * profile, and React's `cache` in `reads.ts` means the second one does not
 * fetch it again. The eighth and ninth — the vocabulary and verb drills — make
 * no query at all: they are compiled corpora and a random pick, and they join
 * the `Promise.all` only so they cannot become serial awaits later. The
 * tenth — informal → formal — is compiled content as well, the first page
 * of the register list.
 *
 * The page never calls this application's own HTTP API. It goes through the
 * composition root to the same use cases the handlers use — the sweep in
 * `src/composition/one-implementation.test.ts` enforces it.
 *
 * Zero-data is a first-class state throughout, not an afterthought: a learner
 * on day one has no attempts, no mastery rows, no streak and nothing due, and
 * every panel below says so in a sentence rather than rendering a 0 that reads
 * as failure.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Six questions in the dashboard card.
 *
 * Short enough to finish before the day's lesson rather than instead of it —
 * this panel is a warm-up, and a twenty-question drill on the page whose whole
 * job is "start today's lesson" would be competing with it.
 */
const VOCABULARY_QUESTIONS = 6;

/**
 * Four verb questions, not six.
 *
 * The verb card sits beside the vocabulary card rather than under it, and a
 * dashboard with two six-question drills on it is a dashboard asking for twelve
 * answers before the day's lesson has started. Four is a warm-up; the full
 * round is one click away on the verb screen.
 */
const VERB_QUESTIONS = 4;

function toMatrixCells(
  cells: readonly {
    readonly dimensionId: string;
    readonly label: string;
    readonly attempts: number;
    readonly correct: number;
    readonly accuracy: number;
    readonly isWeakness: boolean;
  }[],
): readonly IMasteryMatrixCell[] {
  return cells.map((cell) => ({
    ...cell,
    drillHref: `/practice?focus=${encodeURIComponent(cell.dimensionId)}`,
  }));
}

export default async function DashboardPage(): Promise<ReactElement> {
  const user = await requireUser();

  const [
    dashboard,
    summary,
    mastery,
    activity,
    reviews,
    nextExam,
    practised,
    vocabulary,
    verbs,
    formalInformal,
    formalInformalProgress,
  ] = await Promise.all([
    readLearnerDashboard(user.userId),
    readProgressSummary(user.userId),
    readMasterySnapshot(user.userId),
    readActivity(user.userId, 7),
    readDueReviews(user.userId),
    readNextExam(user.userId),
    readWordsPractised(user.userId),
    readVocabularyDrill(VOCABULARY_QUESTIONS),
    readVerbDrill(VERB_QUESTIONS, true),
    readFormalInformal(FORMAL_INFORMAL_PAGE_SIZE, 1),
    readFormalInformalProgress(user.userId),
  ]);

  const accuracyPercent = Math.round(summary.overallAccuracy);
  const hasAttempts = summary.itemsReviewed > 0;

  return (
    <>
      {/*
        Inline, above the content, after the page has rendered — never a modal
        on load. The key is passed down because a Client Component importing the
        env schema would pull it into the bundle; it is public either way.
      */}
      <div className="col-span-12">
        <PushPermissionBanner vapidPublicKey={publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY} />
      </div>

      <header className="col-span-12 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-display text-xl tracking-tight text-primary-900">
          {dashboard.displayName}
        </h1>
        <span className="num text-muted">
          Day {dashboard.currentDayIndex} of {dashboard.totalDays}
        </span>
      </header>

      {/* Four stat panels. */}
      <section className="card col-span-12 grid grid-cols-2 gap-6 p-4 md:grid-cols-4">
        <StatCell
          label="Day"
          note={dashboard.hasFinishedProgram ? 'Programme complete' : `${String(summary.completedDays)} finished`}
          value={dashboard.currentDayIndex}
        />
        <StatCell
          label="Current streak"
          note={dashboard.streakIsAlive ? `Best ${String(summary.longestStreak)}` : 'Broken — start it again today'}
          unit="days"
          value={dashboard.streakIsAlive ? summary.currentStreak : 0}
        />
        <StatCell
          label="Accuracy"
          note={hasAttempts ? `${String(summary.itemsReviewed)} answers` : 'Nothing measured yet'}
          {...(hasAttempts ? { unit: '%' } : {})}
          value={hasAttempts ? accuracyPercent : '—'}
        />
        <StatCell
          label="Mastered"
          note={`${String(dashboard.dueReviewCount)} due for review`}
          value={summary.masteredItems}
        />
      </section>

      {/* Today's session. The one card carrying the day's focus takes the accent rule. */}
      <section className="card card-accent col-span-12 lg:col-span-7">
        <PanelHeader
          title="Today"
          {...(dashboard.today === null
            ? {}
            : { note: `${String(dashboard.today.estimatedMinutes)} min` })}
        />
        <div className="flex flex-wrap items-center gap-4 p-4">
          {dashboard.today === null ? (
            <p className="text-muted">
              {dashboard.hasFinishedProgram
                ? 'You have finished the programme. Keep the reviews going.'
                : 'Nothing is scheduled. Start the next day from the programme.'}
            </p>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base tracking-tight text-primary-900">
                  {dashboard.today.title}
                </p>
                <p className="mt-1 text-muted">
                  {dashboard.today.inProgress
                    ? `Part-finished — you stopped at the ${dashboard.today.stage ?? 'first'} stage.`
                    : 'Not started.'}
                </p>
              </div>
              <StatusBadge
                label={dashboard.today.inProgress ? 'In progress' : 'Ready'}
                tone={dashboard.today.inProgress ? 'active' : 'due'}
              />
              <Link
                className="h-8 rounded-control bg-primary-900 px-3 py-1.5 text-surface"
                href={`/lesson/${String(dashboard.today.dayIndex)}`}
              >
                {dashboard.today.inProgress ? 'Continue' : 'Start'}
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Next exam, with readiness rather than encouragement. */}
      <section className="card col-span-12 lg:col-span-5">
        <PanelHeader title="Next exam" />
        <div className="p-4">
          {nextExam === null ? (
            <p className="text-muted">Every exam passed. Your certificate is on the exams page.</p>
          ) : (
            <>
              <p className="font-display text-base tracking-tight text-primary-900">
                {nextExam.title}
              </p>

              <dl className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <dt className="label">{nextExam.isUnlocked ? 'Unlocked' : 'Unlocks'}</dt>
                  <dd>
                    {nextExam.isUnlocked ? (
                      <span className="text-mastered">Open now</span>
                    ) : (
                      <MonoValue unit="days away" value={nextExam.daysUntilUnlock} />
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="label">Predicted</dt>
                  <dd>
                    {nextExam.predictedScorePercent === null ? (
                      <span className="text-muted">Not yet</span>
                    ) : (
                      <span className="flex items-baseline gap-2">
                        <MonoValue unit="%" value={Math.round(nextExam.predictedScorePercent)} />
                        <StatusBadge
                          label={nextExam.likelyToPass === true ? 'Likely pass' : 'Not ready'}
                          tone={nextExam.likelyToPass === true ? 'passed' : 'failed'}
                        />
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <Link
                className="mt-4 inline-flex h-8 items-center rounded-control border border-primary-900 px-3 text-primary-900"
                href={`/exams/${nextExam.code}`}
              >
                Open the lobby
              </Link>
            </>
          )}
        </div>
      </section>

      {/*
        Today's words, with their sound.

        Above the weekly chart on purpose: "what did I do today" is the question
        a learner opens this page with, and the week is context for it rather
        than the other way round.
      */}
      <section className="card col-span-12">
        <PanelHeader
          note={`${String(practised.course.distinctWords + practised.demo.distinctWords)} words · ${String(practised.course.tries + practised.demo.tries)} tries`}
          title="Words today"
        />
        <div className="p-4">
          <PractisedWords
            course={practised.course}
            date={practised.date}
            demo={practised.demo}
          />
        </div>
      </section>

      {/* Time on task, this week. */}
      <section className="card col-span-12 lg:col-span-5">
        <PanelHeader
          note={`${String(activity.totalMinutes)} min · ${String(activity.totalAttempts)} answers`}
          title="This week"
        />
        <div className="flex flex-col gap-3 p-4">
          {activity.totalAttempts === 0 ? (
            <p className="text-muted">No answers in the last seven days.</p>
          ) : (
            <Sparkline
              className="text-primary-900"
              height={32}
              label={`Minutes a day over the last seven days, ${String(activity.totalMinutes)} in total`}
              values={activity.days.map((day) => day.minutes)}
              width={240}
            />
          )}

          {/* The bars are a chart; the row beneath is the same data as squares
              with their accuracy in words, so the reading survives greyscale. */}
          <ul className="flex gap-1">
            {activity.days.map((day) => (
              <li className="flex flex-col items-center gap-1" key={day.date}>
                <HeatCell accuracy={day.accuracy} label={day.date} size="sm" />
                <span className="num text-[9px] text-muted">{day.minutes}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Due reviews. */}
      <section className="col-span-12 lg:col-span-7">
        <ReviewTable
          rows={reviews.items.map((item) => ({
            reviewItemId: item.reviewItemId,
            prompt: item.prompt,
            itemType: item.itemType,
            daysOverdue: item.daysOverdue,
            lastErrorTags: item.lastErrorTags,
          }))}
        />
        {reviews.totalDue > reviews.items.length && (
          <p className="num mt-1 text-[11px] text-muted">
            Showing {reviews.items.length} of {reviews.totalDue} due. The rest surface tomorrow.
          </p>
        )}
      </section>

      {/*
        IELTS vocabulary, as a drill rather than a list.

        Beside the word-family card because they are the same shelf — both are
        reference rather than course — and above it because this one can be
        *done* in thirty seconds while that one can only be opened. A learner
        who has three minutes gets a real exercise out of this panel; the list
        of 777 is one click away for the learner who wants to read.
      */}
      <section className="card col-span-12 lg:col-span-7">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/vocabulary">
              All {vocabulary.totalEntries}
            </Link>
          }
          note="IELTS vocabulary"
          title="The better word"
        />
        <div className="p-4">
          <VocabularyDrill initial={vocabulary} roundSize={VOCABULARY_QUESTIONS} tone="light" />
        </div>
      </section>

      {/*
        Verb forms, as four questions.

        Beside the vocabulary card because they are the two halves of the same
        thirty seconds: one asks whether a better word is known, this asks
        whether the right *form* of a known word is. It draws from the hundred
        commonest verbs — a dashboard warm-up that opened with the past
        participle of `abash` would be a warm-up nobody finishes.
      */}
      <section className="card col-span-12 lg:col-span-5">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/verbs">
              All {verbs.totalVerbs}
            </Link>
          }
          note="V1 → V5"
          title="Verb forms"
        />
        <div className="p-4">
          <VerbDrill coreOnly initial={verbs} roundSize={VERB_QUESTIONS} tone="light" />
        </div>
      </section>

      {/*
        The word-family reference.
        No count is printed here. The number is real and worth showing, but it
        costs a use-case run and a `rule_families` read to compute, and this is
        the hottest page in the app — so it is shown on the families screen
        itself, where it is already in hand. A card that invited a click with a
        figure hard-coded beside it would be a second source of truth for a
        claim about the size of the product.
      */}
      <section className="card col-span-12 lg:col-span-5">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/families">
              Open
            </Link>
          }
          note="IELTS reference"
          title="Word families"
        />
        <div className="flex flex-col gap-2 p-4 text-muted">
          <p>
            One root, and every word English builds from it —{' '}
            <span className="text-primary-900">happy · happier · happily · happiness</span>.
          </p>
          <p>
            Four words, one rule: the y becomes an i. Learn it once here and it carries to every
            word that ends the same way.
          </p>
        </div>
      </section>

      {/*
        Gap-fill clues — the chart that names the word in a blank.

        Beside a four-step card because they are the same thirty seconds: the
        drill asks whether the clue is visible, the card says how to look for
        it. Four questions, not six, for the same reason as the verb card.
      */}
      <section className="card col-span-12 lg:col-span-7">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/patterns">
              The chart
            </Link>
          }
          note="IELTS reading"
          title="Gap-fill clues"
        />
        <div className="p-4">
          <GrammarPatternDrill roundSize={4} tone="light" />
        </div>
      </section>

      <section className="card col-span-12 lg:col-span-5">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/patterns">
              Open
            </Link>
          }
          note="Four checks"
          title="How to read a blank"
        />
        <ol className="flex list-decimal flex-col gap-2 p-4 pl-8 text-muted">
          <li>
            <span className="text-primary-900">In front:</span> a, many, can, has, very, by.
          </li>
          <li>
            <span className="text-primary-900">After:</span> is, are, students, quickly.
          </li>
          <li>
            <span className="text-primary-900">Auxiliary:</span> can → V1. has → V3. is → adjective,
            V-ing or passive.
          </li>
          <li>
            <span className="text-primary-900">Number:</span> every → singular. many → plural.
          </li>
        </ol>
        <p className="border-t border-hairline px-4 py-3 font-bengali text-muted" lang="bn">
          ______ are available → blank-এ plural noun। materials for sculpting are not readily
          available.
        </p>
      </section>

      {/*
        Prepositions and question words — the two closed lists a learner looks
        up by name, on the same shelf as the verb table.
      */}
      <section className="card col-span-12 lg:col-span-6">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/prepositions">
              Open
            </Link>
          }
          note="Grammar reference"
          title="Prepositions"
        />
        <div className="flex flex-col gap-2 p-4 text-muted">
          <p>
            The word that sits in front of a noun and names a relationship —{' '}
            <span className="text-primary-900">on the table</span>,{' '}
            <span className="text-primary-900">in Bangladesh</span>,{' '}
            <span className="text-primary-900">to school</span>.
          </p>
          <p className="font-bengali" lang="bn">
            জায়গা, সময়, দিক, কারণ — noun-এর সাথে অন্য word-এর সম্পর্ক।
          </p>
        </div>
      </section>

      <section className="card col-span-12 lg:col-span-6">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/library/questions">
              Open
            </Link>
          }
          note="Grammar reference"
          title="Question words"
        />
        <div className="flex flex-col gap-2 p-4 text-muted">
          <p>
            The first word of the question names the kind of answer —{' '}
            <span className="text-primary-900">who</span> a person,{' '}
            <span className="text-primary-900">where</span> a place. The answer often points:{' '}
            <span className="text-primary-900">this</span>,{' '}
            <span className="text-primary-900">that</span>,{' '}
            <span className="text-primary-900">these</span>,{' '}
            <span className="text-primary-900">those</span>.
          </p>
          <p className="font-bengali" lang="bn">
            what, when, where — এবং উত্তরে this, that, these, those।
          </p>
        </div>
      </section>

      {/*
        Informal → formal register, with IPA and Bangla on every word.

        A full-width list rather than a six-question drill: the lesson here is
        seeing the swap, hearing the accent, and reading the meaning. The same
        explorer lives on `/library/formal-informal`. Today opens on page 1; the
        library route opens on the page they last stood on. Continue on either
        screen jumps back there.
      */}
      <section className="col-span-12">
        <div className="card">
          <PanelHeader
            action={
              <Link className="text-[11px] text-primary-900" href="/library/formal-informal">
                All {formalInformal.totalPairs}
              </Link>
            }
            note="Register"
            title="Informal and formal"
          />
          <div className="p-4">
            <FormalInformalExplorer
              initialPage={formalInformal}
              initialProgress={formalInformalProgress}
            />
          </div>
        </div>
      </section>

      {/* The phoneme matrix — the same component /progress renders for rules. */}
      <section className="card col-span-12">
        <PanelHeader
          action={
            <Link className="text-[11px] text-primary-900" href="/progress">
              All of it
            </Link>
          }
          note={`${String(mastery.phonemes.length)} sounds`}
          title="Sounds"
        />
        <div className="p-4">
          {mastery.phonemes.length === 0 ? (
            <p className="text-muted">Nothing scored yet. The matrix fills in as you speak.</p>
          ) : (
            <MasteryMatrix
              cells={toMatrixCells(mastery.phonemes)}
              dimension="phoneme"
              drillLabel="Drill this sound"
            />
          )}
        </div>
      </section>
    </>
  );
}
