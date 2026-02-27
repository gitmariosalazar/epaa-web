import React, { type ButtonHTMLAttributes } from 'react';
import '@/shared/presentation/styles/Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'dashed'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'subtle'
  | 'link'
  | 'action';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: ButtonRounded;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  circle?: boolean;
  iconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  color,
  size = 'md',
  rounded = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  circle = false,
  iconOnly = false,
  ...props
}) => {
  const baseClass = 'btn-pro';
  const roundedClass = `${baseClass}--rounded-${rounded}`;

  // Use explicit color if provided, otherwise derive from variant
  const finalColor =
    color ||
    (['outline', 'ghost', 'dashed', 'link'].includes(variant)
      ? 'primary'
      : (variant as ButtonColor));
  const finalVariant = ['outline', 'ghost', 'dashed', 'link'].includes(variant)
    ? variant
    : 'solid';

  const classes = [
    baseClass,
    `${baseClass}--${finalVariant}`,
    `${baseClass}--${finalColor}`,
    `${baseClass}--${size}`,
    circle ? '' : roundedClass,
    fullWidth ? `${baseClass}--full-width` : '',
    iconOnly ? `${baseClass}--icon-only` : '',
    circle ? `${baseClass}--circle` : '',
    isLoading ? `${baseClass}--loading` : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className={`${baseClass}__loader`} />}
      {!isLoading && leftIcon && (
        <span className={`${baseClass}__icon ${baseClass}__icon--left`}>
          {leftIcon}
        </span>
      )}
      {!iconOnly && <span className={`${baseClass}__text`}>{children}</span>}
      {!isLoading && rightIcon && (
        <span className={`${baseClass}__icon ${baseClass}__icon--right`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};
