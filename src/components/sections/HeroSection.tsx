'use client';

import React from 'react';
import Image from 'next/image';
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy column */}
          <div>
            {/* Elegant eyebrow + stamp */}
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300">
                انتخاب باشکوه
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-[10px] tracking-widest uppercase text-white/70">
                Est. 1998
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="block">{title}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300">
                {subtitle}
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-slate-200/90 leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="inline-block">
                <Button
                  size="lg"
                  className="bg-amber-400 text-slate-900 hover:bg-amber-300 focus:ring-2 focus:ring-amber-300/40 !px-6 !py-3 rounded-xl shadow-[0_10px_30px_-10px_rgba(251,191,36,0.6)]"
                  onClick={onPrimaryClick}
                >
                  {primaryButtonText}
                </Button>
              </Link>
              <Link href="/#categories" className="inline-block">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm !px-6 !py-3 rounded-xl"
                  onClick={onSecondaryClick}
                >
                  {secondaryButtonText}
                </Button>
              </Link>
            </div>

            {/* Gentleman detail list */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-200/80">
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                تضمین اصالت کالا
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                بسته‌بندی شیک و حرفه‌ای
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                ارسال سریع
              </li>
            </ul>
          </div>

          {/* Visual column */}
          <div className="relative">
            {/* Decorative frame */}
            <div className="pointer-events-none absolute -top-6 -left-6 h-28 w-28 rounded-tr-[2rem] border-t border-l border-white/20" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-bl-[2rem] border-b border-r border-white/20" aria-hidden="true" />

            <div className="relative aspect-square rounded-2xl p-1 bg-gradient-to-br from-white/20 via-white/10 to-transparent ring-1 ring-white/20">
              <div className="h-full w-full rounded-[1rem] bg-white/10 backdrop-blur-md overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badges */}
            {discountBadge && (
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-full font-bold shadow-[0_10px_25px_-10px_rgba(251,191,36,0.7)]">
                {discountBadge}
              </div>
            )}
            {freeShippingBadge && (
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg">
                {freeShippingBadge}
              </div>
            )}

            {/* Subtle glow */}
            <div className="absolute inset-0 -z-10 blur-3xl [background:radial-gradient(600px_200px_at_70%_20%,rgba(251,191,36,0.25),transparent)]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};
