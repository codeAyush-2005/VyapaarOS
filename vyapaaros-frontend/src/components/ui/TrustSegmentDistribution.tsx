import React from 'react';
import { TRUST_SEGMENTS } from '../../utils/constants';
import { calculatePercentage } from '../../utils/helpers';

export interface TrustSegmentDistributionProps {
  distribution: {
    butterfly: number;
    loyal: number;
    oneTime: number;
    risky: number;
  };
  className?: string;
}

const TrustSegmentDistribution: React.FC<TrustSegmentDistributionProps> = ({
  distribution,
  className = '',
}) => {
  const total = distribution.butterfly + distribution.loyal + distribution.oneTime + distribution.risky;
  
  const segments = [
    {
      key: 'butterfly' as const,
      count: distribution.butterfly,
      percentage: calculatePercentage(distribution.butterfly, total),
      config: TRUST_SEGMENTS.butterfly,
    },
    {
      key: 'loyal' as const,
      count: distribution.loyal,
      percentage: calculatePercentage(distribution.loyal, total),
      config: TRUST_SEGMENTS.loyal,
    },
    {
      key: 'oneTime' as const,
      count: distribution.oneTime,
      percentage: calculatePercentage(distribution.oneTime, total),
      config: TRUST_SEGMENTS.oneTime,
    },
    {
      key: 'risky' as const,
      count: distribution.risky,
      percentage: calculatePercentage(distribution.risky, total),
      config: TRUST_SEGMENTS.risky,
    },
  ];

  return (
    <div className={`card p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-text-primary mb-6">Client Trust Distribution</h2>
      
      {/* Horizontal Bar Chart */}
      <div className="mb-6">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className="transition-all duration-300"
              style={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.config.color,
              }}
              title={`${segment.config.label}: ${segment.count} clients (${segment.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Segment Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map((segment) => (
          <div key={segment.key} className="text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: segment.config.color }}
            >
              {segment.config.emoji}
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">
              {segment.config.label.split(' ')[0]}
            </p>
            <p className="text-lg font-bold text-text-primary">
              {segment.count}
            </p>
            <p className="text-xs text-text-tertiary">
              {segment.percentage}% of clients
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-tertiary">Total Clients</span>
          <span className="font-semibold text-text-primary">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSegmentDistribution;