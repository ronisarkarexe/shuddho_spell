import { type ReactElement, type ReactNode } from 'react';
import { SiteFooter } from '@/components/shell/site-footer';
import { EducationTopBar } from '@/modules/education/presentation/education-top-bar';

export default function EducationLayout({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <EducationTopBar />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
