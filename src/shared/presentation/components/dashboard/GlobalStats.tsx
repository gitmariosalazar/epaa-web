import React from 'react';
import type { GlobalStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useGlobalStats } from '@/shared/presentation/hooks/dashboard/useGlobalStats';

interface GlobalStatsProps {
  stats: GlobalStatsReport | null;
  loading: boolean;
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, loading }) => {
  const { cards } = useGlobalStats({ stats });

  if (loading) return <div className="p-4">Loading Global Stats...</div>;
  if (!stats) return null;

  return (
    <div className="stats-grid">
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
