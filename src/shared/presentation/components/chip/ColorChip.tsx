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

const isLightColor = (col: string): boolean => {
  const c = col.toLowerCase().trim();
  if (
    c.includes('yellow') ||
    c.includes('orange') ||
    c.includes('amber') ||
    c.includes('cyan') ||
    c.includes('lime') ||
    c.includes('light') ||
    c.includes('warning')
  ) {
    return true;
  }
  if (c.startsWith('#')) {
    const hex = c.substring(1);
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );
    return hsp > 170;
  }
  if (c.includes('--warning') || c.includes('--yellow') || c.includes('--orange') || c.includes('--cyan')) {
    return true;
  }
  return false;
};

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
  const isLight = isLightColor(finalColor);

  const style = {
    '--chip-color': finalColor,
    '--chip-solid-text': isLight ? '#0f172a' : '#ffffff',
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
