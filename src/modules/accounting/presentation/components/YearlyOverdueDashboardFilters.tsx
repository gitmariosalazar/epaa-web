import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Filter, X } from 'lucide-react';
import { Button } from '../../../../shared/presentation/components/Button/Button';
import '../styles/PaymentFilters.css';

interface YearlyOverdueDashboardFiltersProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  isLoading: boolean;
  onRefresh?: () => void;
  availableYears?: number[];
  showAllOption?: boolean;
  hideYearFilter?: boolean;
}

export const YearlyOverdueDashboardFilters: React.FC<
  YearlyOverdueDashboardFiltersProps
> = ({
  selectedYear,
  onYearChange,
  isLoading,
  onRefresh,
  availableYears = [],
  showAllOption = true,
  hideYearFilter = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      {!hideYearFilter && (
        <div className="filter-group">
        <label className="filter-label">
          {t('accounting.filters.year', 'Filtrar por Año')}
        </label>
        <div className="filter-input-wrapper">
          <Filter className="filter-icon" size={16} />
          <select
            className="filter-input filter-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          >
            {showAllOption && (
              <option value="all">{t('common.all', 'Todos los años')}</option>
            )}
            {availableYears.sort((a, b) => b - a).map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      )}

      {!hideYearFilter && selectedYear !== 'all' && (
        <div className="filter-group filter-group--btn">
          <label className="filter-label" style={{ visibility: 'hidden' }}>.</label>
          <Button onClick={() => onYearChange('all')} size="sm" variant="ghost">
            <X size={16} />
            {t('common.clear', 'Limpiar')}
          </Button>
        </div>
      )}

      {onRefresh && (
        <div className="filter-group filter-group--btn">
          <label className="filter-label" style={{ visibility: 'hidden' }}>.</label>
          <Button
            onClick={onRefresh}
            variant="outline"
            color="gray"
            size="sm"
            disabled={isLoading}
            leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
          >
            {t('common.refresh', 'Refrescar')}
          </Button>
        </div>
      )}
    </div>
  );
};
