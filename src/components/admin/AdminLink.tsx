'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useAdminLoading } from '@/components/admin/AdminLoadingContext';

type AdminLinkProps = ComponentProps<typeof Link> & {
  loadingMessage?: string;
};

function resolveHref(href: ComponentProps<typeof Link>['href']): string {
  if (typeof href === 'string') return href.split('?')[0].split('#')[0];
  if (href && typeof href === 'object' && 'pathname' in href && href.pathname) {
    return href.pathname;
  }
  return '';
}

export function AdminLink({ href, loadingMessage, onClick, ...rest }: AdminLinkProps) {
  const pathname = usePathname();
  const { startLoading } = useAdminLoading();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        const target = resolveHref(href);
        const current = pathname?.split('?')[0].split('#')[0] ?? '';
        if (target && target !== current) {
          startLoading(loadingMessage ?? 'در حال بارگذاری...');
        }
      }}
      {...rest}
    />
  );
}
