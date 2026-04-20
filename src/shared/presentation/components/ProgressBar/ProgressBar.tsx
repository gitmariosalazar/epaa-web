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
  /** Whether to show the percentage label next to the bar */
  showLabel?: boolean;
  /** Additional class name for the container */
  showProgressBar?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = '#3b82f6', // Default blue if no color provided
  height = '8px',
  showLabel = true,
  showProgressBar = true,
  className = ''
}) => {
  // Clamp value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress-wrapper ${className}`}>
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
