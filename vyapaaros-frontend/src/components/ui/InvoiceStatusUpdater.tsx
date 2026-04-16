import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import type { Invoice, InvoiceStatus, ClientSummary } from '../../types';
import { Button, StatusBadge } from './index';
import { formatCurrency, formatDate, getTrustSegment, cn } from '../../utils/helpers';

export interface InvoiceStatusUpdaterProps {
  invoice: Invoice;
  onStatusUpdate: (invoiceId: string, newStatus: InvoiceStatus, updatedClient?: ClientSummary) => void;
  onCancel?: () => void;
  className?: string;
}

interface StatusUpdateResult {
  success: boolean;
  message: string;
  newTrustScore?: number;
  oldTrustScore?: number;
}

const InvoiceStatusUpdater: React.FC<InvoiceStatusUpdaterProps> = ({
  invoice,
  onStatusUpdate,
  onCancel,
  className
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<StatusUpdateResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<InvoiceStatus | null>(null);

  // Calculate new trust score when marking as paid
  const calculateNewTrustScore = (currentScore: number, invoiceAmount: number): number => {
    // Simple trust score calculation - increase by 1-5 points based on payment
    const baseIncrease = 2;
    const amountBonus = Math.min(3, Math.floor(invoiceAmount / 10000)); // Bonus for larger payments
    const newScore = Math.min(100, currentScore + baseIncrease + amountBonus);
    return newScore;
  };

  // Get status update options based on current status
  const getAvailableStatusUpdates = (currentStatus: InvoiceStatus) => {
    const statusOptions = [
      {
        status: 'paid' as InvoiceStatus,
        label: 'Mark as Paid',
        icon: CheckCircleIcon,
        variant: 'success' as const,
        description: 'Payment received, will update client trust score'
      },
      {
        status: 'pending' as InvoiceStatus,
        label: 'Mark as Pending',
        icon: ClockIcon,
        variant: 'primary' as const,
        description: 'Waiting for payment'
      },
      {
        status: 'overdue' as InvoiceStatus,
        label: 'Mark as Overdue',
        icon: AlertCircleIcon,
        variant: 'danger' as const,
        description: 'Payment is past due date'
      },
      {
        status: 'cancelled' as InvoiceStatus,
        label: 'Cancel Invoice',
        icon: XCircleIcon,
        variant: 'secondary' as const,
        description: 'Invoice cancelled, no payment expected'
      }
    ];

    return statusOptions.filter(option => option.status !== currentStatus);
  };

  // Handle status update confirmation
  const handleStatusUpdate = async (newStatus: InvoiceStatus) => {
    if (newStatus === 'paid' && invoice.status !== 'paid') {
      // Show confirmation for payment with trust score update
      setPendingStatus(newStatus);
      setShowConfirmation(true);
      return;
    }

    // Direct update for other status changes
    await performStatusUpdate(newStatus);
  };

  // Perform the actual status update
  const performStatusUpdate = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    setUpdateResult(null);

    try {
      let updatedClient: ClientSummary | undefined;
      let result: StatusUpdateResult;

      if (newStatus === 'paid' && invoice.status !== 'paid') {
        // Calculate new trust score
        const oldTrustScore = invoice.client.trustScore;
        const newTrustScore = calculateNewTrustScore(oldTrustScore, invoice.total);
        const newSegment = getTrustSegment(newTrustScore);

        updatedClient = {
          ...invoice.client,
          trustScore: newTrustScore,
          segment: newSegment
        };

        result = {
          success: true,
          message: `Invoice marked as paid! Client trust score updated from ${oldTrustScore} to ${newTrustScore}.`,
          newTrustScore,
          oldTrustScore
        };
      } else {
        result = {
          success: true,
          message: `Invoice status updated to ${newStatus}.`
        };
      }

      setUpdateResult(result);
      
      // Call the parent callback
      onStatusUpdate(invoice.id, newStatus, updatedClient);

    } catch {
      setUpdateResult({
        success: false,
        message: 'Failed to update invoice status. Please try again.'
      });
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  // Confirm payment and trust score update
  const confirmPaymentUpdate = () => {
    if (pendingStatus) {
      performStatusUpdate(pendingStatus);
    }
  };

  const availableUpdates = getAvailableStatusUpdates(invoice.status);

  if (updateResult?.success) {
    return (
      <div className={cn('card p-6 text-center', className)}>
        <CheckCircleIcon className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Status Updated Successfully!
        </h3>
        <p className="text-text-secondary mb-4">
          {updateResult.message}
        </p>
        
        {updateResult.newTrustScore && updateResult.oldTrustScore && (
          <div className="bg-success-light/20 border border-success-light rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-sm text-text-tertiary">Previous Score</div>
                <div className="text-xl font-bold text-text-primary">
                  {updateResult.oldTrustScore}
                </div>
              </div>
              <div className="text-success text-2xl">→</div>
              <div className="text-center">
                <div className="text-sm text-text-tertiary">New Score</div>
                <div className="text-xl font-bold text-success">
                  {updateResult.newTrustScore}
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          onClick={onCancel}
        >
          Close
        </Button>
      </div>
    );
  }

  if (showConfirmation && pendingStatus === 'paid') {
    const newTrustScore = calculateNewTrustScore(invoice.client.trustScore, invoice.total);
    
    return (
      <div className={cn('card p-6', className)}>
        <div className="text-center mb-6">
          <CheckCircleIcon className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Confirm Payment Received
          </h3>
          <p className="text-text-secondary">
            This will mark the invoice as paid and update the client's trust score.
          </p>
        </div>

        {/* Invoice Details */}
        <div className="bg-bg-primary rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-tertiary">Invoice:</span>
              <span className="ml-2 font-medium text-text-primary">{invoice.number}</span>
            </div>
            <div>
              <span className="text-text-tertiary">Amount:</span>
              <span className="ml-2 font-medium text-text-primary">
                {formatCurrency(invoice.total)}
              </span>
            </div>
            <div>
              <span className="text-text-tertiary">Client:</span>
              <span className="ml-2 font-medium text-text-primary">{invoice.client.name}</span>
            </div>
            <div>
              <span className="text-text-tertiary">Due Date:</span>
              <span className="ml-2 text-text-primary">
                {formatDate(new Date(invoice.dueDate))}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Score Update Preview */}
        <div className="bg-success-light/10 border border-success-light rounded-lg p-4 mb-6">
          <h4 className="font-medium text-text-primary mb-3">Trust Score Update</h4>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-sm text-text-tertiary">Current Score</div>
              <div className="text-xl font-bold text-text-primary">
                {invoice.client.trustScore}
              </div>
              <StatusBadge 
                variant="trust-segment" 
                value={invoice.client.segment} 
                showEmoji={true}
                className="mt-1"
              />
            </div>
            <div className="text-success text-2xl">→</div>
            <div className="text-center">
              <div className="text-sm text-text-tertiary">New Score</div>
              <div className="text-xl font-bold text-success">
                {newTrustScore}
              </div>
              <StatusBadge 
                variant="trust-segment" 
                value={getTrustSegment(newTrustScore)} 
                showEmoji={true}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Confirmation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmation(false);
              setPendingStatus(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={confirmPaymentUpdate}
            loading={isUpdating}
          >
            Confirm Payment Received
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('card p-6', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Update Invoice Status
        </h3>
        <p className="text-text-secondary">
          Current status: <StatusBadge variant="invoice-status" value={invoice.status} showEmoji={false} />
        </p>
      </div>

      {/* Invoice Summary */}
      <div className="bg-bg-primary rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-tertiary">Invoice:</span>
            <span className="ml-2 font-medium text-text-primary">{invoice.number}</span>
          </div>
          <div>
            <span className="text-text-tertiary">Amount:</span>
            <span className="ml-2 font-medium text-text-primary">
              {formatCurrency(invoice.total)}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">Client:</span>
            <span className="ml-2 font-medium text-text-primary">{invoice.client.name}</span>
          </div>
          <div>
            <span className="text-text-tertiary">Due Date:</span>
            <span className="ml-2 text-text-primary">
              {formatDate(new Date(invoice.dueDate))}
            </span>
          </div>
        </div>
      </div>

      {/* Status Update Options */}
      <div className="space-y-3 mb-6">
        {availableUpdates.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.status}
              className="border border-border-light rounded-lg p-4 hover:bg-bg-hover transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  option.variant === 'success' && 'text-success',
                  option.variant === 'danger' && 'text-danger',
                  option.variant === 'primary' && 'text-primary',
                  option.variant === 'secondary' && 'text-text-tertiary'
                )} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-text-primary">{option.label}</h4>
                    <Button
                      variant={option.variant}
                      size="sm"
                      onClick={() => handleStatusUpdate(option.status)}
                      loading={isUpdating}
                    >
                      Update
                    </Button>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Display */}
      {updateResult && !updateResult.success && (
        <div className="bg-danger-light/20 border border-danger-light rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-5 h-5 text-danger" />
            <p className="text-danger-dark">{updateResult.message}</p>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {onCancel && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceStatusUpdater;