import '../styles/ConnectionsPage.css';
import {
  useConnectionsViewModel,
  type ConnectionTab
} from '../hooks/useConnectionsViewModel';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Plus, Network, Users, LayoutGrid } from 'lucide-react';
import { CreateConnectionWizard } from '../components/CreateConnectionWizard';
import { ConnectionsTable } from '../components/ConnectionsTable';
import { ConnectionsFilters } from '../components/ConnectionsFilters';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTranslation } from 'react-i18next';
import { AlertCircle, SearchX } from 'lucide-react';

export const ConnectionsPage = () => {
  const { t } = useTranslation();

  const CONNECTION_TABS: TabItem<ConnectionTab>[] = [
    {
      id: 'all',
      label: t('connections.tabs.all'),
      icon: <LayoutGrid size={16} />
    },
    {
      id: 'sector',
      label: t('connections.tabs.sector'),
      icon: <Network size={16} />
    },
    {
      id: 'client',
      label: t('connections.tabs.client'),
      icon: <Users size={16} />
    }
  ];

  // ── Unified ViewModel (Handles both List and CRUD/Wizard) ────────────────
  const { state, actions } = useConnectionsViewModel();

  const loadingProgress = useSimulatedProgress(state.isLoading);

  // ── Content renderer (mirrors PropertiesPage pattern) ────────────────────
  const renderContent = () => {
    // Show spinner only on first load (no data yet)
    if (state.isLoading && state.filteredConnections.length === 0) {
      return (
        <div className="connections-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Loading...')}
          />
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="connections-loading">
          <EmptyState
            message={t('common.error', 'Ocurrió un error')}
            description={state.error}
            icon={AlertCircle}
            variant="error"
            minHeight="300px"
          />
        </div>
      );
    }

    if (!state.isLoading && state.filteredConnections.length === 0) {
      return (
        <div className="connections-loading">
          <EmptyState
            message={t('common.noResults', 'Sin resultados')}
            description={t(
              'connections.noDataDescription',
              'No se encontraron conexiones con los filtros actuales. Usa Consultar para cargar datos.'
            )}
            icon={SearchX}
            variant="warning"
            minHeight="300px"
          />
        </div>
      );
    }

    return (
      <ConnectionsTable
        data={state.filteredConnections}
        isLoading={state.isLoading}
        onEdit={actions.openEdit}
        onDelete={actions.openDelete}
        onSort={actions.handleSort}
        sortConfig={state.sortConfig}
        onEndReached={actions.loadMore}
        hasMore={state.hasMore}
      />
    );
  };

  return (
    <PageLayout
      className="connections-page"
      header={
        <div className="connections-tabs-row">
          <Tabs
            tabs={CONNECTION_TABS}
            activeTab={state.activeTab}
            onTabChange={actions.handleTabChange}
          />
          <Button
            leftIcon={<Plus size={18} />}
            size="compact"
            onClick={() => {
              actions.resetForm();
              actions.setIsFormOpen(true);
            }}
          >
            {t('connections.create', 'Nueva Conexión')}
          </Button>
        </div>
      }
      filters={
        <ConnectionsFilters
          activeTab={state.activeTab}
          sectorInput={state.sectorInput}
          onSectorInputChange={actions.setSectorInput}
          clientIdInput={state.clientIdInput}
          onClientIdInputChange={actions.setClientIdInput}
          onFetch={actions.handleFetch}
          isLoading={state.isLoading}
          canFetch={state.canFetch}
          searchQuery={state.searchQuery}
          onSearchQueryChange={actions.setSearchQuery}
          searchField={state.searchField}
          onSearchFieldChange={actions.setSearchField}
          selectedStatus={state.selectedStatus}
          onStatusChange={actions.setSelectedStatus}
          selectedSewerage={state.selectedSewerage}
          onSewerageChange={actions.setSelectedSewerage}
        />
      }
    >
      {/* ── Content ── */}
      <div className="connections-page-content">
        {renderContent()}
      </div>

      {/* ── Create/Edit Wizard ── */}
      {state.isFormOpen && (
        <CreateConnectionWizard
          viewModel={{ state, actions }}
          onClose={() => actions.setIsFormOpen(false)}
        />
      )}

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={state.isDeleteOpen}
        onClose={() => actions.setIsDeleteOpen(false)}
        title={t('connections.deleteTitle', 'Eliminar Conexión')}
        footer={
          <>
            <Button variant="subtle" onClick={() => actions.setIsDeleteOpen(false)}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              onClick={actions.handleDelete}
              disabled={state.isLoading}
              style={{ backgroundColor: 'var(--error)' }}
            >
              {t('common.delete', 'Eliminar')}
            </Button>
          </>
        }
      >
        <p>
          {t(
            'connections.deleteConfirm',
            '¿Está seguro que desea eliminar esta conexión? Esta acción no se puede deshacer.'
          )}
        </p>
      </Modal>
    </PageLayout>
  );
};
