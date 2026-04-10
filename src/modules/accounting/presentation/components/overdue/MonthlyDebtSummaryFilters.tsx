import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { CalendarIcon, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface MonthlyDebtSummaryFiltersProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  isLoading: boolean;
  onRefresh?: () => void;
  availableYears?: number[];
  availableMonths?: number[];
  showAllOption?: boolean;
  hideYearFilter?: boolean;
  hideMonthFilter?: boolean;
}

export const MonthlyDebtSummaryFilters: React.FC<
  MonthlyDebtSummaryFiltersProps
> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  isLoading,
  onRefresh,
  availableYears = [],
  availableMonths = [],
  showAllOption = true,
  hideYearFilter = false,
  hideMonthFilter = false
}: MonthlyDebtSummaryFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      <div className="filter-section-left">
        {!hideYearFilter && (
          <div className="filter-group">
            <label className="filter-label">
              {t('accounting.monthlyDebtSummary.year', 'Filter by year')}
            </label>
            <Select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              disabled={isLoading}
              leftIcon={<CalendarIcon />}
              size="compact"
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
        )}
        {!hideMonthFilter && (
          <div className="filter-group">
            <label className="filter-label">
              {t('accounting.monthlyDebtSummary.month', 'Filter by month')}
            </label>
            <Select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              disabled={isLoading}
              leftIcon={<CalendarIcon />}
              size="compact"
            >
              {showAllOption && <option value="">Todos</option>}
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
          </div>
        )}
        {!hideYearFilter && selectedYear !== 'all' && (
          <div className="filter-group">
            <label className="filter-label" style={{ visibility: 'hidden' }}>
              .
            </label>
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
