import React, { useEffect } from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import { 
  MetricCard, 
  TrustSegmentDistribution, 
  RecentActivity 
} from '../components/ui';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { dashboardData } = useApp();

  useEffect(() => {
    document.title = 'Dashboard - VyapaarOS';
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Welcome to your business overview</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={dashboardData.metrics.totalRevenue}
          change={{ value: 12, period: 'from last month', trend: 'up' }}
          icon={<DollarSign className="h-6 w-6" />}
          color="success"
        />
        
        <MetricCard
          title="Pending Invoices"
          value={dashboardData.metrics.pendingAmount}
          change={{ value: 8, period: 'invoices pending', trend: 'neutral' }}
          icon={<FileText className="h-6 w-6" />}
          color="warning"
        />
        
        <MetricCard
          title="Total Clients"
          value={dashboardData.metrics.clientCount}
          change={{ value: 5, period: 'new this month', trend: 'up' }}
          icon={<Users className="h-6 w-6" />}
          color="primary"
        />
        
        <MetricCard
          title="Overdue Amount"
          value={dashboardData.metrics.overdueAmount}
          change={{ value: 3, period: 'invoices overdue', trend: 'down' }}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="danger"
        />
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trust Distribution */}
        <TrustSegmentDistribution distribution={dashboardData.trustDistribution} />

        {/* Recent Activity */}
        <RecentActivity activities={dashboardData.recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;