import React from 'react';
import type { GlobalStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useGlobalStats } from '@/shared/presentation/hooks/dashboard/useGlobalStats';
import { CircularProgress } from '../CircularProgress';
import { useTranslation } from 'react-i18next';

interface GlobalStatsProps {
  stats: GlobalStatsReport | null;
  loading: boolean;
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, loading }) => {
  const { t } = useTranslation();
  const { cards } = useGlobalStats({ stats });

  if (loading)
    return (
      <div className="p-4">
        <CircularProgress strokeWidth={9} label={t('common.loading')} />
      </div>
    );
  if (!stats) return null;

  return (
    <div className="stats-grid mb-4">
      {cards.map((card, idx) => (
        <div key={idx} className="stat-card">
          <div className={`stat-icon-wrapper ${card.color}`}>
            <card.icon size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p className="stat-desc">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
