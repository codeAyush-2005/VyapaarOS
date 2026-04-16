import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import type { Client } from '../../types';
import { Button, InputField } from './index';
import { cn } from '../../utils/helpers';

export interface AddClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'createdDate' | 'trustScore' | 'segment' | 'totalInvoiced' | 'totalPaid' | 'totalOwed' | 'invoiceCount'>) => void;
  initialData?: Partial<Client>;
  mode?: 'add' | 'edit';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      zipCode: initialData?.address?.zipCode || '',
      country: initialData?.address?.country || 'India'
    },
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.street.trim() ? formData.address : undefined,
        notes: formData.notes.trim() || undefined
      };

      await onSubmit(clientData);
      onClose();
    } catch (error) {
      console.error('Error submitting client form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-semibold text-text-primary">
              {mode === 'add' ? 'Add New Client' : 'Edit Client'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Client Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    error={errors.name}
                    required
                    placeholder="Enter client name"
                    autoComplete="name"
                  />
                </div>
                
                <InputField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  error={errors.email}
                  required
                  placeholder="client@example.com"
                  autoComplete="email"
                />
                
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-4">Address (Optional)</h3>
              <div className="space-y-4">
                <InputField
                  label="Street Address"
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => updateFormData('address.street', e.target.value)}
                  placeholder="123 Main Street"
                  autoComplete="street-address"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => updateFormData('address.city', e.target.value)}
                    placeholder="Mumbai"
                    autoComplete="address-level2"
                  />
                  
                  <InputField
                    label="State"
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => updateFormData('address.state', e.target.value)}
                    placeholder="Maharashtra"
                    autoComplete="address-level1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="ZIP Code"
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => updateFormData('address.zipCode', e.target.value)}
                    placeholder="400001"
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                  
                  <InputField
                    label="Country"
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => updateFormData('address.country', e.target.value)}
                    placeholder="India"
                    autoComplete="country-name"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="Additional notes about this client..."
                rows={3}
                className={cn(
                  'w-full px-4 py-3 text-sm border rounded-lg bg-bg-secondary text-text-primary placeholder-text-disabled transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-primary focus:ring-primary',
                  'border-border-light resize-vertical',
                  'text-base sm:text-sm touch-manipulation' // Mobile optimizations
                )}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-border-light">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {mode === 'add' ? 'Add Client' : 'Update Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddClientForm.displayName = 'AddClientForm';

export default AddClientForm;