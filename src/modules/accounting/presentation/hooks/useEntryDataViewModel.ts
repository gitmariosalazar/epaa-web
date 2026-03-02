import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryData } from './useEntryData';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import type { EntryDataTab } from '../components/EntryDataFilters';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { BarChart3, Users, CreditCard, AlignLeft } from 'lucide-react';
import React from 'react';

const fmt = (n: any) => `$${Number(n || 0).toFixed(2)}`;

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

export const useEntryDataViewModel = () => {
  const { t } = useTranslation();

  const ENTRY_TABS: TabItem<EntryDataTab>[] = useMemo(
    () => [
      {
        id: 'grouped',
        label: t('accounting.tabs.groupedReport'),
        icon: React.createElement(BarChart3, { size: 16 })
      },
      {
        id: 'collector',
        label: t('accounting.tabs.collectorSummary'),
        icon: React.createElement(Users, { size: 16 })
      },
      {
        id: 'paymentMethod',
        label: t('accounting.tabs.paymentMethod'),
        icon: React.createElement(CreditCard, { size: 16 })
      },
      {
        id: 'fullBreakdown',
        label: t('accounting.tabs.fullBreakdown'),
        icon: React.createElement(AlignLeft, { size: 16 })
      }
    ],
    [t]
  );

  const GROUPED_AND_BREAKDOWN_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { id: 'date', label: t('accounting.columns.date'), isDefault: true },
      {
        id: 'collector',
        label: t('accounting.columns.collector'),
        isDefault: true
      },
      {
        id: 'titleCode',
        label: t('accounting.columns.titleCode'),
        isDefault: true
      },
      {
        id: 'paymentMethod',
        label: t('accounting.columns.paymentMethod'),
        isDefault: true
      },
      { id: 'status', label: t('accounting.columns.status'), isDefault: true },
      {
        id: 'titleValue',
        label: t('accounting.columns.epaaValue'),
        isDefault: true
      },
      {
        id: 'thirdPartyValue',
        label: t('accounting.columns.thirdPartyValue'),
        isDefault: true
      },
      {
        id: 'surchargeValue',
        label: t('accounting.columns.surcharge'),
        isDefault: true
      },
      {
        id: 'trashRateValue',
        label: t('accounting.columns.trashRateDt'),
        isDefault: true
      },
      {
        id: 'detailValue',
        label: t('accounting.columns.trashRateVal'),
        isDefault: true
      },
      {
        id: 'incomeCount',
        label: t('accounting.columns.incomes'),
        isDefault: true
      },
      {
        id: 'grandTotal',
        label: t('accounting.columns.total'),
        isDefault: true
      }
    ],
    [t]
  );

  const COLLECTOR_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { id: 'date', label: t('accounting.columns.date'), isDefault: true },
      {
        id: 'collector',
        label: t('accounting.columns.collector'),
        isDefault: true
      },
      {
        id: 'paymentCount',
        label: t('accounting.columns.incomes'),
        isDefault: true
      },
      {
        id: 'titleValue',
        label: t('accounting.columns.epaaValue'),
        isDefault: true
      },
      {
        id: 'thirdPartyValue',
        label: t('accounting.columns.thirdPartyValue'),
        isDefault: true
      },
      {
        id: 'surchargeValue',
        label: t('accounting.columns.surcharge'),
        isDefault: true
      },
      {
        id: 'trashRateValue',
        label: t('accounting.columns.trashRateDt'),
        isDefault: true
      },
      {
        id: 'detailValue',
        label: t('accounting.columns.trashRateVal'),
        isDefault: true
      },
      {
        id: 'totalCollected',
        label: t('accounting.columns.total'),
        isDefault: true
      }
    ],
    [t]
  );

  const PAYMENT_METHOD_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { id: 'date', label: t('accounting.columns.date'), isDefault: true },
      {
        id: 'paymentMethod',
        label: t('accounting.columns.paymentMethod'),
        isDefault: true
      },
      { id: 'status', label: t('accounting.columns.status'), isDefault: true },
      {
        id: 'incomeCount',
        label: t('accounting.columns.incomes'),
        isDefault: true
      },
      {
        id: 'titleValue',
        label: t('accounting.columns.epaaValue'),
        isDefault: true
      },
      {
        id: 'thirdPartyValue',
        label: t('accounting.columns.thirdPartyValue'),
        isDefault: true
      },
      {
        id: 'surchargeValue',
        label: t('accounting.columns.surcharge'),
        isDefault: true
      },
      {
        id: 'trashRateValue',
        label: t('accounting.columns.trashRateDt'),
        isDefault: true
      },
      {
        id: 'detailValue',
        label: t('accounting.columns.trashRateVal'),
        isDefault: true
      },
      {
        id: 'grandTotal',
        label: t('accounting.columns.total'),
        isDefault: true
      }
    ],
    [t]
  );

  const exportService = useMemo(() => new ExportService(), []);
  const translatedTabs = ENTRY_TABS;

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

  const [activeTab, setActiveTab] = useState<EntryDataTab>('grouped');

  const today = dateService.getCurrentDateString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [selectedTitleCode, setSelectedTitleCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    setSearchQuery('');
    setSelectedCollector('');
    setSelectedTitleCode('');
    setSelectedPaymentMethod('');
    setSelectedStatus('');
    setSortConfig(null);
  }, [activeTab]);

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

  const currentFilteredData = useMemo(() => {
    if (activeTab === 'grouped') return filteredGrouped;
    if (activeTab === 'collector') return filteredCollector;
    if (activeTab === 'paymentMethod') return filteredPaymentMethod;
    return filteredFullBreakdown;
  }, [
    activeTab,
    filteredGrouped,
    filteredCollector,
    filteredPaymentMethod,
    filteredFullBreakdown
  ]);

  const currentAvailableColumns = useMemo(() => {
    if (activeTab === 'grouped') return GROUPED_AND_BREAKDOWN_COLUMNS;
    if (activeTab === 'collector') return COLLECTOR_COLUMNS;
    if (activeTab === 'paymentMethod') return PAYMENT_METHOD_COLUMNS;
    return GROUPED_AND_BREAKDOWN_COLUMNS;
  }, [
    activeTab,
    GROUPED_AND_BREAKDOWN_COLUMNS,
    COLLECTOR_COLUMNS,
    PAYMENT_METHOD_COLUMNS
  ]);

  const currentReportTitle = useMemo(() => {
    if (activeTab === 'grouped') return 'Reporte Diario Agrupado';
    if (activeTab === 'collector') return 'Resumen por Cobrador';
    if (activeTab === 'paymentMethod') return 'Reporte por Método de Pago';
    return 'Desglose Completo';
  }, [activeTab]);

  const mapRowData = (item: any, selectedCols: ExportColumn[]) => {
    const rowData: Record<string, string> = {};

    rowData['date'] = item.date || '-';
    rowData['collector'] = item.collector || '-';
    rowData['titleCode'] = item.titleCode || '-';
    rowData['paymentMethod'] = item.paymentMethod || '-';
    rowData['status'] = item.status || '-';
    rowData['incomeCount'] = String(item.incomeCount ?? item.paymentCount ?? 0);
    rowData['titleValue'] = fmt(item.titleValue);
    rowData['thirdPartyValue'] = fmt(item.thirdPartyValue);
    rowData['surchargeValue'] = fmt(item.surchargeValue);
    rowData['trashRateValue'] = fmt(item.trashRateValue);
    rowData['detailValue'] = fmt(item.detailValue);
    rowData['grandTotal'] = fmt(item.grandTotal);
    rowData['totalCollected'] = fmt(item.totalCollected);

    return selectedCols.map((col) => rowData[col.id]);
  };

  const handlePdfGenerator = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = currentFilteredData.map((d) => mapRowData(d, selectedCols));

    return exportService.generatePdfBlobUrl({
      rows: rows,
      columns: colLabels,
      fileName: `reporte_${activeTab}`,
      title: currentReportTitle,
      orientation
    });
  };

  const handleDownloadPdf = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = currentFilteredData.map((d) => mapRowData(d, selectedCols));

    exportService.exportToPdf({
      rows: rows,
      columns: colLabels,
      fileName: `reporte_${activeTab}`,
      title: currentReportTitle,
      orientation
    });
    setShowPdfPreview(false);
  };

  return {
    t,
    isLoading,
    error,
    translatedTabs,
    activeTab,
    setActiveTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchQuery,
    setSearchQuery,
    selectedCollector,
    setSelectedCollector,
    collectorList,
    selectedTitleCode,
    setSelectedTitleCode,
    titleCodeList,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethodList,
    selectedStatus,
    setSelectedStatus,
    sortConfig,
    filteredGrouped,
    filteredCollector,
    filteredPaymentMethod,
    filteredFullBreakdown,
    showPdfPreview,
    setShowPdfPreview,
    currentFilteredData,
    currentReportTitle,
    currentAvailableColumns,
    handleFetch,
    handleSort,
    handlePdfGenerator,
    handleDownloadPdf
  };
};
