import Link from 'next/link';
import { type ReactElement } from 'react';
import { getTranslations } from 'next-intl/server';

/**
 * Shared public footer. The Education page is reached from here, so the same
 * strip sits on the landing page and on every education screen.
 */
export async function SiteFooter(): Promise<ReactElement> {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-hairline py-10">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-6 gap-y-2 px-5 text-muted sm:px-6">
        <Link className="font-display text-primary-900" href="/">
          ShuddhoSpell
        </Link>
        <Link className="hover:text-primary-900" href="/education">
          {t('education')}
        </Link>
        <Link className="hover:text-primary-900" href="/login">
          {t('signIn')}
        </Link>
        <Link className="hover:text-primary-900" href="/verify/XXXX-XXXX-XXXX">
          {t('verify')}
        </Link>
        <span className="ml-auto num text-[11px]">{t('note')}</span>
      </div>
    </footer>
  );
}
