import { useState, useMemo, useEffect } from 'react';
import { usePayments } from './usePayments';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export type PaymentTab = 'payments' | 'readings' | 'range';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// ── Generic helpers ──────────────────────────────────────────────────────────
function applySortConfig<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function applyLocalFilters<T extends Record<string, any>>(
  data: T[],
  textFields: (keyof T)[],
  searchQuery: string,
  selectedUser: string,
  selectedPaymentMethod: string,
  sortConfig: SortConfig | null
): T[] {
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
}

// ── ViewModel Hook ───────────────────────────────────────────────────────────
export const usePaymentsViewModel = () => {
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

  // ── Form & Tab State ──
  const [activeTab, setActiveTab] = useState<PaymentTab>('payments');

  // Shared single-date fields
  const [date, setDate] = useState<string>(dateService.getCurrentDateString());
  const [orderValue, setOrderValue] = useState<string>('');

  // Shared local-search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Date-range tab fields
  const [initDate, setInitDate] = useState<string>(
    dateService.getCurrentDateString()
  );
  const [endDate, setEndDate] = useState<string>(
    dateService.getCurrentDateString()
  );
  const [limit, setLimit] = useState<string>('50');
  const [offset, setOffset] = useState<string>('0');

  // Sorting
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Reset local filters when changing tabs
  useEffect(() => {
    setSearchQuery('');
    setSelectedUser('');
    setSelectedPaymentMethod('');
    setSortConfig(null);
  }, [activeTab]);

  // ── Submit Handling ──
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

  const handleSort = (key: string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  // ── Derived Dropdown Lists ──
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

  // ── Derived Sorted & Filtered Arrays ──
  const filteredPayments = useMemo(
    () =>
      applyLocalFilters(
        payments,
        ['name', 'cardId', 'cadastralKey', 'incomeCode'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [payments, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]
  );

  const filteredReadings = useMemo(
    () =>
      applyLocalFilters(
        paymentReadings,
        ['name', 'lastName', 'cardId', 'cadastralKey', 'incomeCode'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
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
      applyLocalFilters(
        paymentsByRange,
        ['name', 'cardId', 'cadastralKey', 'incomeCode'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [
      paymentsByRange,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      sortConfig
    ]
  );

  return {
    state: {
      isLoading,
      error,
      activeTab,
      date,
      orderValue,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      initDate,
      endDate,
      limit,
      offset,
      sortConfig,
      userList,
      paymentMethodList,
      filteredPayments,
      filteredReadings,
      filteredPaymentsByRange
    },
    actions: {
      setActiveTab,
      setDate,
      setOrderValue,
      setSearchQuery,
      setSelectedUser,
      setSelectedPaymentMethod,
      setInitDate,
      setEndDate,
      setLimit,
      setOffset,
      handleFetch,
      handleSort
    }
  };
};
