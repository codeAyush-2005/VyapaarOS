import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface IconPlaceholderProps {
  icon?: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  className?: string;
}

const IconPlaceholder: React.FC<IconPlaceholderProps> = ({
  icon: Icon,
  size = 'md',
  isLoading = false,
  className
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded bg-bg-hover animate-pulse',
          sizeClasses[size],
          className
        )}
        aria-label="Loading icon"
      />
    );
  }

  if (!Icon) {
    return (
      <div
        className={cn(
          'rounded bg-bg-hover',
          sizeClasses[size],
          className
        )}
        aria-label="Icon placeholder"
      />
    );
  }

  return (
    <Icon
      className={cn(sizeClasses[size], className)}
    />
  );
};

IconPlaceholder.displayName = 'IconPlaceholder';

export default IconPlaceholder;
