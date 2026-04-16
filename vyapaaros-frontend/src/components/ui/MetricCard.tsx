import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  className,
}) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      case 'neutral':
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      case 'neutral':
        return 'text-text-tertiary';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format large numbers with Indian number system
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(1)}Cr`;
      } else if (val >= 100000) {
        return `₹${(val / 100000).toFixed(1)}L`;
      } else if (val >= 1000) {
        return `₹${(val / 1000).toFixed(1)}K`;
      } else {
        return `₹${val.toLocaleString('en-IN')}`;
      }
    }
    return val;
  };

  return (
    <div className={cn('card p-6 hover:shadow-card-hover transition-shadow duration-200', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-tertiary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{formatValue(value)}</p>
          
          {change && (
            <div className={cn('flex items-center mt-2 text-sm', getTrendColor(change.trend))}>
              {getTrendIcon(change.trend)}
              <span className="ml-1">
                {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                {Math.abs(change.value)}% {change.period}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn('flex-shrink-0 ml-4', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;