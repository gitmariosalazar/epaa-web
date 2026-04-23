import { useState, useMemo } from 'react';
import { useAgreements } from './useAgreements';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { dateFilter } from '../../../domain/dto/params/DataEntryParams';
import type { SearchType } from '../../../domain/dto/params/AgreementsParams';

export type AgreementsTab =
  | 'yearly-dashboard'
  | 'monthly-dashboard'
  | 'debtors'
  | 'collector-performance'
  | 'payment-methods'
  | 'citizen-summary'
  | 'yearly-summary'
  | 'monthly-summary';

export type SortDirection = 'asc' | 'desc';
export interface SortConfig {
  key: string;
  direction: SortDirection;
}

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
  sortConfig: SortConfig | null
): T[] {
  let result = data;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter((item) =>
      textFields.some((f) => item[f]?.toString().toLowerCase().includes(q))
    );
  }
  return applySortConfig(result, sortConfig);
}

interface TabFilters {
  filterType: dateFilter;
  searchType: SearchType;
  startYear: number;
  endYear: number;
  initDate: string;
  endDate: string;
  searchQuery: string;
  sortConfig: SortConfig | null;
}

function defaultFiltersForTab(): TabFilters {
  const today = dateService.getCurrentDateString();
  const year = new Date().getFullYear();
  return {
    filterType: 'paymentDate',
    searchType: 'YEAR',
    startYear: year,
    endYear: year,
    initDate: today,
    endDate: today,
    searchQuery: '',
    sortConfig: null
  };
}

export const useAgreementsViewModel = () => {
  const {
    kpi,
    monthlySummary,
    debtors,
    collectorPerformance,
    paymentMethodSummary,
    citizenSummary,
    isLoading,
    error,
    fetchKpi,
    fetchMonthlySummary,
    fetchDebtors,
    fetchCollectorPerformance,
    fetchPaymentMethodSummary,
    fetchCitizenSummary
  } = useAgreements();

  const [activeTab, setActiveTab] = useState<AgreementsTab>('yearly-dashboard');
  const [tabFiltersMap, setTabFiltersMap] = useState<
    Partial<Record<AgreementsTab, TabFilters>>
  >({});

  const currentFilters: TabFilters =
    tabFiltersMap[activeTab] ?? defaultFiltersForTab();

  const {
    filterType,
    searchType,
    startYear,
    endYear,
    initDate,
    endDate,
    searchQuery,
    sortConfig
  } = currentFilters;

  const patchFilter = <K extends keyof TabFilters>(
    key: K,
    value: TabFilters[K]
  ) => {
    setTabFiltersMap((prev) => {
      const existing = prev[activeTab] ?? defaultFiltersForTab();
      return { ...prev, [activeTab]: { ...existing, [key]: value } };
    });
  };

  const setFilterType = (val: dateFilter) => patchFilter('filterType', val);
  const setSearchType = (val: SearchType) => patchFilter('searchType', val);
  const setInitDate = (val: string) => patchFilter('initDate', val);
  const setEndDate = (val: string) => patchFilter('endDate', val);
  const setStartYear = (val: number) => patchFilter('startYear', val);
  const setEndYear = (val: number) => patchFilter('endYear', val);
  const setSearchQuery = (val: string) => patchFilter('searchQuery', val);

  const handleFetch = () => {
    const rangeParams = { startDate: initDate, endDate };
    if (activeTab === 'yearly-dashboard') {
      fetchKpi({
        searchType: 'YEAR',
        startYear,
        endYear
      });
      // For dashboard we also need performance and payment methods metrics
      const dashboardRange = {
        startDate: `${startYear}-01-01`,
        endDate: `${endYear}-12-31`
      };
      fetchCollectorPerformance(dashboardRange);
      fetchPaymentMethodSummary(dashboardRange);
    } else if (activeTab === 'monthly-dashboard') {
      fetchKpi({
        searchType: 'MONTH',
        startYear: startYear,
        endYear: startYear
      });
      const dashboardRange = {
        startDate: `${startYear}-01-01`,
        endDate: `${startYear}-12-31`
      };
      fetchCollectorPerformance(dashboardRange);
      fetchPaymentMethodSummary(dashboardRange);
    } else if (activeTab === 'yearly-summary') {
      fetchKpi({
        searchType,
        startYear,
        endYear
      });
    } else if (activeTab === 'monthly-summary') {
      fetchMonthlySummary();
    } else if (activeTab === 'debtors') {
      fetchDebtors();
    } else if (activeTab === 'collector-performance') {
      fetchCollectorPerformance(rangeParams);
    } else if (activeTab === 'payment-methods') {
      fetchPaymentMethodSummary(rangeParams);
    } else if (activeTab === 'citizen-summary') {
      fetchCitizenSummary(rangeParams);
    }
  };

  const handleSort = (key: string, direction: SortDirection) => {
    patchFilter('sortConfig', { key, direction });
  };

  const filteredKpi = useMemo(
    () =>
      applyLocalFilters(
        kpi,
        ['year', 'month', 'day'],
        searchQuery,
        sortConfig
      ),
    [kpi, searchQuery, sortConfig]
  );

  const filteredDebtors = useMemo(
    () =>
      applyLocalFilters(
        debtors,
        ['fullName', 'cardId', 'cadastralKey', 'riskLevel'],
        searchQuery,
        sortConfig
      ),
    [debtors, searchQuery, sortConfig]
  );

  const filteredCollectorPerformance = useMemo(
    () =>
      applyLocalFilters(
        collectorPerformance,
        ['collector'],
        searchQuery,
        sortConfig
      ),
    [collectorPerformance, searchQuery, sortConfig]
  );

  const filteredPaymentMethodSummary = useMemo(
    () =>
      applyLocalFilters(
        paymentMethodSummary,
        ['paymentMethod'],
        searchQuery,
        sortConfig
      ),
    [paymentMethodSummary, searchQuery, sortConfig]
  );

  const filteredCitizenSummary = useMemo(
    () =>
      applyLocalFilters(
        citizenSummary,
        ['firstName', 'lastName', 'cardId', 'cadastralKey'],
        searchQuery,
        sortConfig
      ),
    [citizenSummary, searchQuery, sortConfig]
  );

  const filteredMonthlySummary = useMemo(
    () => applySortConfig(monthlySummary, sortConfig),
    [monthlySummary, sortConfig]
  );

  const canFetch = useMemo(() => {
    if (isLoading) return false;
    if (
      activeTab === 'yearly-dashboard' ||
      activeTab === 'monthly-dashboard' ||
      activeTab === 'yearly-summary' ||
      activeTab === 'monthly-summary'
    ) {
      return Boolean(
        startYear &&
          (activeTab === 'monthly-dashboard' ||
            activeTab === 'monthly-summary' ||
            endYear)
      );
    }
    if (
      activeTab === 'collector-performance' ||
      activeTab === 'payment-methods' ||
      activeTab === 'citizen-summary'
    ) {
      return Boolean(initDate && endDate);
    }
    return true; // debtors doesn't need params
  }, [isLoading, activeTab, initDate, endDate, startYear, endYear]);

  return {
    state: {
      isLoading,
      error,
      activeTab,
      filterType,
      searchType,
      initDate,
      endDate,
      startYear,
      endYear,
      searchQuery,
      sortConfig,
      filteredKpi,
      filteredDebtors,
      filteredCollectorPerformance,
      filteredPaymentMethodSummary,
      filteredCitizenSummary,
      filteredMonthlySummary,
      canFetch
    },
    actions: {
      setActiveTab,
      setFilterType,
      setSearchType,
      setInitDate,
      setEndDate,
      setStartYear,
      setEndYear,
      setSearchQuery,
      handleFetch,
      handleSort
    }
  };
};
