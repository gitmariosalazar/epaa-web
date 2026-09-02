import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, BarChart2, AlertCircle, RefreshCcw, Clock, Play } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { FaList } from 'react-icons/fa';

import { useReadingsReconciliationViewModel, type ReconciliationTab } from '../hooks/useReadingsReconciliationViewModel';
import { ReadingsReconciliationProvider } from '../context/ReadingsReconciliationContext';

import { ReconciliationMigrationTab } from '../components/reconciliation/ReconciliationMigrationTab';
import { ReconciliationSummaryTab } from '../components/reconciliation/ReconciliationSummaryTab';
import { ReconciliationDiscrepanciesTab } from '../components/reconciliation/ReconciliationDiscrepanciesTab';
import { ReconciliationBasicSummaryTab } from '../components/reconciliation/ReconciliationBasicSummaryTab';
import { ReconciliationDuplicatesTab } from '../components/reconciliation/ReconciliationDuplicatesTab';
import { ReconciliationBasicMismatchesTab } from '../components/reconciliation/ReconciliationBasicMismatchesTab';

import type { AuditoriaFiltroType } from '../../domain/models/lecturas-reconciliation';
import '../styles/ReadingsReconciliation.css';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

const ReadingsReconciliationContent: React.FC = () => {
  const { t } = useTranslation();

  const RECONCILIATION_TABS: TabItem<ReconciliationTab>[] = useMemo(() => [
    {
      id: 'migration',
      label: t('readings.reconciliation.tabMigration', 'Migración'),
      icon: <Database size={16} />
    },
    {
      id: 'kpis',
      label: t('readings.reconciliation.tabSummary', 'KPIs Detallados'),
      icon: <BarChart2 size={16} />
    },
    {
      id: 'discrepancies',
      label: t('readings.reconciliation.tabDiscrepancies', 'Grilla Discrepancias'),
      icon: <AlertCircle size={16} />
    },
    {
      id: 'basic-summary',
      label: t('readings.reconciliation.tabBasicSummary', 'Resumen Básico'),
      icon: <BarChart2 size={16} />
    },
    {
      id: 'duplicates',
      label: t('readings.reconciliation.tabDuplicates', 'Duplicados'),
      icon: <AlertCircle size={16} />
    },
    {
      id: 'basic-mismatches',
      label: t('readings.reconciliation.tabBasicMismatches', 'Discrepancias Básicas'),
      icon: <AlertCircle size={16} />
    }
  ], [t]);

  const vm = useReadingsReconciliationViewModel();

  // Re-fetch data on active tab change or filters change
  useEffect(() => {
    vm.handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vm.activeTab, vm.selectedMonth, vm.discrepancyFilter]);

  const renderContent = () => {
    switch (vm.activeTab) {
      case 'migration':
        return (
          <ReconciliationMigrationTab
            migrationResult={vm.migrationResult}
          />
        );
      case 'kpis':
        return (
          <ReconciliationSummaryTab
            kpiData={vm.kpiData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchKpis}
          />
        );
      case 'discrepancies':
        return (
          <ReconciliationDiscrepanciesTab
            dataResponse={vm.discrepanciesData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchDiscrepancies}
          />
        );
      case 'basic-summary':
        return (
          <ReconciliationBasicSummaryTab
            summaryData={vm.basicSummaryData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchBasicSummary}
          />
        );
      case 'duplicates':
        return (
          <ReconciliationDuplicatesTab
            duplicatesData={vm.duplicatesData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchDuplicates}
          />
        );
      case 'basic-mismatches':
        return (
          <ReconciliationBasicMismatchesTab
            mismatchesData={vm.basicMismatchesData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchBasicMismatches}
          />
        );
      default:
        return null;
    }
  };

  const filterOptions: { value: AuditoriaFiltroType; label: string }[] = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'DUPLICADOS', label: 'Duplicados' },
    { value: 'DIFERENTES', label: 'Diferentes' },
    { value: 'SOLO_POSTGRES', label: 'Solo en Postgres' }
  ];

  return (
    <PageLayout
      className="reconciliation-page"
      header={
        <div className="reconciliation-tabs-row">
          <Tabs<ReconciliationTab>
            tabs={RECONCILIATION_TABS}
            activeTab={vm.activeTab}
            onTabChange={vm.handleTabChange}
          />
        </div>
      }
      filters={
        <div className="reconciliation-filters" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
              {vm.activeTab === 'migration' ? 'Migración de Datos' :
                vm.activeTab === 'kpis' ? 'KPIs Detallados del Período' :
                  vm.activeTab === 'discrepancies' ? 'Detalle de Discrepancias' :
                    vm.activeTab === 'basic-summary' ? 'Resumen Básico' :
                      vm.activeTab === 'duplicates' ? 'Registros Duplicados' :
                        'Discrepancias Básicas'}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {vm.activeTab === 'migration' ? 'Proceso de migración y comparación' : 'Auditoría de consistencia de datos entre PostgreSQL y SQL Server'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="reconciliation-filter-group">
              <label className="reconciliation-filter-label">
                {t('readingData.filters.month', 'Mes de Operación')}
              </label>
              <div style={{ width: '200px' }}>
                <DatePicker
                  size="compact"
                  view="month"
                  value={vm.selectedMonth}
                  onChange={(val: string) => vm.setSelectedMonth(val.substring(0, 7))}
                />
              </div>
            </div>

            {vm.activeTab === 'discrepancies' && (
              <div className="reconciliation-filter-group">
                <label className="reconciliation-filter-label">
                  {t('readings.reconciliation.filterType', 'Tipo de Discrepancia')}
                </label>
                <div style={{ width: '250px' }}>
                  <Select
                    size="compact"
                    leftIcon={<FaList size={16} />}
                    value={vm.discrepancyFilter}
                    onChange={(e) => vm.setDiscrepancyFilter(e.target.value as AuditoriaFiltroType)}
                  >
                    {filterOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {vm.activeTab === 'migration' ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  onClick={vm.handleMigrate}
                  isLoading={vm.isMigrating}
                  disabled={vm.isComparing || vm.isMigrating}
                  size="compact"
                  leftIcon={!vm.isMigrating && <Database size={14} />}
                  style={{ height: '36px' }}
                >
                  Migrar Datos
                </Button>
                <Button
                  onClick={vm.handleCompare}
                  isLoading={vm.isComparing}
                  disabled={true}
                  variant="outline"
                  size="compact"
                  leftIcon={!vm.isComparing && <Play size={14} />}
                  style={{ height: '36px' }}
                >
                  Comparar
                </Button>
              </div>
            ) : (
              <Button
                onClick={vm.fetchAllData}
                variant="outline"
                size="compact"
                leftIcon={!vm.isLoading && <RefreshCcw size={14} />}
                style={{ height: '36px' }}
                isLoading={vm.isLoading}
                disabled={vm.isLoading}
              >
                {t('common.actions.refresh', 'Actualizar Métricas')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="reconciliation-content">
        {vm.error && (
          <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderBottom: '1px solid #f87171' }}>
            <strong>Error: </strong> {vm.error}
          </div>
        )}
        {renderContent()}
      </div>
    </PageLayout>
  );
};

export const ReadingsReconciliationPage: React.FC = () => {
  const currentHour = dateService.getCurrentDate().getHours();

  const startHourEnabled = 0; // 6:00 PM 
  const endHourEnabled = 24; // 5:00 AM

  if (currentHour >= endHourEnabled && currentHour < startHourEnabled) {
    return (
      <PageLayout className="reconciliation-page">
        <EmptyState
          icon={Clock}
          message="Acceso Restringido por Horario"
          description={`Esta página solo está disponible entre las ${startHourEnabled}:00 y las ${endHourEnabled}:00 (Hora de Ecuador) para no afectar el rendimiento de la base de datos de producción.`}
          variant="warning"
          minHeight="60vh"
        />
      </PageLayout>
    );
  }

  return (
    <ReadingsReconciliationProvider>
      <ReadingsReconciliationContent />
    </ReadingsReconciliationProvider>
  );
};
