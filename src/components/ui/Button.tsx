import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0';

  const variantClasses = {
    primary:
      'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus-visible:ring-[var(--primary)] shadow-sm',
    secondary:
      'bg-slate-700 text-white hover:bg-slate-800 focus-visible:ring-slate-500',
    outline:
      'border-2 border-[var(--primary)] text-[var(--primary-hover)] bg-transparent hover:bg-[var(--primary-muted)] focus-visible:ring-[var(--primary)]',
    ghost:
      'text-[var(--primary)] hover:bg-[var(--primary-muted)] focus-visible:ring-[var(--primary)]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  };

  const sizeClasses = {
    sm: 'min-h-touch px-4 py-2 text-sm',
    md: 'min-h-touch px-5 py-2.5 text-base',
    lg: 'min-h-[3rem] px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};
