import React, { useState, useMemo, useEffect } from 'react';
import '../styles/PaymentsPage.css';
import { PaymentFilters } from '../components/PaymentFilters';
import { PaymentsTable } from '../components/PaymentsTable';
import { PaymentReadingsTable } from '../components/PaymentReadingsTable';
import { usePayments } from '../hooks/usePayments';
import { useTranslation } from 'react-i18next';
import { Receipt, FileText, CalendarRange } from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

// ── Tab type ────────────────────────────────────────────────────────────────
type PaymentTab = 'payments' | 'readings' | 'range';

// ── Tab definitions (Open/Closed: add tabs here without touching logic) ──────
const PAYMENT_TABS: TabItem<PaymentTab>[] = [
  { id: 'payments', label: 'Pagos por Orden', icon: <Receipt size={16} /> },
  {
    id: 'readings',
    label: 'Pagos de Lecturas',
    icon: <FileText size={16} />
  },
  {
    id: 'range',
    label: 'Pagos por Rango de Fechas',
    icon: <CalendarRange size={16} />
  }
];

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Generic sort helper — keeps memos DRY */
function applySortConfig<T>(
  data: T[],
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null
): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ── Component ────────────────────────────────────────────────────────────────
export const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();

  // Translate labels at render time so i18n is honoured
  const translatedTabs: TabItem<PaymentTab>[] = [
    {
      ...PAYMENT_TABS[0],
      label: t('accounting.tabs.generalPayments', 'Pagos por Orden')
    },
    {
      ...PAYMENT_TABS[1],
      label: t('accounting.tabs.paymentReadings', 'Pagos de Lecturas')
    },
    {
      ...PAYMENT_TABS[2],
      label: t('accounting.tabs.dateRangeReport', 'Pagos por Rango de Fechas')
    }
  ];

  const {
    payments,
    paymentReadings,
    paymentsByRange,
    isLoading,
    error,
    fetchPayments,
    fetchPaymentReadings,
    fetchPaymentsByDateRange
  } = usePayments();

  const loadingProgress = useSimulatedProgress(isLoading);

  // ── Filter state ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<PaymentTab>('payments');

  // Shared single-date fields (payments + readings tabs)
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [orderValue, setOrderValue] = useState<string>('');

  // Shared local-search / user / method (all tabs)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Date-range tab fields
  const [initDate, setInitDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [limit, setLimit] = useState<string>('50');
  const [offset, setOffset] = useState<string>('0');

  // Sort
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // ── Fetch handler (SRP: dispatches to correct use case) ─────────────────
  const handleFetch = () => {
    if (activeTab === 'payments') {
      fetchPayments(date, Number(orderValue) || 0);
    } else if (activeTab === 'readings') {
      fetchPaymentReadings(date);
    } else {
      fetchPaymentsByDateRange(
        initDate,
        endDate,
        Number(limit) || 50,
        Number(offset) || 0
      );
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  };

  // Reset local filters when tab changes
  useEffect(() => {
    setSearchQuery('');
    setSelectedUser('');
    setSelectedPaymentMethod('');
    setSortConfig(null);
  }, [activeTab]);

  // ── Derived lists (user + method dropdowns) ──────────────────────────────
  const activeDataset = useMemo(() => {
    if (activeTab === 'payments') return payments;
    if (activeTab === 'readings') return paymentReadings;
    return paymentsByRange;
  }, [activeTab, payments, paymentReadings, paymentsByRange]);

  const userList = useMemo(() => {
    const users = activeDataset.map((item: any) => item.paymentUser || '');
    return Array.from(new Set(users)).filter(Boolean) as string[];
  }, [activeDataset]);

  const paymentMethodList = useMemo(() => {
    const methods = activeDataset.map((item: any) => item.paymentMethod || '');
    return Array.from(new Set(methods)).filter(Boolean) as string[];
  }, [activeDataset]);

  // ── Filtered + sorted data ───────────────────────────────────────────────
  const applyLocalFilters = <T extends Record<string, any>>(
    data: T[],
    textFields: (keyof T)[]
  ): T[] => {
    let result = data;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        textFields.some((f) => item[f]?.toString().toLowerCase().includes(q))
      );
    }
    if (selectedUser) {
      result = result.filter((item) => item.paymentUser === selectedUser);
    }
    if (selectedPaymentMethod) {
      result = result.filter(
        (item) => item.paymentMethod === selectedPaymentMethod
      );
    }
    return applySortConfig(result, sortConfig);
  };

  const filteredPayments = useMemo(
    () =>
      applyLocalFilters(payments, [
        'name',
        'cardId',
        'cadastralKey',
        'incomeCode'
      ]),
    [payments, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]
  );

  const filteredReadings = useMemo(
    () =>
      applyLocalFilters(paymentReadings, [
        'name',
        'lastName',
        'cardId',
        'cadastralKey',
        'incomeCode'
      ]),
    [
      paymentReadings,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      sortConfig
    ]
  );

  const filteredPaymentsByRange = useMemo(
    () =>
      applyLocalFilters(paymentsByRange, [
        'name',
        'cardId',
        'cadastralKey',
        'incomeCode'
      ]),
    [
      paymentsByRange,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      sortConfig
    ]
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="payments-page">
      <Tabs
        tabs={translatedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <PaymentFilters
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        date={date}
        onDateChange={setDate}
        orderValue={orderValue}
        onOrderValueChange={setOrderValue}
        onFetch={handleFetch}
        isLoading={isLoading}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        userList={userList}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        paymentMethodList={paymentMethodList}
        initDate={initDate}
        onInitDateChange={setInitDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        limit={limit}
        onLimitChange={setLimit}
        offset={offset}
        onOffsetChange={setOffset}
      />

      {error ? (
        <div className="payments-error-container">
          <div className="payments-error-dot" />
          <span className="payments-error-text">{error}</span>
        </div>
      ) : isLoading ? (
        <div className="payments-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Loading...')}
          />
        </div>
      ) : activeTab === 'payments' ? (
        <PaymentsTable
          data={filteredPayments}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : activeTab === 'readings' ? (
        <PaymentReadingsTable
          data={filteredReadings}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : (
        <PaymentsTable
          data={filteredPaymentsByRange}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
};
