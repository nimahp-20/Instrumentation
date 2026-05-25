'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const NAV_ACTIVE_COLOR = 'var(--primary)';
const NAV_INACTIVE_COLOR = 'var(--text-muted)';

type NavItem = {
  href: string;
  label: string;
  match: (pathname: string | null) => boolean;
  icon: (active: boolean) => React.ReactNode;
};

function navIconColor(active: boolean): string {
  return active ? NAV_ACTIVE_COLOR : NAV_INACTIVE_COLOR;
}

function isHomeActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/';
}

function isCategoriesActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith('/categories');
}

function isCartActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/cart' || pathname.startsWith('/cart/');
}

function isProfileActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/orders' ||
    pathname.startsWith('/orders/') ||
    pathname === '/wishlist' ||
    pathname === '/settings'
  );
}

const IconGrid: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className="mobile-bottom-nav__icon"
    viewBox="0 0 24 24"
    fill={active ? navIconColor(active) : 'none'}
    stroke={navIconColor(active)}
    strokeWidth={active ? 0 : 1.75}
    aria-hidden
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconBag: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className="mobile-bottom-nav__icon"
    viewBox="0 0 24 24"
    fill={active ? navIconColor(active) : 'none'}
    stroke={navIconColor(active)}
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 8h12l-1.2 10.5a1.5 1.5 0 01-1.49 1.35H8.69a1.5 1.5 0 01-1.49-1.35L6 8z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </svg>
);

const IconUser: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className="mobile-bottom-nav__icon"
    viewBox="0 0 24 24"
    fill={active ? navIconColor(active) : 'none'}
    stroke={navIconColor(active)}
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.9-3.2 3.4-5 6.5-5s5.6 1.8 6.5 5" />
  </svg>
);

const IconHome: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className="mobile-bottom-nav__icon"
    viewBox="0 0 24 24"
    fill={active ? navIconColor(active) : 'none'}
    stroke={navIconColor(active)}
    strokeWidth={active ? 0 : 1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'خانه',
    match: isHomeActive,
    icon: (active) => <IconHome active={active} />,
  },
  {
    href: '/categories',
    label: 'دسته‌بندی‌ها',
    match: isCategoriesActive,
    icon: (active) => <IconGrid active={active} />,
  },
  {
    href: '/cart',
    label: 'سبد خرید',
    match: isCartActive,
    icon: (active) => <IconBag active={active} />,
  },
  {
    href: '/profile',
    label: 'پروفایل',
    match: isProfileActive,
    icon: (active) => <IconUser active={active} />,
  },
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="mobile-bottom-nav" aria-label="ناوبری پایین موبایل">
      <ul className="mobile-bottom-nav__list">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          const isCart = item.href === '/cart';

          return (
            <li key={item.href} className="mobile-bottom-nav__item">
              <Link
                href={item.href}
                className={`mobile-bottom-nav__link${active ? ' mobile-bottom-nav__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="mobile-bottom-nav__icon-wrap">
                  {item.icon(active)}
                  {isCart && totalItems > 0 && (
                    <span className="mobile-bottom-nav__badge" aria-label={`${totalItems} قلم در سبد`}>
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>
                <span
                  className={`mobile-bottom-nav__label${active ? ' mobile-bottom-nav__label--active' : ''}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
