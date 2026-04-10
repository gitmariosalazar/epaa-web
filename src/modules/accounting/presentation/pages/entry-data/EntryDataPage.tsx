import React from 'react';
import '../../styles/entry-data/EntryDataPage.css';
import { EntryDataFilters } from '../../components/entry-data/EntryDataFilters';
import { DailyGroupedReportTable } from '../../components/entry-data/DailyGroupedReportTable';
import { DailyCollectorSummaryTable } from '../../components/entry-data/DailyCollectorSummaryTable';
import { DailyPaymentMethodReportTable } from '../../components/entry-data/DailyPaymentMethodReportTable';
import { FullBreakdownReportTable } from '../../components/entry-data/FullBreakdownReportTable';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { useEntryDataViewModel } from '../../hooks/entry-data/useEntryDataViewModel';

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
    filteredGrouped,
    filteredCollector,
    filteredPaymentMethod,
    filteredFullBreakdown,
    handleFetch,
    handleSort,
    sortConfig,
    setShowPdfPreview,
    PdfPreviewModal
  } = useEntryDataViewModel();

  const loadingProgress = useSimulatedProgress(isLoading);

  return (
    <PageLayout
      className="entry-data-page"
      header={
        <Tabs
          tabs={translatedTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
      filters={
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
      }
    >
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

      {PdfPreviewModal}
    </PageLayout>
  );
};
