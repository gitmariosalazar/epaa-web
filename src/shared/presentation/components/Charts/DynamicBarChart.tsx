import { useId } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  Rectangle
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';

export interface DynamicBarChartProps<T> {
  data: T[];
  dataKeyX: string;
  dataKeyY: string;
  nameY?: string;
  nameX?: string;
  xAxisFormatter?: (value: T[keyof T]) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatterOrComponent?: (
    payload: T
  ) => React.ReactNode | [string, string] | string;
  height?: number | string;

  /**
   * If provided, each bar will cycle through these colors.
   * If not provided, a default blue-purple gradient will be used for all bars.
   */
  colors?: string[];

  /**
   * Defines where the exact value label should render for each bar.
   * "top" spaces it just above the bar.
   * "insideTop" renders it inside the top bound of the bar (works well if value contrast is good).
   */
  valuePosition?: 'none' | 'top' | 'insideTop' | 'insideBottom' | 'center';

  /**
   * Formatter specifically for the label that appears on or inside the bar.
   * Usually a compact format like "$45k" to avoid overflows.
   */
  labelFormatter?: (value: any) => string;

  /**
   * Custom SVG renderer for the label. If passed, overrides valuePosition and labelFormatter styles.
   */
  customLabel?: (props: any) => React.ReactNode;
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

export function DynamicBarChart<T extends object>({
  data,
  dataKeyX,
  dataKeyY,
  nameY = 'Valor',
  nameX = '',
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatterOrComponent,
  height = '100%',
  colors,
  valuePosition = 'none',
  labelFormatter,
  customLabel
}: DynamicBarChartProps<T>) {
  // Unique ID for the default fallback gradient
  const gradientId = `barGradient-${useId().replace(/:/g, '')}`;

  // If no specific colors array is provided, we use the robust 20-color palette.
  const activePalette =
    Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_PALETTE;

  // Render LabelList securely
  const renderLabelList = () => {
    if (valuePosition === 'none') return null;

    // Choose text color based on position for contrast.
    // insideTop is often over a dark fill, top is over background (var(--text-main)).
    const labelColor = valuePosition.includes('inside')
      ? '#ffffff'
      : 'var(--text-main)';

    return (
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
        fill={labelColor}
        fontSize={11}
        fontWeight={500}
        offset={10}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 50, right: 30, left: 65, bottom: 75 }}
      >
        <defs>
          {/* Default Gradient (Light Blue to Dark Blue) used if no specific array is provided */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9} />
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
          tickMargin={35}
          label={{
            value: nameX,
            position: 'insideBottom',
            offset: -50,
            fill: 'var(--text-main)',
            fontWeight: 800,
            fontSize: 13
          }}
        />

        <YAxis
          stroke="var(--text-secondary)"
          fontSize={12}
          tickLine={true}
          axisLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
          tickFormatter={yAxisFormatter}
          label={{
            value: nameY,
            angle: -90,
            position: 'insideLeft',
            dx: -30 /* Pushed incredibly far to the left */,
            fill: 'var(--text-main)',
            fontWeight: 800,
            fontSize: 13,
            style: { textAnchor: 'middle' }
          }}
        />

        <RechartsTooltip
          cursor={{ fill: 'var(--surface-hover)' }}
          content={
            <CustomTooltip
              tooltipFormatterOrComponent={tooltipFormatterOrComponent}
              dataArray={data}
              dataKeyX={dataKeyX}
              activePalette={activePalette}
            />
          }
        />

        <Bar
          dataKey={dataKeyY}
          name={nameY}
          radius={[6, 6, 0, 0]}
          activeBar={(props: any) => {
            const { x, y, width, height, index } = props;
            if (x == null || y == null || width == null || height == null)
              return <g></g>;

            const color = activePalette[index % activePalette.length];

            return (
              <g>
                <Rectangle
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={color}
                  className="pulsating-active-bar"
                  style={{ filter: `drop-shadow(0px 0px 8px ${color})` }}
                  radius={[6, 6, 0, 0]}
                  pointerEvents="none"
                />
                <Rectangle
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={color}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  className="active-bar-core"
                  radius={[6, 6, 0, 0]}
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }}
                />
              </g>
            );
          }}
        >
          {/* Always map distinct colors either from user array or DEFAULT_PALETTE */}
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={activePalette[index % activePalette.length]}
            />
          ))}

          {/* Conditional Value Labels */}
          {renderLabelList()}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
