/**
 * AuditTabFilters.tsx
 *
 * SRP: único componente de filtros para el tab de auditoría.
 * ISP: el prop `showDateFilter` evita exponer a los tipos "Pendientes"/"EnMora"
 *      una funcionalidad que no les corresponde (Fecha_Pago IS NULL en backend).
 * OCP: agregar un nuevo tipo de auditoría NO requiere modificar este componente.
 */
import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaCalendarAlt, FaListUl } from 'react-icons/fa';
import type { AuditDateFilter } from '../../../domain/dto/params/TrashRateAuditParams';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface AuditTabFiltersProps {
  // Date range
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;

  // ISP: dateFilter only shown for audit types that support it
  showDateFilter: boolean;
  dateFilter: AuditDateFilter;
  onDateFilterChange: (val: AuditDateFilter) => void;

  // Diagnostic filter (server-side)
  diagnosticFilter: 'DIFFERENT_AND_NO_RECORD' | 'ALL';
  onDiagnosticFilterChange: (val: 'DIFFERENT_AND_NO_RECORD' | 'ALL') => void;

  // Local search
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;

  // Local post-load filters (derived from loaded data)
  selectedPaymentStatus: string;
  onPaymentStatusChange: (val: string) => void;
  paymentStatusList: string[];

  selectedDiagnostic: string;
  onDiagnosticChange: (val: string) => void;
  diagnosticList: string[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export const AuditTabFilters: React.FC<AuditTabFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  showDateFilter,
  dateFilter,
  onDateFilterChange,
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

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: fecha + [dateFilter opcional] + fetch ── */}
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

        {/* Columna de fecha — solo para Pagados y Todos (ISP) */}
        {showDateFilter && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.dateFilter', 'Fecha por')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={dateFilter}
                onChange={(e) =>
                  onDateFilterChange(e.target.value as AuditDateFilter)
                }
                leftIcon={<FaCalendarAlt size={15} />}
              >
                <option value="incomeDate">Fecha Emisión</option>
                <option value="paymentDate">Fecha Pago</option>
              </Select>
            </div>
          </div>
        )}

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

      {/* ── RIGHT: filtro diagnóstico + búsqueda local + post-load ── */}
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
                {t('trashRateReport.filters.differentAndNoRecord', 'Discrepancias')}
              </option>
            </Select>
          </div>
        </div>
        */}
        {/* Búsqueda local */}
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
