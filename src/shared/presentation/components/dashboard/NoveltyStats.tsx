import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip
} from 'recharts';
import { Loader2 } from 'lucide-react';
import type { NoveltyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface NoveltyStatsProps {
  data: NoveltyStatsReport[];
  loading: boolean;
}

const NOVELTY_COLORS: Record<string, string> = {
  NORMAL: '#10b981', // Green
  'LECTURA NORMAL': '#10b981',
  'FALTA LECTURA': '#f59e0b', // Amber
  DAÑADO: '#ef4444', // Red
  NUEVO: '#3b82f6', // Blue
  SUSPENDIDO: '#6b7280', // Gray
  DEFAULT: '#8b5cf6' // Purple
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 6}
        outerRadius={innerRadius - 2}
        fill={fill}
        cornerRadius={4}
      />
    </g>
  );
};

export const NoveltyStats: React.FC<NoveltyStatsProps> = ({
  data,
  loading
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const chartData = useMemo(() => {
    return data.map((item) => {
      const noveltyName = item.novelty || 'Unknown';
      const colorKey = noveltyName ? noveltyName.toUpperCase() : 'DEFAULT';
      return {
        name: noveltyName,
        value: item.count,
        color:
          NOVELTY_COLORS[colorKey] ||
          NOVELTY_COLORS[noveltyName] ||
          NOVELTY_COLORS.DEFAULT,
        average: Number(item.averageConsumption).toFixed(1)
      };
    });
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((acc, cur) => acc + cur.value, 0),
    [chartData]
  );

  if (loading) {
    return (
      <EmptyState
        message="Loading data..."
        icon={Loader2}
        description="Please wait while we fetch the latest statistics."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="No Novelties Found"
        description="There are no reading novelties recorded for this period."
        icon={Loader2}
      />
    );
  }

  return (
    <div
      className="content-card"
      style={{
        transition: 'border-color 0.3s ease',
        borderColor: activeIndex >= 0 ? chartData[activeIndex].color : undefined
      }}
    >
      <div className="card-header">
        <h3>Novelties Breakdown</h3>
      </div>

      <div className="novelty-content-wrapper" style={{ padding: '1.5rem' }}>
        <div className="horizontal-novelty-layout">
          {/* Chart Section */}
          <div
            className="chart-section"
            style={{ height: 300, position: 'relative' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  cornerRadius={6}
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} - Avg: ${chartData.find((d) => d.name === name)?.average} m³`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                {/* Center Content Overlay */}
                <foreignObject
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  pointerEvents="none"
                >
                  <div className="chart-center-overlay">
                    <div className="total-card">
                      <span className="total-label">
                        {activeIndex !== -1
                          ? chartData[activeIndex].name
                          : 'Total'}
                      </span>
                      <span className="total-value">
                        {activeIndex !== -1
                          ? chartData[activeIndex].value
                          : total}
                      </span>
                    </div>
                  </div>
                </foreignObject>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* List/Legend Section - RESTORED */}
          <div className="list-section">
            <div className="custom-legend-grid">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className={`novelty-item ${activeIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  style={{
                    borderLeft: `4px solid ${item.color}`,
                    opacity:
                      activeIndex !== -1 && activeIndex !== index ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div className="novelty-info">
                    <span className="novelty-name">{item.name}</span>
                    <span className="novelty-meta">Avg: {item.average} m³</span>
                  </div>
                  <div
                    className="novelty-badge"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .horizontal-novelty-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .list-section {
            flex: 1;
        }
        .custom-legend-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        .novelty-item {
            padding: 12px;
            background-color: var(--bg-secondary);
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .novelty-item.active {
            background-color: var(--bg-hover);
            transform: translateX(5px);
        }

        .chart-center-overlay {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .total-card {
           background-color: var(--bg-secondary);
           padding: 0.5rem 1rem;
           border-radius: 8px;
           display: flex;
           flex-direction: column;
           align-items: center;
           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
           border: 1px solid var(--border-color);
           pointer-events: auto; /* Allow interaction if needed, though mostly visual */
           min-width: 120px;
        }
        .total-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .total-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        @media (min-width: 1024px) {
          .horizontal-novelty-layout {
            flex-direction: row;
            align-items: center;
          }
          .chart-section {
            flex: 0 0 40%;
            border-right: 1px solid var(--border-color);
            padding-right: 2rem;
            margin-right: 2rem;
          }
        }
      `}</style>
    </div>
  );
};
