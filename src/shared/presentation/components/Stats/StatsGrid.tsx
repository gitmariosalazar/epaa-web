import React from 'react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import type { SemanticColor } from '@/shared/presentation/utils/colors/ChartColorManager';

export interface StatCardItem {
  title: string;
  value: string | number;
  desc?: string;
  icon: React.ElementType;
  color?: SemanticColor;
}

export interface StatsGridProps {
  items: StatCardItem[];
  loading?: boolean;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  items,
  loading,
  className = ''
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="p-4">
        <CircularProgress strokeWidth={9} label={t('common.loading')} />
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className={`stats-grid mb-4 ${className}`.trim()}>
      {items.map((card, idx) => (
        <div key={idx} className="stat-card">
          <div
            className={`stat-icon-wrapper ${card.color ? `icon-${card.color}` : ''}`.trim()}
          >
            <card.icon size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-title">{card.title}</p>
            <h5>{card.value}</h5>
            {card.desc && <p className="stat-desc">{card.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
