import { describe, expect, it } from 'vitest';
import {
  htmlDarkClass,
  isThemePreference,
  parseThemeCookie,
  themeCookieValue,
  THEME_BOOTSTRAP,
  THEME_COOKIE,
} from './theme-preference';

describe('theme preference cookie', () => {
  it('accepts only the three named values and defaults to light', () => {
    expect(parseThemeCookie('light')).toBe('light');
    expect(parseThemeCookie('dark')).toBe('dark');
    expect(parseThemeCookie('system')).toBe('system');
    expect(parseThemeCookie(undefined)).toBe('light');
    expect(parseThemeCookie('Dark')).toBe('light');
    expect(parseThemeCookie('dark; path=/')).toBe('light');
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('navy')).toBe(false);
  });

  it('puts dark on html only when the cookie itself is dark', () => {
    expect(htmlDarkClass('dark')).toBe('dark');
    expect(htmlDarkClass('light')).toBe('');
    expect(htmlDarkClass('system')).toBe('');
  });

  it('writes a cookie the bootstrap script can read', () => {
    expect(themeCookieValue('dark')).toContain(`${THEME_COOKIE}=dark`);
    expect(THEME_BOOTSTRAP).toContain('shuddhospell\\.theme');
    expect(THEME_BOOTSTRAP).toContain('classList.toggle');
  });
});
