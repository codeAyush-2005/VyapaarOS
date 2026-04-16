import React from 'react';
import { 
  FileText, 
  DollarSign, 
  UserPlus, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import type { ActivityItem } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { StatusBadge } from './';

export interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 5,
  className = '',
}) => {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconProps = { className: 'h-5 w-5' };
    
    switch (type) {
      case 'invoice_created':
        return <FileText {...iconProps} />;
      case 'payment_received':
        return <DollarSign {...iconProps} />;
      case 'client_added':
        return <UserPlus {...iconProps} />;
      case 'invoice_overdue':
        return <AlertTriangle {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getActivityColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-success bg-success-light';
      case 'warning':
        return 'text-warning bg-warning-light';
      case 'danger':
        return 'text-danger bg-danger-light';
      case 'info':
        return 'text-info bg-info-light';
      default:
        return 'text-text-tertiary bg-gray-100';
    }
  };

  const formatActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'invoice_created':
        return `New invoice created for ${activity.client?.name || 'client'}`;
      case 'payment_received':
        return `Payment of ${activity.amount ? formatCurrency(activity.amount) : 'amount'} received from ${activity.client?.name || 'client'}`;
      case 'client_added':
        return `New client ${activity.client?.name || 'client'} added to system`;
      case 'invoice_overdue':
        return `Invoice for ${activity.client?.name || 'client'} is now overdue`;
      default:
        return activity.description;
    }
  };

  if (displayActivities.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-text-disabled mx-auto mb-4" />
          <p className="text-text-tertiary">No recent activity</p>
          <p className="text-sm text-text-disabled">Activity will appear here as you use the system</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
        <StatusBadge 
          variant="semantic" 
          value="info" 
          showEmoji={false}
        />
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            {/* Activity Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                {formatActivityDescription(activity)}
              </p>
              
              {activity.amount && (
                <p className="text-sm font-medium text-text-primary mt-1">
                  {formatCurrency(activity.amount)}
                </p>
              )}
              
              <p className="text-xs text-text-tertiary mt-1">
                {formatDate(activity.timestamp, 'datetime')}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              <StatusBadge 
                variant="semantic" 
                value={activity.status} 
                showEmoji={false}
              />
            </div>
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:text-primary-hover font-medium">
            View all activity ({activities.length} total)
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;