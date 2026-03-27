import React from 'react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTrashRateKPIViewModel } from '../hooks/useTrashRateKPIViewModel';
import { SearchX, AlertCircle } from 'lucide-react';

// Components
import { TrashRateDashboardKPI } from '../components/kpi/TrashRateDashboardKPI';
import { CollectorPerformanceKPITable } from '../components/kpi/CollectorPerformanceKPITable';
import { DailyCollectorDetailTable } from '../components/kpi/DailyCollectorDetailTable';

// Filters
import { TrashRateKPIFilters } from '../components/kpi/TrashRateKPIFilters';
import { CollectorPerformanceKPIFilter } from '../components/kpi/CollectorPerformanceKPIFilter';
import { DailyCollectorDetailFilter } from '../components/kpi/DailyCollectorDetailFilter';

// Styles
import '../styles/TrashRateKPIPage.css';

export const TrashRateKPIPage: React.FC = () => {
  const vm = useTrashRateKPIViewModel();
  const loadingProgress = useSimulatedProgress(vm.isLoading);

  const renderFilters = () => {
    switch (vm.activeTab) {
      case 'dashboard':
        return (
          <TrashRateKPIFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
            categories={vm.trashRateKPI}
            selectedCategoryIndex={vm.selectedCategoryIndex}
            onCategoryChange={vm.setSelectedCategoryIndex}
          />
        );
      case 'collectorPerformance':
        return (
          <CollectorPerformanceKPIFilter
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      case 'dailyCollectorDetail':
        return (
          <DailyCollectorDetailFilter
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
            selectedCollector={vm.selectedCollector}
            onCollectorChange={vm.setSelectedCollector}
            collectorList={vm.collectorList}
            selectedStatus={vm.selectedStatus}
            onStatusChange={vm.setSelectedStatus}
            statusList={vm.statusList}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (vm.isLoading) {
      return (
        <div className="trash-kpi-loading-overlay">
          <CircularProgress
            progress={loadingProgress}
            size={140}
            strokeWidth={10}
            label={vm.t('common.loading', 'CARGANDO...').toUpperCase()}
          />
          <span className="trash-kpi-loading-text">
            OBTENIENDO KPI DASHBOARD...
          </span>
        </div>
      );
    }

    if (vm.error) {
      const isNotFound = vm.error.toLowerCase().includes('no results found');
      return (
        <div className="trash-kpi-error-view">
          <EmptyState
            message={
              isNotFound ? 'No se encontraron resultados' : 'Ocurrió un error'
            }
            description={
              isNotFound
                ? 'Verifica los parámetros de búsqueda e intenta nuevamente.'
                : vm.error
            }
            icon={isNotFound ? SearchX : AlertCircle}
            variant={isNotFound ? 'warning' : 'error'}
            minHeight="400px"
          />
        </div>
      );
    }

    switch (vm.activeTab) {
      case 'dashboard':
        return (
          <TrashRateDashboardKPI
            data={vm.trashRateKPI}
            isLoading={vm.isLoading}
            error={vm.error}
            selectedCategoryIndex={vm.selectedCategoryIndex}
          />
        );
      case 'collectorPerformance':
        return (
          <CollectorPerformanceKPITable
            data={vm.filteredCollectorPerformance}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
            startDate={vm.startDate}
            endDate={vm.endDate}
          />
        );
      case 'dailyCollectorDetail':
        return (
          <DailyCollectorDetailTable
            data={vm.filteredDailyCollectorDetail}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
            startDate={vm.startDate}
            endDate={vm.endDate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="trash-kpi-page"
      header={
        <Tabs
          tabs={vm.translatedTabs}
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />
      }
      filters={<div className="trash-kpi-filters-container">{renderFilters()}</div>}
    >
      <div className="trash-kpi-main-content">{renderContent()}</div>
    </PageLayout>
  );
};
