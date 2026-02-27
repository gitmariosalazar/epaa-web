import React from 'react';
import '../styles/EntryDataFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../../../../shared/presentation/components/DatePicker/DatePicker';
import { Button } from '@/shared/presentation/components/Button/Button';

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
      {/* ── LEFT: date range + Fetch ── */}
      <div className="entry-filter-left">
        <div className="entry-filter-group">
          <label className="entry-filter-label">
            {t('entryData.filters.startDate', 'Desde')}
          </label>
          <div className="entry-filter-input-wrapper">
            <DatePicker value={startDate} onChange={onStartDateChange} />
          </div>
        </div>

        <div className="entry-filter-group">
          <label className="entry-filter-label">
            {t('entryData.filters.endDate', 'Hasta')}
          </label>
          <div className="entry-filter-input-wrapper">
            <DatePicker value={endDate} onChange={onEndDateChange} />
          </div>
        </div>

        <Button onClick={onFetch} disabled={!canFetch} size="sm">
          {isLoading ? (
            <div className="entry-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('entryData.filters.fetch', 'Consultar')}
        </Button>
      </div>

      {/* ── RIGHT: search + conditional dropdowns ── */}
      <div className="entry-filter-right">
        {/* Search — always visible */}
        <div className="entry-filter-group entry-filter-group--search">
          <label className="entry-filter-label">
            {t('entryData.filters.search', 'Buscar')}
          </label>
          <div className="entry-filter-input-wrapper">
            <Search className="entry-filter-icon" size={18} />
            <input
              type="text"
              placeholder={t(
                'entryData.filters.searchPlaceholder',
                'Buscar registros...'
              )}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="entry-filter-input"
            />
          </div>
        </div>

        {/* Collector — grouped | collector | fullBreakdown */}
        {show.collector && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.collector', 'Cobrador')}
            </label>
            <div className="entry-filter-input-wrapper">
              <select
                className="entry-filter-select"
                value={selectedCollector}
                onChange={(e) => onCollectorChange(e.target.value)}
              >
                <option value="">
                  {t('entryData.filters.allCollectors', 'Todos')}
                </option>
                {collectorList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Title Code — grouped | fullBreakdown */}
        {show.titleCode && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.titleCode', 'Código T.')}
            </label>
            <div className="entry-filter-input-wrapper">
              <select
                className="entry-filter-select"
                value={selectedTitleCode}
                onChange={(e) => onTitleCodeChange(e.target.value)}
              >
                <option value="">
                  {t('entryData.filters.allTitleCodes', 'Todos')}
                </option>
                {titleCodeList.map((tc) => (
                  <option key={tc} value={tc}>
                    {tc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Payment Method — grouped | paymentMethod | fullBreakdown */}
        {show.paymentMethod && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.paymentMethod', 'Método de Pago')}
            </label>
            <div className="entry-filter-input-wrapper">
              <select
                className="entry-filter-select"
                value={selectedPaymentMethod}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
              >
                <option value="">
                  {t('entryData.filters.allMethods', 'Todos')}
                </option>
                {paymentMethodList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Status — grouped | paymentMethod | fullBreakdown */}
        {show.status && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('entryData.filters.status', 'Estado')}
            </label>
            <div className="entry-filter-input-wrapper">
              <select
                className="entry-filter-select"
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="">
                  {t('entryData.filters.allStatuses', 'Todos')}
                </option>
                {ESTADO_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
