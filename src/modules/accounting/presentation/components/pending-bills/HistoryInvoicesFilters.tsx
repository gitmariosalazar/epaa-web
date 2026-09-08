import React from 'react';
import '../../styles/payments/PaymentFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { DateRangeParams } from '../../../domain/dto/params/DataEntryParams';

interface HistoryInvoicesFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  dateRange: DateRangeParams;
  onDateRangeChange: (val: DateRangeParams) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const HistoryInvoicesFilters: React.FC<HistoryInvoicesFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  dateRange,
  onDateRangeChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();

  const canFetch = !isLoading && searchQuery.trim().length > 0 && dateRange.startDate && dateRange.endDate;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canFetch) {
      onFetch();
    }
  };

  const handleDateRangeChange = (start: string, end: string) => {
    if (!start || !end) {
      onDateRangeChange({ startDate: start, endDate: end });
      return;
    }

    // Forzar fecha de inicio al primer día del mes
    const [startYear, startMonth] = start.split('-');
    const newStartDate = `${startYear}-${startMonth}-01`;

    // Forzar fecha de fin al último día del mes
    const [endYear, endMonth] = end.split('-');
    const lastDay = new Date(parseInt(endYear), parseInt(endMonth), 0).getDate();
    const newEndDate = `${endYear}-${endMonth}-${String(lastDay).padStart(2, '0')}`;

    onDateRangeChange({ startDate: newStartDate, endDate: newEndDate });
  };

  return (
    <div className="payment-filters">
      <div className="filter-section-left">
        <div className="filter-group filter-group--search" style={{ minWidth: '300px' }}>
          <label className="filter-label">
            {t('accounting.filters.clientId', 'Cédula / RUC o Clave')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder="Ej: 1712345678 o 8-100"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Periodo (Meses)</label>
          <div className="filter-input-wrapper" style={{ marginTop: '4px' }}>
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
              size="xs"
              mode="month"
              maxDate={dateService.getCurrentDateString()}
            />
          </div>
        </div>

        <div className="filter-group">
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="xs"

            isLoading={isLoading}
            leftIcon={<Search size={18} />}
          >
            {t('common.fetch', 'Consultar')}
          </Button>
        </div>
      </div>
    </div>
  );
};
