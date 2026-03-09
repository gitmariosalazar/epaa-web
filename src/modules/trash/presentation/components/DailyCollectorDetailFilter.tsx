import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import '../styles/DailyCollectorDetailFilter.css';

export interface DailyCollectorDetailFilterProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onFetch: () => void;
  isLoading: boolean;

  // New Filters
  selectedCollector: string;
  onCollectorChange: (val: string) => void;
  collectorList: string[];
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  statusList: string[];
}

export const DailyCollectorDetailFilter: React.FC<
  DailyCollectorDetailFilterProps
> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  selectedCollector,
  onCollectorChange,
  collectorList,
  selectedStatus,
  onStatusChange,
  statusList
}) => {
  const { t } = useTranslation();

  const handleRangeChange = (start: string, end: string) => {
    onStartDateChange(start);
    onEndDateChange(end);
  };

  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="daily-collector-filter">
      {/* ── LEFT: date range + Fetch ── */}
      <div className="filter-section-left">
        <div className="filter-group filter-group--range">
          <label className="filter-label">
            {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
          </label>
          <div className="filter-input-wrapper">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleRangeChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button onClick={onFetch} disabled={!canFetch} size="sm">
          {isLoading ? (
            <div className="filter-button-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('common.search', 'Consultar')}
        </Button>
      </div>

      {/* ── RIGHT: local dropdowns ── */}
      <div className="filter-section-right">
        <div className="filter-group">
          <label className="filter-label">
            {t('trashRateKPI.filters.collector', 'Cobrador')}
          </label>
          <div className="filter-input-wrapper">
            <select
              className="filter-input filter-select"
              value={selectedCollector}
              onChange={(e) => onCollectorChange(e.target.value)}
            >
              <option value="">{t('common.all', 'Todos')}</option>
              {collectorList.map((collector) => (
                <option key={collector} value={collector}>
                  {collector}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            {t('trashRateKPI.filters.status', 'Estado')}
          </label>
          <div className="filter-input-wrapper">
            <select
              className="filter-input filter-select"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">{t('common.all', 'Todos')}</option>
              {statusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
