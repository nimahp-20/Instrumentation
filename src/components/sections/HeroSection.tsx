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
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {title}
              <span className="block text-yellow-400">{subtitle}</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                onClick={onPrimaryClick}
              >
                {primaryButtonText}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={onSecondaryClick}
              >
                {secondaryButtonText}
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* عناصر شناور */}
            {discountBadge && (
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold">
                {discountBadge}
              </div>
            )}
            {freeShippingBadge && (
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-4 py-2 rounded-full font-bold">
                {freeShippingBadge}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
