import React, { useState, useMemo, useRef } from 'react';
import { chartColorService } from '../../utils/colors/ChartColorManager';
import './Professional3DPieChart.css';
import '../Charts/Charts.css';
import { Tooltip } from '../common/Tooltip/Tooltip';

export interface PieData {
  name: string;
  value: number;
  color: string;
  label?: string;
  fmt?: (val: number) => string;
}

interface Professional3DPieChartProps {
  data: PieData[];
  height?: number | string;
  showIndicators?: boolean;
}

const RX = 800;
const RY = 520;
const DEPTH = 60;
const CX = 1000;
const CY = 750;
const GAP = 15;
const ACTIVE_OFFSET = 60;

const resolveColor = (c: string) => chartColorService.getColorByName(c);

export const Professional3DPieChart: React.FC<Professional3DPieChartProps> = ({
  data,
  showIndicators = false
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const realTotal = data.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = realTotal === 0;
  const total = isEmpty ? 1 : realTotal;

  const processedData = useMemo(() => {
    let cumulativePercent = 0;
    return data.map((d, i) => {
      const percent = d.value / total;
      const startAngle = cumulativePercent * 360;
      const endAngle = (cumulativePercent + percent) * 360;
      const midAngle = startAngle + (percent * 360) / 2;
      const rad = (midAngle - 90) * (Math.PI / 180);
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);

      const resolvedColor = resolveColor(d.color);

      const result = {
        ...d,
        rawColor: d.color,
        resolvedColor,
        originalIndex: i,
        startAngle,
        endAngle,
        midAngle,
        dx,
        dy,
        depth: dy
      };
      cumulativePercent += percent;
      return result;
    });
  }, [data, total]);

  const sortedSlices = useMemo(() => {
    const base = [...processedData].sort((a, b) => a.depth - b.depth);
    if (activeIndex === -1) return base;

    // Move active slice to the very end so it's drawn on top of everyone
    const activeSlice = base.find((s) => s.originalIndex === activeIndex);
    if (!activeSlice) return base;

    return [
      ...base.filter((s) => s.originalIndex !== activeIndex),
      activeSlice
    ];
  }, [processedData, activeIndex]);

  const getArcPath = (
    start: number,
    end: number,
    rx: number,
    ry: number,
    cx: number,
    cy: number
  ) => {
    if (end - start >= 359.9) {
      return `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry} Z`;
    }
    const s = (start - 90) * (Math.PI / 180);
    const e = (end - 90) * (Math.PI / 180);
    const x1 = cx + rx * Math.cos(s);
    const y1 = cy + ry * Math.sin(s);
    const x2 = cx + rx * Math.cos(e);
    const y2 = cy + ry * Math.sin(e);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${rx} ${ry} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getSlicesGeometry = (
    start: number,
    end: number,
    rx: number,
    ry: number,
    cx: number,
    cy: number,
    depth: number
  ) => {
    const isFull = end - start >= 359.9;

    if (isFull) {
      return {
        top: `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry} Z`,
        outer: `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy + ry} L ${cx} ${cy + ry + depth} A ${rx} ${ry} 0 1 0 ${cx} ${cy - ry + depth} Z M ${cx} ${cy + ry} A ${rx} ${ry} 0 1 1 ${cx} ${cy - ry} L ${cx} ${cy - ry + depth} A ${rx} ${ry} 0 1 0 ${cx} ${cy + ry + depth} Z`,
        inner1: '',
        inner2: ''
      };
    }

    const s = (start - 90) * (Math.PI / 180);
    const e = (end - 90) * (Math.PI / 180);
    const x1 = cx + rx * Math.cos(s);
    const y1 = cy + ry * Math.sin(s);
    const x2 = cx + rx * Math.cos(e);
    const y2 = cy + ry * Math.sin(e);
    const largeArc = end - start > 180 ? 1 : 0;

    return {
      top: `M ${cx} ${cy} L ${x1} ${y1} A ${rx} ${ry} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      outer: `M ${x1} ${y1} A ${rx} ${ry} 0 ${largeArc} 1 ${x2} ${y2} L ${x2} ${y2 + depth} A ${rx} ${ry} 0 ${largeArc} 0 ${x1} ${y1 + depth} Z`,
      inner1: `M ${cx} ${cy} L ${x1} ${y1} L ${x1} ${y1 + depth} L ${cx} ${cy + depth} Z`,
      inner2: `M ${cx} ${cy} L ${x2} ${y2} L ${x2} ${y2 + depth} L ${cx} ${cy + depth} Z`
    };
  };

  return (
    <div
      className="pro-3d-pie-container"
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'auto',
        padding: '10px 0'
      }}
    >
      <div
        className="donut-wrapper"
        style={{
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: '10px' // Minimal gap
        }}
      >
        <div
          className="pro-3d-pie-svg-wrapper"
          style={{
            flex: '5 1 1500px', // Maximum dominance for the chart
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <svg
            viewBox="0 0 2000 1500"
            className="pro-3d-pie-svg"
            style={{ overflow: 'visible', width: '100%', height: 'auto' }}
          >
            <defs>
              {processedData.map((d, i) => (
                <linearGradient
                  key={`grad-${i}`}
                  id={`grad-3d-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={d.resolvedColor} />
                  <stop
                    offset="100%"
                    stopColor={chartColorService.getShadedColor(
                      d.resolvedColor,
                      -20
                    )}
                  />
                </linearGradient>
              ))}
            </defs>

            <g>
              {/* Ghost border base when empty */}
              {isEmpty && (
                <g style={{ opacity: 0.8 }}>
                  <path
                    d={getSlicesGeometry(0, 359.9, RX, RY, CX, CY, DEPTH).outer}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="2"
                  />
                  <path
                    d={getSlicesGeometry(0, 359.9, RX, RY, CX, CY, DEPTH).top}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Data Slices */}
              {!isEmpty &&
                sortedSlices.map((d) => {
                  if (d.value === 0) return null;

                  const isActive = activeIndex === d.originalIndex;
                  const offset = GAP + (isActive ? ACTIVE_OFFSET : 0);

                  const tx = d.dx * offset;
                  const ty = d.dy * offset * (RY / RX);
                  const lift = isActive ? -15 : 0;

                  const activeDepth = isActive ? DEPTH * 3 : DEPTH;
                  const geo = getSlicesGeometry(
                    d.startAngle,
                    d.endAngle,
                    RX,
                    RY,
                    CX,
                    CY,
                    activeDepth
                  );

                  return (
                    <g
                      key={`slice-group-${d.originalIndex}`}
                      className={isActive ? 'is-active-slice' : ''}
                      style={
                        {
                          transition:
                            'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          transform: `translate(${tx}px, ${ty + lift}px)`,
                          zIndex: isActive ? 100 : d.originalIndex,
                          position: 'relative',
                          pointerEvents: 'none',
                          '--tx': `${tx}px`,
                          '--ty': `${ty}px`,
                          '--lift': `${lift}px`
                        } as any
                      }
                    >
                      {geo.inner1 && (
                        <path
                          d={geo.inner1}
                          fill={chartColorService.getShadedColor(
                            d.resolvedColor,
                            -20
                          )}
                          stroke={chartColorService.getShadedColor(
                            d.resolvedColor,
                            -30
                          )}
                          strokeWidth="0.8"
                          opacity={1}
                        />
                      )}
                      {geo.inner2 && (
                        <path
                          d={geo.inner2}
                          fill={chartColorService.getShadedColor(
                            d.resolvedColor,
                            -30
                          )}
                          stroke={chartColorService.getShadedColor(
                            d.resolvedColor,
                            -40
                          )}
                          strokeWidth="0.8"
                          opacity={1}
                        />
                      )}
                      <path
                        d={geo.outer}
                        fill={chartColorService.getShadedColor(
                          d.resolvedColor,
                          -15
                        )}
                        stroke={chartColorService.getShadedColor(
                          d.resolvedColor,
                          -30
                        )}
                        strokeWidth="0.8"
                        opacity={1}
                      />
                      <path
                        d={geo.top}
                        fill={`url(#grad-3d-${d.originalIndex})`}
                        stroke={chartColorService.getShadedColor(
                          d.resolvedColor,
                          15
                        )}
                        strokeWidth="1.2"
                        opacity={1}
                      />
                    </g>
                  );
                })}
            </g>

            {/* Invisible Hover Layer */}
            {!isEmpty &&
              processedData.map((d, i) => {
                const isActive = activeIndex === i;
                const offset = GAP + (isActive ? ACTIVE_OFFSET : 0);
                const tx = d.dx * offset;
                const ty = d.dy * offset * (RY / RX);
                const lift = isActive ? -15 : 0;
                const formattedValue = d.fmt
                  ? d.fmt(d.value)
                  : d.value.toLocaleString();

                return (
                  <Tooltip
                    key={`hover-tooltip-${i}`}
                    as="g"
                    content={`${d.name}: ${formattedValue}`}
                    position="top"
                    followCursor={true}
                    themeColor={d.color}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(-1)}
                  >
                    <path
                      d={getArcPath(d.startAngle, d.endAngle, RX, RY, CX, CY)}
                      fill="transparent"
                      style={{
                        cursor: 'pointer',
                        transform: `translate(${tx}px, ${ty + lift}px)`,
                        transition:
                          'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        pointerEvents: 'auto'
                      }}
                    />
                  </Tooltip>
                );
              })}

            {/* Labels and Lines (Callouts) - DRAWN ONLY IF showIndicators IS TRUE */}
            {showIndicators &&
              !isEmpty &&
              (() => {
                const labels = processedData
                  .filter((d) => d.value > 0)
                  .map((d, i) => {
                    const rad = (d.midAngle - 90) * (Math.PI / 180);
                    const x0 = CX + RX * Math.cos(rad);
                    // Start from the correct edge (top for top, bottom for bottom)
                    const y0 =
                      CY + RY * Math.sin(rad) + (Math.sin(rad) > 0 ? DEPTH : 0);

                    // Direct 100px straight projection base
                    const x1 = CX + (RX + 100) * Math.cos(rad);
                    const y1 =
                      CY +
                      (RY + 100) * Math.sin(rad) +
                      (Math.sin(rad) > 0 ? DEPTH : 0);

                    const isRight = d.dx > 0;
                    return {
                      ...d,
                      x0,
                      y0,
                      x1,
                      y1,
                      isRight,
                      originalY: y1,
                      currentY: y1,
                      index: i
                    };
                  });

                // Collision Avoidance Algorithm
                const adjustLabels = (list: typeof labels) => {
                  if (list.length === 0) return list;
                  list.sort((a, b) => a.originalY - b.originalY);

                  const minGap = 100; // Massive gap for massive charts and fonts
                  for (let i = 1; i < list.length; i++) {
                    if (list[i].currentY < list[i - 1].currentY + minGap) {
                      list[i].currentY = list[i - 1].currentY + minGap;
                    }
                  }

                  const maxBottom = 385;
                  if (list[list.length - 1].currentY > maxBottom) {
                    list[list.length - 1].currentY = maxBottom;
                    for (let i = list.length - 2; i >= 0; i--) {
                      if (list[i].currentY > list[i + 1].currentY - minGap) {
                        list[i].currentY = list[i + 1].currentY - minGap;
                      }
                    }
                  }
                  return list;
                };

                const rightLabels = adjustLabels(
                  labels.filter((l) => l.isRight)
                );
                const leftLabels = adjustLabels(
                  labels.filter((l) => !l.isRight)
                );
                const allAdjustedLabels = [...rightLabels, ...leftLabels];

                return allAdjustedLabels.map((l) => {
                  const isActive = activeIndex === l.originalIndex;
                  const offset = GAP + (isActive ? ACTIVE_OFFSET : 0);
                  const tx = l.dx * offset;
                  const ty = l.dy * offset * (RY / RX);
                  const lift = isActive ? -15 : 0;

                  // Dynamic horizontal extension (elbow)
                  const x2 = l.x1 + (l.isRight ? 30 : -30);
                  const y2 = l.currentY;
                  const pct = ((l.value / total) * 100).toFixed(1);

                  return (
                    <g
                      key={`label-group-${l.index}`}
                      style={{
                        transition:
                          'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        // Add extra 30px only to the active label to clear the 3D volume
                        transform: `translate(${tx + (isActive ? l.dx * 30 : 0)}px, ${ty + lift + (isActive ? l.dy * 30 * (RY / RX) : 0)}px)`,
                        opacity: activeIndex === -1 || isActive ? 1 : 0.3,
                        zIndex: isActive ? 1000 : 1,
                        pointerEvents: 'none'
                      }}
                    >
                      {/* Main projection line */}
                      <line
                        x1={l.x0}
                        y1={l.y0}
                        x2={l.x1}
                        y2={l.y1}
                        stroke={l.resolvedColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                      {/* Professional Underline (Using x2, y2) */}
                      <line
                        x1={l.x1}
                        y1={l.y1}
                        x2={x2}
                        y2={y2}
                        stroke={l.resolvedColor}
                        strokeWidth="2"
                        strokeOpacity="0.8"
                      />
                      {/* Percentage - Large */}
                      <text
                        x={l.x1 + (l.isRight ? 20 : -20)}
                        y={l.y1 - 10}
                        textAnchor={l.isRight ? 'start' : 'end'}
                        fill={l.resolvedColor}
                        style={{
                          fontSize: '40px',
                          fontWeight: '900',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      >
                        {pct}%
                      </text>
                      {/* Name - Small below */}
                      <text
                        x={l.x1 + (l.isRight ? 15 : -15)}
                        y={l.y1 + 35}
                        textAnchor={l.isRight ? 'start' : 'end'}
                        fill={l.resolvedColor}
                        style={{
                          fontSize: '35px',
                          fontWeight: '600',
                          fontFamily: 'Outfit, sans-serif',
                          opacity: 0.9
                        }}
                      >
                        {l.name}
                      </text>
                    </g>
                  );
                });
              })()}
          </svg>
        </div>

        {/* Legend */}
        <div
          className="donut-legend"
          style={{
            flex: '1 1 200px', // Even narrower legend
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '50px',
            padding: '10px',
            marginLeft: '40px',
            marginRight: '40px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}
        >
          {[0, 1].map((colIndex) => {
            const half = Math.ceil(processedData.length / 2);
            const columnData =
              colIndex === 0
                ? processedData.slice(0, half)
                : processedData.slice(half);

            if (columnData.length === 0) return null;

            return (
              <div key={colIndex} className="legend-column">
                <div className="donut-legend-header">
                  <div className="donut-legend-header-spacer" />
                  <span className="donut-legend-header-label">Descripción</span>
                  <span className="donut-legend-header-value">Porcentaje</span>
                  <span className="donut-legend-header-amount">Monto</span>
                </div>
                {columnData.map((d, i) => {
                  const isActive = activeIndex === d.originalIndex;
                  const pct = ((d.value / total) * 100).toFixed(1);
                  return (
                    <div
                      key={i}
                      className={`donut-legend-item ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveIndex(d.originalIndex)}
                      onMouseLeave={() => setActiveIndex(-1)}
                    >
                      <div
                        className="donut-legend-dot"
                        style={{ backgroundColor: d.resolvedColor }}
                      />
                      <span className="donut-legend-label">{d.name}</span>
                      <span className="donut-legend-value">
                        {isEmpty ? '0.0%' : pct}%
                      </span>
                      <span
                        className="donut-legend-amount"
                        style={{ color: d.resolvedColor }}
                      >
                        {d.fmt ? d.fmt(d.value) : d.value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
