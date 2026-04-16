import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Button } from '@/shared/presentation/components/Button/Button';
import '../../styles/CollectorPerformanceFilter.css';

export interface CollectorPerformanceKPIFilterProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const CollectorPerformanceKPIFilter: React.FC<
  CollectorPerformanceKPIFilterProps
> = ({
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
    <div className="collector-performance-filter">
      <div className="filter-section-left">
        <div className="filter-group filter-group--range">
          <label className="filter-label">
            {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
          </label>
          <div className="filter-input-wrapper">
            <DateRangePicker
              size="compact"
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
          size="compact"
          isLoading={isLoading}
        >
          {!isLoading && <Search size={18} />}
          {isLoading ? t('common.loading') : t('common.fetch')}
        </Button>
      </div>
    </div>
  );
};
