import React, { type SelectHTMLAttributes, forwardRef, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import '@/shared/presentation/styles/Input.css';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  /** Custom right icon. Defaults to a ChevronDown for a professional look. Pass `null` to disable. */
  rightIcon?: React.ReactNode | null;
  children?: React.ReactNode;
  options?: { value: string | number; label: string }[];
  size?: 'small' | 'compact' | 'medium' | 'large';
  focused?: boolean;
  /** Sets the width of the select container. Accepts any valid CSS value, e.g. '120px', '8rem'. */
  width?: string | number;
  /** Aligns the entire component within its parent flex/grid container. */
  align?: 'left' | 'center' | 'right';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, leftIcon, rightIcon = <ChevronDown size={14} />, className = '', children, size = 'medium', options, focused, width, align, ...props }, ref) => {
    
    const localRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      if (focused && localRef.current) {
        localRef.current.focus();
      }
    }, [focused]);

    const handleRef = (node: HTMLSelectElement | null) => {
      localRef.current = node as HTMLSelectElement;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const alignSelfMap = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

    return (
      <div
        className={`input-component input--${size} ${className}`}
        style={{
          ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
          ...(align !== undefined ? { alignSelf: alignSelfMap[align] } : {}),
        }}
      >
        {label && <label className="input__label">{label}</label>}
        <div className="input__container">
          {leftIcon && <span className="input__icon-left">{leftIcon}</span>}
          <select
            className={`input__field input__field--select ${error ? 'input__field--error' : ''} ${leftIcon ? 'input__field--with-icon' : ''} ${rightIcon !== null ? 'input__field--with-right-icon' : ''}`}
            ref={handleRef}
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
          {rightIcon !== null && (
            <span className="input__icon-right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="input__error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
