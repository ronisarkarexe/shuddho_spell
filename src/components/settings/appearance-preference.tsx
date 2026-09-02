'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactElement } from 'react';
import { applyTheme, THEME_PREFERENCES, type ThemePreference } from '@/components/shell/theme-preference';
import { readThemeCookie } from '@/components/shell/theme-sync';
import { cn } from '@/lib/cn';

const THEME_LABEL_KEY: Readonly<Record<ThemePreference, 'themeLight' | 'themeDark' | 'themeSystem'>> = {
  light: 'themeLight',
  dark: 'themeDark',
  system: 'themeSystem',
};

/**
 * Light / Dark / System. Writes the same cookie the root layout reads, and
 * paints `html.dark` immediately so the learner sees the paper change without
 * a reload.
 */
export function AppearancePreference(): ReactElement {
  const t = useTranslations('settings');
  const [preference, setPreference] = useState<ThemePreference>('light');

  useEffect(() => {
    setPreference(readThemeCookie());
  }, []);

  const choose = (next: ThemePreference): void => {
    setPreference(next);
    applyTheme(next);
  };

  return (
    <fieldset>
      <legend className="label" id="theme-label">
        {t('theme')}
      </legend>
      <p className="mt-1 max-w-xl text-muted">{t('appearanceHelp')}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {THEME_PREFERENCES.map((value) => {
          const selected = preference === value;

          return (
            <label
              className={cn(
                'flex h-9 cursor-pointer items-center rounded-control px-3 font-medium',
                selected
                  ? 'bg-primary-900 text-surface'
                  : 'border border-hairline bg-surface text-primary-900 hover:bg-primary-50',
              )}
              key={value}
            >
              <input
                checked={selected}
                className="sr-only"
                name="theme"
                onChange={() => { choose(value); }}
                type="radio"
                value={value}
              />
              {t(THEME_LABEL_KEY[value])}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
