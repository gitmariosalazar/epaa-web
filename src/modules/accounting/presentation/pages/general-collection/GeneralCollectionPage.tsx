import React from 'react';
import '../../styles/payments/PaymentsPage.css';
import { GeneralCollectionFilters } from '../../components/general-collection/GeneralCollectionFilters';
import { GeneralCollectionTable } from '../../components/general-collection/GeneralCollectionTable';
import { GeneralCollectionGroupedTable } from '../../components/general-collection/GeneralCollectionGroupedTable';
import { GeneralCollectionDashboard } from '../../components/general-collection/GeneralCollectionDashboard';
import {
  useGeneralCollectionViewModel,
  type GeneralCollectionTab
} from '../../hooks/general-collection/useGeneralCollectionViewModel';
import { FileText, CalendarRange, Calendar, Clock, LayoutDashboard } from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

const COLLECTION_TABS: TabItem<GeneralCollectionTab>[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'general', label: 'Reporte General', icon: <FileText size={16} /> },
  { id: 'daily', label: 'Reporte Diario', icon: <Clock size={16} /> },
  { id: 'monthly', label: 'Reporte Mensual', icon: <CalendarRange size={16} /> },
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
          year={state.year}
          onYearChange={actions.setYear}
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
          kpi={state.kpi}
          monthlyKpi={state.monthlyKpi}
          yearlyKpi={state.yearlyKpi}
          isLoading={state.isLoading}
          activeTab={state.activeTab}
        />
      ) : state.activeTab === 'general' ? (
            <GeneralCollectionTable
              data={state.filteredReport}
              isLoading={false}
              onSort={actions.handleSort}
              sortConfig={state.sortConfig}
              startDate={state.initDate}
              endDate={state.endDate}
            />
          ) : state.activeTab === 'daily' ? (
            <GeneralCollectionGroupedTable
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
              data={state.filteredMonthlyReport}
              isLoading={false}
              type="monthly"
              onSort={actions.handleSort}
              sortConfig={state.sortConfig}
              startDate={`${state.startYear}`}
              endDate={`${state.endYear}`}
            />
          ) : (
            <GeneralCollectionGroupedTable
              data={state.filteredYearlyReport}
              isLoading={false}
              type="yearly"
              onSort={actions.handleSort}
              sortConfig={state.sortConfig}
              startDate={`${state.startYear}`}
              endDate={`${state.endYear}`}
            />
      )}
    </PageLayout>
  );
};
