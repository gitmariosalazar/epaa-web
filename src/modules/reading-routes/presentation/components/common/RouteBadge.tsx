import React from 'react';
import './RouteBadge.css';
import type { RouteAssignmentStatus } from '../../../domain/models/RouteAssignment';

export interface RouteBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: RouteAssignmentStatus | string;
  active?: boolean;
  label?: string;
  sector?: number | string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RouteBadge: React.FC<RouteBadgeProps> = ({
  status,
  active,
  label,
  sector,
  children,
  className = '',
  style: customStyle,
}) => {
  if (sector !== undefined && sector !== null && sector !== '') {
    const numSector = Number(sector);
    const sectorColors: Record<number, { bg: string; color: string }> = {
      1: { bg: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' },
      2: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
      3: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706' },
      4: { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' },
    };
    const sectorStyle = sectorColors[numSector] || {
      bg: 'rgba(107, 114, 128, 0.12)',
      color: 'var(--text-secondary)',
    };
    return (
      <span
        className={`route-badge ${className}`}
        style={{
          backgroundColor: sectorStyle.bg,
          color: sectorStyle.color,
          ...customStyle,
        }}
      >
        <span
          className="route-badge-dot"
          style={{ backgroundColor: sectorStyle.color }}
        />
        {label || children || `Sector ${sector}`}
      </span>
    );
  }

  if (active !== undefined) {
    const isAct = Boolean(active);
    return (
      <span
        className={`route-badge ${isAct ? 'route-badge-active' : 'route-badge-inactive'} ${className}`}
        style={customStyle}
      >
        <span className="route-badge-dot" />
        {label || children || (isAct ? 'Activa' : 'Inactiva')}
      </span>
    );
  }

  const normalizedStatus = (status || 'ASIGNADA').toLowerCase();
  const formatLabel =
    label ||
    children ||
    status?.replace('_', ' ') ||
    'ASIGNADA';

  return (
    <span
      className={`route-badge route-badge-${normalizedStatus} ${className}`}
      style={customStyle}
    >
      <span className="route-badge-dot" />
      {formatLabel}
    </span>
  );
};

export default RouteBadge;
