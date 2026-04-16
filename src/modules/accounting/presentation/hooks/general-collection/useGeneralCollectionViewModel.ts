import { useState, useMemo } from 'react';
import { useGeneralCollection } from './useGeneralCollection';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { dateFilter } from '../../../domain/dto/params/DataEntryParams';

export type GeneralCollectionTab =
  | 'dashboard'
  | 'yearly-dashboard'
  | 'yearly-query'
  | 'monthly-dashboard'
  | 'general'
  | 'daily'
  | 'monthly'
  | 'yearly';
export type SortDirection = 'asc' | 'desc';
export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// ── Pure helpers ──────────────────────────────────────────────────────────────
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
    result = result.filter(
      (item) => (item.paymentUser || item.collector) === selectedUser
    );
  }
  if (selectedPaymentMethod) {
    result = result.filter(
      (item) => item.paymentMethod === selectedPaymentMethod
    );
  }
  return applySortConfig(result, sortConfig);
}

// ── Per-tab filter state ──────────────────────────────────────────────────────
// SRP: each tab owns its own filter values independently.
// No cross-tab contamination — switching tabs preserves each tab's last state.
interface TabFilters {
  filterType: dateFilter;
  startYear: number;
  endYear: number;
  initDate: string;
  endDate: string;
  titleCode: string;
  searchQuery: string;
  selectedUser: string;
  selectedPaymentMethod: string;
  sortConfig: SortConfig | null;
  localDashboardYear: string;
  localDashboardMonth: string;
}

function defaultFiltersForTab(tab: GeneralCollectionTab): TabFilters {
  const today = dateService.getCurrentDateString();
  const year = new Date().getFullYear();
  const base: TabFilters = {
    filterType: 'paymentDate',
    startYear: year,
    endYear: year,
    initDate: today,
    endDate: today,
    titleCode: '',
    searchQuery: '',
    selectedUser: '',
    selectedPaymentMethod: '',
    sortConfig: null,
    localDashboardYear: '',
    localDashboardMonth: ''
  };
  // Dashboard tabs default to the last 10 years so the paginator is pre-populated
  if (tab === 'monthly-dashboard' || tab === 'yearly-dashboard') {
    return { ...base, startYear: year - 9 };
  }
  return base;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useGeneralCollectionViewModel = () => {
  const {
    report,
    dailyReport,
    yearlyReport,
    monthlyReport,
    kpi,
    yearlyKpi,
    monthlyKpi, // yearly-query data store
    monthlyKpiBase, // monthly-dashboard data store
    isLoading,
    error,
    fetchReport,
    fetchDailyReport,
    fetchMonthlyReport,
    fetchYearlyReport,
    fetchYearlyKpi,
    fetchMonthlyKpi, // → used exclusively by yearly-query
    fetchMonthlyKpiBase // → used exclusively by monthly-dashboard
  } = useGeneralCollection();

  const [activeTab, setActiveTab] = useState<GeneralCollectionTab>('dashboard');

  // ── Per-tab isolated filter state ─────────────────────────────────────────
  // Each tab entry is created lazily with its own defaults on first access.
  const [tabFiltersMap, setTabFiltersMap] = useState<
    Partial<Record<GeneralCollectionTab, TabFilters>>
  >({});

  // Read the active tab's filters (or defaults if not yet visited)
  const currentFilters: TabFilters =
    tabFiltersMap[activeTab] ?? defaultFiltersForTab(activeTab);

  // Destructure — same variable names used throughout the hook
  const {
    filterType,
    startYear,
    endYear,
    initDate,
    endDate,
    titleCode,
    searchQuery,
    selectedUser,
    selectedPaymentMethod,
    sortConfig,
    localDashboardYear,
    localDashboardMonth
  } = currentFilters;

  // Generic patch — updates a single field for the active tab only.
  // Other tabs are NOT touched.
  const patchFilter = <K extends keyof TabFilters>(
    key: K,
    value: TabFilters[K]
  ) => {
    setTabFiltersMap((prev) => {
      const existing = prev[activeTab] ?? defaultFiltersForTab(activeTab);
      return { ...prev, [activeTab]: { ...existing, [key]: value } };
    });
  };

  // Backwards-compatible individual setters
  const setFilterType = (val: dateFilter) => patchFilter('filterType', val);
  const setInitDate = (val: string) => patchFilter('initDate', val);
  const setEndDate = (val: string) => patchFilter('endDate', val);
  const setStartYear = (val: number) => patchFilter('startYear', val);
  const setEndYear = (val: number) => patchFilter('endYear', val);
  const setTitleCode = (val: string) => patchFilter('titleCode', val);
  const setSearchQuery = (val: string) => patchFilter('searchQuery', val);
  const setSelectedUser = (val: string) => patchFilter('selectedUser', val);
  const setSelectedPaymentMethod = (val: string) =>
    patchFilter('selectedPaymentMethod', val);
  const setLocalDashboardYear = (val: string) =>
    patchFilter('localDashboardYear', val);
  const setLocalDashboardMonth = (val: string) =>
    patchFilter('localDashboardMonth', val);
  // Legacy alias — year is the same concept as startYear
  const setYear = setStartYear;

  // ── First-visit auto-fetch for dashboard tabs ──────────────────────────────
  // Triggers ONCE per tab per session (tracked via a stable ref).
  // Re-visiting a tab preserves its last filter state and loaded data.
  //const visitedTabs = useRef(new Set<GeneralCollectionTab>());
  /*
  useEffect(() => {
    const isFirstVisit = !visitedTabs.current.has(activeTab);
    if (!isFirstVisit) return;
    visitedTabs.current.add(activeTab);

    const year = new Date().getFullYear();

    if (activeTab === 'monthly-dashboard') {
      fetchMonthlyKpiBase({
        dateFilter: 'paymentDate',
        startYear: year - 9,
        endYear: year,
        titleCode: ''
      });
    }

    if (activeTab === 'yearly-dashboard') {
      fetchYearlyKpi({
        dateFilter: 'paymentDate',
        startYear: year - 9,
        endYear: year,
        titleCode: ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
*/
  // ── handleFetch ───────────────────────────────────────────────────────────
  // Each branch uses the CURRENT tab's own filter state — no cross-tab leakage.
  const handleFetch = () => {
    if (activeTab === 'dashboard' || activeTab === 'general') {
      fetchReport({
        dateFilter: filterType,
        startDate: initDate,
        endDate,
        year: startYear,
        titleCode
      });
    } else if (activeTab === 'daily') {
      fetchDailyReport({
        dateFilter: filterType,
        startDate: initDate,
        endDate,
        year: startYear,
        titleCode
      });
    } else if (activeTab === 'monthly') {
      fetchMonthlyReport({
        dateFilter: filterType,
        startYear,
        endYear,
        titleCode
      });
    } else if (activeTab === 'yearly') {
      fetchYearlyReport({
        dateFilter: filterType,
        startYear,
        endYear,
        titleCode
      });
    } else if (activeTab === 'yearly-dashboard') {
      fetchYearlyKpi({
        dateFilter: filterType,
        startYear,
        endYear,
        titleCode
      });
    } else if (activeTab === 'yearly-query') {
      // Uses fetchMonthlyKpi — writes to monthlyKpi (separate from monthlyKpiBase).
      // This guarantees yearly-query never contaminates monthly-dashboard data.
      fetchMonthlyKpi({
        dateFilter: filterType,
        startYear,
        endYear: startYear, // single year → start === end
        titleCode
      });
      setEndYear(startYear);
    } else if (activeTab === 'monthly-dashboard') {
      // Range of years: updates the paginator BASE so dots/years are correct
      fetchMonthlyKpiBase({
        dateFilter: filterType,
        startYear,
        endYear,
        titleCode
      });
    }
  };

  const handleSort = (key: string, direction: SortDirection) => {
    patchFilter('sortConfig', { key, direction });
  };

  // ── Derived / computed state ───────────────────────────────────────────────
  const activeDataset = useMemo(() => {
    if (activeTab === 'dashboard' || activeTab === 'general') return report;
    if (activeTab === 'daily') return dailyReport;
    if (activeTab === 'monthly') return monthlyReport;
    return yearlyReport;
  }, [activeTab, report, dailyReport, monthlyReport, yearlyReport]);

  const userList = useMemo(() => {
    const users = activeDataset.map(
      (item: any) => item.paymentUser || item.collector || ''
    );
    return Array.from(new Set(users)).filter(Boolean) as string[];
  }, [activeDataset]);

  const paymentMethodList = useMemo(() => {
    const methods = activeDataset.map((item: any) => item.paymentMethod || '');
    return Array.from(new Set(methods)).filter(Boolean) as string[];
  }, [activeDataset]);

  const filteredReport = useMemo(
    () =>
      applyLocalFilters(
        report,
        ['name', 'cardId', 'cadastralKey', 'incomeCode'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [report, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]
  );

  const filteredDailyReport = useMemo(
    () =>
      applyLocalFilters(
        dailyReport,
        ['collector', 'titleCode', 'paymentMethod', 'status'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [dailyReport, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]
  );

  const filteredMonthlyReport = useMemo(
    () =>
      applyLocalFilters(
        monthlyReport,
        ['collector', 'titleCode', 'paymentMethod', 'status'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [
      monthlyReport,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      sortConfig
    ]
  );

  const filteredYearlyReport = useMemo(
    () =>
      applyLocalFilters(
        yearlyReport,
        ['collector', 'titleCode', 'paymentMethod', 'status'],
        searchQuery,
        selectedUser,
        selectedPaymentMethod,
        sortConfig
      ),
    [yearlyReport, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]
  );

  const filteredYearlyKpi = useMemo(() => {
    if (!localDashboardYear) return yearlyKpi;
    return yearlyKpi.filter((k) => k.year.toString() === localDashboardYear);
  }, [yearlyKpi, localDashboardYear]);

  // yearly-query: derived from monthlyKpi (isolated data store)
  const yearlyQueryKpi = useMemo(() => monthlyKpi, [monthlyKpi]);

  // monthly-dashboard: derived from monthlyKpiBase (its own isolated data store)
  const filteredMonthlyKpi = useMemo(() => {
    if (!localDashboardMonth) return monthlyKpiBase;
    return monthlyKpiBase.filter(
      (k) => k.month.toString() === localDashboardMonth
    );
  }, [monthlyKpiBase, localDashboardMonth]);

  const availableDashboardYears = useMemo(() => {
    if (activeTab === 'yearly-dashboard') {
      return Array.from(
        new Set(yearlyKpi.map((k) => k.year.toString()))
      ).sort();
    } else if (activeTab === 'monthly-dashboard') {
      return Array.from(
        new Set(monthlyKpiBase.map((k) => k.year.toString()))
      ).sort((a, b) => parseInt(a) - parseInt(b));
    }
    return [];
  }, [activeTab, yearlyKpi, monthlyKpiBase]);

  // SRP: canFetch lives in the ViewModel — the filter component just receives a boolean.
  const canFetch = useMemo(() => {
    if (isLoading) return false;
    if (
      activeTab === 'dashboard' ||
      activeTab === 'general' ||
      activeTab === 'daily'
    )
      return Boolean(initDate && endDate);
    if (activeTab === 'monthly' || activeTab === 'yearly')
      return Boolean(startYear && endYear);
    if (activeTab === 'monthly-dashboard' || activeTab === 'yearly-dashboard')
      return Boolean(startYear && endYear);
    if (activeTab === 'yearly-query') return Boolean(startYear);
    return false;
  }, [isLoading, activeTab, initDate, endDate, startYear, endYear]);

  // ── Public API (backwards-compatible) ─────────────────────────────────────
  return {
    state: {
      isLoading,
      error,
      activeTab,
      filterType,
      initDate,
      endDate,
      year: startYear, // legacy — same concept as startYear
      startYear,
      endYear,
      titleCode,
      searchQuery,
      selectedUser,
      selectedPaymentMethod,
      sortConfig,
      userList,
      paymentMethodList,
      filteredReport,
      filteredDailyReport,
      filteredMonthlyReport,
      filteredYearlyReport,
      kpi,
      yearlyKpi: filteredYearlyKpi,
      rawYearlyKpi: yearlyKpi,
      monthlyKpi: filteredMonthlyKpi, // monthly-dashboard
      rawMonthlyKpi: monthlyKpiBase, // monthly-dashboard (paginator allItems)
      yearlyQueryKpi, // yearly-query (isolated)
      localDashboardYear,
      localDashboardMonth,
      availableDashboardYears,
      canFetch
    },
    actions: {
      setActiveTab,
      setFilterType,
      setInitDate,
      setEndDate,
      setYear,
      setStartYear,
      setEndYear,
      setTitleCode,
      setSearchQuery,
      setSelectedUser,
      setSelectedPaymentMethod,
      handleFetch,
      handleSort,
      setLocalDashboardYear,
      setLocalDashboardMonth
    }
  };
};
