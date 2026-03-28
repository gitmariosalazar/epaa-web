import React from 'react';
import '../styles/EntryDataFilters.css';
import { CreditCard, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import { VscSymbolString } from 'react-icons/vsc';
import { FaFileInvoiceDollar, FaList } from 'react-icons/fa';

// ── Tab type ──────────────────────────────────────────────────────────────────
export type EntryDataTab =
  | 'grouped'
  | 'collector'
  | 'paymentMethod'
  | 'fullBreakdown';

// ── Fixed status options (always shown, independent of loaded data) ──────────
const ESTADO_OPTIONS = ['O', 'A', 'P', 'B'] as const;

// ── Filter visibility rules per tab ──────────────────────────────────────────
//   grouped       → search | collector | titleCode | paymentMethod | status
//   collector     → search | collector
//   paymentMethod → search | paymentMethod | status
//   fullBreakdown → search | collector | titleCode | paymentMethod | status
const SHOW: Record<
  EntryDataTab,
  {
    collector: boolean;
    titleCode: boolean;
    paymentMethod: boolean;
    status: boolean;
  }
> = {
  grouped: {
    collector: true,
    titleCode: true,
    paymentMethod: true,
    status: true
  },
  collector: {
    collector: true,
    titleCode: false,
    paymentMethod: false,
    status: false
  },
  paymentMethod: {
    collector: false,
    titleCode: false,
    paymentMethod: true,
    status: true
  },
  fullBreakdown: {
    collector: true,
    titleCode: true,
    paymentMethod: true,
    status: true
  }
};

// ── Props (ISP) ───────────────────────────────────────────────────────────────
export interface EntryDataFiltersProps {
  activeTab: EntryDataTab;

  // Date range (all tabs)
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;

  // Local search (all tabs)
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;

  // Collector
  selectedCollector: string;
  onCollectorChange: (val: string) => void;
  collectorList: string[];

  // Title Code
  selectedTitleCode: string;
  onTitleCodeChange: (val: string) => void;
  titleCodeList: string[];

  // Payment method
  selectedPaymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  paymentMethodList: string[];

  // Status
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  // statusList is NOT a prop — ESTADO_OPTIONS is fixed inside the component
}

// ── Component ─────────────────────────────────────────────────────────────────
export const EntryDataFilters: React.FC<EntryDataFiltersProps> = ({
  activeTab,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onFetch,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  selectedCollector,
  onCollectorChange,
  collectorList,
  selectedTitleCode,
  onTitleCodeChange,
  titleCodeList,
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentMethodList,
  selectedStatus,
  onStatusChange
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && Boolean(startDate && endDate);
  const show = SHOW[activeTab];

  return (
    <div className="entry-filters">
      {/* ── LEFT: Primary Inputs & Actions ── */}
      <div className="filter-section-left">
        <div className="filter-group filter-group--range">
          <label className="filter-label">
            {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
          </label>
          <div className="filter-input-wrapper">
            <DateRangePicker
              size="compact"
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                onStartDateChange(start);
                onEndDateChange(end);
              }}
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
            : t('entryData.filters.fetch', 'Consultar')}
        </Button>

        <div className="filter-group filter-group--search">
          <label className="filter-label">
            {t('accounting.filters.search', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder={t(
                'accounting.filters.searchPlaceholder',
                'Buscar...'
              )}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchQueryChange(e.target.value)
              }
              size="compact"
              leftIcon={<Search size={16} />}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Secondary Dropdown Filters ── */}
      <div className="filter-section-right">
        {show.collector && (
          <div className="filter-group">
            <label className="filter-label">
              {t('entryData.filters.collector', 'Cobrador')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                value={selectedCollector}
                onChange={(e) => onCollectorChange(e.target.value)}
                size="compact"
                leftIcon={<User size={18} />}
              >
                <option value="">
                  {t('entryData.filters.allCollectors', 'Todos')}
                </option>
                {collectorList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {show.titleCode && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.titleCode', 'Código T.')}
            </label>
            <div className="entry-filter-input-wrapper">
              <Select
                value={selectedTitleCode}
                onChange={(e) => onTitleCodeChange(e.target.value)}
                size="compact"
                leftIcon={<VscSymbolString size={18} />}
              >
                <option value="">
                  {t('entryData.filters.allTitleCodes', 'Todos')}
                </option>
                {titleCodeList.map((tc) => (
                  <option key={tc} value={tc}>
                    {tc}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {show.paymentMethod && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.paymentMethod', 'Método de Pago')}
            </label>
            <div className="entry-filter-input-wrapper">
              <Select
                value={selectedPaymentMethod}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                size="compact"
                leftIcon={<FaFileInvoiceDollar size={18} />}
              >
                <option value="">
                  {t('entryData.filters.allMethods', 'Todos')}
                </option>
                {paymentMethodList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}

        {show.status && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.status', 'Estado')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                size="compact"
                leftIcon={<FaList size={18} />}
              >
                <option value="">
                  {t('entryData.filters.allStatuses', 'Todos')}
                </option>
                {ESTADO_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
