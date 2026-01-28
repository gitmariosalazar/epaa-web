import React, { type CSSProperties } from 'react';
import '@/shared/presentation/styles/ColorChip.css';

export interface ColorChipProps {
  /** The main color of the chip. Can be a CSS variable or hex code. */
  color?: string;
  label: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'filled' | 'outline' | 'soft' | 'ghost';
  className?: string;
  icon?: React.ReactNode;
  /** If provided, right icon/action */
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  /** Add a dot indicator for status (useful in 'soft' or 'outline' variants) */
  withDot?: boolean;
}

export const ColorChip: React.FC<ColorChipProps> = ({
  color = 'var(--primary)',
  label,
  size = 'md',
  variant = 'solid',
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
  withDot = false
}) => {
  const isInteractive = !!onClick;

  const style = {
    '--chip-color': color
  } as CSSProperties;

  return (
    <div
      className={`
        color-chip 
        color-chip--${size} 
        color-chip--${variant} 
        ${isInteractive ? 'color-chip--interactive' : ''} 
        ${className}
      `}
      style={style}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {withDot && <span className="color-chip__dot" />}

      {icon && iconPosition === 'left' && icon}
      <span>{label}</span>
      {icon && iconPosition === 'right' && icon}
    </div>
  );
};
