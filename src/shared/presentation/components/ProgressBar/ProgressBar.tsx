import React from 'react';
import './ProgressBar.css';
import { ColorChip } from '../chip/ColorChip';
import { PercentageFormatter } from '@/shared/utils/formatters/PercentageFormatter';

interface ProgressBarProps {
  /** Current value (0-100) */
  value: number;
  /** Explicit color override. If not provided, you can handle color logic externally or default to a class. */
  color?: string;
  /** Height of the bar */
  height?: string;
  /** Width preset of the entire progress bar container.
   *  - 'sm'   → 120px
   *  - 'md'   → 200px
   *  - 'lg'   → 320px
   *  - 'full' → 100% (default — backward compatible)
   */
  widthSize?: 'sm' | 'md' | 'lg' | 'full';
  /** Whether to show the percentage label next to the bar */
  showLabel?: boolean;
  /** Additional class name for the container */
  showProgressBar?: boolean;
  className?: string;
}

const WIDTH_MAP: Record<NonNullable<ProgressBarProps['widthSize']>, string> = {
  sm:   '120px',
  md:   '200px',
  lg:   '320px',
  full: '100%'
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = '#3b82f6',
  height = '8px',
  widthSize = 'full',
  showLabel = true,
  showProgressBar = true,
  className = ''
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const resolvedWidth = WIDTH_MAP[widthSize];

  return (
    <div
      className={`progress-wrapper ${className}`}
      style={{ width: resolvedWidth, margin: '0 auto' }}
    >
      {showProgressBar && (
        <div
          className="progress-bar-container"
          style={{ height }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar-fill"
            style={{
              width: `${normalizedValue}%`,
              backgroundColor: color
            }}
          />
        </div>
      )}
      {showLabel && (
        <div className="progress-label">
          <ColorChip
            color={color}
            label={`${PercentageFormatter.formatWithDecimals(value / 100)}`}
            size="sm"
            variant="soft"
          />
        </div>
      )}
    </div>
  );
};
