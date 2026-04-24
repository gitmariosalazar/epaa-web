import React, { type CSSProperties } from 'react';
import '@/shared/presentation/styles/ColorChip.css';

export interface ColorChipProps {
  /** The main color of the chip. Can be a CSS variable or hex code. */
  color?: string;
  /** Semantic status color. If provided, overrides 'color'. */
  status?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'accent';
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
  /** Optional custom border radius (e.g. '4px', '50%') */
  borderRadius?: string | number;
}

export const ColorChip: React.FC<ColorChipProps> = ({
  color = 'var(--primary)',
  status,
  label,
  size = 'md',
  variant = 'solid',
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
  withDot = false,
  borderRadius
}) => {
  const isInteractive = !!onClick;

  const finalColor = status ? `var(--${status})` : color;

  const style = {
    '--chip-color': finalColor,
    ...(borderRadius !== undefined && { borderRadius })
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
      <span style={{ fontWeight: 'bold' }}>{label}</span>
      {icon && iconPosition === 'right' && icon}
    </div>
  );
};
