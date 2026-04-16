import React from 'react';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from './index';

/**
 * Error Fallback Component
 * Reusable error display component for graceful degradation
 * Requirement: Error Handling Strategy - Graceful degradation with user-friendly messages
 */

export interface ErrorFallbackProps {
  error?: Error | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showError?: boolean;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  showError = false,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {/* Error Icon */}
      <div className="w-16 h-16 bg-danger bg-opacity-10 rounded-full flex items-center justify-center mb-4">
        <AlertCircleIcon className="w-8 h-8 text-danger" />
      </div>

      {/* Error Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Error Message */}
      <p className="text-sm text-text-secondary mb-4 max-w-md">
        {message}
      </p>

      {/* Error Details (if enabled) */}
      {showError && errorMessage && (
        <div className="mb-4 p-3 bg-bg-secondary rounded-lg max-w-md">
          <p className="text-xs text-danger font-mono break-words">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          className="flex items-center"
        >
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;
