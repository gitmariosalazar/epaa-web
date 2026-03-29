import React from 'react';

// Helper to convert hex to rgb for rgba() transparency support
export function hexToRgb(hex: string) {
  // Extract RGB safely
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}

export interface CustomTooltipProps<T> {
  active?: boolean;
  payload?: any[];
  label?: string;
  tooltipFormatterOrComponent?: (
    payload: T
  ) => React.ReactNode | [string, string] | string;
  dataArray?: T[];
  dataKeyX?: string;
  activePalette?: string[];
}

export function CustomTooltip<T>({
  active,
  payload,
  label,
  tooltipFormatterOrComponent,
  dataArray,
  dataKeyX,
  activePalette
}: CustomTooltipProps<T>) {
  if (active && payload && payload.length) {
    const data = payload[0];

    // Attempt to find actual color by matching the X-axis label to the data array index
    // Useful for BarCharts where <Cell> colors are injected dynamically.
    let color = data.fill || data.color || data.payload?.fill || '#3b82f6';
    if (dataArray && activePalette && activePalette.length && dataKeyX) {
      const idx = dataArray.findIndex((d: any) => d[dataKeyX] === label);
      if (idx !== -1) {
        color = activePalette[idx % activePalette.length];
      }
    }

    const formatted = tooltipFormatterOrComponent
      ? tooltipFormatterOrComponent(data.payload as T)
      : data.value;

    if (React.isValidElement(formatted)) {
      return (
        <div
          style={{
            background: `rgba(${hexToRgb(color)}, 0.15)`,
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-md)',
            border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
            position: 'relative',
            pointerEvents: 'none',
            backdropFilter: 'blur(12px)',
            zIndex: 1000
          }}
          className="dynamic-custom-tooltip-content"
        >
          {formatted}
        </div>
      );
    }

    const formattedLabel = Array.isArray(formatted)
      ? formatted[0]
      : typeof formatted === 'object'
        ? formatted[0]
        : formatted;
    const itemName = Array.isArray(formatted)
      ? formatted[1]
      : typeof formatted === 'object'
        ? formatted[1]
        : data.name;

    return (
      <div
        style={{
          background: `rgba(${hexToRgb(color)}, 0.15)` /* Highly transparent subtle tint */,
          borderRadius: '10px',
          padding: '12px 16px',
          color:
            'var(--text-main)' /* Adapt to light/dark mode since background is mostly transparent */,
          boxShadow: 'var(--shadow-md)',
          border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
          position: 'relative',
          pointerEvents: 'none',
          backdropFilter:
            'blur(12px)' /* Strong glassmorphism to compensate for high transparency */,
          zIndex: 1000
        }}
        className="dynamic-custom-tooltip-content"
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            opacity: 0.9,
            fontWeight: 500
          }}
        >
          {label || itemName}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 700 }}>
          {label ? `${itemName}: ${formattedLabel}` : formattedLabel}
        </p>
      </div>
    );
  }
  return null;
}
