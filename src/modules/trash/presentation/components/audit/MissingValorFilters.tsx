import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { MdPaid } from 'react-icons/md';

export interface MissingValorFiltersProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  // Local dropdowns (populated from loaded data)
  selectedPaymentStatus: string;
  onPaymentStatusChange: (val: string) => void;
  paymentStatusList: string[];
}

export const MissingValorFilters: React.FC<MissingValorFiltersProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  selectedPaymentStatus,
  onPaymentStatusChange,
  paymentStatusList
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
        <Button
          onClick={onFetch}
          disabled={!canFetch}
          size="xs"
          isLoading={isLoading}
          leftIcon={!isLoading ? <Search size={18} /> : undefined}
        >
          {isLoading ? t('common.loading') : t('common.fetch')}
        </Button>
      </div>
      <div className="trash-report-filter-right">
        {paymentStatusList.length > 0 && (
          <div className="trash-report-filter-group">
            <label className="trash-report-filter-label">
              {t('common.paymentStatus')}
            </label>
            <div className="trash-report-filter-input-wrapper">
              <Select
                size="small"
                value={selectedPaymentStatus}
                onChange={(e) => onPaymentStatusChange(e.target.value)}
                leftIcon={<MdPaid />}
              >
                <option value="">{t('common.all')}</option>
                {paymentStatusList.map((s) => (
                  <option key={s} value={s}>
                    {t(`common.${s.toLowerCase()}`)}
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
