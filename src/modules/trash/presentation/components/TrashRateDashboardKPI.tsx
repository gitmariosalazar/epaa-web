import React from 'react';
import '../styles/TrashRateDashboard.css';
import {
  DollarSign,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Home,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TrashRateKPI } from '../../domain/models/trash-rate-report.model';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import {
  VerticalBarChart,
  type BarItem
} from '@/shared/presentation/components/Charts/VerticalBarChart';
import '@/shared/presentation/components/Charts/Charts.css';

interface RevenueStatusItem {
  Estado: string;
  Monto: number;
}

interface TrashRateDashboardKPIProps {
  data: TrashRateKPI[];
  isLoading: boolean;
  error: string | null;
}

const fmtMoney = (n: number) =>
  `$${Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

// ── KPI Card Component ──
interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color:
    | 'green'
    | 'red'
    | 'blue'
    | 'amber'
    | 'purple'
    | 'teal'
    | 'rose'
    | 'indigo';
  valueColor?: 'green' | 'red' | 'amber';
  description?: string;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  color,
  valueColor,
  description,
  className
}) => (
  <div className={`trash-kpi-card trash-kpi-card--${color} ${className ?? ''}`}>
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

// ── Compliance Card Component ──
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
          {t('trashRateKPI.dashboard.compliancePct', '% Cumplimiento')}
        </span>
        <div className={`trash-kpi-value ${valClass}`}>{pct.toFixed(1)}%</div>
        <span className="trash-kpi-compliance-subtitle">
          {pct >= 80 ? 'Recaudación Óptima' : 'Recaudación en Proceso'}
        </span>
      </div>
    </div>
  );
};

export const TrashRateDashboardKPI: React.FC<TrashRateDashboardKPIProps> = ({
  data,
  isLoading,
  error
}) => {
  const { t } = useTranslation();

  if (isLoading) return null;

  if (error || !data || data.length === 0) {
    return (
      <div className="trash-dashboard">
        <div className="trash-dashboard-empty">
          <TrendingUp size={36} />
          <span>
            {error ||
              t('trashRateKPI.dashboard.empty', 'No hay datos disponibles.')}
          </span>
        </div>
      </div>
    );
  }

  const k = data[0];

  const moneySlices: DonutSlice[] = [
    {
      label: 'Cobrado',
      value: k.netAmountCollected ?? 0,
      color: '#22c55e',
      fmt: fmtMoney
    },
    {
      label: 'Pendiente',
      value: k.totalAmountPending ?? 0,
      color: '#ef4444',
      fmt: fmtMoney
    }
  ];

  const billSlices: DonutSlice[] = [
    {
      label: 'Emitidas',
      value: k.totalBillsIssued ?? 0,
      color: '#8b5cf6',
      fmt: fmtNum
    },
    {
      label: 'Sin Valor',
      value: k.integrityAuditMissingValor ?? 0,
      color: '#f43f5e',
      fmt: fmtNum
    }
  ];

  const barItems: BarItem[] = [
    {
      label: 'Total a Recaudar',
      value: k.grossAmountToCollect ?? 0,
      color: 'blue',
      fmt: fmtMoney
    },
    {
      label: 'Notas de Crédito',
      value: k.creditNotesTotalAmount ?? 0,
      color: 'amber',
      fmt: fmtMoney
    },
    {
      label: 'Total Recaudado',
      value:
        JSON.parse(k.revenueStatusJsonArray ?? '[]').reduce(
          (acc: number, item: RevenueStatusItem) =>
            item.Estado === 'P' ? acc + item.Monto : acc,
          0
        ) ?? 0,
      color: 'green',
      fmt: fmtMoney
    }
  ];

  return (
    <div className="trash-dashboard">
      <div className="trash-dashboard-kpi-grid">
        <div className="trash-kpi--compliance">
          <ComplianceCard pct={k.collectionCompliancePct ?? 0} />
        </div>

        {/* Row 1 */}
        <KpiCard
          className="trash-kpi--top"
          label="Bruto a Recaudar"
          value={fmtMoney(k.grossAmountToCollect)}
          icon={<DollarSign size={16} />}
          color="blue"
          description="Emisión total bruta"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Total sin ajustes"
          value={fmtMoney(k.netAmountCollected)}
          icon={<AlertTriangle size={16} />}
          color="amber"
          description="Total sin ajustes/anulaciones"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Total Recaudado (Pagos)"
          value={fmtMoney(
            (() => {
              try {
                const statusData: RevenueStatusItem[] = JSON.parse(
                  k.revenueStatusJsonArray || '[]'
                );
                return (
                  statusData.find((item) => item.Estado === 'P')?.Monto || 0
                );
              } catch (e) {
                return 0;
              }
            })()
          )}
          icon={<CheckCircle size={16} />}
          color="green"
          valueColor="green"
          description="Pagos liquidados (Estado P)"
        />
        <KpiCard
          className="trash-kpi--top"
          label="Total Pendiente"
          value={fmtMoney(k.totalAmountPending)}
          icon={<Clock size={16} />}
          color="red"
          valueColor="red"
          description="Cartera por cobrar"
        />

        {/* Row 2 */}
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
          label="Facturas Emitidas"
          value={fmtNum(k.totalBillsIssued)}
          icon={<FileText size={16} />}
          color="purple"
          description="Total de comprobantes"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Creditos Emitidos"
          value={fmtNum(k.creditNotesVolume)}
          icon={<FileText size={16} />}
          color="purple"
          description="Total de creditos emitidos"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Valor Creditos"
          value={fmtNum(k.creditNotesTotalAmount)}
          icon={<DollarSign size={16} />}
          color="purple"
          description="Valor total de creditos emitidos"
        />
        <KpiCard
          className="trash-kpi--bottom"
          label="Sin Valor Table"
          value={fmtNum(k.integrityAuditMissingValor)}
          icon={<AlertCircle size={16} />}
          color="red"
          description="Omitidos en auditoría"
        />

        <div className="trash-kpi-revenue-status">
          <div className="revenue-status-card">
            <div className="revenue-status-header">
              <span className="revenue-status-title">
                Distribución por Estado
              </span>
            </div>
            <table className="revenue-status-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  try {
                    const statusData: RevenueStatusItem[] = JSON.parse(
                      k.revenueStatusJsonArray || '[]'
                    );
                    return statusData.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span
                            className={`status-badge status-badge--${item.Estado}`}
                          >
                            {item.Estado === 'B'
                              ? 'Baja'
                              : item.Estado === 'P'
                                ? 'Pagado'
                                : item.Estado}
                          </span>
                        </td>
                        <td className="monto-value">{fmtMoney(item.Monto)}</td>
                      </tr>
                    ));
                  } catch (e) {
                    return (
                      <tr>
                        <td colSpan={2} className="error-text">
                          Error al cargar datos
                        </td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="trash-dashboard-charts-grid">
        <DonutChart
          title="Distribución Monetaria"
          slices={moneySlices}
          centerLabel="TOTAL"
          centerValue={fmtMoney(
            (k.netAmountCollected || 0) + (k.totalAmountPending || 0)
          )}
          description="Porcentaje en dólares recuperados vs cartera vencida"
        />
        <VerticalBarChart
          title="Comparativa General"
          items={barItems}
          description="Detalle de la recaudación"
        />
        <DonutChart
          title="Auditoría Integridad"
          slices={billSlices}
          centerLabel="BILL COUNT"
          centerValue={fmtNum(k.totalBillsIssued)}
          description="Proporción de facturas con respaldo en tabla de valor"
        />
      </div>
    </div>
  );
};
