'use client';

import { useEffect } from 'react';
import {
  applyTheme,
  parseThemeCookie,
  THEME_COOKIE,
  type ThemePreference,
} from './theme-preference';

function cookieTheme(): ThemePreference {
  const escaped = THEME_COOKIE.replaceAll('.', '\\.');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`, 'u'));
  const raw = match?.[1] === undefined ? undefined : decodeURIComponent(match[1]);

  return parseThemeCookie(raw);
}

/**
 * Keeps `html.dark` in step with the OS when the learner chose System, and
 * corrects a server paint that could not see `prefers-color-scheme`.
 *
 * The blocking script in the root layout already set the class for the first
 * frame. This component exists for the hour after that: a laptop that moves
 * from a bright desk to a dark room should not wait for a reload.
 */
export function ThemeSync(): null {
  useEffect(() => {
    const sync = (): void => {
      applyTheme(cookieTheme());
    };

    sync();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', sync);

    return () => {
      media.removeEventListener('change', sync);
    };
  }, []);

  return null;
}

export function readThemeCookie(): ThemePreference {
  return cookieTheme();
}
