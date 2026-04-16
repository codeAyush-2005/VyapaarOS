import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label="Loading"
    />
  );
};

Spinner.displayName = 'Spinner';

export default Spinner;
