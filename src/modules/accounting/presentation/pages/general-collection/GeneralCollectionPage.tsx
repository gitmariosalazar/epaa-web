import React from 'react';
import '../../styles/payments/PaymentsPage.css';
import { GeneralCollectionFilters } from '../../components/general-collection/GeneralCollectionFilters';
import { GeneralCollectionTable } from '../../components/general-collection/GeneralCollectionTable';
import { GeneralCollectionGroupedTable } from '../../components/general-collection/GeneralCollectionGroupedTable';
import { GeneralCollectionDashboard } from '../../components/general-collection/GeneralCollectionDashboard';
import { GeneralCollectionYearlyDashboard } from '../../components/general-collection/GeneralCollectionYearlyDashboard';
import { GeneralCollectionMonthlyDashboard } from '../../components/general-collection/GeneralCollectionMonthlyDashboard';
import {
  useGeneralCollectionViewModel,
  type GeneralCollectionTab
} from '../../hooks/general-collection/useGeneralCollectionViewModel';
import {
  FileText,
  CalendarRange,
  Calendar,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

const COLLECTION_TABS: TabItem<GeneralCollectionTab>[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  {
    id: 'yearly-dashboard',
    label: 'Dashboard Anual',
    icon: <LayoutDashboard size={16} />
  },
  {
    id: 'yearly-query',
    label: 'Consulta Anual',
    icon: <Calendar size={16} />
  },
  {
    id: 'monthly-dashboard',
    label: 'Dashboard Mensual',
    icon: <LayoutDashboard size={16} />
  },
  { id: 'general', label: 'Reporte General', icon: <FileText size={16} /> },
  { id: 'daily', label: 'Reporte Diario', icon: <Clock size={16} /> },
  {
    id: 'monthly',
    label: 'Reporte Mensual',
    icon: <CalendarRange size={16} />
  },
  { id: 'yearly', label: 'Reporte Anual', icon: <Calendar size={16} /> }
];

export const GeneralCollectionPage: React.FC = () => {
  const { state, actions } = useGeneralCollectionViewModel();
  const loadingProgress = useSimulatedProgress(state.isLoading);

  return (
    <PageLayout
      className="payments-page"
      header={
        <Tabs
          tabs={COLLECTION_TABS}
          activeTab={state.activeTab}
          onTabChange={actions.setActiveTab}
        />
      }
      filters={
        <GeneralCollectionFilters
          activeTab={state.activeTab}
          filterType={state.filterType}
          onFilterTypeChange={actions.setFilterType}
          initDate={state.initDate}
          onInitDateChange={actions.setInitDate}
          endDate={state.endDate}
          onEndDateChange={actions.setEndDate}
          startYear={state.startYear}
          onStartYearChange={actions.setStartYear}
          endYear={state.endYear}
          onEndYearChange={actions.setEndYear}
          titleCode={state.titleCode}
          onTitleCodeChange={actions.setTitleCode}
          searchQuery={state.searchQuery}
          onSearchQueryChange={actions.setSearchQuery}
          onFetch={actions.handleFetch}
          isLoading={state.isLoading}
          selectedUser={state.selectedUser}
          onUserChange={actions.setSelectedUser}
          userList={state.userList}
          selectedPaymentMethod={state.selectedPaymentMethod}
          onPaymentMethodChange={actions.setSelectedPaymentMethod}
          paymentMethodList={state.paymentMethodList}
          localDashboardYear={state.localDashboardYear}
          onLocalDashboardYearChange={actions.setLocalDashboardYear}
          localDashboardMonth={state.localDashboardMonth}
          onLocalDashboardMonthChange={actions.setLocalDashboardMonth}
          availableDashboardYears={state.availableDashboardYears}
          canFetch={state.canFetch}
        />
      }
    >
      {state.error ? (
        <div className="payments-error-container">
          <div className="payments-error-dot" />
          <span className="payments-error-text">{state.error}</span>
        </div>
      ) : state.isLoading ? (
        <div className="payments-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label="Cargando..."
          />
        </div>
      ) : state.activeTab === 'dashboard' ? (
        <GeneralCollectionDashboard
          key="general-dashboard"
          kpi={state.kpi}
          isLoading={state.isLoading}
        />
      ) : state.activeTab === 'general' ? (
        <GeneralCollectionTable
          key="general-table"
          data={state.filteredReport}
          isLoading={false}
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={state.initDate}
          endDate={state.endDate}
        />
      ) : state.activeTab === 'daily' ? (
        <GeneralCollectionGroupedTable
          key="daily-grouped-table"
          data={state.filteredDailyReport}
          isLoading={false}
          type="daily"
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={state.initDate}
          endDate={state.endDate}
        />
      ) : state.activeTab === 'monthly' ? (
        <GeneralCollectionGroupedTable
          key="monthly-grouped-table"
          data={state.filteredMonthlyReport}
          isLoading={false}
          type="monthly"
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={`${state.startYear}`}
          endDate={`${state.endYear}`}
        />
      ) : state.activeTab === 'yearly' ? (
        <GeneralCollectionGroupedTable
          key="yearly-grouped-table"
          data={state.filteredYearlyReport}
          isLoading={false}
          type="yearly"
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={`${state.startYear}`}
          endDate={`${state.endYear}`}
        />
      ) : state.activeTab === 'yearly-dashboard' ? (
        <GeneralCollectionYearlyDashboard
          key="yearly-dashboard"
          kpi={state.yearlyKpi}
          unfilteredKpi={state.rawYearlyKpi}
          isLoading={state.isLoading}
        />
      ) : state.activeTab === 'yearly-query' ? (
        <GeneralCollectionMonthlyDashboard
          key="yearly-query-dashboard"
          kpi={state.yearlyQueryKpi}
          unfilteredKpi={state.yearlyQueryKpi}
          isLoading={state.isLoading}
        />
      ) : state.activeTab === 'monthly-dashboard' ? (
        <GeneralCollectionMonthlyDashboard
          key="monthly-dashboard"
          kpi={state.monthlyKpi}
          unfilteredKpi={state.rawMonthlyKpi}
          isLoading={state.isLoading}
          jumpToYear={state.localDashboardYear ? parseInt(state.localDashboardYear) : undefined}
        />
      ) : (
        <GeneralCollectionDashboard
          key="default-dashboard"
          kpi={state.kpi}
          isLoading={state.isLoading}
        />
      )}
    </PageLayout>
  );
};
