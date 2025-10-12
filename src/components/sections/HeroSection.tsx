'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  imageSrc: string;
  imageAlt: string;
  discountBadge?: string;
  freeShippingBadge?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  secondaryButtonText,
  imageSrc,
  imageAlt,
  discountBadge,
  freeShippingBadge,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Background: refined gradient + vignette + pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 [background-image:radial-gradient(1000px_600px_at_20%_-20%,rgba(255,255,255,0.15),transparent),radial-gradient(800px_500px_at_80%_120%,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_70%,rgba(0,0,0,0.65)_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Copy column */}
          <div className="text-center lg:text-right">
            {/* Elegant eyebrow + stamp */}
            <div className="mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-amber-300">
                انتخاب باشکوه
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase text-white/70">
                Est. 1998
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
              <span className="block">{title}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300">
                {subtitle}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10 text-slate-200/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-amber-400 text-slate-900 hover:bg-amber-300 focus:ring-2 focus:ring-amber-300/40 !px-5 sm:!px-6 !py-2.5 sm:!py-3 rounded-xl text-sm sm:text-base shadow-[0_10px_30px_-10px_rgba(251,191,36,0.6)]"
                  onClick={onPrimaryClick}
                >
                  {primaryButtonText}
                </Button>
              </Link>
              <Link href="/#categories" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm !px-5 sm:!px-6 !py-2.5 sm:!py-3 rounded-xl text-sm sm:text-base"
                  onClick={onSecondaryClick}
                >
                  {secondaryButtonText}
                </Button>
              </Link>
            </div>

            {/* Gentleman detail list */}
            <ul className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-xs sm:text-sm text-slate-200/80">
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                تضمین اصالت کالا
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                بسته‌بندی حرفه‌ای
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                ارسال سریع
              </li>
            </ul>
          </div>

          {/* Visual column */}
          <div className="relative mt-8 lg:mt-0 max-w-md sm:max-w-lg mx-auto lg:max-w-none">
            {/* Decorative frame - hidden on small mobile */}
            <div className="pointer-events-none absolute -top-4 sm:-top-6 -left-4 sm:-left-6 h-20 w-20 sm:h-28 sm:w-28 rounded-tr-[1.5rem] sm:rounded-tr-[2rem] border-t border-l border-white/20 hidden xs:block" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 h-20 w-20 sm:h-28 sm:w-28 rounded-bl-[1.5rem] sm:rounded-bl-[2rem] border-b border-r border-white/20 hidden xs:block" aria-hidden="true" />

            <div className="relative aspect-square rounded-2xl p-1 bg-gradient-to-br from-white/20 via-white/10 to-transparent ring-1 ring-white/20">
              <div className="h-full w-full rounded-[1rem] bg-white/10 backdrop-blur-md overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Floating badges */}
            {discountBadge && (
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-amber-400 text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-[0_10px_25px_-10px_rgba(251,191,36,0.7)]">
                {discountBadge}
              </div>
            )}
            {freeShippingBadge && (
              <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-white text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                {freeShippingBadge}
              </div>
            )}

            {/* Subtle glow */}
            <div className="absolute inset-0 -z-10 blur-3xl [background:radial-gradient(600px_200px_at_70%_20%,rgba(251,191,36,0.25),transparent)] hidden sm:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};
