import React from 'react';

type IconProps = { className?: string };

export function IconSparkles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10 1.4-1.4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconShirt({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-2 3v13h12V7l-2-3H8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l2 3H6l2-3z" />
    </svg>
  );
}

export function IconBike({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 17h7M6 17l3-8h5l2 4h3" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6l7-3z" />
    </svg>
  );
}

export function IconArmchair({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12v5h14v-5M7 12V8a2 2 0 012-2h6a2 2 0 012 2v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h14" />
    </svg>
  );
}

export function IconHanger({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a2 2 0 100-4 2 2 0 000 4zM4 10l16 6H4l4-6z" />
    </svg>
  );
}

export function IconBaby({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <circle cx="12" cy="10" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20c.6-2.8 2.7-4 5-4s4.4 1.2 5 4" />
    </svg>
  );
}

export function IconGem({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9l8-5 8 5-8 11-8-11z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16" />
    </svg>
  );
}

export function IconBook({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h10a2 2 0 012 2v14H8a2 2 0 01-2-2V4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12" />
    </svg>
  );
}

export function IconMonitor({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2 2-2.7-2.7 2-2z" />
    </svg>
  );
}

export function IconGridAll({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

const ROOT_ICONS = [
  IconShirt,
  IconBike,
  IconShield,
  IconArmchair,
  IconHanger,
  IconBaby,
  IconGem,
  IconBook,
  IconMonitor,
  IconWrench,
] as const;

export function CategorySidebarIcon({
  variant,
  index = 0,
  className,
}: {
  variant: 'newest' | 'all' | 'category';
  index?: number;
  className?: string;
}) {
  if (variant === 'newest') return <IconSparkles className={className} />;
  if (variant === 'all') return <IconGridAll className={className} />;
  const Icon = ROOT_ICONS[index % ROOT_ICONS.length];
  return <Icon className={className} />;
}
