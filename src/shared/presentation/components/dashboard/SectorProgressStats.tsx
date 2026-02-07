import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import './SectorProgressStats.css';
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { getTrafficLightColor } from '../../utils/colors/traffic-lights.colors';
import { useSectorProgressStats } from '@/shared/presentation/hooks/dashboard/useSectorProgressStats';

interface SectorProgressStatsProps {
  data: AdvancedReportReadings[];
  loading: boolean;
}

export const SectorProgressStats: React.FC<SectorProgressStatsProps> = ({
  data,
  loading
}) => {
  const { t } = useTranslation();

  const {
    searchTerm,
    currentPage,
    totalPages,
    currentData,
    sortConfig,
    handleSearchChange,
    handleSortChange,
    goToNextPage,
    goToPrevPage
  } = useSectorProgressStats({ data });

  if (loading) {
    return (
      <div className="p-4 text-center">
        {t('dashboard.sectorProgress.loading')}
      </div>
    );
  }

  return (
    <div className="content-card progress-stats-container">
      <div className="card-header sector-header-controls">
        <h3>{t('dashboard.sectorProgress.title')}</h3>
        <div className="sector-actions">
          {/* Sort Control */}
          <div className="sector-sort-wrapper">
            <ArrowUpDown size={16} className="sector-sort-icon" />
            <select
              onChange={handleSortChange}
              value={
                sortConfig ? `${sortConfig.key}-${sortConfig.direction}` : ''
              }
              className="sector-select"
            >
              <option value="" disabled>
                Sort by...
              </option>
              <option value="sector-asc">
                {t('dashboard.sectorProgress.sort.sectorAsc', 'Sector (Asc)')}
              </option>
              <option value="sector-desc">
                {t('dashboard.sectorProgress.sort.sectorDesc', 'Sector (Desc)')}
              </option>
              <option value="progressPercentage-desc">
                {t(
                  'dashboard.sectorProgress.sort.progressDesc',
                  'Progress (High to Low)'
                )}
              </option>
              <option value="progressPercentage-asc">
                {t(
                  'dashboard.sectorProgress.sort.progressAsc',
                  'Progress (Low to High)'
                )}
              </option>
            </select>
          </div>

          {/* Search Control */}
          <div className="sector-search-wrapper">
            <Search size={16} className="sector-search-icon" />
            <input
              type="text"
              placeholder={t('dashboard.sectorProgress.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="sector-search-input"
            />
          </div>
        </div>
      </div>

      <div className="sector-progress-grid-wrapper">
        {currentData.length === 0 ? (
          <EmptyState
            message={t('dashboard.sectorProgress.emptyTitle')}
            description={t('dashboard.sectorProgress.emptyDescription')}
            icon={Loader2}
          />
        ) : (
          <>
            <div className="sector-progress-grid">
              {currentData.map((sectorItem) => {
                const percentage = Math.round(sectorItem.progressPercentage);
                const progressColor = getTrafficLightColor(percentage);

                // Data for the donut chart: [progress, remaining]
                const chartData = [
                  {
                    name: t('dashboard.sectorProgress.legend.completed'),
                    value: percentage
                  },
                  {
                    name: t('dashboard.sectorProgress.legend.remaining'),
                    value: 100 - percentage
                  }
                ];

                const inactiveColor = 'var(--border-color)';

                return (
                  <div
                    key={sectorItem.sector}
                    className="sector-progress-card"
                    style={{
                      background: `linear-gradient(135deg, ${progressColor}25 0%, ${progressColor}05 100%)`,
                      borderColor: `${progressColor}40`,
                      boxShadow: `0 8px 32px 0 ${progressColor}15`,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)'
                    }}
                  >
                    <div className="progress-chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            <linearGradient
                              id={`gradient-${sectorItem.sector}`}
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor={progressColor}
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="100%"
                                stopColor={progressColor}
                                stopOpacity={1}
                              />
                            </linearGradient>
                            <filter
                              id={`glow-${sectorItem.sector}`}
                              x="-50%"
                              y="-50%"
                              width="200%"
                              height="200%"
                            >
                              <feGaussianBlur
                                stdDeviation="3"
                                result="coloredBlur"
                              />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="90%"
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                            paddingAngle={0}
                          >
                            {/* Main progress segment with gradient and optional glow */}
                            <Cell
                              fill={`url(#gradient-${sectorItem.sector})`}
                              style={{
                                filter: `drop-shadow(0px 0px 4px ${progressColor}80)`
                              }}
                            />
                            {/* Remaining segment */}
                            <Cell fill={inactiveColor} />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="progress-center-text">
                        <div
                          className="progress-percentage"
                          style={{
                            color: progressColor,
                            textShadow: `0 0 10px ${progressColor}40`
                          }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="sector-info">
                      <h3 className="sector-name">
                        {t('dashboard.sectorProgress.sector')}{' '}
                        {sectorItem.sector}
                      </h3>
                      <div className="sector-stats">
                        <div className="stat-item">
                          <span className="stat-value">
                            {sectorItem.readingsCompleted} /{' '}
                            {sectorItem.totalConnections}
                          </span>
                          <span className="stat-label">
                            {t('dashboard.sectorProgress.readings')}
                          </span>
                        </div>
                      </div>
                      <p
                        className="progress-label"
                        style={{ marginTop: '0.5rem' }}
                      >
                        {sectorItem.missingReadings}{' '}
                        {t('dashboard.sectorProgress.pending')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="sector-pagination">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="pagination-info">
                  {t('common.pagination.page', {
                    current: currentPage,
                    total: totalPages
                  }) || `Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
