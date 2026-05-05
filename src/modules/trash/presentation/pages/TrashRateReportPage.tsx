import React from 'react';
import { Tabs } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  useTrashRateReportViewModel,
  AUDIT_SUB_TABS,
  auditSubTabHasDateFilter
} from '../hooks/useTrashRateReportViewModel';
import { SearchX, AlertCircle, MousePointerClick } from 'lucide-react';
// Tables
import { TrashRateAuditReportTable } from '../components/audit/TrashRateAuditReportTable';
import { MonthlySummaryTable } from '../components/audit/MonthlySummaryTable';
import { MissingValorBillsTable } from '../components/audit/MissingValorBillsTable';
import { CreditNotesTable } from '../components/audit/CreditNotesTable';
import { TopDebtorsTable } from '../components/audit/TopDebtorsTable';
import { ClientTrashDetailTable } from '../components/audit/ClientTrashDetailTable';
import { TrashRateDashboard } from '../components/audit/TrashRateDashboard';
// Filters
import { AuditTabFilters } from '../components/audit/AuditTabFilters';
import { TodosAuditFilters } from '../components/audit/TodosAuditFilters';
import { DashboardFilters } from '../components/audit/DashboardFilters';
import { MonthlySummaryFilters } from '../components/audit/MonthlySummaryFilters';
import { MissingValorFilters } from '../components/audit/MissingValorFilters';
import { CreditNotesFilters } from '../components/audit/CreditNotesFilters';
import { TopDebtorsFilters } from '../components/audit/TopDebtorsFilters';
import { ClientDetailFilters } from '../components/audit/ClientDetailFilters';
// Styles
import '../styles/TrashRateReportPage.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  AUDIT_ACCOUNTING_SUB_TAB_CONFIG,
  AUDIT_ACCOUNTING_SUB_TAB_ICONS
} from '@/shared/utils/tabs-accounting/tabs';
import { FaCheck } from 'react-icons/fa';

export const TrashRateReportPage: React.FC = () => {
  const vm = useTrashRateReportViewModel();
  const loadingProgress = useSimulatedProgress(vm.isLoading);

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
          <div className="audit-subtab-container">
            {/* ── 4 Sub-tab switcher (OCP: add new type = add one entry to AUDIT_SUB_TAB_CONFIG) ── */}
            <div className="audit-subtab-header">
              {AUDIT_SUB_TABS.map((tab) => {
                const { cssClass, shortLabel } =
                  AUDIT_ACCOUNTING_SUB_TAB_CONFIG[tab];
                return (
                  <Button
                    key={tab}
                    className={`audit-subtab-btn audit-subtab-btn--${cssClass}${
                      vm.auditSubTab === tab ? ' active' : ''
                    }`}
                    onClick={() => vm.setAuditSubTab(tab)}
                    title={tab}
                    size="xs"
                    leftIcon={
                      vm.auditSubTab === tab ? (
                        <FaCheck size={12} />
                      ) : (
                        AUDIT_ACCOUNTING_SUB_TAB_ICONS[tab]
                      )
                    }
                  >
                    {shortLabel}
                  </Button>
                );
              })}
            </div>

            {/*
              SRP: cada sub-tab tiene su propio componente de filtros.
              ISP: "Todos" recibe solo los props que le corresponden;
                   los otros 3 sub-tabs usan AuditTabFilters sin cambios (OCP).
            */}
            {vm.auditSubTab === 'Todos (Pagados y Pendientes)' ? (
              <TodosAuditFilters
                startDate={vm.startDate}
                onStartDateChange={vm.setStartDate}
                endDate={vm.endDate}
                onEndDateChange={vm.setEndDate}
                dateFilter={vm.activeSubTabFilters.dateFilter}
                onDateFilterChange={vm.setDateFilter}
                paymentTypeChoice={vm.todosPaymentTypeChoice}
                onPaymentTypeChoiceChange={vm.setTodosPaymentTypeChoice}
                onFetch={vm.handleFetch}
                isLoading={vm.isLoading}
                diagnosticFilter={vm.activeSubTabFilters.diagnosticFilter}
                onDiagnosticFilterChange={vm.setDiagnosticFilter}
                searchQuery={vm.activeSubTabFilters.searchQuery}
                onSearchQueryChange={vm.setSearchQuery}
                selectedPaymentStatus={vm.activeSubTabFilters.paymentStatus}
                onPaymentStatusChange={vm.setPaymentStatus}
                paymentStatusList={vm.auditPaymentStatusList}
                selectedDiagnostic={vm.activeSubTabFilters.diagnostic}
                onDiagnosticChange={vm.setDiagnosticLocal}
                diagnosticList={vm.auditDiagnosticList}
              />
            ) : (
              <AuditTabFilters
                startDate={vm.startDate}
                onStartDateChange={vm.setStartDate}
                endDate={vm.endDate}
                onEndDateChange={vm.setEndDate}
                showDateFilter={auditSubTabHasDateFilter(vm.auditSubTab)}
                dateFilter={vm.activeSubTabFilters.dateFilter}
                onDateFilterChange={vm.setDateFilter}
                diagnosticFilter={vm.activeSubTabFilters.diagnosticFilter}
                onDiagnosticFilterChange={vm.setDiagnosticFilter}
                searchQuery={vm.activeSubTabFilters.searchQuery}
                onSearchQueryChange={vm.setSearchQuery}
                selectedPaymentStatus={vm.activeSubTabFilters.paymentStatus}
                onPaymentStatusChange={vm.setPaymentStatus}
                paymentStatusList={vm.auditPaymentStatusList}
                selectedDiagnostic={vm.activeSubTabFilters.diagnostic}
                onDiagnosticChange={vm.setDiagnosticLocal}
                diagnosticList={vm.auditDiagnosticList}
                onFetch={vm.handleFetch}
                isLoading={vm.isLoading}
              />
            )}
          </div>
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
    // 1. Cargando
    if (vm.isLoading) {
      return (
        <div className="trash-report-loading">
          <CircularProgress
            progress={loadingProgress}
            size={140}
            strokeWidth={10}
            label={vm.t('common.loading', 'CARGANDO...').toUpperCase()}
          />
        </div>
      );
    }

    // 2. Error
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

    // 3. Aún no se ha consultado → estado limpio de bienvenida
    //    hasFetched es false hasta que el usuario presione "Consultar".
    //    Esto garantiza que al cambiar de tab nunca se vean datos anteriores.
    if (!vm.hasFetched) {
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
            message="Configura los filtros y presiona Consultar"
            description="Los resultados se mostrarán aquí una vez que ejecutes la búsqueda."
            icon={MousePointerClick}
            variant="info"
            minHeight="300px"
          />
        </div>
      );
    }

    // 4. Datos cargados → renderizar la tabla/componente del tab activo
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
            startDate={vm.startDate}
            endDate={vm.endDate}
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
            startDate={vm.startDate}
            endDate={vm.endDate}
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
            startDate={vm.startDate}
            endDate={vm.endDate}
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
            startDate={vm.startDate}
            endDate={vm.endDate}
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
            startDate={vm.startDate}
            endDate={vm.endDate}
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
            startDate={vm.startDate}
            endDate={vm.endDate}
          />
        );
    }
  };

  return (
    <PageLayout
      className="trash-report-page"
      header={
        <Tabs
          tabs={vm.translatedTabs}
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />
      }
      filters={
        <div className="trash-rate-report-filters-section">
          {renderFilters()}
        </div>
      }
    >
      <div className="trash-rate-report-content">{renderContent()}</div>
    </PageLayout>
  );
};
