/**
 * The colour scheme, carried in a cookie rather than `localStorage`.
 *
 * Same reason as the sidebar collapse (see `sidebar-preference.ts`): the first
 * paint has to be the right canvas. `localStorage` is readable only after
 * hydration, so a learner who chose dark would see the paper flash cream on
 * every navigation. A cookie is readable in the root layout, and a tiny
 * blocking script resolves `system` against `prefers-color-scheme` before the
 * first frame.
 *
 * Not `httpOnly` on purpose: the Settings control writes it from the client.
 * It carries no identity and no secret, only a name.
 *
 * Default is `light`. Dark mode is an option the learner turns on; it is not
 * the paper they already know, and matching the OS unasked would change the
 * product under them.
 */

export const THEME_COOKIE = 'shuddhospell.theme';

export const THEME_PREFERENCES = Object.freeze(['light', 'dark', 'system'] as const);

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/** A year. A layout preference the learner set once should outlive the session. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function parseThemeCookie(value: string | undefined): ThemePreference {
  return isThemePreference(value) ? value : 'light';
}

/** The `document.cookie` string the Settings control writes. */
export function themeCookieValue(preference: ThemePreference): string {
  return `${THEME_COOKIE}=${preference}; path=/; max-age=${String(MAX_AGE_SECONDS)}; samesite=lax`;
}

/**
 * Server-side class for the `<html>` element. `system` is left unset here —
 * the blocking script below is the only place that can see the OS setting
 * without guessing, and guessing wrong is a flash of the other canvas.
 */
export function htmlDarkClass(preference: ThemePreference): 'dark' | '' {
  return preference === 'dark' ? 'dark' : '';
}

/**
 * Runs before first paint. Inline, no `defer`, so the class is on `<html>`
 * before the body is parsed. The cookie value is validated against the same
 * three names the Settings control writes; anything else is treated as light.
 */
export const THEME_BOOTSTRAP = `(function(){try{var m=document.cookie.match(/(?:^|; )shuddhospell\\.theme=([^;]*)/);var p=m?decodeURIComponent(m[1]):'light';if(p!=='light'&&p!=='dark'&&p!=='system'){p='light';}var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

/** Client-only: the OS setting, used when the preference is `system`. */
export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveIsDark(preference: ThemePreference): boolean {
  if (preference === 'dark') {
    return true;
  }

  if (preference === 'light') {
    return false;
  }

  return systemPrefersDark();
}

/** Client-only: persist the choice and paint it without waiting for a navigation. */
export function applyTheme(preference: ThemePreference): void {
  document.cookie = themeCookieValue(preference);
  document.documentElement.classList.toggle('dark', resolveIsDark(preference));
}
