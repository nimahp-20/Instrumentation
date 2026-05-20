'use client';

import React from 'react';

const stroke = { strokeWidth: 1.75 as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.748-3.066 4.125 4.125 0 00-7.748 3.066 9.337 9.337 0 004.12.952 9.38 9.38 0 002.625-.372" />
      <path d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

export function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

export function IconBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

export function IconEnvelope(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function IconPencil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

export function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function IconCheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function IconExclamation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function IconShopping(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

export function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export function IconSave(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...stroke} {...props}>
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
