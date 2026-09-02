import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Bricolage_Grotesque, IBM_Plex_Mono, Noto_Sans_Bengali, Public_Sans } from 'next/font/google';
import {
  htmlDarkClass,
  parseThemeCookie,
  THEME_BOOTSTRAP,
  THEME_COOKIE,
} from '@/components/shell/theme-preference';
import { ThemeSync } from '@/components/shell/theme-sync';
import { SessionBoundary } from '@/lib/auth/session-boundary';
import { QueryProvider } from '@/lib/query/query-provider';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = Public_Sans({ subsets: ['latin'], variable: '--font-body' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const bengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bengali' });

export const metadata: Metadata = {
  title: 'ShuddhoSpell',
  description: 'A 28-day English precision course built for Bangla speakers.',
  applicationName: 'ShuddhoSpell',
  /*
   * The icons themselves are **not** declared here. `src/app/icon.png` and
   * `src/app/apple-icon.png` are Next file conventions: it fingerprints them,
   * writes the `<link rel>` tags itself, and a hand-written `icons` block here
   * would be a second declaration able to disagree with the files on disk.
   * `manifest.ts` is linked the same way.
   */
  appleWebApp: { capable: true, title: 'ShuddhoSpell', statusBarStyle: 'default' },
};

/**
 * The colour a phone paints its own chrome with — `primary-900`, the same navy
 * as the rail and the hero, so the system bar does not announce itself as a
 * different application.
 */
export const viewport: Viewport = {
  themeColor: '#16255A',
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): Promise<React.ReactElement> {
  const locale = await getLocale();
  const messages = await getMessages();
  const store = await cookies();
  const theme = parseThemeCookie(store.get(THEME_COOKIE)?.value);
  const darkClass = htmlDarkClass(theme);

  return (
    <html
      className={`${display.variable} ${body.variable} ${mono.variable} ${bengali.variable}${darkClass === '' ? '' : ` ${darkClass}`}`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        {/*
          Blocking, in the head, on purpose. `next/script` `beforeInteractive`
          landed in the body payload under Turbopack and ran too late to stop
          a flash of the cream canvas. An inline script here executes before
          first paint, which is the whole point of the cookie.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <ThemeSync />
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <SessionBoundary>{children}</SessionBoundary>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
