import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip
} from 'recharts';
import { Search } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import { Tooltip as UITooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import './InteractiveDonutChart.css';

export interface DonutChartDataItem {
  id: string | number;
  name: string;
  value: number;
  color: string;
  subtitle?: string;
}

export interface InteractiveDonutChartProps {
  title: string;
  data: DonutChartDataItem[];
  loading?: boolean;
  emptyStateMessage?: string;
  emptyStateDescription?: string;
  onItemSelect?: (id: string | number) => void;
  totalLabel?: string;
  totalValue?: string | number;
  tooltipFormatter?: (value: number, name: string, props: any) => React.ReactNode[];
  legendTooltipText?: string;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

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

export const InteractiveDonutChart: React.FC<InteractiveDonutChartProps> = ({
  title,
  data,
  loading,
  emptyStateMessage = "No Data Found",
  emptyStateDescription = "There is no data to display for the selected period.",
  onItemSelect,
  totalLabel = "Total",
  totalValue,
  tooltipFormatter,
  legendTooltipText
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  const calculatedTotal = useMemo(
    () => data.reduce((acc, cur) => acc + cur.value, 0),
    [data]
  );

  const displayTotalValue = totalValue !== undefined ? totalValue : calculatedTotal;
  const activeItem = activeIndex >= 0 ? data[activeIndex] : null;

  if (loading) {
    return (
      <div
        style={{
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <CircularProgress
          label={t('common.loading')}
          strokeWidth={9}
          size={110}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message={emptyStateMessage}
        description={emptyStateDescription}
        icon={Search}
      />
    );
  }

  return (
    <div
      className="content-card donut-chart-card"
      style={{
        transition: 'border-color 0.3s ease',
        borderColor: activeItem ? activeItem.color : undefined
      }}
    >
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="donut-content-wrapper" style={{ padding: '1.5rem' }}>
        <div className="horizontal-donut-layout">
          {/* Chart Section */}
          <div className="chart-section">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  cornerRadius={6}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                {tooltipFormatter ? (
                  <Tooltip
                    formatter={tooltipFormatter}
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                ) : (
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                )}
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
                        {activeItem ? activeItem.name : totalLabel}
                      </span>
                      <span className="total-value">
                        {activeItem ? activeItem.value : displayTotalValue}
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
              {data.map((item, index) => {
                const legendContent = (
                  <div
                    className={`chart-legend-item ${activeIndex === index ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    onClick={() => {
                      if (onItemSelect) {
                        onItemSelect(item.id);
                      }
                    }}
                    style={{
                      borderLeftColor: item.color,
                      opacity: activeIndex !== -1 && activeIndex !== index ? 0.4 : 1
                    }}
                  >
                    <div className="legend-info">
                      <span className="legend-name">{item.name}</span>
                      {item.subtitle && (
                        <span className="legend-meta">{item.subtitle}</span>
                      )}
                    </div>
                    <div
                      className="legend-badge"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                );

                if (legendTooltipText) {
                  return (
                    <UITooltip
                      key={item.id}
                      themeColor="info"
                      content={<div><p>{legendTooltipText.replace('{name}', item.name)}</p></div>}
                    >
                      {legendContent}
                    </UITooltip>
                  );
                }

                return <React.Fragment key={item.id}>{legendContent}</React.Fragment>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
