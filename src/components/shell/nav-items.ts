import { type GlyphName } from '@/components/icons/glyph';

export interface INavItem {
  readonly href: string;
  /** Key under `nav` in the message catalogues. Nested keys use a dot. */
  readonly labelKey: string;
  readonly glyph: GlyphName;
  /** Topic lists sit under the parent shelf so the rail stays one column. */
  readonly children?: readonly INavItem[];
}

const VOCABULARY_NAV_TOPICS = [
  'character',
  'thought',
  'communication',
  'change',
  'quantity',
  'quality',
  'time',
  'conflict',
  'work',
  'body',
  'place',
  'everyday',
] as const;

const FORMAL_NAV_TOPICS = [
  'common',
  'verbs',
  'nouns',
  'adjectives',
  'slang',
  'abbreviations',
  'business',
  'academic',
  'social',
  'variety',
  'more',
] as const;

const FAMILY_NAV_TOPICS = [
  'education',
  'science',
  'language',
  'environment',
  'energy',
  'agriculture',
  'work',
  'economy',
  'money',
  'society',
  'law',
  'government',
  'culture',
  'media',
  'health',
  'food',
  'sport',
  'family',
  'emotion',
  'technology',
  'travel',
  'city',
  'communication',
  'measurement',
  'change',
  'argument',
] as const;

function topicChildren(
  hrefBase: string,
  keyPrefix: string,
  topics: readonly string[],
  glyph: GlyphName,
): readonly INavItem[] {
  return Object.freeze(
    topics.map((topic) =>
      Object.freeze({
        href: `${hrefBase}/${topic}`,
        labelKey: `${keyPrefix}.${topic}`,
        glyph,
      }),
    ),
  );
}

/**
 * The rail, in the order a learner meets these screens: today's work, the plan,
 * the drills, the weaknesses, the reference, the record, the exams.
 *
 * `/grammar` sits after `/weak-spots` and before the two word lists: it is a
 * course of its own — read in order, day by day — rather than a reference, and
 * a learner looking for "what do I study next" should meet it before they meet
 * a list of 3,000 words.
 *
 * `/words` sits before `/library` on purpose: they are both lists of words and
 * the difference is whose. A learner looking for "the word I kept getting
 * wrong" wants their own list, and finding the whole 3,000-word library first
 * is the wrong answer arriving before the right one.
 *
 * `/library/families`, `/library/vocabulary`, `/library/saifurs`,
 * `/library/formal-informal`,
 * `/library/verbs`, `/library/verb-roadmap`, `/library/prepositions`,
 * `/library/questions` and
 * `/library/patterns` sit
 * directly under `/library` because they are the same shelf: all of them are
 * reference rather than course. The roadmap is the system; the verb table is
 * the thousand rows that sit inside it. Each named list that is filed by topic — word
 * families, IELTS vocabulary, informal/formal — then opens a child item per
 * topic, so a learner who wants *conflict* or *education* can go there without
 * first opening the mixed shelf. `activeHref` matches the longest prefix, so
 * standing on a topic lights that topic and not its parent.
 *
 * The hrefs point at routes Phase 11 and Phase 12 build. That is deliberate and
 * is not scaffolding ahead: a navigation rail with no destinations is not the
 * feature. Nothing here creates a stub page — an unbuilt route 404s honestly
 * until its own feature lands.
 */
export const NAV_ITEMS: readonly INavItem[] = Object.freeze([
  { href: '/dashboard', labelKey: 'dashboard', glyph: 'home' },
  { href: '/program', labelKey: 'program', glyph: 'program' },
  { href: '/practice', labelKey: 'practice', glyph: 'practice' },
  { href: '/weak-spots', labelKey: 'weakSpots', glyph: 'weak-spots' },
  { href: '/grammar', labelKey: 'grammar', glyph: 'grammar' },
  { href: '/words', labelKey: 'myWords', glyph: 'check' },
  { href: '/library', labelKey: 'library', glyph: 'library' },
  {
    href: '/library/families',
    labelKey: 'wordFamilies',
    glyph: 'grammar',
    children: topicChildren('/library/families', 'familyTopic', FAMILY_NAV_TOPICS, 'grammar'),
  },
  {
    href: '/library/vocabulary',
    labelKey: 'vocabulary',
    glyph: 'library',
    children: topicChildren(
      '/library/vocabulary',
      'vocabTopic',
      VOCABULARY_NAV_TOPICS,
      'library',
    ),
  },
  { href: '/library/saifurs', labelKey: 'saifurs', glyph: 'library' },
  {
    href: '/library/formal-informal',
    labelKey: 'formalInformal',
    glyph: 'library',
    children: topicChildren(
      '/library/formal-informal',
      'formalTopic',
      FORMAL_NAV_TOPICS,
      'library',
    ),
  },
  { href: '/library/verbs', labelKey: 'verbs', glyph: 'grammar' },
  { href: '/library/verb-roadmap', labelKey: 'verbRoadmap', glyph: 'grammar' },
  { href: '/library/prepositions', labelKey: 'prepositions', glyph: 'grammar' },
  { href: '/library/questions', labelKey: 'questionWords', glyph: 'grammar' },
  { href: '/library/patterns', labelKey: 'gapFill', glyph: 'grammar' },
  { href: '/progress', labelKey: 'progress', glyph: 'progress' },
  { href: '/exams', labelKey: 'exams', glyph: 'exam' },
]);

/**
 * The rail item only an admin sees.
 *
 * Separate from `NAV_ITEMS` rather than filtered out of it, because it is not
 * one of "the screens a learner meets in order" — it is a different job on the
 * same application. Hiding it is a courtesy, not a control: `/admin` and both
 * endpoints behind it check the caller's role against the database.
 */
export const ADMIN_ITEM: INavItem = Object.freeze({
  href: '/admin',
  labelKey: 'admin',
  glyph: 'weak-spots',
});

export const SETTINGS_ITEM: INavItem = Object.freeze({
  href: '/settings/notifications',
  labelKey: 'settings',
  glyph: 'settings',
});

/**
 * Parents and children as a single list, so longest-prefix matching can light
 * a topic without also lighting the shelf above it.
 */
export function flattenNavItems(items: readonly INavItem[]): readonly INavItem[] {
  const flattened: INavItem[] = [];

  for (const item of items) {
    flattened.push(item);

    if (item.children !== undefined) {
      for (const child of item.children) {
        flattened.push(child);
      }
    }
  }

  return flattened;
}

/**
 * Longest-prefix match, so `/exams/attempt/abc` still lights `Exams` and
 * `/dashboard` does not light every route beginning with a slash.
 */
export function activeHref(pathname: string, items: readonly INavItem[]): string | null {
  const matches = flattenNavItems(items)
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length);

  return matches[0]?.href ?? null;
}
