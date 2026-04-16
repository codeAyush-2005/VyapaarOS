import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon, FilterIcon, SearchIcon, AlertTriangleIcon, FileText } from 'lucide-react';
import type { Invoice, InvoiceFilters, InvoiceStatus } from '../../types';
import { StatusBadge, Button, InputField, OverdueInvoiceAlert, EmptyState } from './index';
import { formatCurrency, formatDate, isOverdue, getDaysOverdue, cn } from '../../utils/helpers';

export interface InvoiceListProps {
  invoices: Invoice[];
  onInvoiceSelect?: (invoice: Invoice) => void;
  onStatusChange?: (invoiceId: string, status: InvoiceStatus) => void;
  onSendReminder?: (invoiceId: string) => void;
  onCallClient?: (clientId: string) => void;
  onReschedule?: (invoiceId: string) => void;
  onCreateInvoice?: () => void;
  className?: string;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onInvoiceSelect,
  onStatusChange,
  onSendReminder,
  onCallClient,
  onReschedule,
  onCreateInvoice,
  className
}) => {
  const [filters, setFilters] = useState<InvoiceFilters>({
    sortBy: 'dueDate',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showOverdueAlerts, setShowOverdueAlerts] = useState(true);

  // Get overdue invoices for prominent display
  const overdueInvoices = useMemo(() => {
    return invoices
      .filter(invoice => isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid')
      .sort((a, b) => getDaysOverdue(new Date(b.dueDate)) - getDaysOverdue(new Date(a.dueDate)));
  }, [invoices]);

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = [...invoices];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(search) ||
        invoice.client.name.toLowerCase().includes(search) ||
        invoice.notes?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Apply client filter
    if (filters.clientId) {
      filtered = filtered.filter(invoice => invoice.clientId === filters.clientId);
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdDate);
        return invoiceDate >= filters.dateRange!.start && invoiceDate <= filters.dateRange!.end;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'number':
            aValue = a.number;
            bValue = b.number;
            break;
          case 'client':
            aValue = a.client.name;
            bValue = b.client.name;
            break;
          case 'amount':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'dueDate':
            aValue = new Date(a.dueDate);
            bValue = new Date(b.dueDate);
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [invoices, filters, searchTerm]);

  const handleSort = (column: InvoiceFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStatusFilter = (status: InvoiceStatus | undefined) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
  };

  const getSortIcon = (column: InvoiceFilters['sortBy']) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
      <ChevronDownIcon className="w-4 h-4 ml-1" />;
  };

  const getRowClassName = (invoice: Invoice) => {
    const baseClasses = 'hover:bg-bg-hover transition-colors duration-200 cursor-pointer';
    const overdueClasses = isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid' 
      ? 'bg-danger-light/10 hover:bg-danger-light/20' 
      : '';
    return cn(baseClasses, overdueClasses);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
            <InputField
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              inputMode="search"
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-bg-secondary p-4 rounded-lg border border-border-light">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value as InvoiceStatus || undefined)}
                className="w-full px-3 py-2 text-sm border border-border-light rounded-lg bg-white text-base sm:text-sm touch-manipulation"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Invoices Alert Section */}
      {overdueInvoices.length > 0 && showOverdueAlerts && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-danger" />
              <h3 className="text-lg font-semibold text-danger">
                Overdue Invoices ({overdueInvoices.length})
              </h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowOverdueAlerts(false)}
            >
              Hide Alerts
            </Button>
          </div>
          
          <div className="space-y-3">
            {overdueInvoices.slice(0, 3).map((invoice) => (
              <OverdueInvoiceAlert
                key={invoice.id}
                invoice={invoice}
                onSendReminder={onSendReminder}
                onCallClient={onCallClient}
                onReschedule={onReschedule}
              />
            ))}
            
            {overdueInvoices.length > 3 && (
              <div className="text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusFilter('overdue')}
                >
                  View All {overdueInvoices.length} Overdue Invoices
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show Overdue Alerts Button (when hidden) */}
      {overdueInvoices.length > 0 && !showOverdueAlerts && (
        <div className="flex justify-center">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowOverdueAlerts(true)}
            className="flex items-center gap-2"
          >
            <AlertTriangleIcon className="w-4 h-4" />
            Show {overdueInvoices.length} Overdue Alert{overdueInvoices.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bg-primary">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center">
                    Invoice Number
                    {getSortIcon('number')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center">
                    Client
                    {getSortIcon('client')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    {getSortIcon('dueDate')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredAndSortedInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className={getRowClassName(invoice)}
                  onClick={() => onInvoiceSelect?.(invoice)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {invoice.number}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {formatDate(new Date(invoice.createdDate))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary">{invoice.client.name}</div>
                    <div className="text-xs text-text-tertiary">{invoice.client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {formatCurrency(invoice.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                      "text-sm",
                      isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid'
                        ? "text-danger font-medium"
                        : "text-text-secondary"
                    )}>
                      {formatDate(new Date(invoice.dueDate))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      variant="invoice-status" 
                      value={invoice.status} 
                      showEmoji={false} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.status === 'pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange?.(invoice.id, 'paid');
                        }}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet Table View (Stacked Columns) */}
      <div className="hidden md:block lg:hidden card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bg-primary">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center">
                    Invoice & Client
                    {getSortIcon('number')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount & Due Date
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-bg-hover"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status & Actions
                    {getSortIcon('status')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredAndSortedInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className={getRowClassName(invoice)}
                  onClick={() => onInvoiceSelect?.(invoice)}
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-text-primary">
                        {invoice.number}
                      </div>
                      <div className="text-sm text-text-primary">{invoice.client.name}</div>
                      <div className="text-xs text-text-tertiary">
                        Created: {formatDate(new Date(invoice.createdDate))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-text-primary">
                        {formatCurrency(invoice.total)}
                      </div>
                      <div className={cn(
                        "text-sm",
                        isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid'
                          ? "text-danger font-medium"
                          : "text-text-secondary"
                      )}>
                        Due: {formatDate(new Date(invoice.dueDate))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <StatusBadge 
                        variant="invoice-status" 
                        value={invoice.status} 
                        showEmoji={false} 
                      />
                      {invoice.status === 'pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange?.(invoice.id, 'paid');
                          }}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredAndSortedInvoices.map((invoice) => (
          <div 
            key={invoice.id}
            className={cn(
              "card p-4 cursor-pointer",
              isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid'
                ? "border-danger-light bg-danger-light/5"
                : ""
            )}
            onClick={() => onInvoiceSelect?.(invoice)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-text-primary">{invoice.number}</div>
                <div className="text-sm text-text-secondary">{invoice.client.name}</div>
              </div>
              <StatusBadge 
                variant="invoice-status" 
                value={invoice.status} 
                showEmoji={false} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-text-tertiary">Amount</div>
                <div className="font-medium text-text-primary">
                  {formatCurrency(invoice.total)}
                </div>
              </div>
              <div>
                <div className="text-text-tertiary">Due Date</div>
                <div className={cn(
                  isOverdue(new Date(invoice.dueDate)) && invoice.status !== 'paid'
                    ? "text-danger font-medium"
                    : "text-text-primary"
                )}>
                  {formatDate(new Date(invoice.dueDate))}
                </div>
              </div>
            </div>

            {invoice.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-border-light">
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(invoice.id, 'paid');
                  }}
                  className="w-full"
                >
                  Mark as Paid
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedInvoices.length === 0 && (
        <EmptyState
          icon={searchTerm || filters.status ? SearchIcon : FileText}
          title={searchTerm || filters.status ? 'No invoices match your filters' : 'No invoices found'}
          description={
            searchTerm || filters.status 
              ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
              : 'Create your first invoice to get started with managing your business payments.'
          }
          action={
            searchTerm || filters.status 
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchTerm('');
                    setFilters({ sortBy: 'dueDate', sortOrder: 'desc' });
                  },
                  variant: "secondary"
                }
              : onCreateInvoice 
                ? {
                    label: "Create First Invoice",
                    onClick: onCreateInvoice,
                    variant: "primary"
                  }
                : undefined
          }
          secondaryAction={
            (searchTerm || filters.status) && onCreateInvoice 
              ? {
                  label: "Create New Invoice",
                  onClick: onCreateInvoice,
                  variant: "primary"
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default InvoiceList;