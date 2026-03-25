import React, { type TextareaHTMLAttributes, forwardRef } from 'react';
import '@/shared/presentation/styles/Input.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  info?: string;
  leftIcon?: React.ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, info, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className={`input-component input--medium ${className}`} style={{ height: '100%' }}>
        {label && <label className="input__label">{label}</label>}
        <div className="input__container" style={{ height: '100%', alignItems: 'flex-start' }}>
          {leftIcon && (
            <span
              className="input__icon-left"
              style={{
                top: '12px',
                transform: 'none',
                alignItems: 'flex-start'
              }}
            >
              {leftIcon}
            </span>
          )}
          <textarea
            className={`input__field ${error ? 'input__field--error' : ''} ${
              leftIcon ? 'input__field--with-icon' : ''
            }`}
            ref={ref}
            style={{
              paddingTop: '0.6rem',
              minHeight: '80px',
              fontFamily: 'inherit',
              resize: 'none',
              height: '100%'
            }}
            {...props}
          />
        </div>
        {info && (
          <span
            className="input__info"
            style={{ fontSize: '10px', color: '#666', marginTop: '2px', display: 'block' }}
          >
            {info}
          </span>
        )}
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
