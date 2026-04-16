import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, SearchIcon, XIcon } from 'lucide-react';
import type { Invoice, InvoiceItem, ClientSummary } from '../../types';
import { Button, InputField, StatusBadge } from './index';
import { formatCurrency, generateInvoiceNumber, generateId, cn } from '../../utils/helpers';

export interface InvoiceFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Invoice>;
  clients: ClientSummary[];
  onSubmit: (invoiceData: Partial<Invoice>) => void;
  onCancel: () => void;
  className?: string;
}

interface InvoiceFormData {
  clientId: string;
  client?: ClientSummary;
  items: InvoiceItem[];
  dueDate: string;
  notes: string;
  tax: number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  mode,
  initialData,
  clients,
  onSubmit,
  onCancel,
  className
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: initialData?.clientId || '',
    client: initialData?.client,
    items: initialData?.items || [
      { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    dueDate: initialData?.dueDate 
      ? new Date(initialData.dueDate).toISOString().split('T')[0] 
      : (() => {
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return thirtyDaysFromNow.toISOString().split('T')[0];
        })(),
    notes: initialData?.notes || '',
    tax: initialData?.tax || 0
  });

  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal + formData.tax;

  // Update item amount when quantity or rate changes
  const updateItemAmount = (index: number, quantity: number, rate: number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      rate,
      amount: quantity * rate
    };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  // Remove item
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  // Update item field
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const rate = field === 'rate' ? value : newItems[index].rate;
      updateItemAmount(index, quantity, rate);
    } else {
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  // Select client
  const selectClient = (client: ClientSummary) => {
    setFormData(prev => ({ ...prev, clientId: client.id, client }));
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.client = 'Please select a client';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    const hasValidItems = formData.items.some(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidItems) {
      newErrors.items = 'At least one item must have description, quantity, and rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const invoiceData: Partial<Invoice> = {
      ...initialData,
      clientId: formData.clientId,
      client: formData.client,
      items: formData.items.filter(item => item.description.trim()),
      subtotal,
      tax: formData.tax,
      total,
      dueDate: new Date(formData.dueDate),
      notes: formData.notes.trim() || undefined,
      number: initialData?.number || generateInvoiceNumber(),
      status: initialData?.status || 'draft',
      createdDate: initialData?.createdDate || new Date()
    };

    onSubmit(invoiceData);
  };

  // Set client search when client is pre-selected
  useEffect(() => {
    if (formData.client) {
      setClientSearch(formData.client.name);
    }
  }, [formData.client]);

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            {mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            <XIcon className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Client Selection */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Client Information</h3>
          
          <div className="relative">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Client *
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientDropdown(true);
                  if (!e.target.value) {
                    setFormData(prev => ({ ...prev, clientId: '', client: undefined }));
                  }
                }}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="Search clients..."
                autoComplete="off"
                inputMode="search"
                className={cn(
                  'w-full pl-10 pr-4 py-3 text-sm border rounded-lg bg-bg-secondary text-text-primary placeholder-text-disabled transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 min-h-[44px]',
                  'text-base sm:text-sm touch-manipulation', // Mobile optimizations
                  errors.client ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border-light focus:border-primary focus:ring-primary'
                )}
              />
            </div>

            {/* Client Dropdown */}
            {showClientDropdown && filteredClients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-border-light rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="px-4 py-3 hover:bg-bg-hover cursor-pointer border-b border-border-light last:border-b-0"
                    onClick={() => selectClient(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-text-primary">{client.name}</div>
                        <div className="text-sm text-text-secondary">{client.email}</div>
                      </div>
                      <StatusBadge 
                        variant="trust-segment" 
                        value={client.segment} 
                        showEmoji={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.client && (
              <p className="mt-1 text-xs text-danger">{errors.client}</p>
            )}
          </div>

          {/* Selected Client Display */}
          {formData.client && (
            <div className="mt-4 p-4 bg-bg-primary rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-text-primary">{formData.client.name}</div>
                  <div className="text-sm text-text-secondary">{formData.client.email}</div>
                  <div className="text-sm text-text-tertiary">Trust Score: {formData.client.trustScore}/100</div>
                </div>
                <StatusBadge 
                  variant="trust-segment" 
                  value={formData.client.segment} 
                  showEmoji={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Invoice Items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Invoice Items</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addItem}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-bg-primary rounded-lg">
                <div className="md:col-span-5">
                  <InputField
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Item description..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField
                    label="Quantity"
                    type="number"
                    value={item.quantity.toString()}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField
                    label="Rate"
                    type="number"
                    value={item.rate.toString()}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Amount
                  </label>
                  <div className="px-4 py-3 text-sm bg-bg-secondary border border-border-light rounded-lg text-text-primary min-h-[44px] flex items-center">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                    className="w-full md:w-auto"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="mt-2 text-xs text-danger">{errors.items}</p>
          )}
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Invoice Details</h3>
            
            <div className="space-y-4">
              <InputField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                error={errors.dueDate}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or terms..."
                  rows={4}
                  autoComplete="off"
                  className="w-full px-4 py-3 text-sm border border-border-light rounded-lg bg-bg-secondary text-text-primary placeholder-text-disabled transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-primary focus:ring-primary resize-vertical text-base sm:text-sm touch-manipulation"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Invoice Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal:</span>
                <span className="text-text-primary font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary">Tax:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    autoComplete="off"
                    className="w-24 px-2 py-1 text-sm border border-border-light rounded bg-bg-secondary text-text-primary text-base sm:text-sm touch-manipulation"
                  />
                </div>
              </div>

              <div className="border-t border-border-light pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-text-primary">Total:</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {mode === 'create' ? 'Create Invoice' : 'Update Invoice'}
          </Button>
        </div>
      </form>

      {/* Click outside to close dropdown */}
      {showClientDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowClientDropdown(false)}
        />
      )}
    </div>
  );
};

export default InvoiceForm;