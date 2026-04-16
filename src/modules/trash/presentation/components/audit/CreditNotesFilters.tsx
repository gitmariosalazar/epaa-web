import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaListUl } from 'react-icons/fa';

export interface CreditNotesFiltersProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  // Local dropdowns (populated from loaded data)
  selectedCreditCoverage: string;
  onCreditCoverageChange: (val: string) => void;
  creditCoverageList: string[];
}

export const CreditNotesFilters: React.FC<CreditNotesFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  selectedCreditCoverage,
  onCreditCoverageChange,
  creditCoverageList
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);

  return (
    <div className="trash-report-filters">
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
        <Button onClick={onFetch} disabled={!canFetch} size="xs">
          {isLoading ? (
            <div className="trash-report-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading ? t('common.loading') : t('common.fetch')}
        </Button>
      </div>
      <div className="trash-report-filter-right">
        {creditCoverageList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('trashRateReport.filters.creditCoverage', 'Cobertura NC')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedCreditCoverage}
                onChange={(e) => onCreditCoverageChange(e.target.value)}
                leftIcon={<FaListUl size={18} />}
              >
                <option value="">
                  {t('trashRateReport.filters.all', 'Todos')}
                </option>
                {creditCoverageList.map((c) => (
                  <option key={c} value={c}>
                    {c}
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
