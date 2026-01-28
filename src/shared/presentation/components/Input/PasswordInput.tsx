import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import {
  calculatePasswordStrength,
  getStrengthLabel
} from '@/shared/application/utils/passwordUtils';
import '@/shared/presentation/styles/PasswordInput.css';

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  valueToMatch?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      className = '',
      showStrength = false,
      valueToMatch,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [strength, setStrength] = useState(0);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const checkStrength = (val: string) => {
      if (showStrength) {
        setStrength(calculatePasswordStrength(val));
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkStrength(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // Recalculate if value prop changes externally (e.g. form reset)
    React.useEffect(() => {
      if (typeof value === 'string' && showStrength) {
        checkStrength(value);
      }
    }, [value, showStrength]);

    // Matching Logic
    const hasValue = typeof value === 'string' && value.length > 0;
    const isMatching =
      valueToMatch !== undefined && hasValue && value === valueToMatch;
    const isMismatching =
      valueToMatch !== undefined &&
      hasValue &&
      value !== valueToMatch &&
      valueToMatch.length > 0;

    const getFieldClass = () => {
      if (error) return 'password-input__field--error';
      if (isMatching) return 'password-input__field--success';
      if (isMismatching) return 'password-input__field--error-match';
      return '';
    };

    return (
      <div className={`password-input-wrapper ${className}`}>
        {label && <label className="input__label">{label}</label>}

        <div className="password-input__container">
          <span className="input__icon-left">
            <Lock size={18} />
          </span>

          <input
            type={isVisible ? 'text' : 'password'}
            className={`password-input__field ${getFieldClass()}`}
            ref={ref}
            value={value}
            onChange={handleChange}
            {...props}
          />

          {/* Match Indicator Icons */}
          {(isMatching || isMismatching) && (
            <div
              className={`password-input__match-indicator ${isMatching ? 'password-input__match-indicator--success' : 'password-input__match-indicator--error'}`}
            >
              {isMatching ? <Check size={18} /> : <X size={18} />}
            </div>
          )}

          <button
            type="button"
            className="password-input__toggle"
            onClick={toggleVisibility}
            tabIndex={-1}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {showStrength &&
          value &&
          typeof value === 'string' &&
          value.length > 0 && (
            <div className={`password-strength password-strength--${strength}`}>
              <div className="password-strength__bars">
                <div className="password-strength__bar"></div>
                <div className="password-strength__bar"></div>
                <div className="password-strength__bar"></div>
                <div className="password-strength__bar"></div>
              </div>
              <span className="password-strength__label">
                {getStrengthLabel(strength)}
              </span>
            </div>
          )}

        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
