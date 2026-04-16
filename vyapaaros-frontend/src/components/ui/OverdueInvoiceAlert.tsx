import React from 'react';
import { AlertTriangleIcon, PhoneIcon, MailIcon, CalendarIcon } from 'lucide-react';
import type { Invoice } from '../../types';
import { Button } from './index';
import { formatCurrency, formatDate, getDaysOverdue, cn } from '../../utils/helpers';

export interface OverdueInvoiceAlertProps {
  invoice: Invoice;
  onSendReminder?: (invoiceId: string) => void;
  onCallClient?: (clientId: string) => void;
  onReschedule?: (invoiceId: string) => void;
  className?: string;
}

const OverdueInvoiceAlert: React.FC<OverdueInvoiceAlertProps> = ({
  invoice,
  onSendReminder,
  onCallClient,
  onReschedule,
  className
}) => {
  const daysOverdue = getDaysOverdue(new Date(invoice.dueDate));
  
  const getUrgencyLevel = (days: number) => {
    if (days >= 30) return 'critical';
    if (days >= 14) return 'high';
    if (days >= 7) return 'medium';
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel(daysOverdue);

  const urgencyStyles = {
    low: {
      container: 'bg-warning-light/20 border-warning-light',
      icon: 'text-warning',
      text: 'text-warning-dark'
    },
    medium: {
      container: 'bg-warning-light/30 border-warning',
      icon: 'text-warning',
      text: 'text-warning-dark'
    },
    high: {
      container: 'bg-danger-light/20 border-danger-light',
      icon: 'text-danger',
      text: 'text-danger-dark'
    },
    critical: {
      container: 'bg-danger-light/30 border-danger',
      icon: 'text-danger',
      text: 'text-danger-dark'
    }
  };

  const styles = urgencyStyles[urgencyLevel];

  const getUrgencyMessage = (days: number) => {
    if (days >= 30) return `Critically overdue by ${days} days`;
    if (days >= 14) return `Seriously overdue by ${days} days`;
    if (days >= 7) return `Overdue by ${days} days`;
    return `${days} day${days === 1 ? '' : 's'} overdue`;
  };

  const getSuggestedActions = (days: number) => {
    if (days >= 30) {
      return [
        { label: 'Call Client Immediately', action: 'call', priority: 'high' },
        { label: 'Send Final Notice', action: 'reminder', priority: 'high' },
        { label: 'Consider Collection', action: 'reschedule', priority: 'medium' }
      ];
    }
    if (days >= 14) {
      return [
        { label: 'Call Client', action: 'call', priority: 'high' },
        { label: 'Send Reminder', action: 'reminder', priority: 'medium' },
        { label: 'Reschedule Payment', action: 'reschedule', priority: 'low' }
      ];
    }
    if (days >= 7) {
      return [
        { label: 'Send Reminder', action: 'reminder', priority: 'high' },
        { label: 'Call Client', action: 'call', priority: 'medium' }
      ];
    }
    return [
      { label: 'Send Gentle Reminder', action: 'reminder', priority: 'medium' },
      { label: 'Call Client', action: 'call', priority: 'low' }
    ];
  };

  const suggestedActions = getSuggestedActions(daysOverdue);

  const handleAction = (action: string) => {
    switch (action) {
      case 'reminder':
        onSendReminder?.(invoice.id);
        break;
      case 'call':
        onCallClient?.(invoice.clientId);
        break;
      case 'reschedule':
        onReschedule?.(invoice.id);
        break;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'reminder':
        return <MailIcon className="w-4 h-4" />;
      case 'call':
        return <PhoneIcon className="w-4 h-4" />;
      case 'reschedule':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActionVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'primary';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={cn(
      'border-2 rounded-lg p-4',
      styles.container,
      className
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangleIcon className={cn('w-6 h-6 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className={cn('font-semibold text-lg', styles.text)}>
                {getUrgencyMessage(daysOverdue)}
              </h3>
              <p className="text-text-secondary text-sm">
                Invoice {invoice.number} • {invoice.client.name}
              </p>
            </div>
            <div className="text-right">
              <div className={cn('font-bold text-xl', styles.text)}>
                {formatCurrency(invoice.total)}
              </div>
              <div className="text-text-tertiary text-sm">
                Due: {formatDate(new Date(invoice.dueDate))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white/50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-tertiary">Client:</span>
            <span className="ml-2 font-medium text-text-primary">
              {invoice.client.name}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">Email:</span>
            <span className="ml-2 text-text-primary">
              {invoice.client.email}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">Trust Score:</span>
            <span className="ml-2 font-medium text-text-primary">
              {invoice.client.trustScore}/100
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">Created:</span>
            <span className="ml-2 text-text-primary">
              {formatDate(new Date(invoice.createdDate))}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Actions */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Suggested Actions:</h4>
        <div className="flex flex-wrap gap-2">
          {suggestedActions.map((action, index) => (
            <Button
              key={index}
              variant={getActionVariant(action.priority) as any}
              size="sm"
              onClick={() => handleAction(action.action)}
              className="flex items-center gap-2"
            >
              {getActionIcon(action.action)}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Context for Critical Cases */}
      {urgencyLevel === 'critical' && (
        <div className="mt-4 p-3 bg-danger-light/10 rounded-lg border border-danger-light">
          <p className="text-sm text-danger-dark">
            <strong>Critical:</strong> This invoice has been overdue for over 30 days. 
            Consider escalating to collections or legal action if payment arrangements cannot be made.
          </p>
        </div>
      )}
    </div>
  );
};

export default OverdueInvoiceAlert;