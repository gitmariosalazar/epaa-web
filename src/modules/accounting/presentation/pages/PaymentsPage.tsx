import React from 'react';
import '../styles/PaymentsPage.css';
import { PaymentFilters } from '../components/PaymentFilters';
import { PaymentsTable } from '../components/PaymentsTable';
import { PaymentReadingsTable } from '../components/PaymentReadingsTable';
import {
  usePaymentsViewModel,
  type PaymentTab
} from '../hooks/usePaymentsViewModel';
import { useTranslation } from 'react-i18next';
import { Receipt, FileText, CalendarRange } from 'lucide-react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

// ── Tab definitions (Open/Closed: add tabs here without touching logic) ──────
const PAYMENT_TABS: TabItem<PaymentTab>[] = [
  { id: 'payments', label: 'Pagos por Orden', icon: <Receipt size={16} /> },
  {
    id: 'readings',
    label: 'Pagos de Lecturas',
    icon: <FileText size={16} />
  },
  {
    id: 'range',
    label: 'Pagos por Rango de Fechas',
    icon: <CalendarRange size={16} />
  }
];

export const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();

  // Translate labels at render time so i18n is honoured
  const translatedTabs: TabItem<PaymentTab>[] = [
    {
      ...PAYMENT_TABS[0],
      label: t('accounting.tabs.generalPayments', 'Pagos por Orden')
    },
    {
      ...PAYMENT_TABS[1],
      label: t('accounting.tabs.paymentReadings', 'Pagos de Lecturas')
    },
    {
      ...PAYMENT_TABS[2],
      label: t('accounting.tabs.dateRangeReport', 'Pagos por Rango de Fechas')
    }
  ];

  const { state, actions } = usePaymentsViewModel();
  const loadingProgress = useSimulatedProgress(state.isLoading);

  return (
    <div className="payments-page">
      <Tabs
        tabs={translatedTabs}
        activeTab={state.activeTab}
        onTabChange={actions.setActiveTab}
      />

      <PaymentFilters
        activeTab={state.activeTab}
        searchQuery={state.searchQuery}
        onSearchQueryChange={actions.setSearchQuery}
        date={state.date}
        onDateChange={actions.setDate}
        orderValue={state.orderValue}
        onOrderValueChange={actions.setOrderValue}
        onFetch={actions.handleFetch}
        isLoading={state.isLoading}
        selectedUser={state.selectedUser}
        onUserChange={actions.setSelectedUser}
        userList={state.userList}
        selectedPaymentMethod={state.selectedPaymentMethod}
        onPaymentMethodChange={actions.setSelectedPaymentMethod}
        paymentMethodList={state.paymentMethodList}
        initDate={state.initDate}
        onInitDateChange={actions.setInitDate}
        endDate={state.endDate}
        onEndDateChange={actions.setEndDate}
        limit={state.limit}
        onLimitChange={actions.setLimit}
        offset={state.offset}
        onOffsetChange={actions.setOffset}
      />

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
            label={t('common.loading', 'Loading...')}
          />
        </div>
      ) : state.activeTab === 'payments' ? (
        <PaymentsTable
          data={state.filteredPayments}
          isLoading={false}
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={state.date}
          endDate={state.date}
        />
      ) : state.activeTab === 'readings' ? (
        <PaymentReadingsTable
          data={state.filteredReadings}
          isLoading={false}
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={state.initDate}
          endDate={state.endDate}
        />
      ) : (
        <PaymentsTable
          data={state.filteredPaymentsByRange}
          isLoading={false}
          onSort={actions.handleSort}
          sortConfig={state.sortConfig}
          startDate={state.initDate}
          endDate={state.endDate}
        />
      )}
    </div>
  );
};
