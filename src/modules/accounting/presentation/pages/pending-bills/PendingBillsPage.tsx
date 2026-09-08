import React, { useState } from 'react';
import '../../styles/payments/PaymentsPage.css'; // Reusing layout CSS
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { PendingBillsFilters } from '../../components/pending-bills/PendingBillsFilters';
import { HistoryInvoicesFilters } from '../../components/pending-bills/HistoryInvoicesFilters';
import { ClientPendingBillsList } from '../../components/pending-readings/ClientPendingBillsList';
import { ClientHistoryInvoicesTable } from '../../components/pending-readings/ClientHistoryInvoicesTable';
import { useClientPendingBills } from '../../hooks/pending-readings/useClientPendingBills';
import { useClientHistoryInvoices } from '../../hooks/pending-readings/useClientHistoryInvoices';
import { SearchX, Info, FileText, Clock } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tabs, type TabItem } from '@/shared/presentation/components/Tabs';

type PendingBillsTab = 'pending' | 'history';

const PENDING_BILLS_TABS: TabItem<PendingBillsTab>[] = [
  { id: 'pending', label: 'Facturas Pendientes', icon: <FileText size={16} /> },
  { id: 'history', label: 'Historial', icon: <Clock size={16} /> }
];

export const PendingBillsPage: React.FC = () => {
  const { t } = useTranslation();

  // Local UI State
  const [activeTab, setActiveTab] = useState<PendingBillsTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Translate labels at render time
  const translatedTabs: TabItem<PendingBillsTab>[] = [
    { ...PENDING_BILLS_TABS[0], label: t('accounting.tabs.pending', 'Facturas Pendientes') },
    { ...PENDING_BILLS_TABS[1], label: t('accounting.tabs.history', 'Historial de Pagos') }
  ];

  // ViewModels
  const pendingBillsModel = useClientPendingBills();
  const historyInvoicesModel = useClientHistoryInvoices();

  const handleFetch = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    if (activeTab === 'pending') {
      await pendingBillsModel.fetchPendingBills(searchQuery.trim());
    } else {
      await historyInvoicesModel.fetchHistoryInvoices(searchQuery.trim());
    }
  };

  const isLoading = activeTab === 'pending' ? pendingBillsModel.isLoading : historyInvoicesModel.isLoading;
  const error = activeTab === 'pending' ? pendingBillsModel.error : historyInvoicesModel.error;
  const loadingProgress = useSimulatedProgress(isLoading);

  return (
    <PageLayout
      className="reading-images-page"
      header={
        <Tabs
          tabs={translatedTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
      filters={
        activeTab === 'pending' ? (
          <PendingBillsFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onFetch={handleFetch}
            isLoading={isLoading}
          />
        ) : (
          <HistoryInvoicesFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            dateRange={historyInvoicesModel.dateRange}
            onDateRangeChange={historyInvoicesModel.setDateRange}
            onFetch={handleFetch}
            isLoading={isLoading}
          />
        )
      }
    >
      {error ? (
        <div className="payments-error-container">
          <div className="payments-error-dot" />
          <span className="payments-error-text">{error}</span>
        </div>
      ) : isLoading ? (
        <div className="payments-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando comprobantes...')}
          />
        </div>
      ) : activeTab === 'pending' ? (
        hasSearched && pendingBillsModel.groupedBills.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              message="No se encontraron facturas pendientes"
              description={`No hay comprobantes pendientes para la búsqueda: "${searchQuery}"`}
              icon={SearchX}
              variant="warning"
            />
          </div>
        ) : !hasSearched && pendingBillsModel.groupedBills.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              message="Consulta de Comprobantes"
              description="Ingresa una cédula, RUC o clave catastral para buscar las facturas pendientes asociadas."
              icon={Info}
              variant="info"
            />
          </div>
        ) : (
          <ClientPendingBillsList
            groups={pendingBillsModel.groupedBills}
            isLoading={isLoading}
          />
        )
      ) : (
        hasSearched && historyInvoicesModel.groupedInvoices.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              message="No se encontró historial"
              description={`No hay pagos registrados para la búsqueda: "${searchQuery}" en el periodo seleccionado.`}
              icon={SearchX}
              variant="warning"
            />
          </div>
        ) : !hasSearched && historyInvoicesModel.groupedInvoices.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              message="Historial de Pagos"
              description="Ingresa una cédula, RUC o clave catastral y selecciona un rango de fechas para buscar los pagos realizados."
              icon={Info}
              variant="info"
            />
          </div>
        ) : (
          <ClientHistoryInvoicesTable
            groups={historyInvoicesModel.groupedInvoices}
            isLoading={isLoading}
          />
        )
      )}
    </PageLayout>
  );
};
