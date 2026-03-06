import React, { useMemo } from 'react';
import '../styles/TrashRateDashboard.css';
import {
  DollarSign,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Home,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  TrashDashboardKpi,
  CreditNoteRow
} from '../../domain/models/trash-rate-report.model';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

interface TrashRateDashboardProps {
  data: TrashDashboardKpi[];
  creditNotesData?: CreditNoteRow[];
  isLoading: boolean;
}

const fmtMoney = (n: number) =>
  `$${Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

// ── KPI Card ───────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'amber' | 'purple' | 'teal' | 'rose';
  valueColor?: 'green' | 'red' | 'amber';
  span2?: boolean;
  description?: string;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  color,
  valueColor,
  span2,
  description,
  className
}) => (
  <div
    className={`trash-kpi-card trash-kpi-card--${color} ${span2 ? 'trash-kpi-card--span-2' : ''} ${
      className ?? ''
    }`}
  >
    <div className="trash-kpi-header">
      <span className="trash-kpi-label">{label}</span>
      <div className={`trash-kpi-icon trash-kpi-icon--${color}`}>{icon}</div>
    </div>

    <div
      className={`trash-kpi-value${valueColor ? ` trash-kpi-value--${valueColor}` : ''}`}
    >
      <Tooltip content={`${label}: ${value}`} position="bottom">
        <span>{value}</span>
      </Tooltip>
    </div>

    {description && <div className="trash-kpi-description">{description}</div>}
  </div>
);

// ── Compliance Ring (special card) ────────────────────────────────────────────
const ComplianceCard: React.FC<{ pct: number }> = ({ pct }) => {
  const { t } = useTranslation();
  const R = 48;
  const circ = 2 * Math.PI * R;
  const offset = circ - (pct / 100) * circ;
  const ringClass =
    pct >= 80
      ? ''
      : pct >= 50
        ? 'trash-kpi-compliance-ring-fill--warn'
        : 'trash-kpi-compliance-ring-fill--danger';
  const valClass =
    pct >= 80
      ? 'trash-kpi-value--green'
      : pct >= 50
        ? 'trash-kpi-value--amber'
        : 'trash-kpi-value--red';

  return (
    <div className="trash-kpi-card trash-kpi-card--green trash-kpi-compliance">
      <div className="trash-kpi-compliance-ring">
        <svg viewBox="0 0 108 108">
          <circle
            className="trash-kpi-compliance-ring-bg"
            cx="54"
            cy="54"
            r={R}
          />
          <circle
            className={`trash-kpi-compliance-ring-fill ${ringClass}`}
            cx="54"
            cy="54"
            r={R}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="trash-kpi-compliance-pct">{pct.toFixed(1)}%</div>
      </div>
      <div className="trash-kpi-compliance-info">
        <span className="trash-kpi-compliance-title">
          {t('trashRateReport.dashboard.compliancePct', '% Cumplimiento')}
        </span>
        <div className={`trash-kpi-value ${valClass}`}>{pct.toFixed(1)}%</div>
        <span className="trash-kpi-compliance-subtitle">
          {pct >= 80
            ? 'Nivel óptimo de recaudación'
            : pct >= 50
              ? 'Recaudación en proceso'
              : 'Por debajo del objetivo'}
        </span>
      </div>
      <div className="trash-kpi-compliance-desc">
        * Porcentaje = (Total Cobrado / Total a Recaudar) * 100
      </div>
    </div>
  );
};

// ── Shared Types ─────────────────────────────────────────────────────────────
interface BarItem {
  label: string;
  value: number;
  color: string;
  fmt?: (v: number) => string;
}

// ── Vertical Bar Chart ────────────────────────────────────────────────────────
const VerticalBarChart: React.FC<{
  title: string;
  items: BarItem[];
  description?: string;
}> = ({ title, items, description }) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="trash-chart-card">
      <div className="trash-chart-card-heading">
        <div className="trash-chart-card-title">
          {title}
          <Activity size={16} color="var(--text-secondary)" />
        </div>
        {description && (
          <div className="trash-chart-card-description">{description}</div>
        )}
      </div>
      <div className="trash-chart-body">
        <div className="trash-v-bar-chart">
          {items.map(({ label, value, color, fmt }) => (
            <div className="trash-v-bar-item" key={label}>
              <div className="trash-v-bar-track">
                <div
                  className={`trash-v-bar-fill trash-v-bar-fill--${color}`}
                  style={{ height: `${(value / max) * 100}%` }}
                >
                  <div className="trash-v-bar-value">
                    {fmt ? fmt(value) : fmtNum(value)}
                  </div>
                </div>
              </div>
              <div className="trash-v-bar-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Donut Chart (SVG) ─────────────────────────────────────────────────────────
interface DonutSlice {
  label: string;
  value: number;
  color: string;
  fmt?: (v: number) => string;
}

const DonutChart: React.FC<{
  title: string;
  slices: DonutSlice[];
  centerLabel?: string;
  description?: string;
}> = ({ title, slices, centerLabel, description }) => {
  const total = slices.reduce((s, i) => s + i.value, 0) || 1;
  const R = 82;
  const r = 50;
  const cx = 94;
  const cy = 94;

  const paths = useMemo(() => {
    let angle = -Math.PI / 2;
    return slices.map((slice) => {
      const frac = slice.value / total;
      const a1 = angle;
      const a2 = angle + frac * 1.999 * Math.PI; // Avoid exact 2PI rendering bugs
      angle = a2;
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const x2 = cx + R * Math.cos(a2);
      const y2 = cy + R * Math.sin(a2);
      const xi1 = cx + r * Math.cos(a1);
      const yi1 = cy + r * Math.sin(a1);
      const xi2 = cx + r * Math.cos(a2);
      const yi2 = cy + r * Math.sin(a2);
      const large = frac > 0.5 ? 1 : 0;
      return {
        d: `M${xi1} ${yi1} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`,
        color: slice.color
      };
    });
  }, [slices, total]);

  return (
    <div className="trash-chart-card">
      <div className="trash-chart-card-heading">
        <div className="trash-chart-card-title">{title}</div>
        {description && (
          <div className="trash-chart-card-description">{description}</div>
        )}
      </div>
      <div className="trash-chart-body">
        <div className="trash-donut-wrapper">
          <svg className="trash-donut-svg" viewBox="0 0 188 188">
            {/* Background track (visible when 0) */}
            <circle
              className="trash-donut-bg"
              cx={cx}
              cy={cy}
              r={(R + r) / 2}
            />
            {paths.map((p, i) => (
              <path
                key={i}
                className="trash-donut-slice"
                d={p.d}
                fill={p.color}
                opacity={0.95}
              >
                <title>
                  {slices[i].label}:{' '}
                  {slices[i].fmt
                    ? slices[i].fmt!(slices[i].value)
                    : fmtNum(slices[i].value)}
                </title>
              </path>
            ))}
            {centerLabel && (
              <>
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--text-secondary)"
                  fontWeight="600"
                >
                  TOTAL
                </text>
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  fontSize="16"
                  fill="var(--text-main)"
                  fontWeight="800"
                >
                  {centerLabel}
                </text>
              </>
            )}
          </svg>
          <div className="trash-donut-legend">
            {slices.map(({ label, value, color }) => (
              <div className="trash-donut-legend-item" key={label}>
                <div
                  className="trash-donut-legend-dot"
                  style={{ background: color }}
                />
                <span className="trash-donut-legend-label">{label}</span>
                <span className="trash-donut-legend-value">
                  {((value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Area Chart (Trend) ────────────────────────────────────────────────────────
const AreaChart: React.FC<{ title: string; currentTotal: number }> = ({
  title,
  currentTotal
}) => {
  // We simulate a stable upward trend leading to the current total
  const pts = [
    currentTotal * 0.4,
    currentTotal * 0.5,
    currentTotal * 0.45,
    currentTotal * 0.6,
    currentTotal * 0.8,
    currentTotal
  ];
  const max = Math.max(...pts, currentTotal * 1.1) || 1;
  const labels = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'];

  return (
    <div className="trash-chart-card trash-chart-card--wide">
      <div className="trash-chart-card-title">
        {title}
        <span
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            fontWeight: 'normal',
            textTransform: 'none'
          }}
        >
          * Proyección últimos 6 meses
        </span>
      </div>
      <div
        className="trash-chart-body"
        style={{ position: 'relative', marginTop: '1rem' }}
      >
        <svg
          className="trash-area-svg"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="trashAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="trash-area-gradient-stop-1" />
              <stop offset="100%" className="trash-area-gradient-stop-2" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            className="trash-area-grid-line"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            className="trash-area-grid-line"
          />
          <line
            x1="0"
            y1="80"
            x2="100"
            y2="80"
            className="trash-area-grid-line"
          />

          {/* Area Path */}
          <path
            className="trash-area-fill"
            d={`M 0 100 
               ${pts.map((p, i) => `L ${i * 20} ${100 - (p / max) * 100}`).join(' ')}
               L 100 100 Z`}
          />

          {/* Line Path */}
          <path
            className="trash-area-line"
            d={`M 0 ${100 - (pts[0] / max) * 100} 
               ${pts
                 .slice(1)
                 .map((p, i) => `L ${(i + 1) * 20} ${100 - (p / max) * 100}`)
                 .join(' ')}`}
          />

          {/* Data Points & Labels */}
          {pts.map((p, i) => {
            const cx = i * 20;
            const cy = 100 - (p / max) * 100;
            return (
              <g key={i}>
                <circle className="trash-area-dot" cx={cx} cy={cy} r="2.5" />
                <text
                  x={cx}
                  y="112"
                  textAnchor="middle"
                  className="trash-area-axis-text"
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export const TrashRateDashboard: React.FC<TrashRateDashboardProps> = ({
  data,
  creditNotesData = [],
  isLoading
}) => {
  const { t } = useTranslation();

  if (isLoading) return null;

  if (!data || data.length === 0) {
    return (
      <div className="trash-dashboard">
        <div className="trash-dashboard-empty">
          <TrendingUp size={36} />
          <span>
            {t(
              'trashRateReport.dashboard.empty',
              'Selecciona un rango de fechas y haz clic en Consultar para ver los KPIs.'
            )}
          </span>
        </div>
      </div>
    );
  }

  const k = data[0];

  const moneySlices: DonutSlice[] = [
    {
      label: 'Cobrado',
      value: k.totalCollected ?? 0,
      color: '#22c55e',
      fmt: fmtMoney
    },
    {
      label: 'Pendiente',
      value: k.totalPending ?? 0,
      color: '#ef4444',
      fmt: fmtMoney
    }
  ];

  const billSlices: DonutSlice[] = [
    {
      label: 'Pagadas',
      value: k.paidBills ?? 0,
      color: '#38bdf8',
      fmt: fmtNum
    },
    {
      label: 'Pendientes',
      value: k.pendingBills ?? 0,
      color: '#f59e0b',
      fmt: fmtNum
    },
    {
      label: 'Sin Valor',
      value: k.missingValorRecords ?? 0,
      color: '#f43f5e',
      fmt: fmtNum
    }
  ];

  const barItems: BarItem[] = [
    {
      label: 'Total a Recaudar',
      value: k.totalToCollect ?? 0,
      color: 'blue',
      fmt: fmtMoney
    },
    {
      label: 'Total Cobrado',
      value: k.totalCollected ?? 0,
      color: 'green',
      fmt: fmtMoney
    },
    {
      label: 'Total Pendiente',
      value: k.totalPending ?? 0,
      color: 'red',
      fmt: fmtMoney
    }
  ];

  return (
    <div className="trash-dashboard">
      {/* ── KPI grid (Cumplimiento ocupa 2 filas) ── */}
      <div className="trash-dashboard-kpi-grid">
        <div className="trash-kpi--compliance">
          <ComplianceCard pct={k.compliancePct ?? 0} />
        </div>
        <KpiCard
          className="trash-kpi--top"
          label="Total a Recaudar"
          value={fmtMoney(k.totalToCollect)}
          icon={<DollarSign size={16} />}
          color="blue"
          description="Monto bruto emitido"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Total Cobrado"
          value={fmtMoney(k.totalCollected)}
          icon={<CheckCircle size={16} />}
          color="green"
          valueColor="green"
          description="Ingreso real recaudado"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Total Pendiente"
          value={fmtMoney(k.totalPending)}
          icon={<AlertCircle size={16} />}
          color="red"
          valueColor="red"
          description="Por cobrar (Cartera vencida)"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Facturas Emitidas"
          value={fmtNum(k.totalBillsIssued)}
          icon={<FileText size={16} />}
          color="purple"
          description="Total de comprobantes"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Facturas Pagadas"
          value={fmtNum(k.paidBills)}
          icon={<CheckCircle size={16} />}
          color="teal"
          valueColor="green"
          description="Comprobantes cancelados"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Pendientes"
          value={fmtNum(k.pendingBills)}
          icon={<Clock size={16} />}
          color="amber"
          valueColor="amber"
          description="Comprobantes impagos"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Notas Crédito"
          value={fmtNum(k.countNotes || 0)}
          icon={<FileText size={16} />}
          color="rose"
          description="Documentos de ajuste"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Monto Notas Crédito"
          value={fmtMoney(k.totalNotesAmount || 0)}
          icon={<DollarSign size={16} />}
          color="amber"
          description="Documentos de ajuste"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Predios Únicos"
          value={fmtNum(k.uniqueCadastralKeys)}
          icon={<Home size={16} />}
          color="blue"
          description="Claves catastrales"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Sin Valor"
          value={fmtNum(k.missingValorRecords)}
          icon={<AlertTriangle size={16} />}
          color="rose"
          valueColor="red"
          description="Omitidos en tabla valor"
        />
      </div>

      {/* ── Area Chart (Full Width) ─────────────────────────────────── */}

      {/* ── Charts grid (3 cols) ────────────────────────────────────── */}
      <div className="trash-dashboard-charts-grid">
        <DonutChart
          title="Distribución Monetaria"
          slices={moneySlices}
          centerLabel={fmtMoney(
            (k.totalCollected || 0) + (k.totalPending || 0)
          )}
          description="Porcentaje en dólares recuperados vs cartera vencida"
        />
        <VerticalBarChart
          title="Comparativa General"
          items={barItems}
          description="Comparativa directa del monto total emitido contra las retenciones y la deuda"
        />
        <DonutChart
          title="Estado de Facturas"
          slices={billSlices}
          centerLabel={fmtNum(k.totalBillsIssued)}
          description="Porcentaje del total de comprobantes físicos en cada estado"
        />
      </div>
    </div>
  );
};
