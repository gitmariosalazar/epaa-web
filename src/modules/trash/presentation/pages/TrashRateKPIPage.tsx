import React from 'react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTrashRateKPIViewModel } from '../hooks/useTrashRateKPIViewModel';
import { SearchX, AlertCircle } from 'lucide-react';

// Components
import { TrashRateDashboardKPI } from '../components/TrashRateDashboardKPI';
import { CollectorPerformanceKPITable } from '../components/CollectorPerformanceKPITable';
import { DailyCollectorDetailTable } from '../components/DailyCollectorDetailTable';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';

// Filters
import { TrashRateKPIFilters } from '../components/TrashRateKPIFilters';
import { CollectorPerformanceKPIFilter } from '../components/CollectorPerformanceKPIFilter';
import { DailyCollectorDetailFilter } from '../components/DailyCollectorDetailFilter';

// Styles
import '../styles/TrashRateKPIPage.css';

export const TrashRateKPIPage: React.FC = () => {
  const vm = useTrashRateKPIViewModel();

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
            progress={75}
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
            onExportPdf={() => vm.setShowPdfPreview(true)}
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
            onExportPdf={() => vm.setShowPdfPreview(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="trash-kpi-page">
      <Tabs
        tabs={vm.translatedTabs}
        activeTab={vm.activeTab}
        onTabChange={vm.setActiveTab}
      />
      <div className="trash-kpi-filters-container">{renderFilters()}</div>
      <div className="trash-kpi-main-content">{renderContent()}</div>
      <ReportPreviewModal
        isOpen={vm.showPdfPreview}
        onClose={() => vm.setShowPdfPreview(false)}
        dataCount={vm.currentFilteredData.length}
        reportTitle={vm.currentReportTitle}
        availableColumns={vm.currentAvailableColumns}
        pdfGenerator={vm.handlePdfGenerator}
        onDownload={vm.handleDownloadPdf}
      />
    </div>
  );
};
