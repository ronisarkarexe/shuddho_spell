import { type ReactElement } from 'react';

/**
 * The whole icon set, drawn once.
 *
 * Stroked paths on a 24-box, `currentColor`, no fill: an icon inherits the
 * colour of whatever it sits in, so the rail's active state tints the glyph
 * without a second variant of every icon. `12-design-system.md` forbids
 * illustration and emoji anywhere, which rules out an icon font and rules out
 * a third-party pack whose set drifts from this one.
 */
export const GLYPHS = Object.freeze([
  'home',
  'program',
  'practice',
  'weak-spots',
  'library',
  'progress',
  'exam',
  'settings',
  'bell',
  'chevron-left',
  'chevron-right',
  'chevron-down',
  'close',
  'search',
  'check',
  'alert',
  'download',
  'play',
  'mic',
  'sign-out',
  'grammar',
  'families',
  'cards',
  'bookmark',
  'globe',
  'extra',
  'columns',
  'swap',
  'verb',
  'roadmap',
  'around',
  'question',
  'gap',
  'shield',
] as const);

export type GlyphName = (typeof GLYPHS)[number];

const PATHS: Readonly<Record<GlyphName, string>> = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5',
  program: 'M4 5h16v15H4zM4 9.5h16M9 5v15M14 5v15',
  practice: 'M12 4v16M4 12h16M7.5 7.5l9 9M16.5 7.5l-9 9',
  'weak-spots': 'M12 3.5 21 19.5H3zM12 9.5v4.5M12 16.5v.6',
  library: 'M5 4h5v16H5zM12 4h3v16h-3zM17 5.5l3 .8-3.2 14.2-2.9-.8z',
  progress: 'M4 19.5h16M6.5 19.5V12M11 19.5V6.5M15.5 19.5v-5M20 19.5V9',
  exam: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7',
  settings: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1',
  bell: 'M6.5 17V10.5a5.5 5.5 0 0 1 11 0V17l1.5 2.5H5zM10 19.5a2 2 0 0 0 4 0',
  'chevron-left': 'M14.5 5.5 8 12l6.5 6.5',
  'chevron-right': 'M9.5 5.5 16 12l-6.5 6.5',
  'chevron-down': 'M5.5 9.5 12 16l6.5-6.5',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M10.75 17.5a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5zM15.6 15.6 20 20',
  check: 'M5 12.5 10 17.5 19 7',
  alert: 'M12 4.5v9M12 17.4v.6M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19z',
  download: 'M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15',
  play: 'M7.5 4.5 19 12 7.5 19.5z',
  // A door with the arrow leaving through it. The arrow points away from the
  // panel, not into it: the same drawing reversed is the sign-in glyph, and the
  // two must not be confusable at 16px.
  'sign-out': 'M14 4.5H5.5v15H14M11 12h9M16.5 8.5 20 12l-3.5 3.5',
  // A line of text with a mark underneath it — the shape of a sentence being
  // corrected. Distinct from `library` (a shelf) and `exam` (a page), which
  // are the two it could otherwise be confused with in the rail.
  grammar: 'M4 6h16M4 10.5h11M4 15h16M4 19.5h7M17.5 18.5l1.8 1.8 3.2-3.6',
  mic: 'M12 3.5a2.75 2.75 0 0 1 2.75 2.75v5.5a2.75 2.75 0 0 1-5.5 0v-5.5A2.75 2.75 0 0 1 12 3.5zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3',
  families: 'M12 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.5 17.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM17.5 17.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 8.5v4.5M12 13l-4 4.5M12 13l4 4.5',
  cards: 'M5 8h10v12H5zM9 4h10v12',
  bookmark: 'M7 4h10v16l-5-3.2L7 20z',
  globe: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM3.5 12h17M12 3.5c2.6 3 2.6 14 0 17M12 3.5c-2.6 3-2.6 14 0 17',
  extra: 'M5 5h8v14H5zM15.5 10.5h5M18 8v5',
  columns: 'M4 7h4v12H4zM10 4h4v15h-4zM16 9h4v10h-4z',
  swap: 'M7 8h10M14.5 5.5 17.5 8.5 14.5 11.5M17 16H7M9.5 13.5 6.5 16.5 9.5 19.5',
  verb: 'M5 4v16M5 5h11l-3 4.5L16 14H5',
  roadmap: 'M5 18h4M9 18c0-5 6-5 6-11M15 7h4M6.2 18a1.2 1.2 0 1 0 0-.01M12 12.5a1.2 1.2 0 1 0 0-.01M17.8 7a1.2 1.2 0 1 0 0-.01',
  around: 'M8.5 8.5h7v7h-7zM12 3.5v3.2M12 17.3v3.2M3.5 12h3.2M17.3 12h3.2',
  question: 'M9 8.2a3 3 0 1 1 3.4 3c-.9.4-1.4 1-1.4 2.1M12 16.8v.7M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z',
  gap: 'M4 7h16M4 17h16M4 12h6M14 12h6M10 13.5h4',
  shield: 'M12 3.5 19.5 7v5.2c0 4.3-3.1 6.7-7.5 8.3-4.4-1.6-7.5-4-7.5-8.3V7z',
};

interface IGlyphProps {
  readonly name: GlyphName;
  /** Square edge in px. The rail uses 18, the top bar 16, a button 14. */
  readonly size?: number;
  readonly className?: string;
}

/**
 * Always `aria-hidden`. Every icon in this product sits beside a label or
 * inside a control that carries its own accessible name, so a second name here
 * would be read twice.
 */
export function Glyph({ name, size = 16, className }: IGlyphProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
