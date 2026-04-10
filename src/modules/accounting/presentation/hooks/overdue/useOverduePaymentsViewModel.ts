import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  MonthlyDebtSummary,
  OverduePayment,
  OverdueSummary,
  YearlyOverdueSummary
} from '../../../domain/models/OverdueReading';
import type { PendingReading } from '../../../domain/models/PendingReading';
import { usePaymentsContext } from '../../context/payments/PaymentsContext';

export type OverduePaymentTab =
  | 'dashboard_global'
  | 'yearly_summary'
  | 'payments'
  | 'dashboard_anual'
  | 'monthly_debt_summary';

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
    case '>':
      return actual > target;
    case '<':
      return actual < target;
    case '>=':
      return actual >= target;
    case '<=':
      return actual <= target;
    case '=':
    case '==':
    case '===':
    case '':
      return actual === target;
    case '!=':
    case '!==':
    case '<>':
      return actual !== target;
    default:
      return false;
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
        String(val ?? '')
          .toLowerCase()
          .includes(q)
      );
    }

    const value = item[searchField];

    if (numericFields.includes(searchField) && !isNaN(numValue)) {
      return compareNumeric(Number(value || 0), searchOperator, numValue);
    }

    return String(value ?? '')
      .toLowerCase()
      .includes(q);
  });
}

// ── ViewModel Hook ────────────────────────────────────────────────────────────
/**
 * ViewModel for managing overdue payment data, summaries, and dashboards.
 * Handles state, data fetching, filtering, and sorting logic.
 */
export const useOverduePaymentsViewModel = () => {
  // ── 1. DEPENDENCIES & CONTEXT ──
  const {
    findAllOverduePayments,
    findPendingReadingsByCadastralKeyOrCardId,
    findOverdueSummary,
    findYearlyOverdueSummary,
    findMonthlyDebtSummary
  } = usePaymentsContext();

  // ── 2. UI & NAVIGATION STATE ──
  const [activeTab, setActiveTab] =
    useState<OverduePaymentTab>('dashboard_global');
  const [dashboardYear, setDashboardYear] = useState('all');

  // ── 3. FILTER & SORT STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [searchOperator, setSearchOperator] = useState('=');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // ── 4. PAYMENTS LIST STATE ──
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // ── 5. SUMMARIES & DASHBOARD STATE ──
  // Global Summary
  const [overdueSummary, setOverdueSummary] = useState<OverdueSummary | null>(
    null
  );
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Yearly Summary
  const [yearlyOverdueSummary, setYearlyOverdueSummary] = useState<
    YearlyOverdueSummary[]
  >([]);
  const [isYearlySummaryLoading, setIsYearlySummaryLoading] = useState(false);
  const [yearlySummaryError, setYearlySummaryError] = useState<string | null>(
    null
  );
  const [isYearlyRefreshing, setIsYearlyRefreshing] = useState(false);

  // Monthly Summary
  const [monthlyDebtSummary, setMonthlyDebtSummary] = useState<
    MonthlyDebtSummary[]
  >([]);
  const [isMonthlyDebtSummaryLoading, setIsMonthlyDebtSummaryLoading] =
    useState(false);
  const [monthlyDebtSummaryError, setMonthlyDebtSummaryError] = useState<
    string | null
  >(null);
  const [isMonthlyDebtSummaryRefreshing, setIsMonthlyDebtSummaryRefreshing] =
    useState(false);

  // ── 6. PENDING READINGS STATE (Search Modal) ──
  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // ── 7. DATA FETCHING ACTIONS ──

  /** Fetches global overdue summary metrics */
  const fetchOverdueSummary = useCallback(
    async (isRefresh = false) => {
      setIsSummaryLoading(true);
      if (isRefresh) {
        setIsRefreshing(true);
        setOverdueSummary(null);
      }
      setSummaryError(null);
      try {
        const result = await findOverdueSummary.execute();
        setOverdueSummary(result);
      } catch (err) {
        setSummaryError(
          err instanceof Error ? err.message : 'Error desconocido'
        );
      } finally {
        setIsSummaryLoading(false);
        setIsRefreshing(false);
      }
    },
    [findOverdueSummary]
  );

  /** Fetches yearly summary data for charts and tables */
  const fetchYearlyOverdueSummary = useCallback(
    async (isRefresh = false) => {
      setIsYearlySummaryLoading(true);
      if (isRefresh) {
        setIsYearlyRefreshing(true);
        setYearlyOverdueSummary([]);
      }
      setYearlySummaryError(null);
      try {
        const result = await findYearlyOverdueSummary.execute();
        setYearlyOverdueSummary(result || []);
      } catch (err) {
        setYearlySummaryError(
          err instanceof Error ? err.message : 'Error desconocido'
        );
      } finally {
        setIsYearlySummaryLoading(false);
        setIsYearlyRefreshing(false);
      }
    },
    [findYearlyOverdueSummary]
  );

  /** Fetches monthly breakdown of debt */
  const fetchMonthlyDebtSummary = useCallback(
    async (isRefresh = false) => {
      setIsMonthlyDebtSummaryLoading(true);
      if (isRefresh) {
        setIsMonthlyDebtSummaryRefreshing(true);
        setMonthlyDebtSummary([]);
      }
      setMonthlyDebtSummaryError(null);
      try {
        const result = await findMonthlyDebtSummary.execute();
        setMonthlyDebtSummary(result || []);
      } catch (err) {
        setMonthlyDebtSummaryError(
          err instanceof Error ? err.message : 'Error desconocido'
        );
      } finally {
        setIsMonthlyDebtSummaryLoading(false);
        setIsMonthlyDebtSummaryRefreshing(false);
      }
    },
    [findMonthlyDebtSummary]
  );

  /** Primary orchestrator for fetching data based on active tab */
  const fetchOverduePayments = useCallback(
    async (currentOffset: number = 0, append = false, isRefresh = false) => {
      setIsLoading(true);
      if (isRefresh) {
        setIsRefreshing(true);
        setOverduePayments([]);
      }
      setError(null);
      try {
        if (activeTab === 'payments') {
          const result = await findAllOverduePayments.execute(
            LIMIT_SIZE,
            currentOffset
          );
          const data: OverduePayment[] = (result || []).map((item) => ({
            ...item,
            totalDue:
              (Number(item.totalTrashRate) || 0) +
              (Number(item.totalEpaaValue) || 0) +
              (Number(item.totalSurcharge) || 0) +
              (Number(item.totalOldImprovementsInterest) || 0)
          }));
          if (data.length < LIMIT_SIZE) setHasMore(false);
          setOverduePayments((prev) => (append ? [...prev, ...data] : data));
        } else if (
          activeTab === 'yearly_summary' ||
          activeTab === 'dashboard_anual' ||
          activeTab === 'monthly_debt_summary'
        ) {
          await Promise.all([
            fetchYearlyOverdueSummary(isRefresh),
            fetchMonthlyDebtSummary(isRefresh)
          ]);
        } else if (activeTab === 'dashboard_global') {
          await Promise.all([
            fetchYearlyOverdueSummary(isRefresh),
            fetchOverdueSummary(isRefresh),
            fetchMonthlyDebtSummary(isRefresh)
          ]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      findAllOverduePayments,
      activeTab,
      fetchYearlyOverdueSummary,
      fetchOverdueSummary,
      fetchMonthlyDebtSummary
    ]
  );

  /** Searches for pending readings for a specific account */
  const fetchPendingReadings = useCallback(
    async (searchValue: string) => {
      if (!searchValue || searchValue.trim() === '') return;

      setIsPendingModalOpen(true);
      setIsPendingLoading(true);
      setPendingError(null);
      setPendingReadings([]);
      try {
        const result =
          await findPendingReadingsByCadastralKeyOrCardId.execute(searchValue);
        setPendingReadings(result || []);
      } catch (err) {
        setPendingError(
          err instanceof Error ? err.message : 'Error al buscar lecturas'
        );
      } finally {
        setIsPendingLoading(false);
      }
    },
    [findPendingReadingsByCadastralKeyOrCardId]
  );

  // ── 8. DERIVED DATA (MEMOS) ──

  // Filtered/Sorted Payments
  const displayedPayments = useMemo(() => {
    const paymentNumericFields = [
      'monthsPastDue',
      'totalDue',
      'totalEpaaValue',
      'totalTrashRate'
    ];
    return applySortConfig(
      applyGenericFilters(
        overduePayments,
        searchQuery,
        searchField,
        searchOperator,
        paymentNumericFields
      ),
      sortConfig
    );
  }, [
    overduePayments,
    searchQuery,
    searchField,
    searchOperator,
    sortConfig
  ]);

  // Filtered/Sorted Yearly Summary
  const displayedYearlySummary = useMemo(() => {
    const yearlyNumericFields = [
      'year',
      'clientsWithDebt',
      'totalUniqueCadastralKeysByYear',
      'totalMonthsPastDue',
      'totalDebtAmount',
      'totalEpaaValue'
    ];
    return applySortConfig(
      applyGenericFilters(
        dashboardYear === 'all'
          ? yearlyOverdueSummary
          : yearlyOverdueSummary.filter(
              (item) => item.year.toString() === dashboardYear
            ),
        searchQuery,
        searchField,
        searchOperator,
        yearlyNumericFields
      ),
      sortConfig
    );
  }, [
    yearlyOverdueSummary,
    dashboardYear,
    searchQuery,
    searchField,
    searchOperator,
    sortConfig
  ]);

  // Filtered/Sorted Monthly Summary
  const displayedMonthlyDebtSummary = useMemo(() => {
    const monthlyNumericFields = [
      'year',
      'month',
      'totalUniqueClients',
      'totalUniqueCadastralKeys',
      'clientsWithDebtThisMonth',
      'totalMonthsPastDue',
      'totalDebtAmount',
      'totalEpaaValue'
    ];
    return applySortConfig(
      applyGenericFilters(
        dashboardYear === 'all'
          ? monthlyDebtSummary
          : monthlyDebtSummary.filter(
              (item) => item.year.toString() === dashboardYear
            ),
        searchQuery,
        searchField,
        searchOperator,
        monthlyNumericFields
      ),
      sortConfig
    );
  }, [
    monthlyDebtSummary,
    dashboardYear,
    searchQuery,
    searchField,
    searchOperator,
    sortConfig
  ]);

  // Dashboard calculations
  const resolvedDashboardYear = useMemo(() => {
    if (
      dashboardYear === 'all' &&
      activeTab === 'dashboard_anual' &&
      yearlyOverdueSummary.length > 0
    ) {
      return Math.max(...yearlyOverdueSummary.map((y) => y.year)).toString();
    }
    return dashboardYear;
  }, [dashboardYear, activeTab, yearlyOverdueSummary]);

  /** Data for the specific year selected in the dashboard */
  const selectedYearData = useMemo(() => {
    return (yearlyOverdueSummary || []).find(
      (item) => item.year.toString() === resolvedDashboardYear
    ) || null;
  }, [yearlyOverdueSummary, resolvedDashboardYear]);

  /** Filtered yearly data for charts/tables */
  const dashboardData = useMemo(() => {
    if (resolvedDashboardYear === 'all') return yearlyOverdueSummary;
    return yearlyOverdueSummary.filter(
      (item) => item.year.toString() === resolvedDashboardYear
    );
  }, [yearlyOverdueSummary, resolvedDashboardYear]);

  // ── 9. EVENT HANDLERS ──

  /** Resets search and sort state */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchField('all');
    setSearchOperator('=');
    setSortConfig(null);
  }, []);

  /** Toggles sort direction for a given key */
  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  }, []);

  /** Pagination handler for the payments list */
  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    const newOffset = offset + LIMIT_SIZE;
    setOffset(newOffset);
    fetchOverduePayments(newOffset, true);
  }, [hasMore, isLoading, offset, fetchOverduePayments]);

  // ── 10. SIDE EFFECTS ──

  // Fetch initial data or data on tab change
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    handleClearSearch();
    fetchOverduePayments(0, false);
  }, [activeTab]);

  // ── 11. EXPOSED API ──
  return {
    // UI & Navigation
    activeTab,
    setActiveTab,
    dashboardYear,
    setDashboardYear,
    resolvedDashboardYear,
    selectedYearData,

    // Filters & Sorting
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    searchOperator,
    setSearchOperator,
    sortConfig,
    setSortConfig,
    handleClearSearch,
    handleSort,

    // Payments List
    overduePayments: displayedPayments,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    handleLoadMore,
    fetchOverduePayments,

    // Summaries & Metrics
    globalSummary: overdueSummary, // Alias for better clarity in dashboards
    overdueSummary,
    isSummaryLoading,
    summaryError,
    fetchOverdueSummary,

    yearlyOverdueSummary,
    displayedYearlySummary,
    isYearlySummaryLoading,
    isYearlyRefreshing,
    yearlySummaryError,
    fetchYearlyOverdueSummary,

    monthlyDebtSummary,
    displayedMonthlyDebtSummary,
    isMonthlyDebtSummaryLoading,
    isMonthlyDebtSummaryRefreshing,
    monthlyDebtSummaryError,
    fetchMonthlyDebtSummary,

    // Dashboard Data
    dashboardData,

    // Pending Readings Modal
    pendingReadings,
    isPendingLoading,
    pendingError,
    isPendingModalOpen,
    setIsPendingModalOpen,
    setPendingReadings,
    fetchPendingReadings,

    // Low-level Use Case
    findOverdueSummary
  };
};


