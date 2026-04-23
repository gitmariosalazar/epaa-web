import React from 'react';
import '../../styles/payments/PaymentsPage.css';
import { AgreementsFilters } from '../../components/agreements/AgreementsFilters';
import { AgreementsDashboard } from '../../components/agreements/yearly-dashboard/AgreementsDashboard';
import { AgreementsDebtorsTable } from '../../components/agreements/AgreementsDebtorsTable';
import { AgreementsCollectorPerformanceTable } from '../../components/agreements/AgreementsCollectorPerformanceTable';
import { AgreementsPaymentMethodsTable } from '../../components/agreements/AgreementsPaymentMethodsTable';
import { AgreementsCitizenSummaryTable } from '../../components/agreements/AgreementsCitizenSummaryTable';
import { AgreementsMonthlySummaryTable } from '../../components/agreements/AgreementsMonthlySummaryTable';
import { MonthlyAgreementsDashboard } from '../../components/agreements/monthly-dashboard/MonthlyAgreementsDashboard';
import {
  useAgreementsViewModel,
  type AgreementsTab
} from '../../hooks/agreements/useAgreementsViewModel';
import {
  LayoutDashboard,
  AlertTriangle,
  UserCheck,
  CreditCard,
  Users,
  CalendarRange
} from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { AgreementsAnuallySummaryTable } from '../../components/agreements/AgreementsAnuallySummaryTable';

const AGREEMENTS_TABS: TabItem<AgreementsTab>[] = [
  {
    id: 'yearly-dashboard',
    label: 'Dashboard Anual',
    icon: <LayoutDashboard size={16} />
  },
  {
    id: 'monthly-dashboard',
    label: 'Dashboard Mensual',
    icon: <CalendarRange size={16} />
  },
  {
    id: 'debtors',
    label: 'Deudores de Riesgo',
    icon: <AlertTriangle size={16} />
  },
  {
    id: 'collector-performance',
    label: 'Desempeño Recaudadores',
    icon: <UserCheck size={16} />
  },
  {
    id: 'payment-methods',
    label: 'Métodos de Pago',
    icon: <CreditCard size={16} />
  },
  {
    id: 'citizen-summary',
    label: 'Resumen Ciudadanos',
    icon: <Users size={16} />
  },
  {
    id: 'yearly-summary',
    label: 'Resumen Anual',
    icon: <CalendarRange size={16} />
  },
  {
    id: 'monthly-summary',
    label: 'Resumen Mensual',
    icon: <CalendarRange size={16} />
  }
];

export const AgreementsPage: React.FC = () => {
  const { state, actions } = useAgreementsViewModel();
  const loadingProgress = useSimulatedProgress(state.isLoading);

  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="payments-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label="Cargando..."
          />
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="payments-error-container">
          <div className="payments-error-dot" />
          <span className="payments-error-text">{state.error}</span>
        </div>
      );
    }

    switch (state.activeTab) {
      case 'yearly-dashboard':
        return (
          <AgreementsDashboard
            kpis={state.filteredKpi}
            collectorPerformance={state.filteredCollectorPerformance}
            paymentMethodSummary={state.filteredPaymentMethodSummary}
            isLoading={state.isLoading}
            startYear={state.startYear}
            endYear={state.endYear}
          />
        );
      case 'debtors':
        return (
          <AgreementsDebtorsTable
            data={state.filteredDebtors}
            isLoading={false}
            onSort={actions.handleSort}
            sortConfig={state.sortConfig}
          />
        );
      case 'collector-performance':
        return (
          <AgreementsCollectorPerformanceTable
            data={state.filteredCollectorPerformance}
            isLoading={false}
            onSort={actions.handleSort}
            sortConfig={state.sortConfig}
            startDate={state.initDate}
            endDate={state.endDate}
          />
        );
      case 'payment-methods':
        return (
          <AgreementsPaymentMethodsTable
            data={state.filteredPaymentMethodSummary}
            isLoading={false}
            onSort={actions.handleSort}
            sortConfig={state.sortConfig}
            startDate={state.initDate}
            endDate={state.endDate}
          />
        );
      case 'citizen-summary':
        return (
          <AgreementsCitizenSummaryTable
            data={state.filteredCitizenSummary}
            isLoading={false}
            onSort={actions.handleSort}
            sortConfig={state.sortConfig}
            startDate={state.initDate}
            endDate={state.endDate}
          />
        );
      case 'monthly-dashboard':
        return (
          <MonthlyAgreementsDashboard
            kpis={state.filteredKpi}
            collectorPerformance={state.filteredCollectorPerformance}
            paymentMethodSummary={state.filteredPaymentMethodSummary}
            isLoading={state.isLoading}
            year={state.startYear}
          />
        );
      case 'yearly-summary':
        return (
          <AgreementsAnuallySummaryTable
            data={state.filteredKpi}
            isLoading={state.isLoading}
            searchType={state.searchType}
          />
        );
      case 'monthly-summary':
        return (
          <AgreementsMonthlySummaryTable
            data={state.filteredMonthlySummary}
            isLoading={false}
            onSort={actions.handleSort}
            sortConfig={state.sortConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="payments-page"
      header={
        <Tabs
          tabs={AGREEMENTS_TABS}
          activeTab={state.activeTab}
          onTabChange={actions.setActiveTab}
        />
      }
      filters={
        <AgreementsFilters
          activeTab={state.activeTab}
          initDate={state.initDate}
          onInitDateChange={actions.setInitDate}
          endDate={state.endDate}
          onEndDateChange={actions.setEndDate}
          startYear={state.startYear}
          onStartYearChange={actions.setStartYear}
          endYear={state.endYear}
          onEndYearChange={actions.setEndYear}
          searchQuery={state.searchQuery}
          onSearchQueryChange={actions.setSearchQuery}
          searchType={state.searchType}
          onSearchTypeChange={actions.setSearchType}
          onFetch={actions.handleFetch}
          isLoading={state.isLoading}
          canFetch={state.canFetch}
        />
      }
    >
      {renderContent()}
    </PageLayout>
  );
};
