import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTrashRateReport } from './useTrashRateReport';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarRange,
  FileWarning,
  FileX,
  Users,
  User
} from 'lucide-react';
import React from 'react';

// ── Tab type (SRP: keep tab ids here, not scattered) ──────────────────────────
export type TrashRateTab =
  | 'dashboard'
  | 'auditReport'
  | 'monthlySummary'
  | 'missingValor'
  | 'creditNotes'
  | 'topDebtors'
  | 'clientDetail';

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

// ── ViewModel (DIP: depends on useTrashRateReport abstraction) ────────────────
export const useTrashRateReportViewModel = () => {
  const { t } = useTranslation();

  const TRASH_TABS: TabItem<TrashRateTab>[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: t('trashRateReport.tabs.dashboard', 'KPI Dashboard'),
        icon: React.createElement(LayoutDashboard, { size: 16 })
      },
      {
        id: 'auditReport',
        label: t('trashRateReport.tabs.auditReport', 'Auditoría de Tasas'),
        icon: React.createElement(ClipboardList, { size: 16 })
      },
      {
        id: 'monthlySummary',
        label: t('trashRateReport.tabs.monthlySummary', 'Resumen Mensual'),
        icon: React.createElement(CalendarRange, { size: 16 })
      },
      {
        id: 'missingValor',
        label: t('trashRateReport.tabs.missingValor', 'Sin Valor'),
        icon: React.createElement(FileWarning, { size: 16 })
      },
      {
        id: 'creditNotes',
        label: t('trashRateReport.tabs.creditNotes', 'Notas de Crédito'),
        icon: React.createElement(FileX, { size: 16 })
      },
      {
        id: 'topDebtors',
        label: t('trashRateReport.tabs.topDebtors', 'Top Deudores'),
        icon: React.createElement(Users, { size: 16 })
      },
      {
        id: 'clientDetail',
        label: t('trashRateReport.tabs.clientDetail', 'Detalle Cliente'),
        icon: React.createElement(User, { size: 16 })
      }
    ],
    [t]
  );

  // ── Data from hook ─────────────────────────────────────────────────────────
  const {
    trashRateAuditReport,
    monthlySummaryReport,
    missingValorBills,
    activeCreditNotes,
    clientDetailSearch,
    topDebtorReport,
    dashboardKPITrashRate,
    getTrashRateAuditReport,
    getMonthlySummaryReport,
    getMissingValorBills,
    getActiveCreditNotes,
    getClientDetailSearch,
    getTopDebtorReport,
    getDashboardKPITrashRate,
    loading: isLoading,
    error,
    clearError
  } = useTrashRateReport();

  // ── Shared state ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TrashRateTab>('dashboard');

  const today = dateService.getCurrentDateString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [top, setTop] = useState<string>('100');
  const [limit, setLimit] = useState<string>('50');
  const [offset, setOffset] = useState<string>('0');

  // ── Per-tab filter state (ISP: each tab only exposes what it needs) ────────
  // auditReport
  const [auditPaymentStatus, setAuditPaymentStatus] = useState('');
  const [auditDiagnostic, setAuditDiagnostic] = useState('');

  // missingValor
  const [missingPaymentStatus, setMissingPaymentStatus] = useState('');

  // creditNotes
  const [creditCoverage, setCreditCoverage] = useState('');

  // clientDetail
  const [clientSearchParams, setClientSearchParams] = useState('');

  // shared sort
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // ── Reset filters on tab change (OCP: adding new tabs = add new reset line) ─
  useEffect(() => {
    setAuditPaymentStatus('');
    setAuditDiagnostic('');
    setMissingPaymentStatus('');
    setCreditCoverage('');
    setSortConfig(null);
    setTop('100');
    setLimit('50');
    setOffset('0');
    clearError();
  }, [activeTab, clearError]);

  // ── Fetch per tab ──────────────────────────────────────────────────────────
  const dateParams = () =>
    new DateRangeParams(
      startDate,
      endDate,
      undefined,
      Number(limit) || 50,
      Number(offset) || 0
    );

  const handleFetch = () => {
    if (activeTab === 'dashboard')
      getDashboardKPITrashRate(new DateRangeParams(startDate, endDate));
    else if (activeTab === 'auditReport') getTrashRateAuditReport(dateParams());
    else if (activeTab === 'monthlySummary')
      getMonthlySummaryReport(dateParams());
    else if (activeTab === 'missingValor') getMissingValorBills(dateParams());
    else if (activeTab === 'creditNotes') getActiveCreditNotes(dateParams());
    else if (activeTab === 'topDebtors')
      getTopDebtorReport(
        new DateRangeParams(
          startDate,
          endDate,
          Number(top) || 100,
          Number(limit) || 50,
          Number(offset) || 0
        )
      );
    else if (activeTab === 'clientDetail')
      getClientDetailSearch(clientSearchParams);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') =>
    setSortConfig({ key, direction });

  // ── Derived dropdown lists ─────────────────────────────────────────────────
  const auditPaymentStatusList = useMemo(
    () =>
      Array.from(
        new Set(trashRateAuditReport.map((r) => r.paymentStatus || ''))
      ).filter(Boolean) as string[],
    [trashRateAuditReport]
  );
  const auditDiagnosticList = useMemo(
    () =>
      Array.from(
        new Set(trashRateAuditReport.map((r) => r.diagnostic || ''))
      ).filter(Boolean) as string[],
    [trashRateAuditReport]
  );
  const missingPaymentStatusList = useMemo(
    () =>
      Array.from(
        new Set(missingValorBills.map((r) => r.paymentStatus || ''))
      ).filter(Boolean) as string[],
    [missingValorBills]
  );
  const creditCoverageList = useMemo(
    () =>
      Array.from(
        new Set(activeCreditNotes.map((r) => r.creditCoverage || ''))
      ).filter(Boolean) as string[],
    [activeCreditNotes]
  );

  // ── Filtered data per tab ──────────────────────────────────────────────────
  const filteredAuditReport = useMemo(() => {
    let r = trashRateAuditReport;
    if (auditPaymentStatus)
      r = r.filter((i) => i.paymentStatus === auditPaymentStatus);
    if (auditDiagnostic) r = r.filter((i) => i.diagnostic === auditDiagnostic);
    return applySortConfig(r, sortConfig);
  }, [trashRateAuditReport, auditPaymentStatus, auditDiagnostic, sortConfig]);

  const filteredMonthlySummary = useMemo(
    () => applySortConfig(monthlySummaryReport, sortConfig),
    [monthlySummaryReport, sortConfig]
  );

  const filteredMissingValor = useMemo(() => {
    let r = missingValorBills;
    if (missingPaymentStatus)
      r = r.filter((i) => i.paymentStatus === missingPaymentStatus);
    return applySortConfig(r, sortConfig);
  }, [missingValorBills, missingPaymentStatus, sortConfig]);

  const filteredCreditNotes = useMemo(() => {
    let r = activeCreditNotes;
    if (creditCoverage)
      r = r.filter((i) => i.creditCoverage === creditCoverage);
    return applySortConfig(r, sortConfig);
  }, [activeCreditNotes, creditCoverage, sortConfig]);

  const filteredTopDebtors = useMemo(
    () => applySortConfig(topDebtorReport, sortConfig),
    [topDebtorReport, sortConfig]
  );

  const filteredClientDetail = useMemo(
    () => applySortConfig(clientDetailSearch, sortConfig),
    [clientDetailSearch, sortConfig]
  );

  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  return {
    t,
    isLoading,
    error: errorMessage,
    translatedTabs: TRASH_TABS,
    activeTab,
    setActiveTab,
    // date range (shared by most tabs)
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
    // auditReport filters
    auditPaymentStatus,
    setAuditPaymentStatus,
    auditPaymentStatusList,
    auditDiagnostic,
    setAuditDiagnostic,
    auditDiagnosticList,
    // missingValor filters
    missingPaymentStatus,
    setMissingPaymentStatus,
    missingPaymentStatusList,
    // creditNotes filters
    creditCoverage,
    setCreditCoverage,
    creditCoverageList,
    // clientDetail filters
    clientSearchParams,
    setClientSearchParams,
    // sort / pdf
    sortConfig,
    showPdfPreview,
    setShowPdfPreview,
    // filtered datasets
    filteredAuditReport,
    filteredMonthlySummary,
    filteredMissingValor,
    filteredCreditNotes,
    filteredTopDebtors,
    filteredClientDetail,
    dashboardKPITrashRate,
    // actions
    handleFetch,
    handleSort
  };
};
