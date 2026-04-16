import React from 'react';
import type { ButtonVariant, ButtonSize } from '../../types';
import { cn } from '../../utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus:ring-primary',
      secondary: 'bg-bg-hover text-text-primary border border-border-light hover:bg-gray-200 focus:ring-gray-500',
      danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger',
      success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="spinner mr-2" role="status" aria-label="Loading" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;