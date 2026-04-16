import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: {
      spinner: 'w-4 h-4',
      text: 'text-sm',
      container: 'p-4'
    },
    md: {
      spinner: 'w-6 h-6',
      text: 'text-base',
      container: 'p-8'
    },
    lg: {
      spinner: 'w-8 h-8',
      text: 'text-lg',
      container: 'p-12'
    }
  };

  const classes = sizeClasses[size];

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center text-center space-y-4',
      classes.container,
      className
    )}>
      <Loader2 className={cn('animate-spin text-primary', classes.spinner)} />
      <p className={cn('text-text-secondary', classes.text)}>
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="card">
      {content}
    </div>
  );
};

LoadingState.displayName = 'LoadingState';

export default LoadingState;