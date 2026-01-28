import React, { useEffect, useState, useMemo } from 'react';
import { GlobalStats } from '@/shared/presentation/components/dashboard/GlobalStats';
import { DailyStatsTable } from '@/shared/presentation/components/dashboard/DailyStatsTable';
import { SectorStatsTable } from '@/shared/presentation/components/dashboard/SectorStatsTable';
import { NoveltyStats } from '@/shared/presentation/components/dashboard/NoveltyStats';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { GetGlobalStatsUseCase } from '@/modules/dashboard/application/usecases/get-global-stats.usecase';
import { GetDailyStatsUseCase } from '@/modules/dashboard/application/usecases/get-daily-stats.usecase';
import { GetSectorStatsUseCase } from '@/modules/dashboard/application/usecases/get-sector-stats.usecase';
import { GetNoveltyStatsUseCase } from '@/modules/dashboard/application/usecases/get-novelty-stats.usecase';
import type {
  GlobalStatsReport,
  DailyStatsReport,
  SectorStatsReport,
  NoveltyStatsReport
} from '@/modules/dashboard/domain/models/report-dashboard.model';
import { Calendar } from 'lucide-react';

import '@/shared/presentation/styles/dashboard.css';

export const DashboardHome = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    //new Date().toISOString().slice(0, 7)
    '2025-12'
  ); // YYYY-MM
  const [loading, setLoading] = useState(false);

  const [globalStats, setGlobalStats] = useState<GlobalStatsReport | null>(
    null
  );
  const [dailyStats, setDailyStats] = useState<DailyStatsReport[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStatsReport[]>([]);
  const [noveltyStats, setNoveltyStats] = useState<NoveltyStatsReport[]>([]);

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

  const fetchData = async (month: string) => {
    setLoading(true);
    try {
      // Parallel fetching
      const [global, daily, sector, novelty] = await Promise.all([
        getGlobalStatsUseCase.execute(month),
        getDailyStatsUseCase.execute(month),
        getSectorStatsUseCase.execute(month),
        getNoveltyStatsUseCase.execute(month)
      ]);

      setGlobalStats(global);
      setDailyStats(daily);
      setSectorStats(sector);
      setNoveltyStats(novelty);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      // Handle error (notification/toast)
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(currentMonth);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const pickerRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Analytical Dashboard</h1>
          <p>Overview of system readings and performance</p>
        </div>

        <div
          className="dashboard-controls"
          onClick={() => pickerRef.current?.showPicker()}
          title="Change Period"
        >
          <Calendar className="text-gray-400" size={20} color="#9ca3af" />
          <input
            ref={pickerRef}
            type="month"
            value={currentMonth}
            onChange={handleMonthChange}
            className="month-picker"
          />
        </div>
      </div>

      {globalStats && <GlobalStats stats={globalStats} loading={loading} />}

      {dailyStats.length > 0 && (
        <div className="dashboard-stats-grid">
          <div className="stats-col">
            <DailyStatsTable data={dailyStats} loading={loading} />
          </div>
          <div className="stats-col">
            <SectorStatsTable data={sectorStats} loading={loading} />
          </div>
        </div>
      )}

      {noveltyStats.length > 0 && (
        <div className="dashboard-novelties-row">
          <NoveltyStats data={noveltyStats} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
