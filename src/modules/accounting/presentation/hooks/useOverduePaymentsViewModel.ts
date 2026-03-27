import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  OverduePayment,
  OverdueSummary,
  YearlyOverdueSummary
} from '../../domain/models/OverdueReading';
import type { PendingReading } from '../../domain/models/PendingReading';
import { usePaymentsContext } from '../context/PaymentsContext';

export type OverduePaymentTab = 'payments' | 'yearly_summary' | 'dashboard_global' | 'dashboard_anual';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

const LIMIT_SIZE = 50;

function applySortConfig<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function compareNumeric(actual: number, op: string, target: number): boolean {
  switch (op) {
    case '>': return actual > target;
    case '<': return actual < target;
    case '>=': return actual >= target;
    case '<=': return actual <= target;
    case '=':
    case '==':
    case '===':
    case '': return actual === target;
    case '!=':
    case '!==':
    case '<>': return actual !== target;
    default: return false;
  }
}

/**
 * Generic filter function that supports numeric operators and text search
 */
function applyGenericFilters<T>(
  data: T[],
  searchQuery: string,
  searchField: string,
  searchOperator: string,
  numericFields: string[]
): T[] {
  if (!searchQuery) return data;

  const q = searchQuery.toLowerCase().trim();
  const numValue = parseFloat(q);

  return data.filter((item: any) => {
    if (searchField === 'all') {
      return Object.values(item).some((val) =>
        String(val ?? '').toLowerCase().includes(q)
      );
    }

    const value = item[searchField];

    if (numericFields.includes(searchField) && !isNaN(numValue)) {
      return compareNumeric(Number(value || 0), searchOperator, numValue);
    }

    return String(value ?? '').toLowerCase().includes(q);
  });
}

// ── ViewModel Hook ────────────────────────────────────────────────────────────
export const useOverduePaymentsViewModel = () => {
  const {
    findAllOverduePayments,
    findPendingReadingsByCadastralKeyOrCardId,
    findOverdueSummary,
    findYearlyOverdueSummary
  } = usePaymentsContext();

  // ── 1. LIST STATE ──
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // ── SUMMARY STATE ──
  const [overdueSummary, setOverdueSummary] = useState<OverdueSummary | null>(
    null
  );
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // ── YEARLY SUMMARY STATE ──
  const [yearlyOverdueSummary, setYearlyOverdueSummary] = useState<
    YearlyOverdueSummary[]
  >([]);
  const [isYearlySummaryLoading, setIsYearlySummaryLoading] = useState(false);
  const [yearlySummaryError, setYearlySummaryError] = useState<string | null>(null);
  const [isYearlyRefreshing, setIsYearlyRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<OverduePaymentTab>('payments');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filter State (Shared between tabs or kept separate if needed, but here shared for simplicity)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [searchOperator, setSearchOperator] = useState('=');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Dashboard specific filter
  const [dashboardYear, setDashboardYear] = useState('all');

  // ── 2. DATA FETCHING ──
  const fetchOverdueSummary = useCallback(async (isRefresh = false) => {
    setIsSummaryLoading(true);
    if (isRefresh) {
      setIsRefreshing(true);
      setOverdueSummary(null); // Clear data to trigger loading state if needed
    }
    setSummaryError(null);
    try {
      const result = await findOverdueSummary.execute();
      setOverdueSummary(result);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSummaryLoading(false);
      setIsRefreshing(false);
    }
  }, [findOverdueSummary]);

  const fetchYearlyOverdueSummary = useCallback(async (isRefresh = false) => {
    setIsYearlySummaryLoading(true);
    if (isRefresh) {
      setIsYearlyRefreshing(true);
      setYearlyOverdueSummary([]); // Clear data to trigger loading UI
    }
    setYearlySummaryError(null);
    try {
      const result = await findYearlyOverdueSummary.execute();
      setYearlyOverdueSummary(result || []);
    } catch (err) {
      setYearlySummaryError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsYearlySummaryLoading(false);
      setIsYearlyRefreshing(false);
    }
  }, [findYearlyOverdueSummary]);

  const fetchOverduePayments = useCallback(
    async (currentOffset: number = 0, append = false, isRefresh = false) => {
      setIsLoading(true);
      if (isRefresh) {
        setIsRefreshing(true);
        setOverduePayments([]); // Clear to trigger massive loading overlay
      }
      setError(null);
      try {
        if (activeTab === 'payments') {
          const result = await findAllOverduePayments.execute(LIMIT_SIZE, currentOffset);
          const data: OverduePayment[] = (result || []).map((item) => ({
            ...item,
            totalDue:
              (Number(item.totalTrashRate) || 0) +
              (Number(item.totalEpaaValue) || 0) +
              (Number(item.totalSurcharge) || 0) +
              (Number(item.totalOldSurcharge) || 0) +
              (Number(item.totalOldImprovementsInterest) || 0)
          }));
          if (data.length < LIMIT_SIZE) setHasMore(false);
          setOverduePayments((prev) => (append ? [...prev, ...data] : data));
        } else if (activeTab === 'yearly_summary' || activeTab === 'dashboard_anual') {
          await fetchYearlyOverdueSummary(isRefresh);
        } else if (activeTab === 'dashboard_global') {
          await Promise.all([
            fetchYearlyOverdueSummary(isRefresh),
            fetchOverdueSummary(isRefresh)
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [findAllOverduePayments, activeTab, fetchYearlyOverdueSummary, fetchOverdueSummary]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    // Reset filters when changing tabs to avoid confusion
    handleClearSearch();
    fetchOverduePayments(0, false);
  }, [activeTab]); // Trigger on tab change

  // ── 3. HANDLERS ──
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchField('all');
    setSearchOperator('=');
    setSortConfig(null);
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    const newOffset = offset + LIMIT_SIZE;
    setOffset(newOffset);
    fetchOverduePayments(newOffset, true);
  };

  const fetchPendingReadings = useCallback(
    async (searchValue: string) => {
      if (!searchValue || searchValue.trim() === '') {
        console.warn('Empty search value for pending readings');
        return;
      }
      setIsPendingModalOpen(true);
      setIsPendingLoading(true);
      setPendingError(null);
      setPendingReadings([]);
      try {
        const result = await findPendingReadingsByCadastralKeyOrCardId.execute(searchValue);
        setPendingReadings(result || []);
      } catch (err) {
        setPendingError(err instanceof Error ? err.message : 'Error al buscar lecturas');
      } finally {
        setIsPendingLoading(false);
      }
    },
    [findPendingReadingsByCadastralKeyOrCardId]
  );

  // ── 4. FILTERING LOGIC ──
  
  // Define numeric fields for both types to enable operator search
  const paymentNumericFields = ['monthsPastDue', 'totalDue', 'totalEpaaValue', 'totalTrashRate'];
  const yearlyNumericFields = [
    'year', 
    'clientsWithDebt', 
    'totalUniqueCadastralKeysByYear', 
    'totalMonthsPastDue',
    'totalDebtAmount',
    'totalEpaaValue'
  ];

  const displayedPayments = applySortConfig(
    applyGenericFilters(overduePayments, searchQuery, searchField, searchOperator, paymentNumericFields),
    sortConfig
  );

  const displayedYearlySummary = applySortConfig(
    applyGenericFilters(
      dashboardYear === 'all' 
        ? yearlyOverdueSummary 
        : yearlyOverdueSummary.filter(item => item.year.toString() === dashboardYear), 
      searchQuery, searchField, searchOperator, yearlyNumericFields
    ),
    sortConfig
  );

  const resolvedDashboardYear = useMemo(() => {
    if (dashboardYear === 'all' && activeTab === 'dashboard_anual' && yearlyOverdueSummary.length > 0) {
      return Math.max(...yearlyOverdueSummary.map(y => y.year)).toString();
    }
    return dashboardYear;
  }, [dashboardYear, activeTab, yearlyOverdueSummary]);

  const dashboardData = useMemo(() => {
    if (resolvedDashboardYear === 'all') return yearlyOverdueSummary;
    return yearlyOverdueSummary.filter(item => item.year.toString() === resolvedDashboardYear);
  }, [yearlyOverdueSummary, resolvedDashboardYear]);

  // ── 5. RETURNED VALUES ──
  return {
    overduePayments: displayedPayments,
    displayedYearlySummary, // Return the filtered yearly data
    dashboardData,
    dashboardYear,
    resolvedDashboardYear,
    setDashboardYear,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    searchOperator,
    setSearchOperator,
    sortConfig,
    setSortConfig,
    activeTab,
    setActiveTab,
    handleClearSearch,
    handleSort,
    handleLoadMore,
    pendingReadings,
    setPendingReadings,
    isPendingLoading,
    pendingError,
    isPendingModalOpen,
    setIsPendingModalOpen,
    fetchPendingReadings,
    overdueSummary,
    isSummaryLoading,
    summaryError,
    fetchOverdueSummary,
    yearlyOverdueSummary, // Restored actual raw array. Dropping alias mapping to `displayedYearlySummary` to prevent dropdown starvation.
    isYearlySummaryLoading,
    isYearlyRefreshing,
    yearlySummaryError,
    fetchYearlyOverdueSummary,
    fetchOverduePayments
  };
};
