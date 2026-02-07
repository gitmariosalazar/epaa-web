import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  NoveltyStatsReport,
  AdvancedReportReadings
} from '@/modules/dashboard/domain/models/report-dashboard.model';
import { Calendar } from 'lucide-react';

import '@/shared/presentation/styles/dashboard.css';
import './DashboardHome.css';
import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import { AdvancedReadingsTable } from '@/shared/presentation/components/dashboard/AdvancedReadingsTable';
import { SectorProgressStats } from '@/shared/presentation/components/dashboard/SectorProgressStats';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { Tabs } from '@/shared/presentation/components/common/Tabs';
import { DashboardFocusProvider } from '@/shared/presentation/components/dashboard/DashboardFocusContext';
import {
  DashboardWidgetWrapper,
  DashboardFocusOverlay
} from '@/shared/presentation/components/dashboard/DashboardWidgetWrapper';
import { DashboardMaximizeButton } from '@/shared/presentation/components/dashboard/DashboardMaximizeButton';

export const DashboardHome = () => {
  const { t } = useTranslation();
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

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const pickerRef = React.useRef<HTMLInputElement>(null);

  return (
    <DashboardFocusProvider>
      <div className="dashboard-container">
        <DashboardFocusOverlay
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
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

        {globalStats && (
          <DashboardWidgetWrapper
            id="global-stats"
            title={t('dashboard.globalStats.title', 'System Overview')}
          >
            <GlobalStats stats={globalStats} loading={loading} />
          </DashboardWidgetWrapper>
        )}

        {dailyStats.length > 0 && (
          <div className="dashboard-stats-grid">
            <div className="stats-col">
              <DashboardWidgetWrapper
                id="daily-stats"
                title="Daily Activity Logic"
                className="h-full"
              >
                <DailyStatsTable data={dailyStats} loading={loading} />
              </DashboardWidgetWrapper>
            </div>
            <div className="stats-col">
              <DashboardWidgetWrapper
                id="sector-stats"
                title={t('dashboard.sectorStats.title')}
                className="h-full"
              >
                <SectorStatsTable data={sectorStats} loading={loading} />
              </DashboardWidgetWrapper>
            </div>
          </div>
        )}

        {noveltyStats.length > 0 && (
          <div className="dashboard-novelties-row">
            <DashboardWidgetWrapper
              id="novelty-stats"
              title="Novelty Distribution"
              className="h-full"
            >
              <NoveltyStats data={noveltyStats} loading={loading} />
            </DashboardWidgetWrapper>
          </div>
        )}
        {advancedReportReadings.length > 0 && (
          <>
            <div className="section-divider">
              <h2 className="section-title">
                {t('dashboard.tabs.detailedReports')}
              </h2>
            </div>

            <Tabs
              tabs={[
                { id: 'visual', label: t('dashboard.tabs.visual') },
                { id: 'table', label: t('dashboard.tabs.detailed') }
              ]}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as 'visual' | 'table')}
              variant="pill"
            />

            <div
              className="dashboard-novelties-row"
              style={{ display: activeTab === 'visual' ? undefined : 'none' }}
            >
              <DashboardWidgetWrapper
                id="sector-progress"
                title={t('dashboard.sectorProgress.title')}
                className="h-full"
              >
                <SectorProgressStats
                  data={advancedReportReadings}
                  loading={loading}
                />
              </DashboardWidgetWrapper>
            </div>

            <div
              className="dashboard-advanced-readings-row"
              style={{ display: activeTab === 'table' ? undefined : 'none' }}
            >
              <DashboardWidgetWrapper
                id="advanced-readings"
                title={t('dashboard.advancedReadings.title')}
                className="h-full"
              >
                <AdvancedReadingsTable
                  data={advancedReportReadings}
                  loading={loading}
                />
              </DashboardWidgetWrapper>
            </div>
          </>
        )}
        <DashboardMaximizeButton />
      </div>
    </DashboardFocusProvider>
  );
};

export default DashboardHome;
