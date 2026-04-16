import React from 'react';
import { cn } from '../../utils/helpers';

export interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  width,
  height = '1rem',
  rounded = false
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-bg-hover',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  );
};

// Table skeleton component
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-bg-primary">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <SkeletonLoader height="1rem" width="80%" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <SkeletonLoader 
                      height="1rem" 
                      width={colIndex === 0 ? '100%' : `${60 + Math.random() * 40}%`} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Card skeleton component
export interface CardSkeletonProps {
  rows?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 3,
  className
}) => {
  return (
    <div className={cn('card p-4 space-y-3', className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <SkeletonLoader height="1.25rem" width="60%" />
          <SkeletonLoader height="0.875rem" width="40%" />
        </div>
        <SkeletonLoader height="1.5rem" width="4rem" rounded />
      </div>
      
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-2 gap-4">
          <div>
            <SkeletonLoader height="0.75rem" width="50%" className="mb-1" />
            <SkeletonLoader height="1rem" width="80%" />
          </div>
          <div>
            <SkeletonLoader height="0.75rem" width="50%" className="mb-1" />
            <SkeletonLoader height="1rem" width="70%" />
          </div>
        </div>
      ))}
      
      <div className="flex justify-end space-x-2 pt-3 border-t border-border-light">
        <SkeletonLoader height="2rem" width="4rem" rounded />
        <SkeletonLoader height="2rem" width="4rem" rounded />
      </div>
    </div>
  );
};

SkeletonLoader.displayName = 'SkeletonLoader';
TableSkeleton.displayName = 'TableSkeleton';
CardSkeleton.displayName = 'CardSkeleton';

export default SkeletonLoader;