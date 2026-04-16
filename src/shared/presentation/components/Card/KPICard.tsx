import React from 'react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import '../../styles/KPICard.css';
import type { ChartColor } from '../../utils/colors/charts.colors';

export interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: ChartColor | string;
  valueColor?: 'green' | 'red' | 'amber';
  description?: string;
  className?: string;
  tooltipText?: string;
  activeTooltip?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  color,
  valueColor,
  description,
  className,
  tooltipText,
  activeTooltip = false,
  onClick
}) => {
  const finalTooltipText = tooltipText || `${label}: ${value}`;

  return (
    <div
      className={`kpi-card kpi-card--${color} ${className || ''}`}
      onClick={onClick}
    >
      <div className="kpi-card-header">
        <span className="kpi-card-label">{label}</span>
        <div className="kpi-card-icon">{icon}</div>
      </div>
      <div className="kpi-card-body">
        <div
          className={`kpi-card-value${valueColor ? ` kpi-card-value--${valueColor}` : ''}`}
        >
          {activeTooltip ? (
            <Tooltip
              content={finalTooltipText}
              position="top"
              followCursor={true}
              themeColor={color}
            >
              <span>{value}</span>
            </Tooltip>
          ) : (
            <span>{value}</span>
          )}
        </div>
        {description && (
          <div className="kpi-card-description">{description}</div>
        )}
      </div>
    </div>
  );
};
