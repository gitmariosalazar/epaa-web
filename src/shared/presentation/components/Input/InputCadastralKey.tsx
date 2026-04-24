import React, { forwardRef, type InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { CadastralKeyFormatter } from '../../../domain/utils/CadastralKeyFormatter';
import '@/shared/presentation/styles/Input.css';
import { useTranslation } from 'react-i18next';

// Extends InputHTMLAttributes but overrides type for strict onChange
export interface InputCadastralKeyProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size'
> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'small' | 'compact' | 'medium' | 'large';
  focused?: boolean;
}

export const InputCadastralKey = forwardRef<
  HTMLInputElement,
  InputCadastralKeyProps
>(
  (
    { value, onChange, className = '', size = 'medium', label, error, leftIcon, focused, ...props },
    ref
  ) => {
    // Internal state to manage the controlled input if an external value isn't strictly provided
    const [internalValue, setInternalValue] = useState(value || '');
    
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (focused && localRef.current) {
        localRef.current.focus();
      }
    }, [focused]);

    const handleRef = (node: HTMLInputElement | null) => {
      localRef.current = node as HTMLInputElement;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
    const { t } = useTranslation();

    const displayValue = value !== undefined ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const formattedValue = CadastralKeyFormatter.format(
        newValue,
        displayValue
      );

      setInternalValue(formattedValue);

      if (onChange) {
        onChange(formattedValue);
      }
    };

    return (
      <div className={`input-component input--${size}`}>
        {label && <label className="input__label">{label}</label>}
        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <input
            {...props}
            ref={handleRef}
            value={displayValue}
            onChange={handleChange}
            placeholder={props.placeholder || t('common.cadastralPlaceholder')}
            type="text"
            inputMode="numeric"
            className={`input__field ${className} ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
          />
        </div>
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);
InputCadastralKey.displayName = 'InputCadastralKey';
