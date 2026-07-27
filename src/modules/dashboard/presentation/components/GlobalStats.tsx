import React from 'react';
import type { GlobalStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useGlobalStats } from '@/shared/presentation/hooks/dashboard/useGlobalStats';
import { StatsGrid } from '@/shared/presentation/components/Stats/StatsGrid';

interface GlobalStatsProps {
  stats: GlobalStatsReport | null;
  loading: boolean;
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, loading }) => {
  const { cards } = useGlobalStats({ stats });

  if (!stats && !loading) return null;

  return <StatsGrid items={cards} loading={loading} />;
};
