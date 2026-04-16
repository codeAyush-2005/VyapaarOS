import React, { useId } from 'react';
import type { InputType } from '../../types';
import { cn } from '../../utils/helpers';

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  type?: InputType;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  // Mobile-specific props
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal' | 'search' | 'url';
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    type = 'text', 
    error, 
    success, 
    helperText, 
    required, 
    className, 
    id,
    autoComplete,
    inputMode,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    
    // Auto-determine inputMode and autoComplete based on type for better mobile experience
    const getInputModeAndAutoComplete = () => {
      const defaults = { inputMode: inputMode, autoComplete: autoComplete };
      
      switch (type) {
        case 'email':
          return {
            inputMode: inputMode || 'email' as const,
            autoComplete: autoComplete || 'email'
          };
        case 'tel':
          return {
            inputMode: inputMode || 'tel' as const,
            autoComplete: autoComplete || 'tel'
          };
        case 'number':
          return {
            inputMode: inputMode || 'numeric' as const,
            autoComplete: autoComplete || 'off'
          };
        case 'date':
          return {
            inputMode: inputMode || 'text' as const,
            autoComplete: autoComplete || 'bday'
          };
        default:
          return defaults;
      }
    };

    const { inputMode: finalInputMode, autoComplete: finalAutoComplete } = getInputModeAndAutoComplete();
    
    const baseClasses = 'w-full px-4 py-3 text-sm border rounded-lg bg-bg-secondary text-text-primary placeholder-text-disabled transition-colors duration-200';
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-opacity-20';
    
    const stateClasses = {
      default: 'border-border-light focus:border-primary focus:ring-primary',
      error: 'border-danger focus:border-danger focus:ring-danger',
      success: 'border-success focus:border-success focus:ring-success',
    };

    const getStateClass = () => {
      if (error) return stateClasses.error;
      if (success) return stateClasses.success;
      return stateClasses.default;
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          inputMode={finalInputMode}
          autoComplete={finalAutoComplete}
          aria-invalid={ariaInvalid ?? !!error}
          aria-describedby={
            ariaDescribedBy || 
            (error ? errorId : helperText ? helperId : undefined)
          }
          aria-required={required}
          className={cn(
            baseClasses,
            focusClasses,
            getStateClass(),
            'min-h-[44px]', // Touch-friendly height
            // Additional mobile optimizations
            'text-base sm:text-sm', // Prevent zoom on iOS
            'touch-manipulation', // Optimize touch interactions
            className
          )}
          {...props}
        />
        
        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <p id={errorId} className="text-xs text-danger" role="alert">
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={helperId} className="text-xs text-text-tertiary">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;