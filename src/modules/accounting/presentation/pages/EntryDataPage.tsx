import React, { useState, useMemo, useEffect } from 'react';
import '../styles/EntryDataPage.css';
import { EntryDataFilters } from '../components/EntryDataFilters';
import type { EntryDataTab } from '../components/EntryDataFilters';
import { DailyGroupedReportTable } from '../components/DailyGroupedReportTable';
import { DailyCollectorSummaryTable } from '../components/DailyCollectorSummaryTable';
import { DailyPaymentMethodReportTable } from '../components/DailyPaymentMethodReportTable';
import { FullBreakdownReportTable } from '../components/FullBreakdownReportTable';
import { useEntryData } from '../hooks/useEntryData';
import { useTranslation } from 'react-i18next';
import { BarChart3, Users, CreditCard, AlignLeft } from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

// ── Static tab definitions ────────────────────────────────────────────────────
const ENTRY_TABS: TabItem<EntryDataTab>[] = [
  {
    id: 'grouped',
    label: 'Reporte Diario Agrupado',
    icon: <BarChart3 size={16} />
  },
  { id: 'collector', label: 'Resumen por Cobrador', icon: <Users size={16} /> },
  {
    id: 'paymentMethod',
    label: 'Por Método de Pago',
    icon: <CreditCard size={16} />
  },
  {
    id: 'fullBreakdown',
    label: 'Desglose Completo',
    icon: <AlignLeft size={16} />
  }
];

// ── Sort helper (SRP) ─────────────────────────────────────────────────────────
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

// ── Page ──────────────────────────────────────────────────────────────────────
export const EntryDataPage: React.FC = () => {
  const { t } = useTranslation();

  const translatedTabs: TabItem<EntryDataTab>[] = [
    {
      ...ENTRY_TABS[0],
      label: t('entryData.tabs.grouped', 'Reporte Diario Agrupado')
    },
    {
      ...ENTRY_TABS[1],
      label: t('entryData.tabs.collector', 'Resumen por Cobrador')
    },
    {
      ...ENTRY_TABS[2],
      label: t('entryData.tabs.paymentMethod', 'Por Método de Pago')
    },
    {
      ...ENTRY_TABS[3],
      label: t('entryData.tabs.fullBreakdown', 'Desglose Completo')
    }
  ];

  const {
    dailyGrouped,
    collectorSummary,
    paymentMethodReport,
    fullBreakdown,
    isLoading,
    error,
    fetchDailyGrouped,
    fetchCollectorSummary,
    fetchPaymentMethodReport,
    fetchFullBreakdown
  } = useEntryData();

  const loadingProgress = useSimulatedProgress(isLoading);

  // ── Tab & date range state ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<EntryDataTab>('grouped');

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // ── Local filter state ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [selectedTitleCode, setSelectedTitleCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Reset all local filters when the tab changes
  useEffect(() => {
    setSearchQuery('');
    setSelectedCollector('');
    setSelectedTitleCode('');
    setSelectedPaymentMethod('');
    setSelectedStatus('');
    setSortConfig(null);
  }, [activeTab]);

  // ── Fetch dispatcher (SRP) ──────────────────────────────────────────────────
  const handleFetch = () => {
    if (activeTab === 'grouped') fetchDailyGrouped(startDate, endDate);
    else if (activeTab === 'collector')
      fetchCollectorSummary(startDate, endDate);
    else if (activeTab === 'paymentMethod')
      fetchPaymentMethodReport(startDate, endDate);
    else fetchFullBreakdown(startDate, endDate);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') =>
    setSortConfig({ key, direction });

  // ── Dropdown option lists — derived from the active dataset ─────────────────
  const activeDataset: any[] = useMemo(() => {
    if (activeTab === 'grouped') return dailyGrouped;
    if (activeTab === 'collector') return collectorSummary;
    if (activeTab === 'paymentMethod') return paymentMethodReport;
    return fullBreakdown;
  }, [
    activeTab,
    dailyGrouped,
    collectorSummary,
    paymentMethodReport,
    fullBreakdown
  ]);

  const collectorList = useMemo(
    () =>
      Array.from(new Set(activeDataset.map((r) => r.collector || ''))).filter(
        Boolean
      ) as string[],
    [activeDataset]
  );
  const titleCodeList = useMemo(
    () =>
      Array.from(new Set(activeDataset.map((r) => r.titleCode || ''))).filter(
        Boolean
      ) as string[],
    [activeDataset]
  );
  const paymentMethodList = useMemo(
    () =>
      Array.from(
        new Set(activeDataset.map((r) => r.paymentMethod || ''))
      ).filter(Boolean) as string[],
    [activeDataset]
  );

  // ── Generic filter + sort helper ─────────────────────────────────────────────
  // Only the filters relevant to the active tab are applied (matching SHOW map in filters component).
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
    if (selectedCollector)
      result = result.filter((item) => item.collector === selectedCollector);
    if (selectedTitleCode)
      result = result.filter((item) => item.titleCode === selectedTitleCode);
    if (selectedPaymentMethod)
      result = result.filter(
        (item) => item.paymentMethod === selectedPaymentMethod
      );
    if (selectedStatus)
      result = result.filter((item) => item.status === selectedStatus);

    return applySortConfig(result, sortConfig);
  };

  // Every dependency that may change for each tab is listed explicitly so
  // React can memoize only the affected dataset.
  const filteredGrouped = useMemo(
    () =>
      applyLocalFilters(dailyGrouped, [
        'date',
        'collector',
        'titleCode',
        'paymentMethod',
        'status'
      ]),
    [
      dailyGrouped,
      searchQuery,
      selectedCollector,
      selectedTitleCode,
      selectedPaymentMethod,
      selectedStatus,
      sortConfig
    ]
  );

  const filteredCollector = useMemo(
    () => applyLocalFilters(collectorSummary, ['date', 'collector']),
    // collector tab: only collector matters  (titleCode/paymentMethod/status won't be set)
    [collectorSummary, searchQuery, selectedCollector, sortConfig]
  );

  const filteredPaymentMethod = useMemo(
    () =>
      applyLocalFilters(paymentMethodReport, [
        'date',
        'paymentMethod',
        'status'
      ]),
    [
      paymentMethodReport,
      searchQuery,
      selectedPaymentMethod,
      selectedStatus,
      sortConfig
    ]
  );

  const filteredFullBreakdown = useMemo(
    () =>
      applyLocalFilters(fullBreakdown, [
        'date',
        'collector',
        'titleCode',
        'paymentMethod',
        'status'
      ]),
    [
      fullBreakdown,
      searchQuery,
      selectedCollector,
      selectedTitleCode,
      selectedPaymentMethod,
      selectedStatus,
      sortConfig
    ]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="entry-data-page">
      <Tabs
        tabs={translatedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EntryDataFilters
        activeTab={activeTab}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onFetch={handleFetch}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCollector={selectedCollector}
        onCollectorChange={setSelectedCollector}
        collectorList={collectorList}
        selectedTitleCode={selectedTitleCode}
        onTitleCodeChange={setSelectedTitleCode}
        titleCodeList={titleCodeList}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        paymentMethodList={paymentMethodList}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {error ? (
        <div className="entry-data-error">
          <div className="entry-data-error-dot" />
          <span className="entry-data-error-text">{error}</span>
        </div>
      ) : isLoading ? (
        <div className="entry-data-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando...')}
          />
        </div>
      ) : activeTab === 'grouped' ? (
        <DailyGroupedReportTable
          data={filteredGrouped}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : activeTab === 'collector' ? (
        <DailyCollectorSummaryTable
          data={filteredCollector}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : activeTab === 'paymentMethod' ? (
        <DailyPaymentMethodReportTable
          data={filteredPaymentMethod}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : (
        <FullBreakdownReportTable
          data={filteredFullBreakdown}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
};
