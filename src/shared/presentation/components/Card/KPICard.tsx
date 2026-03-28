import React from 'react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import '../../styles/KPICard.css';

export interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color:
    | 'green'
    | 'red'
    | 'blue'
    | 'amber'
    | 'purple'
    | 'teal'
    | 'rose'
    | 'indigo';
  valueColor?: 'green' | 'red' | 'amber';
  description?: string;
  className?: string;
  tooltipText?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  color,
  valueColor,
  description,
  className,
  tooltipText
}) => {
  const finalTooltipText = tooltipText || `${label}: ${value}`;

  return (
    <div className={`kpi-card kpi-card--${color} ${className || ''}`}>
      <div className="kpi-card-header">
        <span className="kpi-card-label">{label}</span>
        <div className="kpi-card-icon">{icon}</div>
      </div>
      <div className="kpi-card-body">
        <div
          className={`kpi-card-value${valueColor ? ` kpi-card-value--${valueColor}` : ''}`}
        >
          <Tooltip content={finalTooltipText} position="bottom">
            <span>{value}</span>
          </Tooltip>
        </div>
        {description && (
          <div className="kpi-card-description">{description}</div>
        )}
      </div>
    </div>
  );
};
