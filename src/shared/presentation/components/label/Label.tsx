import React, { type LabelHTMLAttributes } from 'react';
import { Info } from 'lucide-react';
import './Label.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** The text content of the label */
  text?: string;
  /** Whether the field is required (shows a red asterisk) */
  required?: boolean;
  /** The size of the label, matching the Input component */
  size?: 'small' | 'compact' | 'medium' | 'large';
  /** The color variant of the label */
  variant?: 'default' | 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'text-main';
  /** The font weight of the label */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** An icon to display on the left side of the label text */
  leftIcon?: React.ReactNode;
  /** An icon to display on the right side of the label text */
  rightIcon?: React.ReactNode;
  /** Info text to display as a tooltip next to the label (shows an info icon) */
  info?: string;
}

export const Label: React.FC<LabelProps> = ({
  text,
  children,
  required = false,
  size = 'medium',
  variant = 'default',
  weight = 'semibold',
  leftIcon,
  rightIcon,
  info,
  className = '',
  ...props
}) => {
  const content = text || children;

  const baseClass = 'label-component';
  const sizeClass = `label--${size}`;
  const variantClass = `label--${variant}`;
  const weightClass = `label--weight-${weight}`;

  const classes = [baseClass, sizeClass, variantClass, weightClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes} {...props}>
      {leftIcon && <span className="label__icon label__icon--left">{leftIcon}</span>}
      
      <span className="label__text">
        {content}
        {required && <span className="label__required-mark" aria-hidden="true">*</span>}
      </span>

      {rightIcon && <span className="label__icon label__icon--right">{rightIcon}</span>}
      
      {info && (
        <span className="label__info-icon" title={info}>
          <Info size="1em" />
        </span>
      )}
    </label>
  );
};
