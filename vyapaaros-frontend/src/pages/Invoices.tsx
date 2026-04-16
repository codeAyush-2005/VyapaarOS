import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import { InvoiceList, InvoiceForm, InvoiceStatusUpdater, Button } from '../components/ui';
import type { Invoice, InvoiceStatus, ClientSummary } from '../types';
import { useApp } from '../context/AppContext';

const Invoices: React.FC = () => {
  const { invoices, clients, addInvoice, updateInvoice, updateInvoiceStatus } = useApp();
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'status-update'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    document.title = 'Invoices - VyapaarOS';
  }, []);

  // Convert clients to ClientSummary format
  const clientSummaries: ClientSummary[] = useMemo(() => 
    clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      trustScore: client.trustScore,
      segment: client.segment,
    })),
    [clients]
  );

  // Memoize callbacks to prevent unnecessary re-renders
  const handleInvoiceSelect = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView('status-update');
  }, []);

  const handleStatusChange = useCallback((invoiceId: string, newStatus: InvoiceStatus) => {
    updateInvoiceStatus(invoiceId, newStatus);
  }, [updateInvoiceStatus]);

  const handleCreateInvoice = useCallback((invoiceData: Partial<Invoice>) => {
    addInvoice(invoiceData);
    setView('list');
  }, [addInvoice]);

  const handleSendReminder = useCallback((invoiceId: string) => {
    // Mock implementation - would integrate with email service
    console.log('Sending reminder for invoice:', invoiceId);
    alert('Reminder sent successfully!');
  }, []);

  const handleCallClient = useCallback((clientId: string) => {
    // Mock implementation - would integrate with phone system
    console.log('Initiating call to client:', clientId);
    alert('Call initiated!');
  }, []);

  const handleReschedule = useCallback((invoiceId: string) => {
    // Mock implementation - would show reschedule dialog
    console.log('Rescheduling invoice:', invoiceId);
    alert('Reschedule dialog would open here');
  }, []);

  if (view === 'create') {
    return (
      <div>
        <InvoiceForm
          mode="create"
          clients={clientSummaries}
          onSubmit={handleCreateInvoice}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  if (view === 'edit' && selectedInvoice) {
    return (
      <div>
        <InvoiceForm
          mode="edit"
          initialData={selectedInvoice}
          clients={clientSummaries}
          onSubmit={(invoiceData) => {
            updateInvoice(selectedInvoice.id, invoiceData);
            setView('list');
          }}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  if (view === 'status-update' && selectedInvoice) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setView('list')}
          >
            ← Back to Invoices
          </Button>
        </div>
        <InvoiceStatusUpdater
          invoice={selectedInvoice}
          onStatusUpdate={(invoiceId, newStatus) => {
            handleStatusChange(invoiceId, newStatus);
            setView('list');
          }}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
            <p className="text-text-secondary">Track and manage your invoices</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setView('create')}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <InvoiceList
        invoices={invoices}
        onInvoiceSelect={handleInvoiceSelect}
        onStatusChange={handleStatusChange}
        onSendReminder={handleSendReminder}
        onCallClient={handleCallClient}
        onReschedule={handleReschedule}
      />
    </div>
  );
};

export default Invoices;