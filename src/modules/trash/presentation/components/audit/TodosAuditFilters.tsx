/**
 * TodosAuditFilters.tsx
 *
 * SRP: único componente de filtros para el sub-tab "Vista General"
 *      (Todos — Pagados y Pendientes).
 *
 * ISP: recibe solo los props que necesita este sub-tab específico.
 *      No comparte interfaz con los otros sub-tabs.
 *
 * OCP: agregar un nuevo filtro = agregar una prop aquí y un campo en
 *      el ViewModel, cero cambios en los demás sub-tabs.
 */
import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaCalendarAlt, FaFilter, FaListUl } from 'react-icons/fa';
import type { AuditDateFilter } from '../../../domain/dto/params/TrashRateAuditParams';

/** Opciones de tipo de pago exclusivas de Vista General */
export type TodosPaymentTypeChoice = 'all' | 'pagados' | 'pendientes';

const PAYMENT_TYPE_OPTIONS: { value: TodosPaymentTypeChoice; label: string }[] =
  [
    { value: 'all', label: 'Todos (Pagados y Pendientes)' },
    { value: 'pagados', label: 'Solo Pagados' },
    { value: 'pendientes', label: 'Solo Pendientes' }
  ];

// ── Props (ISP: solo los props que Vista General necesita) ────────────────────
export interface TodosAuditFiltersProps {
  // ── LEFT: parámetros de consulta ──────────────────────────────────────────
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  /** Columna de fecha usada en el backend (Fecha Emisión / Fecha Pago) */
  dateFilter: AuditDateFilter;
  onDateFilterChange: (val: AuditDateFilter) => void;

  /** Elección de tipo de pago para filtrado post-carga — exclusivo de Vista General */
  paymentTypeChoice: TodosPaymentTypeChoice;
  onPaymentTypeChoiceChange: (val: TodosPaymentTypeChoice) => void;

  onFetch: () => void;
  isLoading: boolean;

  // ── RIGHT: filtros servidor + búsqueda local + post-load ──────────────────
  /** Filtro de diagnóstico enviado al servidor en la próxima consulta */
  diagnosticFilter: 'DIFFERENT_AND_NO_RECORD' | 'ALL';
  onDiagnosticFilterChange: (val: 'DIFFERENT_AND_NO_RECORD' | 'ALL') => void;

  /** Búsqueda local (cedula / nombre / clave catastral) */
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;

  /** Filtro post-carga por estado de pago (derivado de los datos ya cargados) */
  selectedPaymentStatus: string;
  onPaymentStatusChange: (val: string) => void;
  paymentStatusList: string[];

  /** Filtro post-carga por diagnóstico (derivado de los datos ya cargados) */
  selectedDiagnostic: string;
  onDiagnosticChange: (val: string) => void;
  diagnosticList: string[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export const TodosAuditFilters: React.FC<TodosAuditFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  dateFilter,
  onDateFilterChange,
  paymentTypeChoice,
  onPaymentTypeChoiceChange,
  onFetch,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  paymentStatusList,
  selectedDiagnostic,
  onDiagnosticChange,
  diagnosticList
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);

  /**
   * Regla de negocio (ISP): si el usuario filtra por "Fecha Pago", solo pueden
   * existir registros pagados (los pendientes no tienen Fecha_Pago en el backend).
   * → Forzar paymentTypeChoice a 'pagados' automáticamente.
   * → Deshabilitar las opciones incompatibles en el select.
   */
  const isPaymentDateMode = dateFilter === 'paymentDate';

  const handleDateFilterChange = (val: AuditDateFilter) => {
    onDateFilterChange(val);
    if (val === 'paymentDate') {
      // Aplicar la regla: Fecha Pago → solo pagados
      onPaymentTypeChoiceChange('pagados');
    }
  };

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: fecha + dateFilter + tipo de pago + Consultar ── */}
      <div className="trash-report-filter-left">
        {/* Rango de fechas */}
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

        {/* Columna de fecha (Fecha Emisión o Fecha Pago) */}
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.dateFilter', 'Fecha por')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Select
              size="small"
              value={dateFilter}
              onChange={(e) =>
                handleDateFilterChange(e.target.value as AuditDateFilter)
              }
              leftIcon={<FaCalendarAlt size={15} />}
            >
              <option value="incomeDate">Fecha Emisión</option>
              <option value="paymentDate">Fecha Pago</option>
            </Select>
          </div>
        </div>

        {/* Tipo de pago — exclusivo de "Vista General" (ISP) */}
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.paymentTypeChoice', 'Mostrar')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Select
              size="small"
              value={isPaymentDateMode ? 'pagados' : paymentTypeChoice}
              onChange={(e) =>
                !isPaymentDateMode &&
                onPaymentTypeChoiceChange(
                  e.target.value as TodosPaymentTypeChoice
                )
              }
              leftIcon={<FaFilter size={14} />}
              disabled={isPaymentDateMode}
            >
              {PAYMENT_TYPE_OPTIONS.map((opt) => {
                // Con Fecha Pago solo tiene sentido "Solo Pagados" (regla de negocio)
                const incompatible =
                  isPaymentDateMode && opt.value !== 'pagados';
                return (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={incompatible}
                  >
                    {opt.label}
                    {incompatible ? ' (no aplica)' : ''}
                  </option>
                );
              })}
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

      {/* ── RIGHT: filtro servidor + búsqueda local + post-load ── */}
      <div className="trash-report-filter-right">
        {/* Filtro diagnóstico (server-side: aplica en la próxima consulta) 
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
                {t('trashRateReport.filters.differentAndNoRecord', 'Discrepancias')}
              </option>
            </Select>
          </div>
        </div>
        */}
        {/* Búsqueda local (cédula / nombre / clave catastral) */}
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('common.search')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Input
              type="text"
              size="small"
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        {/* Estado de pago post-carga (derivado de los datos ya cargados) */}
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

        {/* Diagnóstico post-carga (derivado de los datos ya cargados) */}
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
