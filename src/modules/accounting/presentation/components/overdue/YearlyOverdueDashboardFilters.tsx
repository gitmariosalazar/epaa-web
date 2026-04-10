import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Filter, X } from 'lucide-react';
import { Button } from '../../../../../shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import '../../styles/payments/PaymentFilters.css';

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
      {/* ── LEFT: Filters ── */}
      <div className="filter-section-left">
        {!hideYearFilter && (
          <div className="filter-group">
            <label className="filter-label">
              {t('accounting.filters.year', 'Filtrar por Año')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                size="compact"
                leftIcon={<Filter size={16} />}
              >
                {showAllOption && (
                  <option value="all">{t('common.all', 'Todos los años')}</option>
                )}
                {availableYears
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
        )}

        {!hideYearFilter && selectedYear !== 'all' && (
          <div className="filter-group">
            <label className="filter-label" style={{ visibility: 'hidden' }}>.</label>
            <Button
              onClick={() => onYearChange('all')}
              size="compact"
              variant="ghost"
              leftIcon={<X size={16} />}
            >
              {t('common.clear', 'Limpiar')}
            </Button>
          </div>
        )}
      </div>

      {/* ── RIGHT: Actions ── */}
      {onRefresh && (
        <div className="filter-section-right">
          <Button
            onClick={onRefresh}
            variant="outline"
            color="gray"
            size="compact"
            isLoading={isLoading}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('common.refresh', 'Refrescar')}
          </Button>
        </div>
      )}
    </div>
  );
};
