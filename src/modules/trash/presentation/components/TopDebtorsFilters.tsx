import React from 'react';
import '../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../../../../shared/presentation/components/DatePicker/DatePicker';
import { Button } from '@/shared/presentation/components/Button/Button';

export interface TopDebtorsFiltersProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  top: string;
  onTopChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const TopDebtorsFilters: React.FC<TopDebtorsFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  top,
  onTopChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
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
          <label className="trash-report-filter-label">Top</label>
          <div className="trash-report-filter-input-wrapper">
            <input
              type="number"
              min="1"
              max="500"
              value={top}
              onChange={(e) => onTopChange(e.target.value)}
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
    </div>
  );
};
