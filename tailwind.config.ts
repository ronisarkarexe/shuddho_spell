import type { Config } from 'tailwindcss';

/**
 * Tokens come from ui_images/image copy 4.png and .claude/docs/12-design-system.md.
 * Where the two disagree, the image wins.
 *
 * Semantic tokens (canvas, surface, ink, hairline, muted, the light primary
 * tints) are CSS variables so `html.dark` can swap the paper. Brand fills
 * stay hex: `primary-900` is the navy button and the exam room, and several
 * of those fills are used with an opacity modifier (`bg-primary-900/40`)
 * which Tailwind cannot apply to a bare `var(--token)`.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          300: '#8496C4',
          500: '#3B4E86',
          700: '#243766',
          900: '#16255A',
        },
        secondary: {
          100: '#F7DFB8',
          300: '#F2C376',
          500: '#E9A13B',
          700: '#B97A1F',
        },
        tertiary: {
          100: 'var(--tertiary-100)',
          300: '#E29187',
          500: '#C24A3C',
          700: '#93342A',
        },
        neutral: {
          50: 'var(--canvas)',
          100: 'var(--neutral-100)',
          300: 'var(--neutral-300)',
          500: 'var(--neutral-500)',
          700: 'var(--neutral-700)',
          900: '#1B1D22',
        },
        /**
         * The heat scale of 12-design-system.md, low to high. Named by level
         * rather than by colour so a cell asks for `bg-heat-2` and never has to
         * know that level 2 happens to be amber — the ramp can be retuned in
         * one place.
         */
        heat: {
          0: 'var(--heat-0)',
          1: '#C7CCD8',
          2: '#F7DFB8',
          3: '#E9A13B',
          4: '#0E7A55',
        },
        surface: 'var(--surface)',
        hairline: 'var(--hairline)',
        muted: 'var(--muted)',
        mastered: '#0E7A55',
        cold: 'var(--cold)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        bengali: ['var(--font-bengali)', 'var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        base: ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      borderRadius: { card: '6px', control: '4px', chip: '2px' },
      spacing: { rail: '56px', sidebar: '232px', topbar: '48px', rule: '32px' },
      maxWidth: { content: '1280px' },
      backgroundImage: {
        // The ruled-paper surface: 32px horizontal rules plus one margin rule.
        paper:
          'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #E4E6E0 31px, #E4E6E0 32px)',
      },
    },
  },
  plugins: [],
};

export default config;
