import React from 'react';
import '../../styles/payments/PaymentFilters.css';
import { CreditCard, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
//import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { dateFilter } from '../../../domain/dto/params/DataEntryParams';
import { listYears } from '@/shared/utils/listYears';
import { BsCalendar2DateFill } from 'react-icons/bs';

interface GeneralCollectionFiltersProps {
  activeTab: 'dashboard' | 'general' | 'daily' | 'monthly' | 'yearly';

  filterType: dateFilter;
  onFilterTypeChange: (val: dateFilter) => void;

  initDate: string;
  onInitDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  year: number;
  onYearChange: (val: number) => void;

  startYear: number;
  onStartYearChange: (val: number) => void;
  endYear: number;
  onEndYearChange: (val: number) => void;

  titleCode: string;
  onTitleCodeChange: (val: string) => void;

  onFetch: () => void;
  isLoading: boolean;

  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  selectedUser: string;
  onUserChange: (val: string) => void;
  userList: string[];
  selectedPaymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  paymentMethodList: string[];
}

export const GeneralCollectionFilters: React.FC<
  GeneralCollectionFiltersProps
> = ({
  activeTab,
  filterType,
  onFilterTypeChange,
  initDate,
  onInitDateChange,
  endDate,
  onEndDateChange,
  //year,
  //onYearChange,
  startYear,
  onStartYearChange,
  endYear,
  onEndYearChange,
  titleCode,
  onTitleCodeChange,
  onFetch,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  selectedUser,
  onUserChange,
  userList,
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentMethodList
}) => {
  const { t } = useTranslation();

  const canFetch =
    !isLoading &&
    ((activeTab === 'dashboard' ? Boolean(initDate && endDate) : false) ||
      (activeTab === 'general' ? Boolean(initDate && endDate) : false) ||
      (activeTab === 'daily' ? Boolean(initDate && endDate) : false) ||
      (activeTab === 'monthly' ? Boolean(startYear && endYear) : false) ||
      (activeTab === 'yearly' ? Boolean(startYear && endYear) : false));

  return (
    <div
      className="payment-filters"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <div
        className="filter-section-left"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          flex: '0 1 auto',
          width: 'auto',
          minWidth: 'min-content'
        }}
      >
        <div
          className="filter-group"
          style={{ flex: '0 0 auto', width: 'max-content' }}
        >
          <label className="filter-label">Tipo de Fecha</label>
          <div
            className="filter-input-wrapper"
            style={{ width: 'max-content' }}
          >
            <Select
              value={filterType}
              onChange={(e) => onFilterTypeChange(e.target.value as dateFilter)}
              size="compact"
            >
              <option value="paymentDate">Fecha de Pago</option>
              <option value="incomeDate">Fecha de Ingreso</option>
            </Select>
          </div>
        </div>

        {(activeTab === 'dashboard' ||
          activeTab === 'general' ||
          activeTab === 'daily') && (
          <div
            className="filter-group filter-group--range"
            style={{
              flex: '0 0 auto',
              width: 'max-content',
              minWidth: 'unset'
            }}
          >
            <label className="filter-label">Rango de Fechas</label>
            <div
              className="filter-input-wrapper"
              style={{ width: 'max-content' }}
            >
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

        {(activeTab === 'monthly' || activeTab === 'yearly') && (
          <>
            <div
              className="filter-group"
              style={{ flex: '0 0 auto', width: 'max-content' }}
            >
              <label className="filter-label">Año Inicial</label>
              <div
                className="filter-input-wrapper"
                style={{ width: 'max-content' }}
              >
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
                  {listYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div
              className="filter-group"
              style={{ flex: '0 0 auto', width: 'max-content' }}
            >
              <label className="filter-label">Año Final</label>
              <div
                className="filter-input-wrapper"
                style={{ width: 'max-content' }}
              >
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
                  {listYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </>
        )}

        <div
          className="filter-group"
          style={{ flex: '0 0 auto', width: 'max-content' }}
        >
          <label className="filter-label">Cód. Título</label>
          <div
            className="filter-input-wrapper"
            style={{ width: 'max-content' }}
          >
            <Input
              type="text"
              placeholder="Opcional"
              value={titleCode}
              onChange={(e) => onTitleCodeChange(e.target.value)}
              size="compact"
            />
          </div>
        </div>

        <div style={{ flex: '0 0 auto', width: 'max-content' }}>
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
            leftIcon={<Search size={18} />}
          >
            {t('accounting.filters.fetch', 'Consultar')}
          </Button>
        </div>
      </div>

      <div
        className="filter-section-right"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          flex: '0 1 auto',
          justifyContent: 'flex-end',
          marginLeft: 'auto'
        }}
      >
        <div
          className="filter-group filter-group--search"
          style={{ flex: '0 0 auto', width: 'max-content' }}
        >
          <label className="filter-label">
            {t('accounting.filters.localSearch', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder={t(
                'accounting.filters.localSearchPlaceholder',
                'Buscar registros...'
              )}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              size="compact"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">
            {t('accounting.filters.chargingUser', 'Usuario')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedUser}
              onChange={(e) => onUserChange(e.target.value)}
              size="compact"
              leftIcon={<User size={18} />}
            >
              <option value="">
                {t('accounting.filters.allUsers', 'Todos los usuarios')}
              </option>
              {userList.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">
            {t('accounting.filters.paymentMethod', 'Método de Pago')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedPaymentMethod}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              size="compact"
              leftIcon={<CreditCard size={18} />}
            >
              <option value="">
                {t('accounting.filters.allMethods', 'Todos los métodos')}
              </option>
              {paymentMethodList.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
