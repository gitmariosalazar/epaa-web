import { useEffect, useCallback } from 'react';
import { useIncidentContext } from '../context/IncidentContext';

export const useIncidentDashboardViewModel = () => {
  const {
    dashboardKpis,
    isDashboardLoading,
    error,
    loadDashboardKpis,
  } = useIncidentContext();

  const handleFetchData = useCallback(async () => {
    await loadDashboardKpis();
  }, [loadDashboardKpis]);

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dashboardKpis,
    isLoading: isDashboardLoading,
    error,
    refresh: handleFetchData,
  };
};
