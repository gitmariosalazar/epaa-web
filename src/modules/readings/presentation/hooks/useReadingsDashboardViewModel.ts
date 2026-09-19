import { useState, useCallback } from 'react';
import { useReadingsReconciliation } from './useReadingsReconciliation';
import type { ReconciliationSummary } from '../../domain/models/lecturas-reconciliation';
import type { DashboardKpiResponse, DashboardKpiAnnualSqlResponse } from '../../domain/models/reading-kpi';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export type ReadingsDashboardTab = 'dashboard-kpi-month' | 'dashboard-kpi-year';

export const useReadingsDashboardViewModel = (initialMonth?: string) => {
  const repo = useReadingsReconciliation();

  const [activeTab, setActiveTab] = useState<ReadingsDashboardTab>(
    'dashboard-kpi-month'
  );

  // State for Month Selection
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialMonth || dateService.getCurrentMonthString()
  );

  // Default to one month behind for the new dashboard
  const getPreviousMonth = () => {
    const d = dateService.getCurrentDate();
    d.setMonth(d.getMonth() - 1);
    return dateService.toISODateString(d).substring(0, 7);
  };
  const [dashboardSelectedMonth, setDashboardSelectedMonth] = useState<string>(
    initialMonth || getPreviousMonth()
  );

  const [dashboardSelectedYear, setDashboardSelectedYear] = useState<string>(
    initialMonth ? initialMonth.split('-')[0] : String(dateService.getCurrentDate().getFullYear())
  );

  // State for Dashboard KPIs Tab
  const [dashboardKpisData, setDashboardKpisData] = useState<
    DashboardKpiResponse[] | null
  >(null);

  // State for Dashboard KPIs Annual Tab
  const [dashboardKpisAnnualData, setDashboardKpisAnnualData] = useState<
    DashboardKpiAnnualSqlResponse[] | null
  >(null);

  // State for Basic Summary Tab
  const [basicSummaryData, setBasicSummaryData] =
    useState<ReconciliationSummary | null>(null);

  // Common fetching status
  const isLoading = repo.isLoading;
  const error = repo.error;

  const handleTabChange = useCallback(
    (tab: ReadingsDashboardTab) => {
      setActiveTab(tab);
      repo.clearError();
    },
    [repo]
  );

  // Actions for Basic Summary Tab
  const fetchBasicSummary = useCallback(async () => {
    if (!selectedMonth) return;
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getSummary({
      anio: year,
      mesTexto: monthNum,
      mesLectura: selectedMonth
    });
    if (result) setBasicSummaryData(result);
  }, [selectedMonth, repo]);

  // Actions for Dashboard KPIs
  const fetchDashboardKpis = useCallback(async () => {
    if (!dashboardSelectedMonth) return;
    const [year, monthNum] = dashboardSelectedMonth.split('-');

    const monthMap: Record<string, string> = {
      '01': 'ENERO',
      '02': 'FEBRERO',
      '03': 'MARZO',
      '04': 'ABRIL',
      '05': 'MAYO',
      '06': 'JUNIO',
      '07': 'JULIO',
      '08': 'AGOSTO',
      '09': 'SEPTIEMBRE',
      '10': 'OCTUBRE',
      '11': 'NOVIEMBRE',
      '12': 'DICIEMBRE'
    };
    const monthText = monthMap[monthNum] || 'ENERO';

    const result = await repo.getDashboardKpisByPeriod(
      parseInt(year),
      monthText
    );
    if (result) setDashboardKpisData(result);
  }, [dashboardSelectedMonth, repo]);

  // Actions for Dashboard KPIs Annual
  const fetchDashboardKpisAnnual = useCallback(async () => {
    if (!dashboardSelectedYear) return;

    const result = await repo.getDashboardKpisByYear(
      parseInt(dashboardSelectedYear)
    );
    if (result) setDashboardKpisAnnualData(result);
  }, [dashboardSelectedYear, repo]);

  // Fetch data for the active tab when refresh is clicked
  const fetchAllData = useCallback(async () => {
    if (activeTab === 'dashboard-kpi-month') {
      await fetchDashboardKpis();
    } else if (activeTab === 'dashboard-kpi-year') {
      await fetchDashboardKpisAnnual();
    }
  }, [activeTab, fetchDashboardKpis, fetchDashboardKpisAnnual]);

  // Automatic fetches based on tab switching
  const handleFetchData = useCallback(() => {
    if (activeTab === 'dashboard-kpi-month') {
      fetchDashboardKpis();
    }
    if (activeTab === 'dashboard-kpi-year') fetchDashboardKpisAnnual();
  }, [activeTab, fetchDashboardKpis, fetchDashboardKpisAnnual]);

  return {
    activeTab,
    handleTabChange,

    selectedMonth,
    setSelectedMonth,

    basicSummaryData,
    fetchBasicSummary,

    dashboardSelectedMonth,
    setDashboardSelectedMonth,
    dashboardKpisData,
    fetchDashboardKpis,

    dashboardSelectedYear,
    setDashboardSelectedYear,
    dashboardKpisAnnualData,
    fetchDashboardKpisAnnual,

    handleFetchData,

    fetchAllData,

    isLoading,
    error,
    clearError: repo.clearError
  };
};
