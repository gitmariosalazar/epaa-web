/* src/shared/presentation/components/Charts/VerticalBarChart.tsx */
import React, { memo } from 'react';
import { chartColorService } from '@/shared/presentation/utils/colors/ChartColorManager';
import type { ChartColor } from '@/shared/presentation/utils/colors/charts.colors';
import './Charts.css';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { Button } from '../Button/Button';
import { Download } from 'lucide-react';

export interface BarItem {
  label: string;
  value: number;
  color: ChartColor | string;
  name: string;
  fmt?: (v: number) => string;
}

interface VerticalBarChartProps {
  title: string;
  items: BarItem[];
  description?: string;
  icon?: React.ReactNode;
  label?: string;
  value?: string;
  onExport?: () => void;
  exportable?: boolean;
}

/**
 * A professional Vertical Bar Chart component.
 * Features dynamic scaling, micro-animations, and clean data labels.
 */
export const VerticalBarChart: React.FC<VerticalBarChartProps> = memo(
  ({ title, items, description, icon, label, value, onExport, exportable }) => {
    const max = Math.max(...items.map((i) => i.value), 1);

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
          <div className="v-bar-chart">
            {items.map(({ label, value, color, fmt }, idx) => {
              const resolvedColor = chartColorService.getColorByName(color);
              const { gradient } = chartColorService.getDefinition(color);

              return (
                <Tooltip
                  key={idx}
                  className="v-bar-item"
                  content={fmt ? fmt(value) : value.toLocaleString()}
                  position="top"
                  followCursor={true}
                  themeColor={color}
                >
                  <div className="v-bar-track">
                    <div
                      className={`v-bar-fill v-bar-fill--${color}`}
                      style={{
                        height: `${(value / max) * 100}%`,
                        backgroundColor: resolvedColor,
                        background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})`,
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
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

VerticalBarChart.displayName = 'VerticalBarChart';
