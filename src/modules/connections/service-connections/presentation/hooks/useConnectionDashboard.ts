import { useState, useCallback } from 'react';
import type {
  DashboardAdvanceResponse,
  LiveMapConnectionResponse
} from '../../domain/models/DashboardStats';
import { useConnectionsContext } from '../context/ConnectionContext';

export const useConnectionDashboard = () => {
  const {
    getAdvanceDashboardStatsUseCase,
    getLiveUpdateMapConnectionsUseCase
  } = useConnectionsContext();

  const [data, setData] = useState<DashboardAdvanceResponse | null>(null);
  const [liveData, setLiveData] = useState<LiveMapConnectionResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getAdvanceDashboardStatsUseCase.execute();
      setData(stats);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [getAdvanceDashboardStatsUseCase]);

  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await getLiveUpdateMapConnectionsUseCase.execute();
      setLiveData(stats);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [getLiveUpdateMapConnectionsUseCase]);

  return {
    data,
    liveData,
    isLoading,
    error,
    fetchStats,
    fetchLiveData
  };
};
