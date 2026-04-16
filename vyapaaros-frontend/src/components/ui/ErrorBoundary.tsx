import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from 'lucide-react';
import { Button } from './index';

/**
 * Error Boundary Component
 * Catches component crashes and displays graceful fallback UI
 * Requirement: Error Handling Strategy - React Error Boundaries
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="card p-8 text-center">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-danger bg-opacity-10 rounded-full flex items-center justify-center">
                  <AlertTriangleIcon className="w-10 h-10 text-danger" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-text-secondary mb-6">
                We're sorry for the inconvenience. An unexpected error occurred while loading this section.
              </p>

              {/* Error Details (Development Only) */}
              {this.props.showDetails && this.state.error && import.meta.env.DEV && (
                <div className="mb-6 p-4 bg-bg-secondary rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Error Details:</h3>
                  <pre className="text-xs text-danger overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Component Stack:</h3>
                      <pre className="text-xs text-text-tertiary overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  className="flex items-center justify-center"
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Retry Count Warning */}
              {this.state.errorCount > 2 && (
                <div className="mt-6 p-4 bg-warning bg-opacity-10 rounded-lg">
                  <p className="text-sm text-warning">
                    This error has occurred multiple times. You may want to{' '}
                    <button
                      onClick={this.handleReload}
                      className="underline font-medium hover:text-warning-dark"
                    >
                      reload the page
                    </button>
                    {' '}or contact support if the problem persists.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
