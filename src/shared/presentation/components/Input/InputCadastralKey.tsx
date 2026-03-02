import React, { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { CadastralKeyFormatter } from '../../../domain/utils/CadastralKeyFormatter';
import '@/shared/presentation/styles/Input.css';
import { useTranslation } from 'react-i18next';

// Extends InputHTMLAttributes but overrides type for strict onChange
export interface InputCadastralKeyProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const InputCadastralKey = forwardRef<
  HTMLInputElement,
  InputCadastralKeyProps
>(
  (
    { value, onChange, className = '', label, error, leftIcon, ...props },
    ref
  ) => {
    // Internal state to manage the controlled input if an external value isn't strictly provided
    const [internalValue, setInternalValue] = useState(value || '');
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

    const inputElement = (
      <div className="input__container">
        {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
        <input
          {...props}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          placeholder={props.placeholder || t('common.cadastralPlaceholder')}
          type="text"
          inputMode="numeric"
          className={`input__field ${className} ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''}`}
        />
      </div>
    );

    if (!label && !error) {
      return inputElement;
    }

    return (
      <div className={`input-component`}>
        {label && <label className="input__label">{label}</label>}
        {inputElement}
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);
InputCadastralKey.displayName = 'InputCadastralKey';
