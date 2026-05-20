import React from 'react';

export { Button } from './Button';
export type { ButtonProps } from './Button';
export { ProductCard } from './ProductCard';
export type { ProductCardProduct } from './ProductCard';

// کامپوننت کارت
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`card-base ${hover ? 'transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};

// کامپوننت ورودی
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="form-label">{label}</label>
      )}
      <input
        className={`w-full min-h-touch px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 bg-white hover:border-[var(--border-strong)] text-slate-900 placeholder:text-slate-600 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// کامپوننت نشان
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-900',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs leading-snug',
    md: 'px-3 py-1.5 text-sm leading-snug',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// کامپوننت انتخابگر
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="form-label">{label}</label>
      )}
      <select
        className={`w-full min-h-touch px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200 bg-white hover:border-[var(--border-strong)] text-slate-900 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// کامپوننت اسپینر بارگذاری
export { LoadingSpinner, LoadingScreen } from './LoadingSpinner';


// کامپوننت حالت خالی
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-body mb-8 max-w-md mx-auto">{description}</p>
      {action && action}
    </div>
  );
};

export * from './advanced';
export { SearchCategory } from './SearchCategory';
