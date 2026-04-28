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
import { PropertiesDashBoard } from '../components/PropertiesDashBoard';
import '../styles/PropertiesPage.css';
import { useSimulatedProgress } from '@/shared/presentation/components/CircularProgress/useSimulatedProgress';

export const PropertiesPage: React.FC = () => {
  const vm = usePropertiesViewModel();

  const renderFilters = () => {
    switch (vm.activeTab) {
      case 'statistics':
        return null;
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

  const progress = useSimulatedProgress(vm.isLoading);

  const renderContent = () => {
    const isDataEmpty =
      vm.activeTab === 'statistics'
        ? vm.propertiesByType.length === 0
        : vm.filteredProperties.length === 0;

    if (vm.isLoading && isDataEmpty) {
      return (
        <div className="properties-page-centered-content">
          <CircularProgress
            progress={progress}
            size={140}
            strokeWidth={10}
            showPercentage
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

    if (vm.activeTab === 'statistics') {
      return <PropertiesDashBoard data={vm.propertiesByType} />;
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
      <div className="properties-page-content-wrapper">{renderContent()}</div>
    </PageLayout>
  );
};
