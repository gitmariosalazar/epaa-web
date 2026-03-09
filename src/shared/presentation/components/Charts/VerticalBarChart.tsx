/* src/shared/presentation/components/Charts/VerticalBarChart.tsx */
import React, { memo } from 'react';
import './Charts.css';

export interface BarItem {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  fmt?: (v: number) => string;
}

interface VerticalBarChartProps {
  title: string;
  items: BarItem[];
  description?: string;
}

/**
 * A professional Vertical Bar Chart component.
 * Features dynamic scaling, micro-animations, and clean data labels.
 */
export const VerticalBarChart: React.FC<VerticalBarChartProps> = memo(
  ({ title, items, description }) => {
    const max = Math.max(...items.map((i) => i.value), 1);

    return (
      <div className="chart-card">
        <div className="chart-card-heading">
          <h4 className="chart-card-title">{title}</h4>
          {description && (
            <p className="chart-card-description">{description}</p>
          )}
        </div>

        <div className="chart-body">
          <div className="v-bar-chart">
            {items.map(({ label, value, color, fmt }, idx) => (
              <div className="v-bar-item" key={idx}>
                <div className="v-bar-track">
                  <div
                    className={`v-bar-fill v-bar-fill--${color}`}
                    style={{
                      height: `${(value / max) * 100}%`,
                      animationDelay: `${idx * 0.1}s`
                    }}
                  >
                    <div className="v-bar-value">
                      {fmt ? fmt(value) : value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="v-bar-label" title={label}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

VerticalBarChart.displayName = 'VerticalBarChart';
