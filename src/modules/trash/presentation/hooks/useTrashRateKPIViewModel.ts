import type { TabItem } from '@/shared/presentation/components/Tabs';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ClipboardList, CalendarRange } from 'lucide-react';
import { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import { useTrashRateReport } from './useTrashRateReport';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';

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

const fmt = (n: any) => `$${Number(n || 0).toFixed(2)}`;

export const useTrashRateKPIViewModel = () => {
  const { t } = useTranslation();

  const COLLECTOR_PERFORMANCE_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { id: 'collectorId', label: 'ID del Cobrador', isDefault: true },
      { id: 'totalTransactions', label: 'N° de Facturas', isDefault: true },
      {
        id: 'sourceTrashRateTotal',
        label: 'TB Datos Ingreso',
        isDefault: true
      },
      { id: 'valorTableTotal', label: 'TB Tabla Valor', isDefault: true },
      {
        id: 'integrityGapAmount',
        label: 'Diferencia (TBDI - TBTV)',
        isDefault: true
      },
      { id: 'grossAmount', label: 'Monto Facturado', isDefault: true },
      {
        id: 'totalDiscountsApplied',
        label: 'DesC. Aplicados',
        isDefault: true
      },
      { id: 'netCollectionTotal', label: 'Recaudación Neta', isDefault: true },
      {
        id: 'cancelledBillsValue',
        label: 'Valor Fact. (A - B)',
        isDefault: true
      },
      { id: 'cancelledBillsCount', label: 'Fact. (A - B)', isDefault: true }
    ],
    []
  );

  const DAILY_COLLECTOR_DETAIL_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { id: 'collectorId', label: 'Colector', isDefault: true },
      { id: 'paymentDate', label: 'Fecha Pago', isDefault: true },
      { id: 'incomeStatus', label: 'Estado Ingreso', isDefault: true },
      { id: 'transactionsCount', label: 'N° de Facturas', isDefault: true },
      {
        id: 'sourceTrashRateDaily',
        label: 'TB Datos Ingreso',
        isDefault: true
      },
      { id: 'valorTableDaily', label: 'TB Tabla Valor', isDefault: true },
      {
        id: 'integrityGapDaily',
        label: 'Diferencia (TBDI - TBTV)',
        isDefault: true
      },
      { id: 'grossDailyTotal', label: 'Monto Facturado', isDefault: true },
      { id: 'discountsDailyTotal', label: 'DesC. Aplicados', isDefault: true },
      { id: 'netDailyCollection', label: 'Recaudación Neta', isDefault: true },
      {
        id: 'cancelledValueDaily',
        label: 'Valor Fact. (A - B)',
        isDefault: true
      },
      { id: 'cancelledCountDaily', label: 'Fact. (A - B)', isDefault: true }
    ],
    []
  );

  const exportService = useMemo(() => new ExportService(), []);

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
    loading: isLoading,
    error,
    clearError
  } = useTrashRateReport();

  const [activeTab, setActiveTab] = useState<TrashRateKPIViewTabs>('dashboard');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const today = dateService.getCurrentDateString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [top, setTop] = useState<string>('100');
  const [limit, setLimit] = useState<string>('50');
  const [offset, setOffset] = useState<string>('0');

  // Local Filters for Daily Collector Detail
  const [selectedCollector, setSelectedCollector] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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

  const handleFetch = () => {
    if (activeTab === 'dashboard') {
      getDashboardKPITrashRate(new DateRangeParams(startDate, endDate));
      getTrashRateKPI(dateParams());
    } else if (activeTab === 'collectorPerformance')
      getCollectorPerformanceKPI(dateParams());
    else if (activeTab === 'dailyCollectorDetail')
      getDailyCollectorDetail(dateParams());
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

  const currentFilteredData = useMemo(() => {
    if (activeTab === 'collectorPerformance')
      return filteredCollectorPerformance;
    if (activeTab === 'dailyCollectorDetail')
      return filteredDailyCollectorDetail;
    return [];
  }, [activeTab, filteredCollectorPerformance, filteredDailyCollectorDetail]);

  const currentAvailableColumns = useMemo(() => {
    if (activeTab === 'collectorPerformance')
      return COLLECTOR_PERFORMANCE_COLUMNS;
    if (activeTab === 'dailyCollectorDetail')
      return DAILY_COLLECTOR_DETAIL_COLUMNS;
    return [];
  }, [
    activeTab,
    COLLECTOR_PERFORMANCE_COLUMNS,
    DAILY_COLLECTOR_DETAIL_COLUMNS
  ]);

  const currentReportTitle = useMemo(() => {
    if (activeTab === 'collectorPerformance')
      return 'Rendimiento del Recolector';
    if (activeTab === 'dailyCollectorDetail')
      return 'Detalle de Recolectores Diarios';
    return '';
  }, [activeTab]);

  const mapRowData = (item: any, selectedCols: ExportColumn[]) => {
    const rowData: Record<string, string> = {};

    if (activeTab === 'collectorPerformance') {
      rowData['collectorId'] = item.collectorId || '-';
      rowData['totalTransactions'] = String(item.totalTransactions || 0);
      rowData['sourceTrashRateTotal'] = fmt(item.sourceTrashRateTotal);
      rowData['valorTableTotal'] = fmt(item.valorTableTotal);
      rowData['integrityGapAmount'] = fmt(item.integrityGapAmount);
      rowData['grossAmount'] = fmt(item.grossAmount);
      rowData['totalDiscountsApplied'] = fmt(item.totalDiscountsApplied);
      rowData['netCollectionTotal'] = fmt(item.netCollectionTotal);
      rowData['cancelledBillsValue'] = fmt(item.cancelledBillsValue);
      rowData['cancelledBillsCount'] = String(item.cancelledBillsCount || 0);
    } else if (activeTab === 'dailyCollectorDetail') {
      rowData['collectorId'] = item.collectorId || '-';
      rowData['paymentDate'] = item.paymentDate
        ? new Date(item.paymentDate).toLocaleDateString()
        : '-';
      rowData['incomeStatus'] = item.incomeStatus || '-';
      rowData['transactionsCount'] = String(item.transactionsCount || 0);
      rowData['sourceTrashRateDaily'] = fmt(item.sourceTrashRateDaily);
      rowData['valorTableDaily'] = fmt(item.valorTableDaily);
      rowData['integrityGapDaily'] = fmt(item.integrityGapDaily);
      rowData['grossDailyTotal'] = fmt(item.grossDailyTotal);
      rowData['discountsDailyTotal'] = fmt(item.discountsDailyTotal);
      rowData['netDailyCollection'] = fmt(item.netDailyCollection);
      rowData['cancelledValueDaily'] = fmt(item.cancelledValueDaily);
      rowData['cancelledCountDaily'] = String(item.cancelledCountDaily || 0);
    }

    return selectedCols.map((col) => rowData[col.id] || '-');
  };

  const handlePdfGenerator = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c: any) => c.label);
    const rows = currentFilteredData.map((d) => mapRowData(d, selectedCols));

    return exportService.generatePdfBlobUrl({
      rows: rows,
      columns: colLabels,
      fileName: `reporte_trash_${activeTab}`,
      title: currentReportTitle,
      orientation
    });
  };

  const handleDownloadPdf = ({ orientation, selectedColumnIds }: any) => {
    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c: any) => c.label);
    const rows = currentFilteredData.map((d) => mapRowData(d, selectedCols));

    exportService.exportToPdf({
      rows: rows,
      columns: colLabels,
      fileName: `reporte_trash_${activeTab}`,
      title: currentReportTitle,
      orientation
    });
    setShowPdfPreview(false);
  };

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
    showPdfPreview,
    setShowPdfPreview,
    currentFilteredData,
    currentAvailableColumns,
    currentReportTitle,
    handlePdfGenerator,
    handleDownloadPdf
  };
};
