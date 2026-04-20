/* src/shared/presentation/components/Charts/DonutChart.tsx */
import React, { useMemo, memo, useState } from 'react';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { chartColorService } from '@/shared/presentation/utils/colors/ChartColorManager';
import type { ChartColor } from '@/shared/presentation/utils/colors/charts.colors';
import './Charts.css';
import { Button } from '../Button/Button';
import { Download } from 'lucide-react';

export interface DonutSlice {
  label: string;
  value: number;
  color: ChartColor | string;
  icon?: React.ReactNode;
  fmt?: (v: number) => string;
}

interface DonutChartProps {
  title: string;
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  value?: string;
  onExport?: () => void;
  exportable?: boolean;
}

/**
 * A professional Donut Chart component built with SVG.
 * Features a dynamic legend, percentage calculations, and smooth animations.
 */
export const DonutChart: React.FC<DonutChartProps> = memo(
  ({
    title,
    slices,
    centerLabel = 'TOTAL',
    centerValue,
    description,
    icon,
    label,
    value,
    onExport,
    exportable
  }) => {
    const total = useMemo(
      () => slices.reduce((sum, slice) => sum + slice.value, 0) || 1,
      [slices]
    );

    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // SVG Geometry constants
    const R = 130; // Outer radius (even larger)
    const r = 100; // Inner radius (huge hole)
    const cx = 140; // Center X
    const cy = 140; // Center Y

    // Resolver to map generic string colors to CSS variables
    const resolveColor = (c: string) => chartColorService.getColorByName(c);

    const paths = useMemo(() => {
      let currentAngle = -Math.PI / 2; // Start from top

      return slices
        .map((slice) => {
          const frac = slice.value / total;
          if (frac === 0) return null;

          const a1 = currentAngle;
          const a2 = currentAngle + frac * 2 * Math.PI * 0.9999; // Slightly less than 2PI to avoid SVG drawing bugs
          currentAngle = a2;

          // Outer arc points
          const x1 = cx + R * Math.cos(a1);
          const y1 = cy + R * Math.sin(a1);
          const x2 = cx + R * Math.cos(a2);
          const y2 = cy + R * Math.sin(a2);

          // Inner arc points
          const xi1 = cx + r * Math.cos(a1);
          const yi1 = cy + r * Math.sin(a1);
          const xi2 = cx + r * Math.cos(a2);
          const yi2 = cy + r * Math.sin(a2);

          const largeArcFlag = frac > 0.5 ? 1 : 0;

          const pathData = `
        M ${x1} ${y1}
        A ${R} ${R} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${xi2} ${yi2}
        A ${r} ${r} 0 ${largeArcFlag} 0 ${xi1} ${yi1}
        Z
      `;

          // Generate outer glow outline "hoverD" separated by 4px
          const gap = 4;
          const Ro = R + gap;
          const ri = r - gap;
          const xo1 = cx + Ro * Math.cos(a1);
          const yo1 = cy + Ro * Math.sin(a1);
          const xo2 = cx + Ro * Math.cos(a2);
          const yo2 = cy + Ro * Math.sin(a2);
          const xhi1 = cx + ri * Math.cos(a1);
          const yhi1 = cy + ri * Math.sin(a1);
          const xhi2 = cx + ri * Math.cos(a2);
          const yhi2 = cy + ri * Math.sin(a2);

          const hoverPathData = `
        M ${xo1} ${yo1}
        A ${Ro} ${Ro} 0 ${largeArcFlag} 1 ${xo2} ${yo2}
        L ${xhi2} ${yhi2}
        A ${ri} ${ri} 0 ${largeArcFlag} 0 ${xhi1} ${yhi1}
        Z
      `;

          return {
            d: pathData,
            hoverD: hoverPathData,
            color: slice.color,
            label: slice.label,
            formattedValue: slice.fmt
              ? slice.fmt(slice.value)
              : slice.value.toLocaleString()
          };
        })
        .filter(Boolean);
    }, [slices, total]);

    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-heading">
            <h4 className="chart-card-title">{title}</h4>
            {description && (
              <p className="chart-card-description">{description}</p>
            )}
          </div>
          <div className="chart-card-header-left-absolute">
            {icon && label && (
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">{icon}</div>
                <span>
                  {label}
                  <p>{value}</p>
                </span>
              </div>
            )}
            {exportable && (
              <div className="chart-card-header-button">
                <Button
                  variant="ghost"
                  size="compact"
                  onClick={() => {
                    if (onExport) {
                      onExport();
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="chart-body">
          <div className="donut-wrapper">
            <div className="donut-svg-container">
              <svg className="donut-svg" viewBox="0 0 280 280">
                {/* Background Track */}
                <circle className="donut-bg" cx={cx} cy={cy} r={(R + r) / 2} />

                {paths.map((p, i) => {
                  const isActive = hoveredIdx === i;
                  return (
                    <Tooltip
                      key={i}
                      as="g"
                      content={`${p?.label}: ${p?.formattedValue}`}
                      position="top"
                      className={`donut-slice-tooltip-g ${isActive ? 'is-active' : ''}`}
                      themeColor={p?.color}
                      followCursor={true}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <path
                        className={`donut-slice-hover-ring ${isActive ? 'is-active' : ''}`}
                        d={p?.hoverD}
                        fill="none"
                        stroke={p?.color ? resolveColor(p.color) : undefined}
                        style={{
                          filter: `drop-shadow(0px 0px 4px ${p?.color ? resolveColor(p.color) : 'black'})`
                        }}
                      />
                      <path
                        className={`donut-slice ${isActive ? 'is-active' : ''}`}
                        d={p?.d}
                        fill={p?.color ? resolveColor(p.color) : undefined}
                      />
                    </Tooltip>
                  );
                })}
              </svg>

              <div className="donut-center-content">
                <span className="donut-center-label">
                  {hoveredIdx !== null ? slices[hoveredIdx].label : centerLabel}
                </span>
                <span className="donut-center-value">
                  {hoveredIdx !== null
                    ? slices[hoveredIdx].fmt
                      ? slices[hoveredIdx].fmt!(slices[hoveredIdx].value)
                      : slices[hoveredIdx].value.toLocaleString()
                    : centerValue}
                </span>
              </div>
            </div>

            <div className="donut-legend">
              <div className="donut-legend-header">
                <div className="donut-legend-header-spacer" />
                <span className="donut-legend-header-label">Descripción</span>
                <span className="donut-legend-header-value">Porcentaje</span>
                <span className="donut-legend-header-amount">Monto</span>
              </div>
              {slices.map((slice, i) => {
                const isActive = hoveredIdx === i;
                return (
                  <div
                    key={i}
                    className={`donut-legend-item ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <div
                      className="donut-legend-dot"
                      style={{ backgroundColor: resolveColor(slice.color) }}
                    />
                    <span className="donut-legend-label">{slice.label}</span>
                    <span className="donut-legend-value">
                      {((slice.value / total) * 100).toFixed(1)}%
                    </span>
                    <span
                      className="donut-legend-amount"
                      style={{ color: resolveColor(slice.color) }}
                    >
                      {slice.fmt
                        ? slice.fmt(slice.value)
                        : slice.value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';
