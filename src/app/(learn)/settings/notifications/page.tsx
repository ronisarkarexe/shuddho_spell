import { getTranslations } from 'next-intl/server';
import { AppearancePreference } from '@/components/settings/appearance-preference';
import { PreferencesTable } from '@/components/notifications/preferences-table';
import { PushPermissionBanner } from '@/components/notifications/push-permission-banner';
import { requireUser } from '@/lib/auth/current-user';
import { publicEnv } from '@/lib/env.public';

/**
 * Settings: appearance first, then notification channels.
 *
 * Appearance is a cookie the root layout reads (D80), so the control here is
 * the writer, not a second source of truth. Notifications stay the Phase 8
 * matrix — in-app and push, no email column.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function NotificationSettingsPage() {
  await requireUser();
  const t = await getTranslations('settings');

  return (
    <section className="col-span-12">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>

      <div className="card mt-6 p-4 sm:p-6">
        <h2 className="font-display text-lg tracking-tight">{t('preferences')}</h2>
        <div className="mt-4">
          <AppearancePreference />
        </div>
      </div>

      <h2 className="mt-10 font-display text-lg tracking-tight">{t('notifications')}</h2>

      <div className="mt-6">
        <PushPermissionBanner vapidPublicKey={publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY} />
      </div>

      <div className="mt-8">
        <PreferencesTable />
      </div>
    </section>
  );
}
