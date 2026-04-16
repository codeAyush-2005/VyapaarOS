import React from 'react';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { EmptyState } from './index';
import { cn } from '../../utils/helpers';

export interface EmptyDashboardProps {
  onAddClient?: () => void;
  onCreateInvoice?: () => void;
  className?: string;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  onAddClient,
  onCreateInvoice,
  className
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Empty State */}
      <EmptyState
        icon={BarChart3}
        title="Welcome to VyapaarOS"
        description="Get started by adding your first client and creating invoices to track your business growth."
        action={onAddClient ? {
          label: "Add Your First Client",
          onClick: onAddClient,
          variant: "primary"
        } : undefined}
        secondaryAction={onCreateInvoice ? {
          label: "Create Invoice",
          onClick: onCreateInvoice,
          variant: "secondary"
        } : undefined}
        size="lg"
      />

      {/* Quick Start Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium text-text-primary mb-2">Add Clients</h3>
          <p className="text-sm text-text-secondary">
            Start by adding your clients to track their trust scores and payment history.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-medium text-text-primary mb-2">Create Invoices</h3>
          <p className="text-sm text-text-secondary">
            Generate professional invoices and track payment status automatically.
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-warning" />
          </div>
          <h3 className="font-medium text-text-primary mb-2">Track Growth</h3>
          <p className="text-sm text-text-secondary">
            Monitor your business metrics and client trust scores in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

EmptyDashboard.displayName = 'EmptyDashboard';

export default EmptyDashboard;