import React from 'react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';

export interface StatCardItem {
  title: string;
  value: string | number;
  desc?: string;
  icon: React.ElementType;
  color?: string;
}

export interface StatsGridProps {
  items: StatCardItem[];
  loading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ items, loading }) => {
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
    <div className="stats-grid mb-4">
      {items.map((card, idx) => (
        <div key={idx} className="stat-card">
          <div className={`stat-icon-wrapper ${card.color}`}>
            <card.icon size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-title">{card.title}</p>
            <h3>{card.value}</h3>
            {card.desc && <p className="stat-desc">{card.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
