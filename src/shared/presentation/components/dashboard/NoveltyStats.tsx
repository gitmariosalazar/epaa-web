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
import { NOVELTY_COLORS } from '../../utils/colors/novelties.colors';
import './NoveltyStats.css';

interface NoveltyStatsProps {
  data: NoveltyStatsReport[];
  loading: boolean;
}

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

const getNoveltyColor = (noveltyName: string): string => {
  if (!noveltyName) return NOVELTY_COLORS.DEFAULT;

  // Normalize string: uppercase and replace spaces with underscores
  // e.g., "Consumo Bajo" -> "CONSUMO_BAJO"
  const normalizedKey = noveltyName.toUpperCase().replace(/\s+/g, '_');

  return (
    NOVELTY_COLORS[normalizedKey] ||
    NOVELTY_COLORS[noveltyName] || // Fallback to exact match just in case
    NOVELTY_COLORS.DEFAULT
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
      const color = getNoveltyColor(noveltyName);

      return {
        name: noveltyName,
        value: item.count,
        color: color,
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

  const activeItem = activeIndex >= 0 ? chartData[activeIndex] : null;

  return (
    <div
      className="content-card"
      style={{
        transition: 'border-color 0.3s ease',
        borderColor: activeItem ? activeItem.color : undefined
      }}
    >
      <div className="card-header">
        <h3>Novelties Breakdown</h3>
      </div>

      <div className="novelty-content-wrapper" style={{ padding: '1.5rem' }}>
        <div className="horizontal-novelty-layout">
          {/* Chart Section */}
          <div className="chart-section">
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
                        {activeItem ? activeItem.name : 'Total'}
                      </span>
                      <span className="total-value">
                        {activeItem ? activeItem.value : total}
                      </span>
                    </div>
                  </div>
                </foreignObject>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* List/Legend Section */}
          <div className="list-section">
            <div className="custom-legend-grid">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className={`novelty-item ${activeIndex === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  style={{
                    borderLeftColor: item.color,
                    opacity:
                      activeIndex !== -1 && activeIndex !== index ? 0.4 : 1
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
    </div>
  );
};
