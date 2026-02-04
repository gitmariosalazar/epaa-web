import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import './SectorProgressStats.css';
import { Loader2, Search } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { getTrafficLightColor } from '../../utils/colors/traffic-lights.colors';

interface SectorProgressStatsProps {
  data: AdvancedReportReadings[];
  loading: boolean;
}

export const SectorProgressStats: React.FC<SectorProgressStatsProps> = ({
  data,
  loading
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="p-4 text-center">
        {t('dashboard.sectorProgress.loading')}
      </div>
    );
  }

  // Filter based on search term (sector number)
  const validData = data.filter(
    (item) =>
      item.sector > 0 &&
      item.sector.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-card progress-stats-container">
      <div
        className="card-header flex justify-between items-center"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3>{t('dashboard.sectorProgress.title')}</h3>
        <div style={{ position: 'relative', width: '250px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder={t('dashboard.sectorProgress.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 10px 8px 34px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-main)',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </div>

      <div className="sector-progress-grid-wrapper">
        {validData.length === 0 ? (
          <EmptyState
            message={t('dashboard.sectorProgress.emptyTitle')}
            description={t('dashboard.sectorProgress.emptyDescription')}
            icon={Loader2}
          />
        ) : (
          <div className="sector-progress-grid">
            {validData.map((sectorItem) => {
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
                          innerRadius={55}
                          outerRadius={70}
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
                          background: `linear-gradient(135deg, ${progressColor} 0%, ${progressColor} 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          color: progressColor // Fallback
                        }}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>

                  <div className="sector-info">
                    <h3 className="sector-name">
                      {t('dashboard.sectorProgress.sector')} {sectorItem.sector}
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
        )}
      </div>
    </div>
  );
};
