import { useState, useCallback, useEffect } from 'react';
import type { ValidationResult } from '../utils/validation';

/**
 * Custom hook for form validation with debounced real-time checking
 * Requirement 6.4: Real-time validation with debounced checking
 */

export interface ValidationRules<T> {
  [K: string]: (value: any, formData?: T) => ValidationResult;
}

export interface UseFormValidationOptions {
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T> {
  errors: Partial<Record<keyof T, string>>;
  isValidating: boolean;
  isValid: boolean;
  validateField: (field: keyof T, value: any) => Promise<void>;
  validateForm: (data: T) => Promise<boolean>;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  setError: (field: keyof T, error: string) => void;
}

export function useFormValidation<T extends Record<string, any>>(
  validationRules: ValidationRules<T>,
  options: UseFormValidationOptions = {}
): UseFormValidationReturn<T> {
  const {
    debounceMs = 300,
    // validateOnChange and validateOnBlur are reserved for future enhancements
    // validateOnChange = true,
    // validateOnBlur = true,
  } = options;

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationTimeouts, setValidationTimeouts] = useState<Record<string, ReturnType<typeof setTimeout>>>({});

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [validationTimeouts]);

  // Validate a single field with debouncing
  const validateField = useCallback(
    async (field: keyof T, value: any, formData?: T): Promise<void> => {
      // Clear existing timeout for this field
      if (validationTimeouts[field as string]) {
        clearTimeout(validationTimeouts[field as string]);
      }

      // Set new timeout for debounced validation
      const timeout = setTimeout(async () => {
        setIsValidating(true);

        try {
          const validator = validationRules[field as string];
          if (validator) {
            const result = validator(value, formData);
            
            setErrors(prev => {
              const newErrors = { ...prev };
              if (result.isValid) {
                delete newErrors[field];
              } else {
                newErrors[field] = result.error;
              }
              return newErrors;
            });
          }
        } finally {
          setIsValidating(false);
        }
      }, debounceMs);

      setValidationTimeouts(prev => ({
        ...prev,
        [field as string]: timeout,
      }));
    },
    [validationRules, debounceMs, validationTimeouts]
  );

  // Validate entire form (no debouncing for form submission)
  const validateForm = useCallback(
    async (data: T): Promise<boolean> => {
      setIsValidating(true);
      const newErrors: Partial<Record<keyof T, string>> = {};
      let isValid = true;

      try {
        for (const field in validationRules) {
          const validator = validationRules[field];
          const result = validator(data[field], data);

          if (!result.isValid) {
            newErrors[field as keyof T] = result.error;
            isValid = false;
          }
        }

        setErrors(newErrors);
        return isValid;
      } finally {
        setIsValidating(false);
      }
    },
    [validationRules]
  );

  // Clear error for a specific field
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set error manually
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Check if form is valid (no errors)
  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValidating,
    isValid,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setError,
  };
}
