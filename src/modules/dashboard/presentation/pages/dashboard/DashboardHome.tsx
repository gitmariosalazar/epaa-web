import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalStats } from '@/shared/presentation/components/dashboard/GlobalStats';
import { DailyStatsTable } from '@/shared/presentation/components/dashboard/DailyStatsTable';
import { SectorStatsTable } from '@/shared/presentation/components/dashboard/SectorStatsTable';
import { NoveltyStats } from '@/shared/presentation/components/dashboard/NoveltyStats';
import { Calendar } from 'lucide-react';

import '@/shared/presentation/styles/dashboard.css';
import './DashboardHome.css';
import { AdvancedReadingsTable } from '@/shared/presentation/components/dashboard/AdvancedReadingsTable';
import { SectorProgressStats } from '@/shared/presentation/components/dashboard/SectorProgressStats';
import { Tabs } from '@/shared/presentation/components/common/Tabs';
import { DashboardFocusProvider } from '@/shared/presentation/components/dashboard/DashboardFocusContext';
import {
  DashboardWidgetWrapper,
  DashboardFocusOverlay
} from '@/shared/presentation/components/dashboard/DashboardWidgetWrapper';
import { DashboardMaximizeButton } from '@/shared/presentation/components/dashboard/DashboardMaximizeButton';
import { useDashboardController } from '@/modules/dashboard/presentation/hooks/useDashboardController';

export const DashboardHome = () => {
  const { t } = useTranslation();

  const {
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
  } = useDashboardController();

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

            {activeTab === 'visual' && (
              <div className="dashboard-novelties-row">
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
            )}

            {activeTab === 'table' && (
              <div className="dashboard-advanced-readings-row">
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
            )}
          </>
        )}
        <DashboardMaximizeButton visible={false} disabled={true} />
      </div>
    </DashboardFocusProvider>
  );
};

export default DashboardHome;
