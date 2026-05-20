import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  narrow?: boolean;
}

/**
 * Consistent page wrapper: container width, horizontal padding, vertical rhythm.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  header,
  narrow = false,
}) => {
  const containerClass = narrow ? 'page-container max-w-4xl' : 'page-container';

  return (
    <div className={`page-surface ${className}`}>
      {header && (
        <div className="bg-white border-b border-slate-200">
          <div className={containerClass}>
            <div className="py-8 sm:py-10">{header}</div>
          </div>
        </div>
      )}
      <div className={`${containerClass} py-8 sm:py-10`}>{children}</div>
    </div>
  );
};
