import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Sector
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

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
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="var(--text-main)"
        fontSize={14}
        fontWeight={600}
      >
        {(percent * 100).toFixed(1)}%
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

export function DynamicPieChart<T extends object>({
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
    setTooltipPos(undefined);
  };

  const onChartMouseMove = (state: any) => {
    if (state && state.chartX != null && state.chartY != null) {
      // Estimate center using activeCoordinate if available, else fallback
      const cx = state.activeCoordinate?.cx || 150;
      const cy = state.activeCoordinate?.cy || 150;

      const dx = state.chartX - cx;
      const dy = state.chartY - cy;

      let offsetX = state.chartX;
      let offsetY = state.chartY;

      // Quadrant-based tooltip placement to guarantee it never overlaps the center hole
      if (dx >= 0) {
        offsetX += 20; // Mouse on right, place tooltip to the right
      } else {
        offsetX -= 160; // Mouse on left, place tooltip far left (accounting for tooltip width)
      }

      if (dy >= 0) {
        offsetY += 20; // Mouse on bottom, place tooltip below
      } else {
        offsetY -= 50; // Mouse on top, place tooltip above (accounting for tooltip height)
      }

      setTooltipPos({ x: offsetX, y: offsetY });
    }
  };

  const onLegendEnter = (e: any) => {
    // Find index of the hovered legend item by comparing its value to the data
    const idx = data.findIndex((item: any) => item[nameKey] === e.value);
    if (idx !== -1) setActiveIndex(idx);
  };

  const onLegendLeave = () => {
    setActiveIndex(-1);
  };

  // Recharts Legend formatting to highlight the active legend text
  const renderLegendText = (value: string, _: any, index: number) => {
    const isActive = activeIndex === index;
    return (
      <span
        className={`custom-legend-text ${isActive ? 'custom-legend-text--active' : 'custom-legend-text--inactive'}`}
      >
        {value}
      </span>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        onMouseMove={onChartMouseMove}
        onMouseLeave={() => setTooltipPos(undefined)}
      >
        <Pie
          data={data}
          nameKey={nameKey}
          dataKey={dataKey}
          cx={showLegend ? '40%' : '50%'}
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

        {showLegend && (
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            className="custom-recharts-legend-pie"
            onMouseEnter={onLegendEnter}
            onMouseLeave={onLegendLeave}
            formatter={renderLegendText}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
