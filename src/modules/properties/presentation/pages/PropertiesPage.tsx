import React from 'react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { usePropertiesViewModel } from '../hooks/usePropertiesViewModel';
import { AlertCircle } from 'lucide-react';
// Components
import { PropertiesTable } from '../components/PropertiesTable';
import { ByOwnerFilters } from '../components/ByOwnerFilters';
import { AllPropertiesFilters } from '../components/AllPropertiesFilters';
import '../styles/PropertiesPage.css';

export const PropertiesPage: React.FC = () => {
  const vm = usePropertiesViewModel();

  const renderFilters = () => {
    switch (vm.activeTab) {
      case 'all':
        return (
          <AllPropertiesFilters
            searchBy={vm.searchBy}
            setSearchBy={vm.setSearchBy}
            searchQuery={vm.searchQuery}
            setSearchQuery={vm.setSearchQuery}
            onRefresh={vm.handleFetch}
          />
        );
      case 'byOwner':
        return (
          <ByOwnerFilters
            clientId={vm.clientId}
            onClientIdChange={vm.setClientId}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (vm.isLoading && vm.filteredProperties.length === 0) {
      return (
        <div className="properties-page-centered-content">
          <CircularProgress
            progress={75}
            size={140}
            strokeWidth={10}
            label={vm.t('common.loading', 'CARGANDO...').toUpperCase()}
          />
        </div>
      );
    }

    if (vm.error) {
      return (
        <div className="properties-page-flex-content">
          <EmptyState
            message={vm.t('common.error', 'Ocurrió un error')}
            description={vm.error}
            icon={AlertCircle}
            variant="error"
            minHeight="300px"
          />
        </div>
      );
    }

    return (
      <PropertiesTable
        data={vm.filteredProperties}
        isLoading={vm.isLoading}
        onSort={vm.handleSort}
        sortConfig={vm.sortConfig}
        onEndReached={vm.loadMore}
        hasMore={vm.hasMore}
      />
    );
  };

  return (
    <PageLayout
      className="properties-page-container"
      header={
        <Tabs
          tabs={vm.translatedTabs}
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />
      }
      filters={renderFilters()}
    >
      <div className="properties-page-content-wrapper">
        {renderContent()}
      </div>
    </PageLayout>
  );
};
