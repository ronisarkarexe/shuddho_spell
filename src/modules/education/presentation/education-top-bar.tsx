import Link from 'next/link';
import { type ReactElement } from 'react';
import { getTranslations } from 'next-intl/server';

export async function EducationTopBar(): Promise<ReactElement> {
  const t = await getTranslations('education');
  const tApp = await getTranslations('app');

  return (
    <header className="border-b border-hairline bg-surface">
      <div className="mx-auto flex h-topbar max-w-content items-center gap-6 px-5 sm:px-6">
        <Link className="font-display font-bold text-primary-900" href="/">
          {tApp('name')}
        </Link>
        <span className="label">{t('nav')}</span>
        <Link className="ml-auto text-muted hover:text-primary-900" href="/login">
          {t('signIn')}
        </Link>
      </div>
    </header>
  );
}
