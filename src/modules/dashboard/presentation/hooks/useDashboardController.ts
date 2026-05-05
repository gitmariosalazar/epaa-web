import { useState, useMemo, useEffect, useCallback, useRef, type ChangeEvent } from 'react';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { GetGlobalStatsUseCase } from '@/modules/dashboard/application/usecases/get-global-stats.usecase';
import { GetDailyStatsUseCase } from '@/modules/dashboard/application/usecases/get-daily-stats.usecase';
import { GetSectorStatsUseCase } from '@/modules/dashboard/application/usecases/get-sector-stats.usecase';
import { GetNoveltyStatsUseCase } from '@/modules/dashboard/application/usecases/get-novelty-stats.usecase';
import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useRealtimeEvent } from '@/shared/presentation/hooks/useRealtimeEvent';
import type {
  GlobalStatsReport,
  DailyStatsReport,
  SectorStatsReport,
  NoveltyStatsReport,
  AdvancedReportReadings
} from '@/modules/dashboard/domain/models/report-dashboard.model';

export const useDashboardController = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    dateService.getCurrentMonthString()
  ); // YYYY-MM
  const [loading, setLoading] = useState(true);

  const [globalStats, setGlobalStats] = useState<GlobalStatsReport | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatsReport[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStatsReport[]>([]);
  const [noveltyStats, setNoveltyStats] = useState<NoveltyStatsReport[]>([]);
  const [advancedReportReadings, setAdvancedReportReadings] = useState<AdvancedReportReadings[]>([]);

  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('table');

  // Dependency Injection
  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const getGlobalStatsUseCase = useMemo(() => new GetGlobalStatsUseCase(repository), [repository]);
  const getDailyStatsUseCase = useMemo(() => new GetDailyStatsUseCase(repository), [repository]);
  const getSectorStatsUseCase = useMemo(() => new GetSectorStatsUseCase(repository), [repository]);
  const getNoveltyStatsUseCase = useMemo(() => new GetNoveltyStatsUseCase(repository), [repository]);
  const getAdvancedReportReadingsUseCase = useMemo(() => new GetAdvancedReportReadingsUseCase(repository), [repository]);

  // ── fetchData estable con useCallback para no recrear efectos ─────────────
  const fetchData = useCallback(async (month: string, isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      // Parallel fetching pero tolerante a fallos individuales (SRP)
      const results = await Promise.allSettled([
        getGlobalStatsUseCase.execute(month),
        getDailyStatsUseCase.execute(month),
        getSectorStatsUseCase.execute(month),
        getNoveltyStatsUseCase.execute(month),
        getAdvancedReportReadingsUseCase.execute(month)
      ]);

      setGlobalStats(results[0].status === 'fulfilled' ? results[0].value || null : null);
      setDailyStats(results[1].status === 'fulfilled' ? results[1].value || [] : []);
      setSectorStats(results[2].status === 'fulfilled' ? results[2].value || [] : []);
      setNoveltyStats(results[3].status === 'fulfilled' ? results[3].value || [] : []);
      setAdvancedReportReadings(results[4].status === 'fulfilled' ? results[4].value || [] : []);

      results.forEach((res, index) => {
        if (res.status === 'rejected') {
          console.error(`Dashboard fetch failed for index ${index}:`, res.reason);
        }
      });
    } catch (error) {
      console.error('Failed to execute dashboard data fetching process', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [
    getGlobalStatsUseCase,
    getDailyStatsUseCase,
    getSectorStatsUseCase,
    getNoveltyStatsUseCase,
    getAdvancedReportReadingsUseCase
  ]);

  // ── Carga inicial INMEDIATA — sin debounce al montar el componente ───────────
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchData(currentMonth); // sin delay — el usuario verá datos cuanto antes
      return;
    }
    // Cambio de mes: debounce para no disparar en cada pulsación de teclado
    const timer = setTimeout(() => fetchData(currentMonth), 400);
    return () => clearTimeout(timer);
  }, [currentMonth, fetchData]);

  // ── WebSocket: actualización INSTANTÁNEA (< 1 seg) ─────────────────────────
  useRealtimeEvent('reading:updated', (payload) => {
    if (payload.month.startsWith(currentMonth)) {
      fetchData(currentMonth, true); // isBackground=true → sin spinner
    }
  });

  // ── Polling de respaldo: 60 s (actúa si el WS no está disponible) ──────────
  useEffect(() => {
    const interval = setInterval(() => fetchData(currentMonth, true), 60_000);
    return () => clearInterval(interval);
  }, [currentMonth, fetchData]);


  const handleMonthChange = (e: ChangeEvent<HTMLInputElement> | string) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setCurrentMonth(value);
  };

  return {
    currentMonth,
    loading,
    globalStats,
    dailyStats,
    sectorStats,
    noveltyStats,
    advancedReportReadings,
    activeTab,
    setActiveTab,
    handleMonthChange
  };
};
