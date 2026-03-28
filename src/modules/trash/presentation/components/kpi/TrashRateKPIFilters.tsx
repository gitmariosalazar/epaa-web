import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { List, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import type { TrashRateKPI } from '../../../domain/models/trash-rate-report.model';
import { Select } from '@/shared/presentation/components/Input/Select';

export interface TrashRateKPIFiltersProps {
  // Monthly selection (represented internally as startDate/endDate)
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;

  // Category filter
  categories: TrashRateKPI[];
  selectedCategoryIndex: number;
  onCategoryChange: (index: number) => void;
}

/**
 * Filters component for the Trash Rate KPI Dashboard.
 * Specialized for monthly selection that auto-populates the full range.
 */
export const TrashRateKPIFilters: React.FC<TrashRateKPIFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  categories,
  selectedCategoryIndex,
  onCategoryChange
}) => {
  const { t } = useTranslation();

  // Convert "YYYY-MM-DD" to "YYYY-MM" for the picker display
  const currentMonthValue = startDate ? startDate.substring(0, 7) : '';

  const handleMonthChange = (monthStr: string) => {
    if (!monthStr) {
      onStartDateChange('');
      onEndDateChange('');
      return;
    }

    // monthStr is expected to be "YYYY-MM"
    const [year, month] = monthStr.split('-').map(Number);

    // First day of the month
    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;

    // Last day of the month
    const lastDayObj = new Date(year, month, 0); // month is 1-indexed here relative to 0-indexed Date month
    const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(lastDayObj.getDate()).padStart(2, '0')}`;

    onStartDateChange(firstDay);
    onEndDateChange(lastDay);
  };

  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
      {/* ── LEFT: month selection ── */}
      <div className="trash-report-filter-left">
        <div className="trash-report-filter-group trash-report-filter-group--range">
          <label className="trash-report-filter-label">
            {t('trashRateKPI.filters.selectMonth', 'Seleccionar Mes')}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <DatePicker
              size="compact"
              view="month"
              value={currentMonthValue}
              onChange={handleMonthChange}
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
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('trashRateReport.filters.fetch', 'Consultar')}
        </Button>
      </div>

      {/* ── RIGHT: Category selection ── */}
      <div className="trash-report-filter-right">
        {categories.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateKPI.filters.category', 'Categoría')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="compact"
                value={selectedCategoryIndex}
                onChange={(e) => onCategoryChange(Number(e.target.value))}
                disabled={isLoading}
                leftIcon={<List size={18} />}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={index}>
                    {cat.category}
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
