import React, { type SelectHTMLAttributes, forwardRef } from 'react';
import '@/shared/presentation/styles/Input.css';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
  options?: { value: string | number; label: string }[];
  size?: 'small' | 'compact' | 'medium' | 'large';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, leftIcon, className = '', children, size = 'medium', options, ...props }, ref) => {
    return (
      <div className={`input-component input--${size} ${className}`}>
        {label && <label className="input__label">{label}</label>}
        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <select
            className={`input__field ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
            ref={ref}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
        </div>
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
