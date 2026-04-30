import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaListUl } from 'react-icons/fa';

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

        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.limit', 'Límite')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Input
              type="number"
              min="1"
              size="small"
              value={limit}
              onChange={(e) => onLimitChange(e.target.value)}
            />
          </div>
        </div>

        <div className="trash-report-filter-group">
          <label className="trash-report-filter-label">
            {t('trashRateReport.filters.offset', 'Desplazamiento')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Input
              type="number"
              min="0"
              size="small"
              value={offset}
              onChange={(e) => onOffsetChange(e.target.value)}
            />
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

      {/* ── RIGHT: search + dropdowns ── */}
      <div className="trash-report-filter-right">
        {/* Search */}
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

        {/* Payment Status */}
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
                leftIcon={<FaListUl size={18} />}
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

        {/* Diagnostic */}
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
