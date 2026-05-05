import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaListUl } from 'react-icons/fa';
import type { AuditAccountingSubTab } from '@/shared/utils/tabs-accounting/tabs';

// ── Pendientes audit types ────────────────────────────────────────────────────
const PENDIENTES_AUDIT_TYPES: {
  value: AuditAccountingSubTab;
  label: string;
}[] = [
  {
    value: 'Pendientes (Cartera Corriente)',
    label: 'Cartera Corriente (Todos)'
  },
  { value: 'En Mora (Cartera Vencida)', label: 'En Mora (Cartera Vencida)' }
];

// ── Props ─────────────────────────────────────────────────────────────────────
export interface PendientesAuditFiltersProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  onFetch: () => void;
  isLoading: boolean;

  auditType: AuditAccountingSubTab;
  onAuditTypeChange: (val: AuditAccountingSubTab) => void;

  diagnosticFilter: 'DIFFERENT_AND_NO_RECORD' | 'ALL';
  onDiagnosticFilterChange: (val: 'DIFFERENT_AND_NO_RECORD' | 'ALL') => void;

  selectedPaymentStatus: string;
  onPaymentStatusChange: (val: string) => void;
  paymentStatusList: string[];

  selectedDiagnostic: string;
  onDiagnosticChange: (val: string) => void;
  diagnosticList: string[];
}

// ── Component (SRP: solo Pendientes) ──────────────────────────────────────────
// Nota: dateFilter no aplica en Pendientes — el backend siempre usa Fecha_Ingreso
// ya que Fecha_Pago IS NULL para todos los registros pendientes.
export const PendientesAuditFilters: React.FC<PendientesAuditFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  auditType,
  onAuditTypeChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  paymentStatusList,
  selectedDiagnostic,
  onDiagnosticChange,
  diagnosticList
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: fecha + tipo de pendientes + fetch ── */}
      <div className="trash-report-filter-left">
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.dateRange', 'Rango de Fechas')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <DateRangePicker
              size="small"
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                onStartDateChange(start);
                onEndDateChange(end);
              }}
            />
          </div>
        </div>

        {/* Tipo de pendientes */}
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.pendientesType', 'Tipo')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Select
              size="small"
              value={auditType}
              onChange={(e) =>
                onAuditTypeChange(e.target.value as AuditAccountingSubTab)
              }
              leftIcon={<FaListUl size={16} />}
            >
              {PENDIENTES_AUDIT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button
          onClick={onFetch}
          disabled={!canFetch}
          size="xs"
          isLoading={isLoading}
          leftIcon={!isLoading ? <Search size={18} /> : undefined}
        >
          {isLoading ? t('common.loading') : t('common.fetch')}
        </Button>
      </div>

      {/* ── RIGHT: filtro servidor + post-load ── */}
      <div className="trash-report-filter-right">
        {/* Filtro diagnóstico (server-side) 
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.diagnosticFilter', 'Filtro Servidor')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Select
              size="small"
              value={diagnosticFilter}
              onChange={(e) =>
                onDiagnosticFilterChange(
                  e.target.value as 'DIFFERENT_AND_NO_RECORD' | 'ALL'
                )
              }
            >
              <option value="ALL">
                {t('trashRateReport.filters.all', 'Todos')}
              </option>
              <option value="DIFFERENT_AND_NO_RECORD">
                {t(
                  'trashRateReport.filters.differentAndNoRecord',
                  'Discrepancias'
                )}
              </option>
            </Select>
          </div>
        </div>
        */}
        {/* Estado de pago (post-load) */}
        {paymentStatusList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.paymentStatus', 'Estado Pago')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedPaymentStatus}
                onChange={(e) => onPaymentStatusChange(e.target.value)}
                leftIcon={<FaListUl size={16} />}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {paymentStatusList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Diagnóstico (post-load) */}
        {diagnosticList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.diagnostic', 'Diagnóstico')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedDiagnostic}
                onChange={(e) => onDiagnosticChange(e.target.value)}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {diagnosticList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
