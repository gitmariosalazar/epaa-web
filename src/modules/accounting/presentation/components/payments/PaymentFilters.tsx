import React from 'react';
import '../../styles/payments/PaymentFilters.css';
import { CreditCard, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../../../../../shared/presentation/components/DatePicker/DatePicker';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';

// ── Props (ISP: each consumer only passes what it needs) ─────────────────────
interface PaymentFiltersProps {
  activeTab: 'payments' | 'readings' | 'range';

  // Shared — single-date tabs
  date: string;
  onDateChange: (val: string) => void;

  // Payments tab only
  orderValue: string;
  onOrderValueChange: (val: string) => void;

  // Date-range tab
  initDate: string;
  onInitDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  limit: string;
  onLimitChange: (val: string) => void;
  offset: string;
  onOffsetChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;

  // Local search + dropdowns (all tabs)
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  selectedUser: string;
  onUserChange: (val: string) => void;
  userList: string[];
  selectedPaymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  paymentMethodList: string[];
}

// ── Fixed option lists ───────────────────────────────────────────────────────
const ORDER_VALUES = [9, 3, 6, 7, 1, 10, 4, 5, 2, 77, 8];

// ── Component ────────────────────────────────────────────────────────────────
export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  activeTab,
  date,
  onDateChange,
  orderValue,
  onOrderValueChange,
  initDate,
  onInitDateChange,
  endDate,
  onEndDateChange,
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

  /** Whether the Fetch button should be enabled */
  const canFetch =
    !isLoading &&
    (activeTab === 'range' ? Boolean(initDate && endDate) : Boolean(date));

  return (
    <div className="payment-filters">
      {/* ── LEFT: Primary Inputs & Actions ── */}
      <div className="filter-section-left">
        {/* Single-date picker (payments + readings tabs) */}
        {activeTab !== 'range' && (
          <div className="filter-group">
            <label className="filter-label">
              {t('accounting.filters.date', 'Fecha de Pago')}
            </label>
            <div className="filter-input-wrapper">
              <DatePicker value={date} onChange={onDateChange} size="compact" />
            </div>
          </div>
        )}

        {/* Order value (payments tab only) */}
        {activeTab === 'payments' && (
          <div className="filter-group">
            <label className="filter-label">
              {t('accounting.filters.orderValue', 'Orden N°')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                value={orderValue}
                onChange={(e) => onOrderValueChange(e.target.value)}
                size="compact"
              >
                <option value="">
                  {t('accounting.filters.selectOrder', 'Select order...')}
                </option>
                {ORDER_VALUES.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Date range inputs (range tab only) */}
        {activeTab === 'range' && (
          <div className="filter-group filter-group--range">
            <label className="filter-label">
              {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
            </label>
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

        <Button
          onClick={onFetch}
          disabled={!canFetch}
          size="compact"
          isLoading={isLoading}
          leftIcon={<Search size={18} />}
        >
          {t('accounting.filters.fetch', 'Consultar')}
        </Button>

        {/* local search (all tabs) */}
        <div className="filter-group filter-group--search">
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
      </div>

      {/* ── RIGHT: Secondary Dropdown Filters ── */}
      <div className="filter-section-right">
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
