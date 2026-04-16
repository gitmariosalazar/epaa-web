import React from 'react';
import '../../styles/payments/PaymentFilters.css';
import { CreditCard, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { dateFilter } from '../../../domain/dto/params/DataEntryParams';
import { listYears } from '@/shared/utils/listYears';
import { BsCalendar2DateFill } from 'react-icons/bs';
import type { GeneralCollectionTab } from '../../hooks/general-collection/useGeneralCollectionViewModel';

// ─── SRP: pure helper — determines which month numbers are selectable
//         for a given year range start. Hides the "future month" business
//         rule completely from JSX rendering.
function getAvailableMonthNums(rangeStartYear: number): number[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const maxMonth = rangeStartYear >= currentYear ? now.getMonth() + 1 : 12;
  return Array.from({ length: maxMonth }, (_, i) => i + 1);
}

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

interface GeneralCollectionFiltersProps {
  activeTab: GeneralCollectionTab;

  filterType: dateFilter;
  onFilterTypeChange: (val: dateFilter) => void;

  initDate: string;
  onInitDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

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

  /** SRP: canFetch is computed in the ViewModel; Filters only renders the button state */
  canFetch: boolean;

  localDashboardYear: string;
  onLocalDashboardYearChange: (val: string) => void;

  localDashboardMonth?: string;
  onLocalDashboardMonthChange?: (val: string) => void;
  availableDashboardYears?: string[];
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
  paymentMethodList,
  canFetch,
  localDashboardYear,
  onLocalDashboardYearChange,
  localDashboardMonth,
  onLocalDashboardMonthChange,
  availableDashboardYears = []
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      {/* ── LEFT: Primary Inputs & Actions ── */}
      <div className="filter-section-left">
        {/* ── TIPO DE FECHA (always visible) ──────────────────────────────── */}
      <div className="filter-group">
        <label className="filter-label">Tipo de Fecha</label>
        <div className="filter-input-wrapper">
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

      {/* ── RANGO DE FECHAS (dashboard / general / daily) ───────────────── */}
      {(activeTab === 'dashboard' ||
        activeTab === 'general' ||
        activeTab === 'daily') && (
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

      {/* ── AÑO INICIAL + AÑO FINAL (multi-year report / dashboard tabs) ── */}
      {(activeTab === 'monthly' ||
        activeTab === 'yearly' ||
        activeTab === 'yearly-dashboard' ||
        activeTab === 'monthly-dashboard') && (
        <>
          <div className="filter-group">
            <label className="filter-label">Año Inicial</label>
            <div className="filter-input-wrapper">
              <Select
                value={startYear}
                onChange={(e) =>
                  onStartYearChange(parseInt(e.target.value) || new Date().getFullYear())
                }
                size="compact"
                leftIcon={<BsCalendar2DateFill size={18} />}
              >
                {listYears().map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">Año Final</label>
            <div className="filter-input-wrapper">
              <Select
                value={endYear}
                onChange={(e) =>
                  onEndYearChange(parseInt(e.target.value) || new Date().getFullYear())
                }
                size="compact"
                leftIcon={<BsCalendar2DateFill size={18} />}
              >
                {listYears().map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          </div>
        </>
      )}

      {/* ── AÑO (single-year — yearly-query) ────────────────────────────── */}
      {activeTab === 'yearly-query' && (
        <div className="filter-group">
          <label className="filter-label">Año</label>
          <div className="filter-input-wrapper">
            <Select
              value={startYear}
              onChange={(e) => {
                const y = parseInt(e.target.value) || new Date().getFullYear();
                onStartYearChange(y);
                onEndYearChange(y);
              }}
              size="compact"
              leftIcon={<BsCalendar2DateFill size={18} />}
            >
              {listYears().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* ── CÓD. TÍTULO (always visible) ────────────────────────────────── */}
      <div className="filter-group">
        <label className="filter-label">Cód. Título</label>
        <div className="filter-input-wrapper">
          <Input
            type="text"
            placeholder="Opcional"
            value={titleCode}
            onChange={(e) => onTitleCodeChange(e.target.value)}
            size="compact"
          />
        </div>
      </div>

      {/* ── CONSULTAR (always visible) ──────────────────────────────────── */}
      <div className="filter-group">
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

      {/* ── RIGHT: Secondary Dropdown Filters ── */}
      <div className="filter-section-right">
        {/* ── LOCAL FILTERS: report tabs ──────────────────────────────────── */}
        {(activeTab === 'general' ||
        activeTab === 'daily' ||
        activeTab === 'monthly' ||
        activeTab === 'yearly') && (
        <>
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
                  <option key={user} value={user}>{user}</option>
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
                  <option key={method} value={method}>{method}</option>
                ))}
              </Select>
            </div>
          </div>
        </>
      )}

      {/* ── LOCAL FILTERS: yearly-dashboard ─────────────────────────────── */}
      {activeTab === 'yearly-dashboard' && (
        <div className="filter-group">
          <label className="filter-label">Filtrar por Año</label>
          <div className="filter-input-wrapper">
            <Select
              value={localDashboardYear}
              onChange={(e) => onLocalDashboardYearChange(e.target.value)}
              size="compact"
              leftIcon={<BsCalendar2DateFill size={18} />}
            >
              <option value="">Todos</option>
              {availableDashboardYears?.map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* ── LOCAL FILTERS: monthly-dashboard ────────────────────────────── */}
      {activeTab === 'monthly-dashboard' && (
        <>
          {availableDashboardYears && availableDashboardYears.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Filtrar por Año</label>
              <div className="filter-input-wrapper">
                <Select
                  value={localDashboardYear || ''}
                  onChange={(e) => onLocalDashboardYearChange(e.target.value)}
                  size="compact"
                  leftIcon={<BsCalendar2DateFill size={18} />}
                >
                  <option value="">Todos</option>
                  {availableDashboardYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
            </div>
          )}
          <div className="filter-group">
            <label className="filter-label">Filtrar por Mes</label>
            <div className="filter-input-wrapper">
              <Select
                value={localDashboardMonth || ''}
                onChange={(e) => onLocalDashboardMonthChange?.(e.target.value)}
                size="compact"
                leftIcon={<BsCalendar2DateFill size={18} />}
              >
                <option value="">Todos</option>
                {getAvailableMonthNums(startYear).map((num) => (
                  <option key={num} value={String(num)}>
                    {MONTH_NAMES[num - 1]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </>
      )}

      </div>
    </div>
  );
};

