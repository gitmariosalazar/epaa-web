import React, { type InputHTMLAttributes, forwardRef } from 'react';
import '@/shared/presentation/styles/Input.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  info?: string;
  leftIcon?: React.ReactNode;
  size?: 'small' | 'compact' | 'medium' | 'large';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, info, leftIcon, className = '', size = 'medium', ...props }, ref) => {
    return (
      <div className={`input-component input--${size} ${className}`}>
        {label && <label className="input__label">{label}</label>}
        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <input
            className={`input__field ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
            ref={ref}
            {...props}
          />
        </div>
        {info && <span className="input__info" style={{ fontSize: '10px', color: '#666', marginTop: '2px', display: 'block' }}>{info}</span>}
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
