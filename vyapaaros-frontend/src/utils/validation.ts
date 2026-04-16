/**
 * Comprehensive validation utilities for form inputs
 * Requirement 6.4: Real-time validation with debounced checking
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

// Phone validation (supports international formats)
export function validatePhone(phone: string, required: boolean = false): ValidationResult {
  if (!phone || !phone.trim()) {
    if (required) {
      return { isValid: false, error: 'Phone number is required' };
    }
    return { isValid: true };
  }

  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for minimum length (10 digits)
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  // Check for maximum length (15 digits for international)
  if (cleaned.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  return { isValid: true };
}

// Required field validation
export function validateRequired(value: string, fieldName: string = 'This field'): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

// Number validation
export function validateNumber(
  value: string | number,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
    fieldName?: string;
  } = {}
): ValidationResult {
  const { min, max, required = true, fieldName = 'This field' } = options;

  if (!value && value !== 0) {
    if (required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true };
}

// Amount/Currency validation
export function validateAmount(
  amount: string | number,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
  } = {}
): ValidationResult {
  const { min = 0, max, required = true } = options;

  if (!amount && amount !== 0) {
    if (required) {
      return { isValid: false, error: 'Amount is required' };
    }
    return { isValid: true };
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }

  if (num < min) {
    return { isValid: false, error: `Amount must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Amount must be at most ${max}` };
  }

  return { isValid: true };
}

// Date validation
export function validateDate(
  date: string | Date,
  options: {
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    fieldName?: string;
  } = {}
): ValidationResult {
  const { required = true, minDate, maxDate, fieldName = 'Date' } = options;

  if (!date) {
    if (required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} is invalid` };
  }

  if (minDate && dateObj < minDate) {
    return { isValid: false, error: `${fieldName} must be after ${minDate.toLocaleDateString()}` };
  }

  if (maxDate && dateObj > maxDate) {
    return { isValid: false, error: `${fieldName} must be before ${maxDate.toLocaleDateString()}` };
  }

  return { isValid: true };
}

// String length validation
export function validateLength(
  value: string,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
    fieldName?: string;
  } = {}
): ValidationResult {
  const { min, max, required = true, fieldName = 'This field' } = options;

  if (!value || !value.trim()) {
    if (required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }

  const length = value.trim().length;

  if (min !== undefined && length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  if (max !== undefined && length > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max} characters` };
  }

  return { isValid: true };
}

// Pattern validation (regex)
export function validatePattern(
  value: string,
  pattern: RegExp,
  errorMessage: string,
  required: boolean = true
): ValidationResult {
  if (!value || !value.trim()) {
    if (required) {
      return { isValid: false, error: 'This field is required' };
    }
    return { isValid: true };
  }

  if (!pattern.test(value)) {
    return { isValid: false, error: errorMessage };
  }

  return { isValid: true };
}

// URL validation
export function validateUrl(url: string, required: boolean = false): ValidationResult {
  if (!url || !url.trim()) {
    if (required) {
      return { isValid: false, error: 'URL is required' };
    }
    return { isValid: true };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

// Postal code validation
export function validatePostalCode(code: string, required: boolean = false): ValidationResult {
  if (!code || !code.trim()) {
    if (required) {
      return { isValid: false, error: 'Postal code is required' };
    }
    return { isValid: true };
  }

  // Support various postal code formats (US, UK, India, etc.)
  const cleaned = code.replace(/\s/g, '');
  
  if (cleaned.length < 3 || cleaned.length > 10) {
    return { isValid: false, error: 'Please enter a valid postal code' };
  }

  return { isValid: true };
}

// Composite validation - run multiple validators
export function validateField(
  value: any,
  validators: ValidationRule[]
): ValidationResult {
  for (const validator of validators) {
    if (!validator.validate(value)) {
      return { isValid: false, error: validator.message };
    }
  }
  return { isValid: true };
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  formData: T,
  validationRules: Record<keyof T, (value: any) => ValidationResult>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const field in validationRules) {
    const result = validationRules[field](formData[field]);
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}
