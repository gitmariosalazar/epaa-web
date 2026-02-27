import React, { useId } from 'react';
import '../../styles/CircularProgress.css';

// ── Types ────────────────────────────────────────────────────────────────────
export interface CircularProgressProps {
  /** 0–100. Omit for indeterminate (spin) mode. */
  progress?: number;
  /** Diameter in px. Default 100. */
  size?: number;
  /** Ring thickness in px. Default 9. */
  strokeWidth?: number;
  /** Text below the percentage. */
  label?: string;
  /** Show the numeric percentage in the center. Default true. */
  showPercentage?: boolean;
  className?: string;
}

// ── Gradient stops keyed to progress ─────────────────────────────────────────
function resolveGradient(p: number): [string, string] {
  if (p < 30) return ['#6366f1', '#818cf8']; // indigo → violet
  if (p < 60) return ['#8b5cf6', '#06b6d4']; // purple → cyan
  if (p < 85) return ['#06b6d4', '#10b981']; // cyan → emerald
  return ['#10b981', '#34d399']; // emerald → light green
}

// ── Component ─────────────────────────────────────────────────────────────────
export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 9,
  label,
  showPercentage = true,
  className = ''
}) => {
  const uid = useId().replace(/:/g, 'x');
  const isIndeterminate = progress === undefined;
  const clamped = Math.min(100, Math.max(0, progress ?? 0));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = isIndeterminate
    ? circumference * 0.75
    : circumference - (clamped / 100) * circumference;

  const [colorA, colorB] = resolveGradient(clamped);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className={`cp-root ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* ── SVG ring ── */}
      <svg
        width={size}
        height={size}
        className={isIndeterminate ? 'cp-svg cp-svg--spin' : 'cp-svg'}
        style={{ filter: 'drop-shadow(0 0 6px var(--cp-glow, #6366f140))' }}
      >
        <defs>
          <linearGradient id={`cpg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>

          {/* Subtle glowing track using a radial gradient */}
          <radialGradient id={`cpt-${uid}`} cx="50%" cy="50%" r="50%">
            <stop
              offset="60%"
              stopColor="var(--border-color)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--border-color)"
              stopOpacity="0.3"
            />
          </radialGradient>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#cpt-${uid})`}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#cpg-${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="cp-arc"
        />
      </svg>

      {/* ── Center text ── */}
      <div className="cp-center">
        {showPercentage && !isIndeterminate && (
          <span className="cp-pct" style={{ color: colorB }}>
            {Math.round(clamped)}
            <span className="cp-pct-symbol">%</span>
          </span>
        )}
        {isIndeterminate && (
          <span className="cp-dots">
            <span />
            <span />
            <span />
          </span>
        )}
        {label && <span className="cp-label">{label}</span>}
      </div>
    </div>
  );
};
