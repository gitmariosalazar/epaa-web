import type { TabItem } from '@/shared/presentation/components/Tabs';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ClipboardList, CalendarRange } from 'lucide-react';
import { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import { useTrashRateReport } from './useTrashRateReport';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export type TrashRateKPIViewTabs =
  | 'dashboard'
  | 'collectorPerformance'
  | 'dailyCollectorDetail';

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



export const useTrashRateKPIViewModel = () => {
  const { t } = useTranslation();

  const TRASH_KPI_TABS: TabItem<TrashRateKPIViewTabs>[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: t('trashRateKPI.tabs.dashboard', 'KPI Dashboard'),
        icon: React.createElement(LayoutDashboard, { size: 16 })
      },
      {
        id: 'collectorPerformance',
        label: t(
          'trashRateKPI.tabs.collectorPerformance',
          'Rendimiento del Recolector'
        ),
        icon: React.createElement(ClipboardList, { size: 16 })
      },
      {
        id: 'dailyCollectorDetail',
        label: t(
          'trashRateKPI.tabs.dailyCollectorDetail',
          'Detalle del Recolector Diario'
        ),
        icon: React.createElement(CalendarRange, { size: 16 })
      }
    ],
    [t]
  );

  const {
    dashboardKPITrashRate,
    collectorPerformanceKPI,
    dailyCollectorDetail,
    trashRateKPI,
    getDashboardKPITrashRate,
    getCollectorPerformanceKPI,
    getDailyCollectorDetail,
    getTrashRateKPI,
    getMissingValorBills,
    getTrashRateAuditReport, // New
    missingValorBills,
    trashRateAuditReport, // New
    loading: isLoading,
    error,
    clearError
  } = useTrashRateReport();

  const [activeTab, setActiveTab] = useState<TrashRateKPIViewTabs>('dashboard');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [startDate, setStartDate] = useState(() => {
    const month = dateService.getCurrentMonthString();
    return `${month}-01`;
  });

  const [endDate, setEndDate] = useState(() => {
    const now = dateService.getCurrentDate();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  });

  const [top, setTop] = useState<string>('100');
  const [limit, setLimit] = useState<string>('50');
  const [offset, setOffset] = useState<string>('0');

  // Local Filters for Daily Collector Detail
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSortConfig(null);
    setLimit('50');
    setOffset('0');
    setSelectedCollector('');
    setSelectedStatus('');
    setSelectedCategoryIndex(0);
    clearError();
  }, [activeTab, clearError]);

  const dateParams = () =>
    new DateRangeParams(
      startDate,
      endDate,
      undefined,
      Number(limit) || 50,
      Number(offset) || 0
    );

  const handleFetch = async () => {
    if (activeTab === 'dashboard') {
      await Promise.all([
        getDashboardKPITrashRate(new DateRangeParams(startDate, endDate)),
        getTrashRateKPI(dateParams()),
        getMissingValorBills(dateParams()),
        getTrashRateAuditReport(dateParams()) // Fetch full audit
      ]);
    } else if (activeTab === 'collectorPerformance') {
      await getCollectorPerformanceKPI(dateParams());
    } else if (activeTab === 'dailyCollectorDetail') {
      await getDailyCollectorDetail(dateParams());
    }

    setSelectedCategoryIndex(0);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') =>
    setSortConfig({ key, direction });

  const filteredCollectorPerformance = useMemo(
    () => applySortConfig(collectorPerformanceKPI, sortConfig),
    [collectorPerformanceKPI, sortConfig]
  );

  const filteredDailyCollectorDetail = useMemo(() => {
    let result = dailyCollectorDetail;

    if (selectedCollector) {
      result = result.filter((item) => item.collectorId === selectedCollector);
    }

    if (selectedStatus) {
      result = result.filter((item) => item.incomeStatus === selectedStatus);
    }

    return applySortConfig(result, sortConfig);
  }, [dailyCollectorDetail, sortConfig, selectedCollector, selectedStatus]);

  const collectorList = useMemo(() => {
    const collectors = dailyCollectorDetail.map((item) => item.collectorId);
    return Array.from(new Set(collectors)).sort();
  }, [dailyCollectorDetail]);

  const statusList = useMemo(() => {
    const statuses = dailyCollectorDetail.map((item) => item.incomeStatus);
    return Array.from(new Set(statuses)).sort();
  }, [dailyCollectorDetail]);

  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  return {
    t,
    isLoading,
    error: errorMessage,
    translatedTabs: TRASH_KPI_TABS,
    activeTab,
    setActiveTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    top,
    setTop,
    limit,
    setLimit,
    offset,
    setOffset,
    dashboardKPITrashRate,
    filteredCollectorPerformance,
    filteredDailyCollectorDetail,
    trashRateKPI,
    missingValorBills,
    trashRateAuditReport,
    handleFetch,
    handleSort,
    sortConfig,
    clearError,
    selectedCollector,
    setSelectedCollector,
    collectorList,
    selectedStatus,
    setSelectedStatus,
    statusList,
    selectedCategoryIndex,
    setSelectedCategoryIndex
  };
};
