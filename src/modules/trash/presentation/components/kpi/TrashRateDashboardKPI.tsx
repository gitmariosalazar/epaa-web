import React, { useState, useMemo } from 'react';
import '../../styles/TrashRateDashboard.css';
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
import type {
  MissingValorRow,
  TrashRateAuditRow,
  TrashRateKPI
} from '../../../domain/models/trash-rate-report.model';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import {
  VerticalBarChart,
  type BarItem
} from '@/shared/presentation/components/Charts/VerticalBarChart';
import '@/shared/presentation/components/Charts/Charts.css';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { MissingValorBillsTable } from '../audit/MissingValorBillsTable';
import { TrashRateAuditReportTable } from '../audit/TrashRateAuditReportTable';

interface RevenueStatusItem {
  Estado: string;
  Monto: number;
}

interface DiscountAndCreditNoteItem {
  Tipo: string;
  value: number;
}

interface TrashRateDashboardKPIProps {
  data: TrashRateKPI[];
  isLoading: boolean;
  isLoadingAudit?: boolean;
  isLoadingMissing?: boolean;
  onFetchAudit?: () => void;
  onFetchMissing?: () => void;
  error: string | null;
  selectedCategoryIndex: number;
  missingValorBills: MissingValorRow[];
  trashRateAuditReport: TrashRateAuditRow[];
}

const fmtMoney = (n: number) =>
  `$${Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

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
  isLoadingAudit,
  isLoadingMissing,
  onFetchAudit,
  onFetchMissing,
  error,
  selectedCategoryIndex,
  missingValorBills,
  trashRateAuditReport
}) => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>(
    'ALL'
  );
  const [diagnosticFilter, setDiagnosticFilter] = useState<'ALL' | 'INCONSISTENT'>(
    'INCONSISTENT'
  );

  const handleCardClickOpenModal = (label: string) => {
    setModalTitle(label);
    setIsModalOpen(true);
    setStatusFilter('ALL'); // Reset filter when opening
    setDiagnosticFilter('INCONSISTENT'); // Default to anomalies

    if (label.includes('Inconsistencia') || label.includes('Integridad')) {
      onFetchAudit?.();
    } else {
      onFetchMissing?.();
    }
  };

  const handleCardClickCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredMissingBills = useMemo(() => {
    let result = missingValorBills;
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.paymentStatus === statusFilter);
    }
    if (diagnosticFilter === 'INCONSISTENT') {
      result = result.filter(
        (item) => item.finalDiagnosis && !item.finalDiagnosis.includes('Correct Match')
      );
    }
    return result;
  }, [missingValorBills, statusFilter, diagnosticFilter]);

  const filteredAuditReport = useMemo(() => {
    let result = trashRateAuditReport;
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => item.paymentStatus === statusFilter);
    }
    if (diagnosticFilter === 'INCONSISTENT') {
      result = result.filter(
        (item) => item.diagnostic && !item.diagnostic.includes('Correct Match')
      );
    }
    return result;
  }, [trashRateAuditReport, statusFilter, diagnosticFilter]);

  if (isLoading) return null;

  if (error || !data || data.length === 0) {
    return (
      <div className="trash-dashboard" style={{ padding: '5px 0 12px 0' }}>
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

  const k = data[selectedCategoryIndex] || data[0];

  // Helper to parse revenue status
  const revenueStatus: RevenueStatusItem[] = (() => {
    try {
      return JSON.parse(k.revenueStatusJson || '[]');
    } catch (e) {
      return [];
    }
  })();

  const paidAmount =
    revenueStatus.find((item) => item.Estado === 'P')?.Monto || 0;
  const pendingAmount = revenueStatus
    .filter((item) => item.Estado !== 'P')
    .reduce((acc, item) => acc + item.Monto, 0);

  const discountAndCreditNoteItems: DiscountAndCreditNoteItem[] = [
    {
      Tipo: 'Descuentos',
      value: k.discounts ?? 0
    },
    {
      Tipo: 'Notas de Crédito',
      value: k.creditNotesAmount ?? 0
    }
  ];

  const moneySlices: DonutSlice[] = [
    {
      label: 'Cobrado',
      value: paidAmount,
      color: '#22c55e',
      fmt: fmtMoney
    },
    {
      label: 'Pendiente',
      value: pendingAmount,
      color: '#ef4444',
      fmt: fmtMoney
    }
  ];

  const billSlices: DonutSlice[] = [
    {
      label: 'Emitidas',
      value: k.totalBills ?? 0,
      color: '#8b5cf6',
      fmt: fmtNum
    },
    {
      label: 'Diferencia (Gap)',
      value: k.integrityGap ?? 0,
      color: '#f43f5e',
      fmt: fmtMoney
    }
  ];

  const barItems: BarItem[] = [
    {
      label: 'Total a Recaudar',
      name: 'Total a Recaudar',
      value: k.grossAmount ?? 0,
      color: 'blue',
      fmt: fmtMoney
    },
    {
      label: 'Notas de Crédito',
      name: 'Notas de Crédito',
      value: k.creditNotesAmount ?? 0,
      color: 'amber',
      fmt: fmtMoney
    },
    {
      label: 'Total Recaudado',
      name: 'Total Recaudado',
      value: paidAmount,
      color: 'green',
      fmt: fmtMoney
    }
  ];

  // console.log({ missingValorBills }); // Removed for performance
  // console.log({ trashRateAuditReport }); // Removed for performance

  return (
    <div className="trash-dashboard" style={{ padding: '5px 0 12px 0' }}>
      {/* ── TOP IMPERIAL ROW: Compliance + All KPIs ── */}
      <div className="trash-kpi-semantic-row trash-kpi-top-row">
        <div className="trash-kpi-compliance-wrapper">
          <ComplianceCard pct={k.collectionRate ?? 0} />
        </div>
        <div className="trash-kpi-metrics-grid">
          {/* Row 1 equivalents */}
          <KPICard
            label="Bruto a Recaudar"
            value={fmtMoney(k.grossAmount)}
            icon={<DollarSign size={16} />}
            color="blue"
            description="Emisión total bruta"
          />
          <KPICard
            label="Total Neto"
            value={fmtMoney(k.netAmount)}
            icon={<AlertTriangle size={16} />}
            color="amber"
            description="Gross minus discounts"
          />
          <KPICard
            label="Total Recaudado (Pagos)"
            value={fmtMoney(paidAmount)}
            icon={<CheckCircle size={16} />}
            color="green"
            valueColor="green"
            description="Pagos liquidados (Estado P)"
          />
          <KPICard
            label="Total Pendiente"
            value={fmtMoney(pendingAmount)}
            icon={<Clock size={16} />}
            color="red"
            valueColor="red"
            description="Cartera por cobrar"
          />
          <KPICard
            label="Predios Únicos"
            value={fmtNum(k.uniqueCadastralKeys)}
            icon={<Home size={16} />}
            color="blue"
            description="Claves catastrales"
          />

          {/* Row 2 equivalents */}
          <KPICard
            label="Facturas Emitidas"
            value={fmtNum(k.totalBills)}
            icon={<FileText size={16} />}
            color="purple"
            description="Total de comprobantes"
          />
          <KPICard
            label="Creditos Emitidos"
            value={fmtNum(k.creditNotesVolume)}
            icon={<FileText size={16} />}
            color="purple"
            description="Total de creditos emitidos"
          />

          {/* Table 1 */}
          <div className="revenue-status-card" style={{ gridColumn: 'span 1' }}>
            <div className="revenue-status-header">
              <span
                className="revenue-status-title"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Descuentos y N.C. Total{' '}
                <FaMoneyCheckAlt size={16} color="var(--warning)" />
              </span>
            </div>
            <table className="revenue-status-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {discountAndCreditNoteItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span
                        className={`status-badge status-badge--${item.Tipo === 'Descuentos' ? 'discount' : 'credit-note'}`}
                      >
                        {item.Tipo}
                      </span>
                    </td>
                    <td
                      className={`monto-value monto-value--${item.Tipo === 'Descuentos' ? 'discount' : 'credit-note'}`}
                    >
                      {fmtMoney(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <KPICard
            label="Diferencia de Integridad"
            value={fmtMoney(k.integrityGap)}
            icon={<AlertCircle size={16} />}
            color="red"
            activeTooltip={true}
            description="Diferencia entre el valor de la fuente y factura"
            onClick={() => {
              handleCardClickOpenModal(
                'Inconsistencia en el Valor de la Tasa de Recolección de Residuos'
              );
            }}
          />

          {/* Table 2 */}
          <div className="revenue-status-card" style={{ gridColumn: 'span 1' }}>
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
                {revenueStatus.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span
                        className={`status-badge status-badge--${
                          item.Estado === 'P'
                            ? 'P'
                            : item.Estado === 'B'
                              ? 'B'
                              : item.Estado === 'S/E'
                                ? 'S'
                                : ''
                        }`}
                      >
                        {item.Estado === 'P'
                          ? 'Pagado'
                          : item.Estado === 'B'
                            ? 'Baja'
                            : item.Estado === 'S/E'
                              ? 'Sin Estado'
                              : item.Estado}
                      </span>
                    </td>
                    <td
                      className={`monto-value color-value--${
                        item.Estado === 'P'
                          ? 'P'
                          : item.Estado === 'B'
                            ? 'B'
                            : item.Estado === 'S/E'
                              ? 'S'
                              : ''
                      }`}
                    >
                      {fmtMoney(item.Monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="trash-dashboard-charts-grid">
        <DonutChart
          title="Distribución Monetaria"
          slices={moneySlices}
          centerLabel="TOTAL NETO"
          centerValue={fmtMoney(k.netAmount)}
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
          centerValue={fmtNum(k.totalBills)}
          description="Diferencia de monto entre emisión original y cálculo actual"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCardClickCloseModal}
        title={modalTitle}
        description={`Resumen detallado de auditoría para el periodo seleccionado.`}
        size="full"
        headerActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600
                }}
              >
                DIAGNÓSTICO:
              </span>
              <select
                value={diagnosticFilter}
                onChange={(e) => setDiagnosticFilter(e.target.value as any)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--tb-bg)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">TODOS</option>
                <option value="INCONSISTENT">SOLO ANOMALÍAS</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600
                }}
              >
                FILTRAR POR ESTADO:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--tb-bg)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">TODOS</option>
                <option value="PAID">PAGADOS</option>
                <option value="PENDING">PENDIENTES</option>
              </select>
            </div>
          </div>
        }
      >
        <div
          style={{
            height: 'calc(100vh - 140px)',
            width: '100%',
            marginTop: '10px'
          }}
        >
          {modalTitle.includes('Inconsistencia') || modalTitle.includes('Integridad') ? (
            <TrashRateAuditReportTable
              data={filteredAuditReport}
              isLoading={isLoadingAudit ?? false}
              error={error ? new Error(error) : null}
            />
          ) : (
            <MissingValorBillsTable
              data={filteredMissingBills}
              isLoading={isLoadingMissing ?? false}
              error={error ? new Error(error) : null}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
