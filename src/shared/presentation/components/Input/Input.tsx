import React, { type InputHTMLAttributes, forwardRef } from 'react';
import '@/shared/presentation/styles/Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className={`input-component ${className}`}>
        {label && <label className="input__label">{label}</label>}
        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <input
            className={`input__field ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
            ref={ref}
            {...props}
          />
        </div>
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
