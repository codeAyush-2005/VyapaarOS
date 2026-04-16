import React from 'react';
import type { TrustSegment, InvoiceStatus } from '../../types';
import { getTrustSegmentConfig } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

export interface StatusBadgeProps {
  variant: 'trust-segment' | 'invoice-status' | 'semantic';
  value: TrustSegment | InvoiceStatus | 'success' | 'warning' | 'danger' | 'info';
  showEmoji?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  variant, 
  value, 
  showEmoji = true, 
  className 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const getTrustSegmentClasses = (segment: TrustSegment) => {
    const classMap = {
      butterfly: 'bg-butterfly-light text-butterfly-dark',
      loyal: 'bg-loyal-light text-loyal-dark',
      oneTime: 'bg-one-time-light text-one-time-dark',
      risky: 'bg-risky-light text-risky-dark',
    };
    return classMap[segment];
  };

  const getInvoiceStatusClasses = (status: InvoiceStatus) => {
    const classMap = {
      paid: 'bg-success-light text-success-dark',
      pending: 'bg-warning-light text-warning-dark',
      overdue: 'bg-danger-light text-danger-dark',
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-info-light text-info-dark',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return classMap[status];
  };

  const getSemanticClasses = (semantic: string) => {
    const classMap = {
      success: 'bg-success-light text-success-dark',
      warning: 'bg-warning-light text-warning-dark',
      danger: 'bg-danger-light text-danger-dark',
      info: 'bg-info-light text-info-dark',
    };
    return classMap[semantic as keyof typeof classMap] || 'bg-gray-100 text-gray-700';
  };

  const getDisplayText = () => {
    if (variant === 'trust-segment') {
      const segment = value as TrustSegment;
      const config = getTrustSegmentConfig(segment);
      const emoji = showEmoji ? ` ${config.emoji}` : '';
      const labels = {
        butterfly: 'Butterfly',
        loyal: 'Loyal',
        oneTime: 'One-Time',
        risky: 'Risky',
      };
      return `${labels[segment]}${emoji}`;
    }

    if (variant === 'invoice-status') {
      const status = value as InvoiceStatus;
      const labels = {
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue',
        draft: 'Draft',
        sent: 'Sent',
        cancelled: 'Cancelled',
      };
      return labels[status];
    }

    // Semantic variant
    const labels = {
      success: 'Success',
      warning: 'Warning',
      danger: 'Error',
      info: 'Info',
    };
    return labels[value as keyof typeof labels] || value;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'trust-segment':
        return getTrustSegmentClasses(value as TrustSegment);
      case 'invoice-status':
        return getInvoiceStatusClasses(value as InvoiceStatus);
      case 'semantic':
        return getSemanticClasses(value as string);
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={cn(baseClasses, getVariantClasses(), className)}>
      {getDisplayText()}
    </span>
  );
};

export default StatusBadge;