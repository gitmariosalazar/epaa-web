import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { GetGlobalStatsUseCase } from '@/modules/dashboard/application/usecases/get-global-stats.usecase';
import { GetDailyStatsUseCase } from '@/modules/dashboard/application/usecases/get-daily-stats.usecase';
import { GetSectorStatsUseCase } from '@/modules/dashboard/application/usecases/get-sector-stats.usecase';
import { GetNoveltyStatsUseCase } from '@/modules/dashboard/application/usecases/get-novelty-stats.usecase';
import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
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
  const [loading, setLoading] = useState(false);

  const [globalStats, setGlobalStats] = useState<GlobalStatsReport | null>(
    null
  );
  const [dailyStats, setDailyStats] = useState<DailyStatsReport[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStatsReport[]>([]);
  const [noveltyStats, setNoveltyStats] = useState<NoveltyStatsReport[]>([]);
  const [advancedReportReadings, setAdvancedReportReadings] = useState<
    AdvancedReportReadings[]
  >([]);

  // Default tab is table
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('table');

  // Dependency Injection (Manually for now)
  const repository = useMemo(() => new HttpReportDashboardRepository(), []);

  const getGlobalStatsUseCase = useMemo(
    () => new GetGlobalStatsUseCase(repository),
    [repository]
  );
  const getDailyStatsUseCase = useMemo(
    () => new GetDailyStatsUseCase(repository),
    [repository]
  );
  const getSectorStatsUseCase = useMemo(
    () => new GetSectorStatsUseCase(repository),
    [repository]
  );
  const getNoveltyStatsUseCase = useMemo(
    () => new GetNoveltyStatsUseCase(repository),
    [repository]
  );

  const getAdvancedReportReadingsUseCase = useMemo(
    () => new GetAdvancedReportReadingsUseCase(repository),
    [repository]
  );

  const fetchData = async (month: string, isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      // Parallel fetching
      const [global, daily, sector, novelty, advanced] = await Promise.all([
        getGlobalStatsUseCase.execute(month),
        getDailyStatsUseCase.execute(month),
        getSectorStatsUseCase.execute(month),
        getNoveltyStatsUseCase.execute(month),
        getAdvancedReportReadingsUseCase.execute(month)
      ]);

      setGlobalStats(global);
      setDailyStats(daily);
      setSectorStats(sector);
      setNoveltyStats(novelty);
      setAdvancedReportReadings(advanced);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      // Handle error (notification/toast)
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(currentMonth);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentMonth]);

  // Real-time updates (Polling)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(currentMonth, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentMonth]);

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
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
