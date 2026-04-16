import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/helpers';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'w-12 h-12',
      iconContainer: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      container: 'p-8',
      icon: 'w-16 h-16',
      iconContainer: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'p-12',
      icon: 'w-20 h-20',
      iconContainer: 'w-20 h-20',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-6'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('card text-center', classes.container, className)}>
      <div className={cn('max-w-md mx-auto', classes.spacing)}>
        {/* Icon */}
        <div className={cn(
          'bg-bg-hover rounded-full flex items-center justify-center mx-auto',
          classes.iconContainer
        )}>
          <Icon className={cn('text-text-disabled', classes.icon)} />
        </div>

        {/* Content */}
        <div className={classes.spacing}>
          <h3 className={cn('font-medium text-text-primary', classes.title)}>
            {title}
          </h3>
          <p className={cn('text-text-secondary', classes.description)}>
            {description}
          </p>
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {action && (
              <Button
                variant={action.variant || 'primary'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'secondary'}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;