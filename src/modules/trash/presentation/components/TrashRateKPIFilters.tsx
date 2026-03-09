import React from 'react';
import '../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';

export interface TrashRateKPIFiltersProps {
  // Date range
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;
}

/**
 * Filters component for the Trash Rate KPI Dashboard.
 * Designed to be similar to TrashRateReportFilters but using DateRangePicker
 * for a more professional and unified user experience.
 */
export const TrashRateKPIFilters: React.FC<TrashRateKPIFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();

  const handleRangeChange = (start: string, end: string) => {
    onStartDateChange(start);
    onEndDateChange(end);
  };

  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: date range ── */}
      <div className="trash-report-filter-left">
        <div className="trash-report-filter-group trash-report-filter-group--range">
          <label className="trash-report-filter-label">
            {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleRangeChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          onClick={onFetch}
          disabled={!canFetch}
          size="sm"
          style={{ height: '36px' }}
        >
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

      {/* ── RIGHT: Future specific filters ── */}
      <div className="trash-report-filter-right">
        {/* Placeholder for future filters */}
      </div>
    </div>
  );
};
