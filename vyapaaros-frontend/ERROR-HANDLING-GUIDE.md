# Error Handling and Validation Guide

This guide explains how to use the comprehensive error handling and validation features implemented in VyapaarOS Frontend.

## Form Validation

### Using the `useFormValidation` Hook

The `useFormValidation` hook provides debounced real-time validation for forms:

```typescript
import { useFormValidation } from '../hooks';
import { validateEmail, validateRequired, validateAmount } from '../utils/validation';

function MyForm() {
  const [formData, setFormData] = useState({ email: '', amount: '' });
  
  const { errors, validateField, validateForm } = useFormValidation({
    email: (value) => validateEmail(value),
    amount: (value) => validateAmount(value, { min: 0 }),
  }, {
    debounceMs: 300,
    validateOnChange: true,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm(formData);
    if (isValid) {
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />
      {/* More fields... */}
    </form>
  );
}
```

### Available Validation Functions

All validation functions are available in `utils/validation.ts`:

- `validateEmail(email: string)` - Email validation
- `validatePhone(phone: string, required?: boolean)` - Phone number validation
- `validateRequired(value: string, fieldName?: string)` - Required field validation
- `validateNumber(value, options)` - Number validation with min/max
- `validateAmount(amount, options)` - Currency/amount validation
- `validateDate(date, options)` - Date validation with min/max dates
- `validateLength(value, options)` - String length validation
- `validatePattern(value, pattern, message)` - Regex pattern validation
- `validateUrl(url, required?)` - URL validation
- `validatePostalCode(code, required?)` - Postal code validation

## Error Boundaries

### Application-Level Error Boundary

The app is wrapped with an Error Boundary that catches all component crashes:

```typescript
// Already implemented in App.tsx
<ErrorBoundary showDetails={import.meta.env.DEV}>
  <Router>
    {/* App content */}
  </Router>
</ErrorBoundary>
```

### Section-Level Error Boundaries

Wrap specific sections with Error Boundaries for granular error handling:

```typescript
import { ErrorBoundary } from '../components/ui';

function MyPage() {
  return (
    <div>
      <ErrorBoundary>
        <CriticalSection />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <AnotherSection />
      </ErrorBoundary>
    </div>
  );
}
```

### Custom Error Fallback

Provide custom fallback UI for specific sections:

```typescript
<ErrorBoundary
  fallback={
    <ErrorFallback
      title="Failed to load data"
      message="We couldn't load this section. Please try again."
      onRetry={() => refetch()}
    />
  }
>
  <DataSection />
</ErrorBoundary>
```

## Async Operations with Retry

Use the `useAsyncOperation` hook for operations that need retry logic:

```typescript
import { useAsyncOperation } from '../hooks';

function MyComponent() {
  const { data, error, isLoading, execute, retry } = useAsyncOperation(
    async (id: string) => {
      const response = await fetch(`/api/data/${id}`);
      return response.json();
    },
    {
      maxRetries: 3,
      retryDelay: 1000,
      onError: (error) => console.error('Operation failed:', error),
    }
  );

  useEffect(() => {
    execute('123');
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorFallback error={error} onRetry={retry} />;
  
  return <div>{/* Render data */}</div>;
}
```

## Error Fallback Component

Use the `ErrorFallback` component for displaying errors in specific sections:

```typescript
import { ErrorFallback } from '../components/ui';

function MyComponent() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <ErrorFallback
        error={error}
        title="Failed to load clients"
        message="We couldn't load the client list. Please try again."
        onRetry={() => {
          setError(null);
          refetch();
        }}
        showError={import.meta.env.DEV}
      />
    );
  }

  return <div>{/* Normal content */}</div>;
}
```

## Best Practices

1. **Use Error Boundaries** - Wrap major sections with Error Boundaries to prevent entire app crashes
2. **Debounced Validation** - Use the validation hook with debouncing for better UX
3. **Clear Error Messages** - Provide specific, actionable error messages
4. **Retry Mechanisms** - Implement retry logic for network operations
5. **Graceful Degradation** - Show fallback UI when sections fail to load
6. **Development vs Production** - Show detailed errors in development, user-friendly messages in production

## Example: Complete Form with Validation

```typescript
import { useState } from 'react';
import { useFormValidation } from '../hooks';
import { validateEmail, validateRequired, validatePhone } from '../utils/validation';
import { InputField, Button } from '../components/ui';

function ClientForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const { errors, validateField, validateForm, isValid } = useFormValidation({
    name: (value) => validateRequired(value, 'Client name'),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value, false), // Optional
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFormValid = await validateForm(formData);
    if (!isFormValid) return;

    try {
      // Submit form
      await submitClient(formData);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Client Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />
      
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        required
      />
      
      <InputField
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
      />
      
      <Button type="submit" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
}
```
