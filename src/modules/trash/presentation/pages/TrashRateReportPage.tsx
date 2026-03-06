import React from 'react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTrashRateReportViewModel } from '../hooks/useTrashRateReportViewModel';
import { SearchX, AlertCircle } from 'lucide-react';
// Tables
import { TrashRateAuditReportTable } from '../components/TrashRateAuditReportTable';
import { MonthlySummaryTable } from '../components/MonthlySummaryTable';
import { MissingValorBillsTable } from '../components/MissingValorBillsTable';
import { CreditNotesTable } from '../components/CreditNotesTable';
import { TopDebtorsTable } from '../components/TopDebtorsTable';
import { ClientTrashDetailTable } from '../components/ClientTrashDetailTable';
import { TrashRateDashboard } from '../components/TrashRateDashboard';
// Filters
import { TrashRateReportFilters } from '../components/TrashRateReportFilters';
import { DashboardFilters } from '../components/DashboardFilters';
import { MonthlySummaryFilters } from '../components/MonthlySummaryFilters';
import { MissingValorFilters } from '../components/MissingValorFilters';
import { CreditNotesFilters } from '../components/CreditNotesFilters';
import { TopDebtorsFilters } from '../components/TopDebtorsFilters';
import { ClientDetailFilters } from '../components/ClientDetailFilters';
// Styles
import '../styles/TrashRateReportPage.css';

export const TrashRateReportPage: React.FC = () => {
  const vm = useTrashRateReportViewModel();

  const renderFilters = () => {
    switch (vm.activeTab) {
      case 'dashboard':
        return (
          <DashboardFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      case 'auditReport':
        return (
          <TrashRateReportFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            limit={vm.limit}
            onLimitChange={vm.setLimit}
            offset={vm.offset}
            onOffsetChange={vm.setOffset}
            searchQuery=""
            onSearchQueryChange={() => {}}
            selectedPaymentStatus={vm.auditPaymentStatus}
            onPaymentStatusChange={vm.setAuditPaymentStatus}
            paymentStatusList={vm.auditPaymentStatusList}
            selectedDiagnostic={vm.auditDiagnostic}
            onDiagnosticChange={vm.setAuditDiagnostic}
            diagnosticList={vm.auditDiagnosticList}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      case 'monthlySummary':
        return (
          <MonthlySummaryFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      case 'missingValor':
        return (
          <MissingValorFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
            selectedPaymentStatus={vm.missingPaymentStatus}
            onPaymentStatusChange={vm.setMissingPaymentStatus}
            paymentStatusList={vm.missingPaymentStatusList}
          />
        );
      case 'creditNotes':
        return (
          <CreditNotesFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
            selectedCreditCoverage={vm.creditCoverage}
            onCreditCoverageChange={vm.setCreditCoverage}
            creditCoverageList={vm.creditCoverageList}
          />
        );
      case 'topDebtors':
        return (
          <TopDebtorsFilters
            startDate={vm.startDate}
            onStartDateChange={vm.setStartDate}
            endDate={vm.endDate}
            onEndDateChange={vm.setEndDate}
            top={vm.top}
            onTopChange={vm.setTop}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
      case 'clientDetail':
        return (
          <ClientDetailFilters
            searchParams={vm.clientSearchParams}
            onSearchParamsChange={vm.setClientSearchParams}
            onFetch={vm.handleFetch}
            isLoading={vm.isLoading}
          />
        );
    }
  };

  const renderContent = () => {
    if (vm.isLoading) {
      return (
        <div className="trash-report-loading">
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
      const isNotFound = vm.error.toLowerCase().includes('no results found');
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
            minHeight="300px"
          />
        </div>
      );
    }

    switch (vm.activeTab) {
      case 'dashboard':
        return (
          <TrashRateDashboard
            data={vm.dashboardKPITrashRate}
            creditNotesData={vm.filteredCreditNotes}
            isLoading={vm.isLoading}
          />
        );
      case 'auditReport':
        return (
          <TrashRateAuditReportTable
            data={vm.filteredAuditReport}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
      case 'monthlySummary':
        return (
          <MonthlySummaryTable
            data={vm.filteredMonthlySummary}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
      case 'missingValor':
        return (
          <MissingValorBillsTable
            data={vm.filteredMissingValor}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
      case 'creditNotes':
        return (
          <CreditNotesTable
            data={vm.filteredCreditNotes}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
      case 'topDebtors':
        return (
          <TopDebtorsTable
            data={vm.filteredTopDebtors}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
      case 'clientDetail':
        return (
          <ClientTrashDetailTable
            data={vm.filteredClientDetail}
            isLoading={vm.isLoading}
            error={null}
            onSort={vm.handleSort}
            sortConfig={vm.sortConfig}
          />
        );
    }
  };

  return (
    <div className="trash-report-page">
      <Tabs
        tabs={vm.translatedTabs}
        activeTab={vm.activeTab}
        onTabChange={vm.setActiveTab}
      />
      <div className="trash-rate-report-filters-section">{renderFilters()}</div>
      <div className="trash-rate-report-content">{renderContent()}</div>
    </div>
  );
};
