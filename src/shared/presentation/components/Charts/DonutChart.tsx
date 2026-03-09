/* src/shared/presentation/components/Charts/DonutChart.tsx */
import React, { useMemo, memo } from 'react';
import './Charts.css';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  fmt?: (v: number) => string;
}

interface DonutChartProps {
  title: string;
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  description?: string;
}

/**
 * A professional Donut Chart component built with SVG.
 * Features a dynamic legend, percentage calculations, and smooth animations.
 */
export const DonutChart: React.FC<DonutChartProps> = memo(
  ({ title, slices, centerLabel = 'TOTAL', centerValue, description }) => {
    const total = useMemo(
      () => slices.reduce((sum, slice) => sum + slice.value, 0) || 1,
      [slices]
    );

    // SVG Geometry constants
    const R = 85; // Outer radius
    const r = 60; // Inner radius (donut hole)
    const cx = 94; // Center X
    const cy = 94; // Center Y

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

          return {
            d: pathData,
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
        <div className="chart-card-heading">
          <h4 className="chart-card-title">{title}</h4>
          {description && (
            <p className="chart-card-description">{description}</p>
          )}
        </div>

        <div className="chart-body">
          <div className="donut-wrapper">
            <div className="donut-svg-container">
              <svg className="donut-svg" viewBox="0 0 188 188">
                {/* Background Track */}
                <circle className="donut-bg" cx={cx} cy={cy} r={(R + r) / 2} />

                {paths.map((p, i) => (
                  <path
                    key={i}
                    className="donut-slice"
                    d={p?.d}
                    fill={p?.color}
                  >
                    <title>
                      {p?.label}: {p?.formattedValue}
                    </title>
                  </path>
                ))}
              </svg>

              {(centerLabel || centerValue) && (
                <div className="donut-center-content">
                  <span className="donut-center-label">{centerLabel}</span>
                  {centerValue && (
                    <span className="donut-center-value">{centerValue}</span>
                  )}
                </div>
              )}
            </div>

            <div className="donut-legend">
              {slices.map((slice, i) => (
                <div key={i} className="donut-legend-item">
                  <div
                    className="donut-legend-dot"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="donut-legend-label">{slice.label}</span>
                  <span className="donut-legend-value">
                    {((slice.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';
