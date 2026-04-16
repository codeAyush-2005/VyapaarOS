import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { Client, Invoice } from '../../types';
import { Button, StatusBadge } from './';
import { formatCurrency, formatDate, getTrustSegmentConfig } from '../../utils/helpers';

export interface ClientDetailProps {
  client: Client;
  invoices?: Invoice[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (client: Client) => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({
  client,
  invoices = [],
  isOpen,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments'>('overview');
  
  if (!isOpen) return null;

  const segmentConfig = getTrustSegmentConfig(client.segment);
  const recentInvoices = invoices.slice(0, 5);

  const stats = {
    totalInvoiced: client.totalInvoiced,
    totalPaid: client.totalPaid,
    totalOwed: client.totalOwed,
    averagePaymentTime: 15, // Mock data
    onTimePayments: Math.round((client.totalPaid / client.totalInvoiced) * 100),
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: segmentConfig.color }}
              >
                {segmentConfig.emoji}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{client.name}</h2>
                <p className="text-text-secondary">{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(client)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'invoices', label: 'Invoices' },
                { id: 'payments', label: 'Payment History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Trust Score & Segment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-4">
                    <h3 className="text-sm font-medium text-text-tertiary mb-2">Trust Score</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-text-primary">{client.trustScore}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${client.trustScore}%`,
                              backgroundColor: segmentConfig.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <StatusBadge variant="trust-segment" value={client.segment} />
                    </div>
                  </div>

                  <div className="card p-4">
                    <h3 className="text-sm font-medium text-text-tertiary mb-2">Client Since</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-text-tertiary" />
                      <span className="text-lg font-semibold text-text-primary">
                        {formatDate(client.createdDate, 'long')}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {Math.floor((new Date().getTime() - client.createdDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-text-tertiary" />
                      <div>
                        <p className="text-sm text-text-tertiary">Email</p>
                        <p className="text-text-primary">{client.email}</p>
                      </div>
                    </div>
                    
                    {client.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-text-tertiary" />
                        <div>
                          <p className="text-sm text-text-tertiary">Phone</p>
                          <p className="text-text-primary">{client.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {client.address && (
                      <div className="flex items-start space-x-3 md:col-span-2">
                        <MapPin className="h-5 w-5 text-text-tertiary mt-0.5" />
                        <div>
                          <p className="text-sm text-text-tertiary">Address</p>
                          <p className="text-text-primary">
                            {client.address.street}, {client.address.city}, {client.address.state} {client.address.zipCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4 text-center">
                    <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
                    <p className="text-sm text-text-tertiary">Total Invoiced</p>
                    <p className="text-xl font-bold text-text-primary">{formatCurrency(stats.totalInvoiced)}</p>
                  </div>
                  
                  <div className="card p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-text-tertiary">Total Paid</p>
                    <p className="text-xl font-bold text-text-primary">{formatCurrency(stats.totalPaid)}</p>
                  </div>
                  
                  <div className="card p-4 text-center">
                    <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                    <p className="text-sm text-text-tertiary">Amount Owed</p>
                    <p className="text-xl font-bold text-text-primary">{formatCurrency(stats.totalOwed)}</p>
                  </div>
                </div>

                {/* Notes */}
                {client.notes && (
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Notes</h3>
                    <p className="text-text-secondary">{client.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Recent Invoices ({client.invoiceCount} total)
                  </h3>
                  <Button variant="primary" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </div>
                
                {recentInvoices.length > 0 ? (
                  <div className="space-y-3">
                    {recentInvoices.map((invoice) => (
                      <div key={invoice.id} className="card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-text-primary">{invoice.number}</p>
                            <p className="text-sm text-text-tertiary">
                              Due: {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-text-primary">
                              {formatCurrency(invoice.total)}
                            </p>
                            <StatusBadge variant="invoice-status" value={invoice.status} showEmoji={false} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-text-disabled mx-auto mb-4" />
                    <p className="text-text-tertiary">No invoices yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Statistics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="card p-4">
                    <p className="text-sm text-text-tertiary">Average Payment Time</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.averagePaymentTime} days</p>
                  </div>
                  
                  <div className="card p-4">
                    <p className="text-sm text-text-tertiary">On-Time Payment Rate</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.onTimePayments}%</p>
                  </div>
                </div>

                <div className="card p-4">
                  <p className="text-sm text-text-tertiary mb-2">Last Payment</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {client.lastPaymentDate ? formatDate(client.lastPaymentDate, 'long') : 'No payments yet'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;