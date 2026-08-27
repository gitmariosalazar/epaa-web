import React, { useState } from 'react';
import '../../styles/payments/PaymentsPage.css'; // Reusing layout CSS
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { PendingBillsFilters } from '../../components/pending-bills/PendingBillsFilters';
import { ClientPendingBillsList } from '../../components/pending-readings/ClientPendingBillsList';
import { useClientPendingBills } from '../../hooks/pending-readings/useClientPendingBills';
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
    { ...PENDING_BILLS_TABS[1], label: t('accounting.tabs.history', 'Historial (Próximamente)') }
  ];

  // ViewModel / Hook
  const { isLoading, error, groupedBills, fetchPendingBills } = useClientPendingBills();
  const loadingProgress = useSimulatedProgress(isLoading);

  const handleFetch = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    if (activeTab === 'pending') {
      await fetchPendingBills(searchQuery.trim());
    }
  };

  return (
    <PageLayout
      className="payments-page"
      header={
        <Tabs
          tabs={translatedTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
      filters={
        <PendingBillsFilters
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onFetch={handleFetch}
          isLoading={isLoading}
        />
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
        hasSearched && groupedBills.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState
              message="No se encontraron facturas pendientes"
              description={`No hay comprobantes pendientes para la búsqueda: "${searchQuery}"`}
              icon={SearchX}
              variant="warning"
            />
          </div>
        ) : !hasSearched && groupedBills.length === 0 ? (
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
            groups={groupedBills}
            isLoading={isLoading}
          />
        )
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            message="Próximamente"
            description="Esta consulta estará disponible muy pronto para que puedas ir agregando más opciones."
            icon={Info}
            variant="info"
          />
        </div>
      )}
    </PageLayout>
  );
};
