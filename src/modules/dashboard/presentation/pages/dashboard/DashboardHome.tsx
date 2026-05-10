import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalStats } from '@/modules/dashboard/presentation/components/GlobalStats';
import { DailyStatsTable } from '@/modules/dashboard/presentation/components/DailyStatsTable';
import { SectorStatsTable } from '@/modules/dashboard/presentation/components/SectorStatsTable';
import { NoveltyStats } from '@/modules/dashboard/presentation/components/NoveltyStats';

import '@/shared/presentation/styles/dashboard.css';
import './DashboardHome.css';
import { AdvancedReadingsTable } from '@/modules/dashboard/presentation/components/AdvancedReadingsTable';
import { SectorProgressStats } from '@/modules/dashboard/presentation/components/SectorProgressStats';
import { Tabs } from '@/shared/presentation/components/common/Tabs';
import { DashboardFocusProvider } from '@/modules/dashboard/presentation/components/DashboardFocusContext';
import {
  DashboardWidgetWrapper,
  DashboardFocusOverlay
} from '@/modules/dashboard/presentation/components/DashboardWidgetWrapper';
import { DashboardMaximizeButton } from '@/modules/dashboard/presentation/components/DashboardMaximizeButton';
import { useDashboardController } from '@/modules/dashboard/presentation/hooks/useDashboardController';

import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useSimulatedProgress } from '@/shared/presentation/components/CircularProgress/useSimulatedProgress';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { NoveltyStatsModal } from '@/modules/dashboard/presentation/components/NoveltyStatsModal';
import { DashBoardProgressReadings } from '../../components/DashBoardProgressReadings';

export const DashboardHome = () => {
  const { t } = useTranslation();
  const [selectedNovelty, setSelectedNovelty] = React.useState<string | null>(
    null
  );

  const {
    currentMonth,
    loading,
    globalStats,
    dailyStats,
    sectorStats,
    noveltyStats,
    advancedReportReadings,
    advancedReportSectors,
    activeTab,
    setActiveTab,
    handleMonthChange
  } = useDashboardController();

  const pickerRef = React.useRef<HTMLInputElement>(null);

  const progress = useSimulatedProgress(loading);

  return (
    <DashboardFocusProvider>
      <div className="dashboard-container">
        <DashboardFocusOverlay
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />

        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>{t('dashboard.title', 'Analytical Dashboard')}</h1>
            <p>
              {t(
                'dashboard.subtitle',
                'Descripción general de las lecturas y el rendimiento del sistema.'
              )}
            </p>
          </div>

          <Tooltip
            content={t('dashboard.changePeriod', 'Cambiar periodo')}
            position="bottom"
            themeColor="sky"
          >
            <div
              className="dashboard-control pulse-hover"
              onClick={() => pickerRef.current?.showPicker()}
            >
              <DatePicker
                view="month"
                value={currentMonth}
                onChange={handleMonthChange}
                disabled={loading}
                ref={pickerRef}
              />
            </div>
          </Tooltip>
        </div>

        {/* ── Dashboard Content Wrapper with Global Loader ── */}
        <div className="dashboard-content-rel">
          {(loading || progress > 0) && (
            <div className="dashboard-global-loader fade-in">
              <div className="loader-glass-card">
                <CircularProgress
                  size={140}
                  strokeWidth={8}
                  progress={progress}
                  label={t('common.loading', 'Loading...')}
                />
              </div>
            </div>
          )}

          <div
            className={
              'dashboard-main-content ' + (loading ? 'content-blur' : '')
            }
          >
            <div style={{ marginBottom: '-1.5rem' }}>
              <DashboardWidgetWrapper
                id="global-stats"
                title={t('dashboard.globalStats.title', 'System Overview')}
              >
                <GlobalStats stats={globalStats} loading={false} />
              </DashboardWidgetWrapper>
            </div>

            <div
              className="dashboard-stats-grid"
              style={{ marginTop: '1.5rem' }}
            >
              <div className="stats-col">
                <DashboardWidgetWrapper
                  id="daily-stats"
                  title={t('dashboard.dailyStats.title', 'Daily Performance')}
                  className="h-full"
                >
                  <DailyStatsTable data={dailyStats} loading={false} />
                </DashboardWidgetWrapper>
              </div>
              <div className="stats-col">
                <DashboardWidgetWrapper
                  id="sector-stats"
                  title={t('dashboard.sectorStats.title', 'Sector Analysis')}
                  className="h-full"
                >
                  <SectorStatsTable data={sectorStats} loading={false} />
                </DashboardWidgetWrapper>
              </div>
            </div>

            <div className="dashboard-novelties-row">
              <DashBoardProgressReadings
                data={advancedReportSectors}
                loading={false}
              />
            </div>

            <div className="dashboard-novelties-row">
              <DashboardWidgetWrapper
                id="novelty-stats"
                title={t(
                  'dashboard.noveltyStats.title',
                  'Novelty Distribution'
                )}
                className="h-full"
              >
                <NoveltyStats
                  data={noveltyStats}
                  loading={false}
                  onSelectNovelty={setSelectedNovelty}
                />
              </DashboardWidgetWrapper>
            </div>

            {advancedReportReadings.length > 0 && (
              <div className="dashboard-advanced-section fade-in">
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

                <div className="tab-content-wrapper">
                  {activeTab === 'visual' ? (
                    <DashboardWidgetWrapper
                      id="sector-progress"
                      title={t('dashboard.sectorProgress.title')}
                      className="h-full"
                    >
                      <SectorProgressStats
                        data={advancedReportReadings}
                        loading={false}
                      />
                    </DashboardWidgetWrapper>
                  ) : (
                    <DashboardWidgetWrapper
                      id="advanced-readings"
                      title={t('dashboard.advancedReadings.title')}
                      className="h-full"
                    >
                      <AdvancedReadingsTable
                        data={advancedReportReadings}
                        loading={false}
                        currentMonth={currentMonth}
                      />
                    </DashboardWidgetWrapper>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DashboardMaximizeButton visible={true} disabled={false} />
      </div>

      <NoveltyStatsModal
        isOpen={!!selectedNovelty}
        onClose={() => setSelectedNovelty(null)}
        month={currentMonth}
        novelty={selectedNovelty || ''}
      />
    </DashboardFocusProvider>
  );
};

export default DashboardHome;
