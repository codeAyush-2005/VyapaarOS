import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  X,
  Users
} from 'lucide-react';
import type { Client, ClientFilters } from '../../types';
import { StatusBadge, Button, EmptyState } from './';
import { formatCurrency, formatDate, sortBy } from '../../utils/helpers';

export interface ClientListProps {
  clients: Client[];
  onClientSelect?: (client: Client) => void;
  onClientEdit?: (client: Client) => void;
  onAddClient?: () => void;
  className?: string;
}

// Move SortableHeader outside the component
interface SortableHeaderProps {
  field: keyof Client;
  children: React.ReactNode;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: keyof Client) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ field, children, sortBy, sortOrder, onSort }) => {
  const getSortIcon = () => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover transition-colors duration-200"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

const ClientList: React.FC<ClientListProps> = ({
  clients,
  onClientSelect,
  onClientEdit,
  onAddClient,
  className = '',
}) => {
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter and sort clients
  const filteredClients = React.useMemo(() => {
    let filtered = [...clients];

    // Search filter - search in name, email, and phone
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        (client.phone && client.phone.toLowerCase().includes(searchLower))
      );
    }

    // Segment filter
    if (filters.segment) {
      filtered = filtered.filter(client => client.segment === filters.segment);
    }

    // Payment status filter
    if (filters.paymentStatus) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(client => {
        switch (filters.paymentStatus) {
          case 'recent':
            return client.lastPaymentDate && client.lastPaymentDate >= thirtyDaysAgo;
          case 'overdue':
            return client.totalOwed > 0 && (!client.lastPaymentDate || client.lastPaymentDate < thirtyDaysAgo);
          case 'no-outstanding':
            return client.totalOwed === 0;
          default:
            return true;
        }
      });
    }

    // Amount owed filter
    if (filters.amountOwedRange) {
      filtered = filtered.filter(client => {
        const owed = client.totalOwed;
        switch (filters.amountOwedRange) {
          case 'none':
            return owed === 0;
          case 'low':
            return owed > 0 && owed <= 10000;
          case 'medium':
            return owed > 10000 && owed <= 50000;
          case 'high':
            return owed > 50000;
          default:
            return true;
        }
      });
    }

    // Sort
    if (filters.sortBy) {
      filtered = sortBy(filtered, filters.sortBy, filters.sortOrder);
    }

    return filtered;
  }, [clients, filters]);

  const handleSort = (field: keyof Client) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field as ClientFilters['sortBy'],
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setSearchTerm('');
    setShowFilters(false);
  };

  const hasActiveFilters = filters.segment || filters.paymentStatus || filters.amountOwedRange || filters.search;

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Start by adding your first client to track their trust score and manage invoices."
        action={onAddClient ? {
          label: "Add First Client",
          onClick: onAddClient,
          variant: "primary"
        } : undefined}
        className={className}
      />
    );
  }

  return (
    <div className={`card ${className}`}>
      {/* Header with Search and Filters */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Clients ({filteredClients.length})
            </h2>
            <p className="text-sm text-text-secondary">
              Manage your client relationships and trust scores
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-sm touch-manipulation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                inputMode="search"
                autoComplete="off"
              />
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                  •
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-bg-primary rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Trust Segment
                </label>
                <select
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  value={filters.segment || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    segment: e.target.value as ClientFilters['segment'] || undefined 
                  }))}
                >
                  <option value="">All Segments</option>
                  <option value="butterfly">Butterfly (High Trust)</option>
                  <option value="loyal">Loyal (Medium Trust)</option>
                  <option value="oneTime">One-Time (Low Trust)</option>
                  <option value="risky">Risky (Needs Attention)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Payment Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  value={filters.paymentStatus || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    paymentStatus: e.target.value as ClientFilters['paymentStatus'] || undefined 
                  }))}
                >
                  <option value="">All Payment Status</option>
                  <option value="recent">Recent Payment (30 days)</option>
                  <option value="overdue">Overdue Payments</option>
                  <option value="no-outstanding">No Outstanding Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Amount Owed
                </label>
                <select
                  className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-sm touch-manipulation"
                  value={filters.amountOwedRange || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    amountOwedRange: e.target.value as ClientFilters['amountOwedRange'] || undefined 
                  }))}
                >
                  <option value="">All Amounts</option>
                  <option value="none">No Outstanding (₹0)</option>
                  <option value="low">Low (₹1 - ₹10,000)</option>
                  <option value="medium">Medium (₹10,001 - ₹50,000)</option>
                  <option value="high">High (₹50,000+)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-text-secondary">Active filters:</span>
                  {filters.segment && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      Segment: {filters.segment}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, segment: undefined }))}
                        className="ml-1 hover:text-primary/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.paymentStatus && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      Payment: {filters.paymentStatus}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, paymentStatus: undefined }))}
                        className="ml-1 hover:text-primary/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.amountOwedRange && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      Amount: {filters.amountOwedRange}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, amountOwedRange: undefined }))}
                        className="ml-1 hover:text-primary/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-bg-primary">
            <tr>
              <SortableHeader 
                field="name" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Client
              </SortableHeader>
              <SortableHeader 
                field="trustScore" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Trust Score
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Segment
              </th>
              <SortableHeader 
                field="totalOwed" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Amount Owed
              </SortableHeader>
              <SortableHeader 
                field="lastPaymentDate" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Last Payment
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {filteredClients.map((client) => (
              <tr 
                key={client.id} 
                className="hover:bg-bg-hover transition-colors duration-200 cursor-pointer"
                onClick={() => onClientSelect?.(client)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {client.name}
                    </div>
                    <div className="text-sm text-text-tertiary">
                      {client.email}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-text-primary mr-2">
                      {client.trustScore}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${client.trustScore}%`,
                          backgroundColor: client.trustScore >= 80 ? '#10B981' :
                                         client.trustScore >= 60 ? '#F59E0B' :
                                         client.trustScore >= 40 ? '#6366F1' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge variant="trust-segment" value={client.segment} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">
                    {formatCurrency(client.totalOwed)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    {client.lastPaymentDate ? formatDate(client.lastPaymentDate) : 'Never'}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClientSelect?.(client);
                      }}
                      className="text-text-tertiary hover:text-primary transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClientEdit?.(client);
                      }}
                      className="text-text-tertiary hover:text-primary transition-colors duration-200"
                      title="Edit Client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-text-tertiary hover:text-primary transition-colors duration-200"
                      title="More Actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Table View (Stacked Columns) */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-bg-primary">
            <tr>
              <SortableHeader 
                field="name" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Client & Trust
              </SortableHeader>
              <SortableHeader 
                field="totalOwed" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onSort={handleSort}
              >
                Amount & Payment
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {filteredClients.map((client) => (
              <tr 
                key={client.id} 
                className="hover:bg-bg-hover transition-colors duration-200 cursor-pointer"
                onClick={() => onClientSelect?.(client)}
              >
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {client.name}
                      </div>
                      <div className="text-sm text-text-tertiary">
                        {client.email}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-text-primary mr-2">
                          {client.trustScore}
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${client.trustScore}%`,
                              backgroundColor: client.trustScore >= 80 ? '#10B981' :
                                             client.trustScore >= 60 ? '#F59E0B' :
                                             client.trustScore >= 40 ? '#6366F1' : '#EF4444'
                            }}
                          />
                        </div>
                      </div>
                      <StatusBadge variant="trust-segment" value={client.segment} />
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-text-primary">
                      {formatCurrency(client.totalOwed)}
                    </div>
                    <div className="text-sm text-text-secondary">
                      Last: {client.lastPaymentDate ? formatDate(client.lastPaymentDate) : 'Never'}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClientSelect?.(client);
                      }}
                      className="text-text-tertiary hover:text-primary transition-colors duration-200 p-2"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClientEdit?.(client);
                      }}
                      className="text-text-tertiary hover:text-primary transition-colors duration-200 p-2"
                      title="Edit Client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => onClientSelect?.(client)}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-medium text-text-primary">{client.name}</div>
                <div className="text-sm text-text-secondary">{client.email}</div>
                {client.phone && (
                  <div className="text-sm text-text-tertiary">{client.phone}</div>
                )}
              </div>
              <StatusBadge variant="trust-segment" value={client.segment} />
            </div>
            
            {/* Trust Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">Trust Score</span>
                <span className="text-sm font-medium text-text-primary">{client.trustScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${client.trustScore}%`,
                    backgroundColor: client.trustScore >= 80 ? '#10B981' :
                                   client.trustScore >= 60 ? '#F59E0B' :
                                   client.trustScore >= 40 ? '#6366F1' : '#EF4444'
                  }}
                />
              </div>
            </div>
            
            {/* Financial Info */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <div className="text-text-tertiary">Amount Owed</div>
                <div className="font-medium text-text-primary">
                  {formatCurrency(client.totalOwed)}
                </div>
              </div>
              <div>
                <div className="text-text-tertiary">Last Payment</div>
                <div className="text-text-primary">
                  {client.lastPaymentDate ? formatDate(client.lastPaymentDate) : 'Never'}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-border-light">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClientSelect?.(client);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClientEdit?.(client);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {filteredClients.length > 0 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-tertiary">
              Showing {filteredClients.length} of {clients.length} clients
              {hasActiveFilters && (
                <span className="ml-2 text-primary">
                  (filtered)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                Previous
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Results State */}
      {filteredClients.length === 0 && clients.length > 0 && (
        <div className="px-6 py-8">
          <EmptyState
            icon={Search}
            title="No clients found"
            description="No clients match your current search and filter criteria."
            action={{
              label: "Clear Filters",
              onClick: clearFilters,
              variant: "secondary"
            }}
            secondaryAction={onAddClient ? {
              label: "Add New Client",
              onClick: onAddClient,
              variant: "primary"
            } : undefined}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default ClientList;