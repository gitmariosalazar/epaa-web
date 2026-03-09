import React from 'react';
import '../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../../../../shared/presentation/components/DatePicker/DatePicker';
import { Button } from '@/shared/presentation/components/Button/Button';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface TrashRateReportFiltersProps {
  // Date range
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;

  // Pagination
  limit: string;
  onLimitChange: (val: string) => void;
  offset: string;
  onOffsetChange: (val: string) => void;

  // Local search
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;

  // Payment status
  selectedPaymentStatus: string;
  onPaymentStatusChange: (val: string) => void;
  paymentStatusList: string[];

  // Diagnostic
  selectedDiagnostic: string;
  onDiagnosticChange: (val: string) => void;
  diagnosticList: string[];
}

// ── Component ──────────────────────────────────────────────────────────────────
export const TrashRateReportFilters: React.FC<TrashRateReportFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  limit,
  onLimitChange,
  offset,
  onOffsetChange,
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

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: date range + Fetch ── */}
      <div className="trash-report-filter-left">
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.startDate', 'Desde')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <DatePicker value={startDate} onChange={onStartDateChange} />
          </div>
        </div>

        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.endDate', 'Hasta')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <DatePicker value={endDate} onChange={onEndDateChange} />
          </div>
        </div>

        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.limit', 'Límite')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <input
              type="number"
              min="1"
              value={limit}
              onChange={(e) => onLimitChange(e.target.value)}
              className="trash-report-filter-input"
              style={{ width: '80px' }}
            />
          </div>
        </div>

        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.offset', 'Desplazamiento')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <input
              type="number"
              min="0"
              value={offset}
              onChange={(e) => onOffsetChange(e.target.value)}
              className="trash-report-filter-input"
              style={{ width: '80px' }}
            />
          </div>
        </div>

        <Button onClick={onFetch} disabled={!canFetch} size="sm">
          {isLoading ? (
            <div className="trash-report-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('trashRateReport.filters.fetch', 'Consultar')}
        </Button>
      </div>

      {/* ── RIGHT: search + dropdowns ── */}
      <div className="trash-report-filter-right">
        {/* Search */}
        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.search', 'Buscar')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <input
              type="text"
              placeholder={t(
                'trashRateReport.filters.searchPlaceholder',
                'Buscar...'
              )}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="trash-report-filter-input"
            />
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatusList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.paymentStatus', 'Estado Pago')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <select
                className="trash-report-filter-select"
                value={selectedPaymentStatus}
                onChange={(e) => onPaymentStatusChange(e.target.value)}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {paymentStatusList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Diagnostic */}
        {diagnosticList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.diagnostic', 'Diagnóstico')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <select
                className="trash-report-filter-select"
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
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
