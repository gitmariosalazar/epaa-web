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
import { FaCalendarAlt, FaFunnelDollar } from 'react-icons/fa';
import type { AuditDateFilter } from '../../../domain/dto/params/TrashRateAuditParams';
import { FaListCheck } from 'react-icons/fa6';
import { TbUserDollar } from 'react-icons/tb';

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
  selectedDiagnostic: string;
  onDiagnosticChange: (val: string) => void;
  diagnosticList: string[];

  // Collector + PaymentMethod: only for "Cobros Efectuados" subtab
  showCollectorAndPaymentMethod?: boolean;
  selectedCollector: string;
  onCollectorChange: (val: string) => void;
  collectorList: string[];

  selectedPaymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  paymentMethodList: string[];
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
  selectedDiagnostic,
  onDiagnosticChange,
  diagnosticList,
  showCollectorAndPaymentMethod = false,
  selectedCollector,
  onCollectorChange,
  collectorList,
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentMethodList
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: fecha + [dateFilter opcional] + fetch ── */}
      <div className="trash-report-filter-left">
        {/* Rango de fechas */}
        <div className="trash-report-filter-group-left">
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
          <div className="trash-report-filter-group-left">
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

      {/* ── RIGHT: búsqueda local + post-load — siempre agrupados a la derecha ── */}
      <div className="trash-report-filter-right">
        {/* Búsqueda local */}
        <div className="trash-report-filter-group-right">
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

        {/* Collector + Método Pago — solo en "Cobros Efectuados" */}
        {showCollectorAndPaymentMethod && collectorList.length > 0 && (
          <div className="trash-report-filter-group-right">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.collector', 'Usuario')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedCollector}
                onChange={(e) => onCollectorChange(e.target.value)}
                leftIcon={<TbUserDollar size={16} />}
                width={120}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {collectorList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {showCollectorAndPaymentMethod && paymentMethodList.length > 0 && (
          <div className="trash-report-filter-group-right">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.paymentMethod', 'Método Pago')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedPaymentMethod}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                leftIcon={<FaFunnelDollar size={16} />}
                width={120}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {paymentMethodList.map((s) => (
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
          <div className="trash-report-filter-group-right">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.diagnostic', 'Diagnóstico')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedDiagnostic}
                onChange={(e) => onDiagnosticChange(e.target.value)}
                leftIcon={<FaListCheck size={16} />}
                width={120}
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
