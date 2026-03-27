import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOverduePaymentsViewModel, type OverduePaymentTab } from '../hooks/useOverduePaymentsViewModel';
import { OverduePaymentFilters } from '../components/OverduePaymentFilters';
import { OverduePaymentsTable } from '../components/OverduePaymentsTable';
import { YearlyOverdueSumaryTable } from '../components/YearlyOverdueSumaryTable';
import { YearlyOverdueDashboard } from '../components/YearlyOverdueDashboard';
import { GlobalOverdueDashboard} from '../components/GlobalOverdueDashboard';
import { YearlyOverdueDashboardFilters } from '../components/YearlyOverdueDashboardFilters';
import { PendingReadingsModal } from '../components/PendingReadingsModal';
import { Table as TableIcon, LayoutDashboard, Globe, FileText } from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import '../styles/OverdueDashboard.css';

export const OverduePaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    overduePayments,
    displayedYearlySummary,
    yearlyOverdueSummary,
    dashboardYear,
    resolvedDashboardYear,
    setDashboardYear,
    overdueSummary,
    isLoading,
    isYearlySummaryLoading,
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    searchOperator,
    setSearchOperator,
    activeTab,
    setActiveTab,
    handleClearSearch,
    handleSort,
    handleLoadMore,
    pendingReadings,
    isPendingLoading,
    isPendingModalOpen,
    setIsPendingModalOpen,
    fetchPendingReadings,
    fetchOverdueSummary,
    fetchYearlyOverdueSummary,
    fetchOverduePayments,
    sortConfig,
    hasMore
  } = useOverduePaymentsViewModel();

  const TABS_DEFINITION: TabItem<OverduePaymentTab>[] = [
    { id: 'payments', label: t('accounting.overdue.paymentsTab', 'Pagos en Mora'), icon: <FileText size={16} /> },
    { id: 'yearly_summary', label: t('accounting.overdue.yearlySummaryTab', 'Resumen Anual'), icon: <TableIcon size={16} /> },
    { id: 'dashboard_global', label: t('accounting.overdue.globalDashboardTab', 'Dashboard Global'), icon: <Globe size={16} /> },
    { id: 'dashboard_anual', label: t('accounting.overdue.yearlyDashboardTab', 'Dashboard Anual'), icon: <LayoutDashboard size={16} /> },
  ];

  const selectedYearData = (yearlyOverdueSummary || []).find(item => item.year.toString() === resolvedDashboardYear) || null;
  const loadingProgress = useSimulatedProgress(isLoading || isYearlySummaryLoading);

  const renderFilters = () => {
    switch (activeTab) {
      case 'payments':
        return (
          <OverduePaymentFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchField={searchField}
            setSearchField={setSearchField}
            searchOperator={searchOperator}
            setSearchOperator={setSearchOperator}
            handleClearSearch={handleClearSearch}
            isLoading={isLoading}
            onRefresh={() => fetchOverduePayments(0, false, true)}
          />
        );
      case 'yearly_summary':
        return (
          <YearlyOverdueDashboardFilters 
            selectedYear={dashboardYear}
            onYearChange={setDashboardYear}
            availableYears={(yearlyOverdueSummary || []).map(y => y.year)}
            isLoading={isYearlySummaryLoading}
            onRefresh={() => fetchYearlyOverdueSummary(true)}
          />
        );
      case 'dashboard_global':
        return (
          <YearlyOverdueDashboardFilters 
            selectedYear="all"
            onYearChange={() => {}}
            isLoading={isYearlySummaryLoading || isLoading}
            onRefresh={() => {
              fetchYearlyOverdueSummary(true);
              fetchOverdueSummary(true);
            }}
            hideYearFilter={true}
          />
        );
      case 'dashboard_anual':
        return (
          <YearlyOverdueDashboardFilters 
            selectedYear={resolvedDashboardYear}
            onYearChange={setDashboardYear}
            availableYears={(yearlyOverdueSummary || []).map(y => y.year)}
            isLoading={isYearlySummaryLoading}
            showAllOption={false}
            onRefresh={() => fetchYearlyOverdueSummary(true)}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if ((activeTab === 'payments' && isLoading && overduePayments.length === 0) ||
        (activeTab !== 'payments' && isYearlySummaryLoading && displayedYearlySummary.length === 0)) {
      return (
        <div className="overdue-page-loading">
          <CircularProgress
            progress={loadingProgress}
            size={140}
            strokeWidth={6}
            label={t('common.loading', 'Cargando...')}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'payments':
        return (
          <OverduePaymentsTable
            data={overduePayments}
            isLoading={isLoading}
            sortConfig={sortConfig}
            onSort={(key) => handleSort(key)}
            onEndReached={handleLoadMore}
            onViewPendingReadings={(clientId) => {
              fetchPendingReadings(clientId);
            }}
            hasMore={hasMore}
          />
        );
      case 'yearly_summary':
        return (
          <YearlyOverdueSumaryTable
            data={displayedYearlySummary}
            isLoading={isYearlySummaryLoading}
          />
        );
      case 'dashboard_global':
        return (
          <GlobalOverdueDashboard 
            yearlyData={yearlyOverdueSummary || []}
            globalSummary={overdueSummary}
            isLoading={isYearlySummaryLoading}
          />
        );
      case 'dashboard_anual':
        return (
          <YearlyOverdueDashboard 
            yearlyData={yearlyOverdueSummary || []}
            selectedYearData={selectedYearData}
            isLoading={isYearlySummaryLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="overdue-payments-page"
      header={
        <div className="overdue-payments-tabs-row">
          <Tabs
            tabs={TABS_DEFINITION}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as OverduePaymentTab)}
          />
        </div>
      }
      filters={renderFilters()}
    >
      <div className="overdue-payments-content">
        {renderContent()}
      </div>

      <PendingReadingsModal 
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)} 
        data={pendingReadings}
        isLoading={isPendingLoading}
      />
    </PageLayout>
  );
};

export default OverduePaymentsPage;
