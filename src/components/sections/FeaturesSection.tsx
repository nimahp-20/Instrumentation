'use client';

import React from 'react';
import { Card } from '@/components/ui';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  className?: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  features, 
  className = '' 
}) => {
  return (
    <section className={`page-section bg-slate-50 ${className}`}>
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 sm:p-8">
              <div className="text-[var(--primary)] mb-5 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-body text-sm sm:text-base">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
