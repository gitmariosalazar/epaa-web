import React, { type InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react';
import '@/shared/presentation/styles/Input.css';

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label?: string;
  error?: string;
  info?: string;
  leftIcon?: React.ReactNode;
  size?: 'small' | 'compact' | 'medium' | 'large';
  focused?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, info, leftIcon, className = '', size = 'medium', focused, ...props },
    ref
  ) => {
    const localRef = useRef<HTMLInputElement>(null);

    // Efecto para hacer focus automáticamente cuando 'focused' cambie a true
    useEffect(() => {
      if (focused && localRef.current) {
        localRef.current.focus();
      }
    }, [focused]);

    // Función para manejar tanto el ref interno como el que viene por prop
    const handleRef = (node: HTMLInputElement | null) => {
      localRef.current = node as HTMLInputElement;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div className={`input-component input--${size} ${className}`}>
        {label && (
          <label className="input__label">
            {label}
            {props.required && <span className="input__required-mark"> *</span>}
          </label>
        )}

        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <input
            className={`input__field ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
            ref={handleRef}
            {...props}
          />
        </div>
        {info && (
          <span
            className="input__info"
            style={{
              fontSize: '10px',
              color: '#666',
              marginTop: '2px',
              display: 'block'
            }}
          >
            {info}
          </span>
        )}
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
