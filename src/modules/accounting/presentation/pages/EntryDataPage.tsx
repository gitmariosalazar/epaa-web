import React from 'react';
import '../styles/EntryDataPage.css';
import { EntryDataFilters } from '../components/EntryDataFilters';
import { DailyGroupedReportTable } from '../components/DailyGroupedReportTable';
import { DailyCollectorSummaryTable } from '../components/DailyCollectorSummaryTable';
import { DailyPaymentMethodReportTable } from '../components/DailyPaymentMethodReportTable';
import { FullBreakdownReportTable } from '../components/FullBreakdownReportTable';
import { Tabs } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { useEntryDataViewModel } from '../hooks/useEntryDataViewModel';

export const EntryDataPage: React.FC = () => {
  const {
    t,
    isLoading,
    error,
    translatedTabs,
    activeTab,
    setActiveTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchQuery,
    setSearchQuery,
    selectedCollector,
    setSelectedCollector,
    collectorList,
    selectedTitleCode,
    setSelectedTitleCode,
    titleCodeList,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethodList,
    selectedStatus,
    setSelectedStatus,
    sortConfig,
    filteredGrouped,
    filteredCollector,
    filteredPaymentMethod,
    filteredFullBreakdown,
    showPdfPreview,
    setShowPdfPreview,
    currentFilteredData,
    currentReportTitle,
    currentAvailableColumns,
    handleFetch,
    handleSort,
    handlePdfGenerator,
    handleDownloadPdf
  } = useEntryDataViewModel();

  const loadingProgress = useSimulatedProgress(isLoading);

  return (
    <div className="entry-data-page">
      <Tabs
        tabs={translatedTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EntryDataFilters
        activeTab={activeTab}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onFetch={handleFetch}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCollector={selectedCollector}
        onCollectorChange={setSelectedCollector}
        collectorList={collectorList}
        selectedTitleCode={selectedTitleCode}
        onTitleCodeChange={setSelectedTitleCode}
        titleCodeList={titleCodeList}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        paymentMethodList={paymentMethodList}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {error ? (
        <div className="entry-data-error">
          <div className="entry-data-error-dot" />
          <span className="entry-data-error-text">{error}</span>
        </div>
      ) : isLoading ? (
        <div className="entry-data-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando...')}
          />
        </div>
      ) : activeTab === 'grouped' ? (
        <DailyGroupedReportTable
          data={filteredGrouped}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
          onExportPdf={() => setShowPdfPreview(true)}
        />
      ) : activeTab === 'collector' ? (
        <DailyCollectorSummaryTable
          data={filteredCollector}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
          onExportPdf={() => setShowPdfPreview(true)}
        />
      ) : activeTab === 'paymentMethod' ? (
        <DailyPaymentMethodReportTable
          data={filteredPaymentMethod}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
          onExportPdf={() => setShowPdfPreview(true)}
        />
      ) : (
        <FullBreakdownReportTable
          data={filteredFullBreakdown}
          isLoading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
          onExportPdf={() => setShowPdfPreview(true)}
        />
      )}

      <ReportPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        dataCount={currentFilteredData.length}
        reportTitle={currentReportTitle}
        availableColumns={currentAvailableColumns}
        pdfGenerator={handlePdfGenerator}
        onDownload={handleDownloadPdf}
      />
    </div>
  );
};
