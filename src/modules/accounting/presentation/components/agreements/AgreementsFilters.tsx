import React from 'react';
import '../../styles/payments/PaymentFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import { listYears } from '@/shared/utils/listYears';
import { BsCalendar2DateFill } from 'react-icons/bs';
import type { AgreementsTab } from '../../hooks/agreements/useAgreementsViewModel';

interface AgreementsFiltersProps {
  activeTab: AgreementsTab;

  initDate: string;
  onInitDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  startYear: number;
  onStartYearChange: (val: number) => void;
  endYear: number;
  onEndYearChange: (val: number) => void;

  onFetch: () => void;
  isLoading: boolean;

  searchQuery: string;
  onSearchQueryChange: (val: string) => void;

  canFetch: boolean;
}

export const AgreementsFilters: React.FC<AgreementsFiltersProps> = ({
  activeTab,
  initDate,
  onInitDateChange,
  endDate,
  onEndDateChange,
  startYear,
  onStartYearChange,
  endYear,
  onEndYearChange,
  onFetch,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  canFetch
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      <div className="filter-section-left">
        {/* Rango de Años para Dashboard o Año para Resumen Mensual */}
        {(activeTab === 'dashboard' || activeTab === 'monthly-summary' || activeTab === 'monthly-dashboard') && (
          <>
            <div className="filter-group">
              <label className="filter-label">Año {(activeTab === 'monthly-summary' || activeTab === 'monthly-dashboard') ? 'Consulta' : 'Inicial'}</label>
              <div className="filter-input-wrapper">
                <Select
                  value={startYear}
                  onChange={(e) =>
                    onStartYearChange(
                      parseInt(e.target.value) || new Date().getFullYear()
                    )
                  }
                  size="compact"
                  leftIcon={<BsCalendar2DateFill size={18} />}
                >
                  {listYears().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {activeTab === 'dashboard' && (
              <div className="filter-group">
                <label className="filter-label">Año Final</label>
                <div className="filter-input-wrapper">
                  <Select
                    value={endYear}
                    onChange={(e) =>
                      onEndYearChange(
                        parseInt(e.target.value) || new Date().getFullYear()
                      )
                    }
                    size="compact"
                    leftIcon={<BsCalendar2DateFill size={18} />}
                  >
                    {listYears().map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </>
        )}

        {/* Rango de Fechas para Reportes Detallados */}
        {(activeTab === 'collector-performance' ||
          activeTab === 'payment-methods' ||
          activeTab === 'citizen-summary') && (
          <div className="filter-group filter-group--range">
            <label className="filter-label">Rango de Fechas</label>
            <div className="filter-input-wrapper">
              <DateRangePicker
                size="compact"
                startDate={initDate}
                endDate={endDate}
                onChange={(start, end) => {
                  onInitDateChange(start);
                  onEndDateChange(end);
                }}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Botón Consultar */}
        <div className="filter-group">
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
            leftIcon={<Search size={18} />}
          >
            {t('common.fetch')}
          </Button>
        </div>
      </div>

      <div className="filter-section-right">
        {/* Búsqueda Local */}
        {(activeTab === 'debtors' ||
          activeTab === 'collector-performance' ||
          activeTab === 'payment-methods' ||
          activeTab === 'citizen-summary') && (
          <div className="filter-group filter-group--search">
            <label className="filter-label">{t('common.search')}</label>
            <div className="filter-input-wrapper">
              <Input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                size="compact"
                leftIcon={<Search size={18} />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
