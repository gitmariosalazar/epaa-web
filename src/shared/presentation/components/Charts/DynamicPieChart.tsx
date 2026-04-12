import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Sector,
  Label
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { PercentageFormatter } from '@/shared/utils/formatters/PercentageFormatter';

export interface DynamicPieChartProps<T> {
  data: T[];
  nameKey: string;
  dataKey: string;
  height?: number | string;
  /**
   * By default, it will use the `color` property from the object if present.
   * Or fallback to the provided colors array or default palette.
   */
  colors?: string[];
  tooltipFormatterOrComponent?: (
    payload: T
  ) => React.ReactNode | [string, string] | string;
  showLegend?: boolean;
}

const DEFAULT_PALETTE = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
  '#a855f7', // purple-500
  '#f43f5e', // rose-500
  '#0ea5e9', // sky-500
  '#22c55e', // green-500
  '#d946ef', // fuchsia-500
  '#64748b', // slate-500
  '#0284c7', // light blue-600
  '#4f46e5' // indigo-600
];

// Custom active shape for a sleek hover effect on the donut slices
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 25}
        dy={8}
        textAnchor="middle"
        fill="var(--text-secondary)"
        fontSize={14}
        fontWeight={600}
      >
        {props.payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="var(--text-main)"
        fontSize={14}
        fontWeight={600}
      >
        {PercentageFormatter.formatWithDecimals(percent)}
      </text>
      <text
        x={cx}
        y={cy + 25}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={14}
        fontWeight={600}
      >
        {CurrencyFormatter.format(props.payload.value)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 12}
        fill={fill}
      />
    </g>
  );
};

export function DynamicPieChart<T extends Record<string, any>>({
  data,
  nameKey,
  dataKey,
  height = '100%',
  colors = DEFAULT_PALETTE,
  tooltipFormatterOrComponent,
  showLegend = true
}: DynamicPieChartProps<T>) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [tooltipPos, setTooltipPos] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  const onChartMouseMove = (state: any) => {
    if (state && state.chartX != null && state.chartY != null) {
      setTooltipPos({ x: state.chartX + 20, y: state.chartY - 20 });
    }
  };

  const onChartMouseLeave = () => {
    setTooltipPos(undefined);
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const total = useMemo(() => {
    return (
      data.reduce((sum, item: any) => sum + (Number(item[dataKey]) || 0), 0) ||
      1
    );
  }, [data, dataKey]);

  // renderCustomLegend and Recharts Legend logic removed in favor of external CSS Flexbox

  return (
    <div className="donut-wrapper">
      <div 
        className="donut-svg-container" 
        style={height !== '100%' ? { height, width: height, flexShrink: 0 } : undefined}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onMouseMove={onChartMouseMove}
            onMouseLeave={onChartMouseLeave}
          >
            <Pie
              data={data}
              nameKey={nameKey}
              dataKey={dataKey}
              cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={8}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          stroke="var(--surface)" // blends the border with background
          strokeWidth={2}
        >
          {data.map((entry: any, index: number) => {
            // Check if the object itself has a specific color mapping
            const color = entry.color || colors[index % colors.length];
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
          {activeIndex === -1 && (
            <Label
              position="center"
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as any;
                return (
                  <g>
                    <text
                      x={cx}
                      y={cy}
                      dy={-6}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize={12}
                      fontWeight={700}
                    >
                      TOTAL AMOUNT
                    </text>
                    <text
                      x={cx}
                      y={cy}
                      dy={18}
                      textAnchor="middle"
                      fill="var(--text-main)"
                      fontSize={22}
                      fontWeight={800}
                    >
                      {total.toLocaleString()}
                    </text>
                  </g>
                );
              }}
            />
          )}
        </Pie>

        <RechartsTooltip
          position={tooltipPos}
          wrapperClassName="custom-recharts-tooltip custom-tooltip-wrapper-pie"
          content={
            <CustomTooltip
              tooltipFormatterOrComponent={tooltipFormatterOrComponent as any}
            />
          }
        />

        </PieChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="donut-legend">
          <div className="donut-legend-header">
            <div className="donut-legend-header-spacer" />
            <span className="donut-legend-header-label">Descripción</span>
            <span className="donut-legend-header-value">Porcentaje</span>
            <span className="donut-legend-header-amount">Monto</span>
          </div>
          {data.map((item: any, index: number) => {
            const isActive = activeIndex === index;
            const value = Number(item[dataKey]) || 0;
            const color = item.color || colors[index % colors.length];

            return (
              <div
                key={`item-${index}`}
                className={`donut-legend-item ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <div
                  className="donut-legend-dot"
                  style={{ backgroundColor: color }}
                />
                <span className="donut-legend-label">{item[nameKey]}</span>
                <span className="donut-legend-value">
                  {((value / total) * 100).toFixed(1)}%
                </span>
                <span
                  className="donut-legend-amount"
                  style={{ color }}
                >
                  {(item as any)?.fmt
                    ? (item as any).fmt(value)
                    : value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
