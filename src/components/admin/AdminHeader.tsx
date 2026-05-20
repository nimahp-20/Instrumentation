'use client';

import Link from 'next/link';

function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function IconCog() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

export function AdminHeader() {
  return (
    <header
      className="shrink-0 h-14 px-4 lg:px-6 flex items-center justify-between gap-4 text-white shadow-sm"
      style={{ background: 'var(--admin-header)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-white/15 transition-colors lg:hidden"
          aria-label="منو"
        >
          <IconMenu />
        </button>
        <Link href="/admin" className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-lg tracking-tight truncate">ابزارکده مدیریت</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-white/15 transition-colors hidden sm:flex"
          aria-label="تمام‌صفحه"
        >
          <IconExpand />
        </button>
        <button type="button" className="p-2 rounded-lg hover:bg-white/15 transition-colors relative" aria-label="اعلان‌ها">
          <IconBell />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--admin-header)]" />
        </button>
        <div
          className="w-9 h-9 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-sm font-bold ms-1"
          aria-hidden
        >
          م
        </div>
        <button type="button" className="p-2 rounded-lg hover:bg-white/15 transition-colors" aria-label="تنظیمات">
          <IconCog />
        </button>
      </div>
    </header>
  );
}
