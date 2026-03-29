import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

export interface GradientAreaChartProps<T> {
  data: T[];
  dataKeyX: string;
  dataKeyY: string;
  nameY?: string;
  nameX?: string;
  xAxisFormatter?: (value: T[keyof T]) => string;
  yAxisFormatter?: (value: T[keyof T]) => string;
  tooltipFormatterOrComponent?: (
    payload: T
  ) => React.ReactNode | [string, string] | string;
  height?: number | string;
  startColor?: string;
  endColor?: string;
  showDots?: boolean;

  /**
   * Defines where the exact value label should render for each point over the area.
   */
  valuePosition?: 'none' | 'top' | 'bottom';

  /**
   * Formatter specifically for the label that appears on the point.
   */
  labelFormatter?: (value: any) => string;

  /**
   * Custom SVG renderer for the label. If passed, overrides valuePosition and labelFormatter styles.
   */
  customLabel?: (props: any) => React.ReactNode;
}

export function GradientAreaChart<T extends object>({
  data,
  dataKeyX,
  dataKeyY,
  nameY = 'Valor',
  nameX = 'Eje X',
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatterOrComponent,
  height = '100%',
  startColor = '#3c149aff', // Violet
  endColor = '#00aeffff', // Ocean Blue / Cyan
  showDots = true,
  valuePosition = 'none',
  labelFormatter,
  customLabel
}: GradientAreaChartProps<T>) {
  // Generate unique IDs for the gradients to avoid conflicts if multiple charts are rendered
  const gradientIdFill = React.useId().replace(/:/g, '');
  const gradientIdLine = React.useId().replace(/:/g, '');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 70 /* Extra high for zig-zag labels */,
          right: 50,
          left: 65 /* Even larger corridor for massive Y values */,
          bottom: 75 /* Huge 75px corridor to prevent dots from stomping tick marks */
        }} /* Super spaced out margins */
      >
        <defs>
          {/* Vertical gradient for the fill area (fading down) */}
          <linearGradient id={gradientIdFill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={startColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={endColor} stopOpacity={0} />
          </linearGradient>

          {/* Horizontal gradient for the line stroke (evolving left to right) */}
          <linearGradient id={gradientIdLine} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border-color)"
        />

        <XAxis
          dataKey={dataKeyX}
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={true}
          axisLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
          tickFormatter={xAxisFormatter}
          tickMargin={
            35
          } /* Dramatically lower to prevent low-value zig-zag collision */
          label={{
            value: nameX,
            position: 'insideBottom',
            offset: -50 /* Pushed safely in the massive 75px margin */,
            fill: 'var(--text-main)',
            fontWeight: 800 /* Ultra Bold! */,
            fontSize: 13
          }}
        />

        <YAxis
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={true}
          axisLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
          tickFormatter={yAxisFormatter}
          tickMargin={10}
          label={{
            value: nameY,
            angle: -90,
            position: 'insideLeft',
            dx: -30 /* Pushed hard 55px left of the axis line, far from the ticks */,
            fill: 'var(--text-main)',
            fontWeight: 800 /* Ultra Bold */,
            fontSize: 13,
            style: { textAnchor: 'middle' }
          }}
        />

        <RechartsTooltip
          wrapperClassName="custom-recharts-tooltip"
          cursor={{
            stroke: 'var(--border-color)',
            strokeWidth: 1,
            strokeDasharray: '4 4'
          }}
          content={
            <CustomTooltip
              tooltipFormatterOrComponent={tooltipFormatterOrComponent}
            />
          }
        />

        <Area
          type="monotone"
          name={nameY}
          dataKey={dataKeyY}
          stroke={`url(#${gradientIdLine})`}
          strokeWidth={3}
          fill={`url(#${gradientIdFill})`}
          activeDot={(props: any) => {
            const { cx, cy } = props;
            // Prevent attempting to render if cx/cy is missing
            if (cx == null || cy == null) return <g></g>;
            return (
              <g>
                <circle
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill={endColor}
                  className="pulsating-active-dot-ring"
                  style={{ filter: `drop-shadow(0px 0px 6px ${endColor})` }}
                  pointerEvents="none"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={7}
                  fill={endColor}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  className="pulsating-active-dot-core"
                  style={{ filter: `drop-shadow(0px 2px 4px rgba(0,0,0,0.3))` }}
                />
              </g>
            );
          }}
          dot={
            showDots
              ? {
                  r: 3,
                  fill: 'var(--surface)',
                  stroke: startColor,
                  strokeWidth: 2
                }
              : false
          }
        >
          {valuePosition !== 'none' && (
            <LabelList
              dataKey={dataKeyY}
              position={valuePosition}
              formatter={labelFormatter}
              content={
                customLabel
                  ? (props: any) =>
                      customLabel({ ...props, payload: data[props.index] })
                  : undefined
              }
              fill="var(--text-main)"
              fontSize={11}
              fontWeight={700}
              offset={14}
              stroke="var(--surface)" /* Halo effect to prevent line intersection clashing */
              strokeWidth={3}
              style={{ paintOrder: 'stroke fill', strokeLinejoin: 'round' }}
            />
          )}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}
