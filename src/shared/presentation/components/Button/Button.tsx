import React, { type ButtonHTMLAttributes } from 'react';
import '@/shared/presentation/styles/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'subtle'
    | 'success'
    | 'info'
    | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  circle?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  circle = false,
  ...props
}) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className} ${circle ? `btn--circle btn--circle--${size}` : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="btn__loader" />}
      {!isLoading && leftIcon && (
        <span className="btn__icon-left">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="btn__icon-right">{rightIcon}</span>
      )}
    </button>
  );
};
