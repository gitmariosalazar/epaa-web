import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// ─── Domain Types ──────────────────────────────────────────────────────────────

export interface MultiLineSerie {
  /** Key that maps to data entries */
  dataKey: string;
  /** Human-readable label for the legend */
  name: string;
  /** Stroke color (hex or CSS var) */
  color: string;
  /** Whether to show a glow / shadow effect on the line */
  glow?: boolean;
  /** Dash pattern, e.g. "5 3". Omit for solid. */
  strokeDasharray?: string;
  /** strokeWidth; defaults to 3 */
  strokeWidth?: number;
}

export interface MultiLineChartProps<T extends object> {
  /** Data array; each entry must contain `dataKeyX` and all serie dataKeys */
  data: T[];
  /** Key used for the X-axis categories */
  dataKeyX: string;
  /** List of series to render */
  series: MultiLineSerie[];
  /** Optional X-axis tick formatter */
  xAxisFormatter?: (value: any) => string;
  /** Optional Y-axis tick formatter */
  yAxisFormatter?: (value: any) => string;
  /**
   * Custom tooltip body. Receives the ORIGINAL (un-normalized) data item.
   */
  tooltipFormatterOrComponent?: (payload: T) => React.ReactNode | string;
  /** Chart height; defaults to '100%' */
  height?: number | string;
  /** X-axis human-readable label */
  nameX?: string;
  /** Y-axis human-readable label */
  nameY?: string;
  /** Show value labels on every data point */
  showLabels?: boolean;
  /** Formatter for the inline data labels */
  labelFormatter?: (value: any) => string;
  /** Reference horizontal line value */
  referenceValue?: number;
  referenceLabel?: string;
  /** Show legend below the chart */
  showLegend?: boolean;
  /**
   * When true, normalizes each series independently to a 0–100 % scale
   * so metrics with very different magnitudes can be compared side by side.
   * Actual values are always shown in the tooltip.
   */
  normalizeData?: boolean;
}

// ─── Pure helper: normalise all series in the data to 0-100 ───────────────────
// SRP: data transformation is isolated from rendering

function buildNormalizedData<T extends object>(
  data: T[],
  series: MultiLineSerie[],
  dataKeyX: string
): object[] {
  // Compute per-serie max across all rows
  const maxByKey: Record<string, number> = {};
  series.forEach((s) => {
    const max = Math.max(
      ...data.map((d) => Number((d as any)[s.dataKey] ?? 0))
    );
    maxByKey[s.dataKey] = max === 0 ? 1 : max;
  });

  return data.map((row) => {
    const entry: any = { [dataKeyX]: (row as any)[dataKeyX] };
    series.forEach((s) => {
      const raw = Number((row as any)[s.dataKey] ?? 0);
      entry[s.dataKey] = parseFloat(
        ((raw / maxByKey[s.dataKey]) * 100).toFixed(2)
      );
    });
    return entry;
  });
}

// ─── Sub-component: GlowDot ────────────────────────────────────────────────────
// SRP: only renders the active dot for a given color

interface GlowDotProps {
  cx: number;
  cy: number;
  color: string;
}
function GlowDot({ cx, cy, color }: GlowDotProps) {
  if (cx == null || cy == null) return <g />;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill={color}
        opacity={0.2}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        pointerEvents="none"
      />
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="var(--surface)"
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 2px 6px ${color})` }}
      />
    </g>
  );
}

// ─── Sub-component: RestingDot ─────────────────────────────────────────────────
// SRP: renders the static dot at every data point

interface RestingDotProps {
  cx?: number;
  cy?: number;
  color: string;
}
function RestingDot({ cx, cy, color }: RestingDotProps) {
  if (cx == null || cy == null) return <g />;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="var(--surface)"
      stroke={color}
      strokeWidth={2.5}
    />
  );
}

// ─── Sub-component: MultiLineTooltipWrapper ────────────────────────────────────
// Adapter: passes the original (non-normalized) data item to the custom renderer

interface MultiLineTooltipWrapperProps<T extends object> {
  active?: boolean;
  payload?: any[];
  label?: string;
  tooltipFormatterOrComponent?: (payload: T) => React.ReactNode | string;
  originalData: T[];
  dataKeyX: string;
  series: MultiLineSerie[];
}

function MultiLineTooltipWrapper<T extends object>({
  active,
  payload,
  label,
  tooltipFormatterOrComponent,
  originalData,
  dataKeyX,
  series
}: MultiLineTooltipWrapperProps<T>) {
  if (!active || !payload || payload.length === 0) return null;

  // Find the original row that matches this X label
  const originalRow =
    originalData.find((d: any) => String(d[dataKeyX]) === String(label)) ??
    (payload[0]?.payload as T);

  const glassStyle: React.CSSProperties = {
    background: 'color-mix(in srgb, var(--surface) 90%, transparent)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: 'var(--text-main)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    border: '1px solid var(--border-color)',
    backdropFilter: 'blur(12px)',
    pointerEvents: 'none',
    zIndex: 10000,
    minWidth: '180px'
  };

  if (tooltipFormatterOrComponent) {
    const node = tooltipFormatterOrComponent(originalRow);
    if (React.isValidElement(node)) {
      return (
        <div style={glassStyle} className="dynamic-custom-tooltip-content">
          {node}
        </div>
      );
    }
  }

  // Default – list all series with their original (raw) values
  return (
    <div style={glassStyle}>
      <p
        style={{
          margin: '0 0 10px 0',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--text-secondary)'
        }}
      >
        {label}
      </p>
      {series.map((s) => {
        const rawVal = (originalRow as any)[s.dataKey];
        return (
          <div
            key={s.dataKey}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 5
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: s.color,
                boxShadow: `0 0 6px ${s.color}`,
                flexShrink: 0
              }}
            />
            <span
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                flex: 1
              }}
            >
              {s.name}
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
              {typeof rawVal === 'number'
                ? rawVal.toLocaleString('es-EC')
                : rawVal}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub-component: CustomLegend ───────────────────────────────────────────────
// SRP: glowing colored legend swatches

interface CustomLegendProps {
  series: MultiLineSerie[];
}
function CustomLegend({ series }: CustomLegendProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px 18px',
        justifyContent: 'center',
        padding: '6px 0 0 0'
      }}
    >
      {series.map((s) => (
        <div
          key={s.dataKey}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 3,
              borderRadius: 2,
              background: s.color,
              boxShadow: `0 0 5px ${s.color}`,
              verticalAlign: 'middle'
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
          >
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
// OCP: add more series without modifying this component.
// DIP: depends on abstract MultiLineSerie[], not concrete domain models.

export function MultiLineChart<T extends object>({
  data,
  dataKeyX,
  series,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatterOrComponent,
  height = '100%',
  nameX = 'Eje X',
  nameY = 'Valor',
  referenceValue,
  referenceLabel,
  showLegend = true,
  normalizeData = false
}: MultiLineChartProps<T>) {
  // SRP: normalization is a pure transformation, computed here before render
  const chartData = normalizeData
    ? buildNormalizedData(data, series, dataKeyX)
    : data;

  const yFormatter = normalizeData
    ? (v: number) => `${v.toFixed(0)}%`
    : yAxisFormatter;

  return (
    <div style={{ width: '100%', height: height, display: 'flex', flexDirection: 'column' }}>
      {/* Chart area: takes all remaining height via flex:1 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData as object[]}
            margin={{ top: 50, right: 50, left: 65, bottom: 55 }}
          >
          {/* ── Grid ── */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border-color)"
            opacity={0.45}
          />

          {/* ── X Axis ── */}
          <XAxis
            dataKey={dataKeyX}
            stroke="var(--text-secondary)"
            fontSize={12}
            fontWeight={500}
            tickLine={true}
            axisLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
            tickFormatter={xAxisFormatter}
            tickMargin={12}
            label={{
              value: nameX,
              position: 'insideBottom',
              offset: -38,
              fill: 'var(--text-main)',
              fontWeight: 800,
              fontSize: 13
            }}
          />

          {/* ── Y Axis ── */}
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={12}
            fontWeight={500}
            tickLine={true}
            axisLine={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }}
            tickFormatter={yFormatter}
            tickMargin={10}
            domain={normalizeData ? [0, 100] : ['auto', 'auto']}
            label={{
              value: normalizeData ? '% (relativo)' : nameY,
              angle: -90,
              position: 'insideLeft',
              dx: -30,
              fill: 'var(--text-main)',
              fontWeight: 800,
              fontSize: 13,
              style: { textAnchor: 'middle' }
            }}
          />

          {/* ── Tooltip ── */}
          <RechartsTooltip
            wrapperClassName="custom-recharts-tooltip"
            cursor={{
              stroke: 'var(--border-color)',
              strokeWidth: 1,
              strokeDasharray: '4 4'
            }}
            content={
              <MultiLineTooltipWrapper
                tooltipFormatterOrComponent={tooltipFormatterOrComponent}
                originalData={data}
                dataKeyX={dataKeyX}
                series={series}
              />
            }
          />

          {/* ── Optional reference line ── */}
          {referenceValue != null && (
            <ReferenceLine
              y={referenceValue}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="6 3"
              label={{
                value: referenceLabel ?? String(referenceValue),
                position: 'insideTopRight',
                fill: 'var(--text-secondary)',
                fontSize: 11
              }}
            />
          )}

          {/* ── One Line per serie (OCP) ── */}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={s.strokeWidth ?? 3}
              strokeDasharray={s.strokeDasharray}
              dot={(props: any) => (
                <RestingDot key={`dot-${s.dataKey}-${props.index}`} cx={props.cx} cy={props.cy} color={s.color} />
              )}
              activeDot={(props: any) => (
                <GlowDot key={`active-${s.dataKey}-${props.index}`} cx={props.cx} cy={props.cy} color={s.color} />
              )}
              style={{
                filter: s.glow ? `drop-shadow(0 0 4px ${s.color})` : undefined
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      </div>{/* end flex:1 chart area */}

      {/* ── Legend: real DOM element below SVG — zero overlap with X axis ── */}
      {showLegend && (
        <div style={{ flexShrink: 0, paddingTop: '8px' }}>
          <CustomLegend series={series} />
        </div>
      )}
    </div>
  );
}
