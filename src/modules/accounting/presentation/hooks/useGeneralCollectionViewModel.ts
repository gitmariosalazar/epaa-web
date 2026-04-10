import { useState, useMemo, useEffect } from 'react';
import { useGeneralCollection } from './useGeneralCollection';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { dateFilter } from '../../domain/dto/params/DataEntryParams';

export type GeneralCollectionTab = 'dashboard' | 'general' | 'daily' | 'monthly' | 'yearly';
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

  // Handle difference in property names based on report type
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

export const useGeneralCollectionViewModel = () => {
  const {
    report,
    dailyReport,
    yearlyReport,
    monthlyReport,
    kpi,
    yearlyKpi,
    monthlyKpi,
    isLoading,
    error,
    fetchReport,
    fetchDailyReport,
    fetchMonthlyReport,
    fetchYearlyReport
  } = useGeneralCollection();

  const [activeTab, setActiveTab] = useState<GeneralCollectionTab>('dashboard');

  const [filterType, setFilterType] = useState<dateFilter>('paymentDate');
  const [initDate, setInitDate] = useState<string>(dateService.getCurrentDateString());
  const [endDate, setEndDate] = useState<string>(dateService.getCurrentDateString());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear() - 1);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [titleCode, setTitleCode] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    setSearchQuery('');
    setSelectedUser('');
    setSelectedPaymentMethod('');
    setSortConfig(null);
  }, [activeTab]);

  const handleFetch = () => {
    if (activeTab === 'dashboard' || activeTab === 'general') {
      fetchReport({ dateFilter: filterType, startDate: initDate, endDate, year, titleCode });
    } else if (activeTab === 'daily') {
      fetchDailyReport({ dateFilter: filterType, startDate: initDate, endDate, year, titleCode });
    } else if (activeTab === 'monthly') {
      fetchMonthlyReport({ dateFilter: filterType, startYear, endYear, titleCode });
    } else if (activeTab === 'yearly') {
      fetchYearlyReport({ dateFilter: filterType, startYear, endYear, titleCode });
    }
  };

  const handleSort = (key: string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  const activeDataset = useMemo(() => {
    if (activeTab === 'dashboard' || activeTab === 'general') return report;
    if (activeTab === 'daily') return dailyReport;
    if (activeTab === 'monthly') return monthlyReport;
    return yearlyReport;
  }, [activeTab, report, dailyReport, monthlyReport, yearlyReport]);

  const userList = useMemo(() => {
    const users = activeDataset.map((item: any) => item.paymentUser || item.collector || '');
    return Array.from(new Set(users)).filter(Boolean) as string[];
  }, [activeDataset]);

  const paymentMethodList = useMemo(() => {
    const methods = activeDataset.map((item: any) => item.paymentMethod || '');
    return Array.from(new Set(methods)).filter(Boolean) as string[];
  }, [activeDataset]);

  const filteredReport = useMemo(() => applyLocalFilters(
    report, ['name', 'cardId', 'cadastralKey', 'incomeCode'],
    searchQuery, selectedUser, selectedPaymentMethod, sortConfig
  ), [report, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]);

  const filteredDailyReport = useMemo(() => applyLocalFilters(
    dailyReport, ['collector', 'titleCode', 'paymentMethod', 'status'],
    searchQuery, selectedUser, selectedPaymentMethod, sortConfig
  ), [dailyReport, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]);

  const filteredMonthlyReport = useMemo(() => applyLocalFilters(
    monthlyReport, ['collector', 'titleCode', 'paymentMethod', 'status'],
    searchQuery, selectedUser, selectedPaymentMethod, sortConfig
  ), [monthlyReport, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]);

  const filteredYearlyReport = useMemo(() => applyLocalFilters(
    yearlyReport, ['collector', 'titleCode', 'paymentMethod', 'status'],
    searchQuery, selectedUser, selectedPaymentMethod, sortConfig
  ), [yearlyReport, searchQuery, selectedUser, selectedPaymentMethod, sortConfig]);

  return {
    state: {
      isLoading, error, activeTab,
      filterType, initDate, endDate, year, startYear, endYear, titleCode,
      searchQuery, selectedUser, selectedPaymentMethod, sortConfig,
      userList, paymentMethodList,
      filteredReport, filteredDailyReport, filteredMonthlyReport, filteredYearlyReport,
      kpi, yearlyKpi, monthlyKpi
    },
    actions: {
      setActiveTab, setFilterType, setInitDate, setEndDate,
      setYear, setStartYear, setEndYear, setTitleCode,
      setSearchQuery, setSelectedUser, setSelectedPaymentMethod,
      handleFetch, handleSort
    }
  };
};
