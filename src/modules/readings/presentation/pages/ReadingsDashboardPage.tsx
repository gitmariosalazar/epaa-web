import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Clock, RefreshCcw } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Select } from '@/shared/presentation/components/Input/Select';

import { DashboardKpisByPeriodTab } from '../components/reconciliation/DashboardKpisByPeriodTab';
import { DashboardKpisByYearTab } from '../components/reconciliation/DashboardKpisByYearTab';
import '../styles/ReadingsReconciliation.css';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useReadingsDashboardViewModel, type ReadingsDashboardTab } from '../hooks/useReadingsDashboardViewModel';
import { ReadingsReconciliationProvider } from '../context/ReadingsReconciliationContext';
import { Button } from '@/shared/presentation/components/Button/Button';

interface ReadingsReconciliationContentProps {
  initialMonth?: string;
  isModal?: boolean;
}

const ReadingsReconciliationContent: React.FC<ReadingsReconciliationContentProps> = ({ initialMonth }) => {
  const { t } = useTranslation();

  const READINGS_DASHBOARD_TABS: TabItem<ReadingsDashboardTab>[] = useMemo(() => [
    {
      id: 'dashboard-kpi-month',
      label: t('readings.reconciliation.tabDashboardKpis', 'Dashboard KPIs Mensual'),
      icon: <BarChart2 size={16} />
    },
    {
      id: 'dashboard-kpi-year',
      label: t('readings.reconciliation.tabSummary', 'Dashboard KPIs Anual'),
      icon: <BarChart2 size={16} />
    },
  ], [t]);

  const vm = useReadingsDashboardViewModel(initialMonth);

  // Re-fetch data on active tab change or filters change
  useEffect(() => {
    vm.handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vm.activeTab, vm.selectedMonth]);

  const renderContent = () => {
    switch (vm.activeTab) {
      case 'dashboard-kpi-month':
        return (
          <DashboardKpisByPeriodTab
            data={vm.dashboardKpisData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchDashboardKpis}
          />
        );
      case 'dashboard-kpi-year':
        return (
          <DashboardKpisByYearTab
            data={vm.dashboardKpisAnnualData}
            isLoading={vm.isLoading}
            onRefresh={vm.fetchDashboardKpisAnnual}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="reconciliation-page"
      header={
        <div className="reconciliation-tabs-row">
          <Tabs<ReadingsDashboardTab>
            tabs={READINGS_DASHBOARD_TABS}
            activeTab={vm.activeTab}
            onTabChange={vm.handleTabChange}
          />
        </div>
      }
      filters={
        <div className="reconciliation-filters" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)' }}>
              {vm.activeTab === 'dashboard-kpi-month' ? 'Dashboard de KPIs por Periodo' :
                vm.activeTab === 'dashboard-kpi-year' ? 'Dashboard de KPIs Anual' :
                'Resumen Estadístico del Período'}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {vm.activeTab === 'dashboard-kpi-month' ? 'Análisis avanzado de KPIs de lectura mensual (Siempre busca datos pasados)' :
                vm.activeTab === 'dashboard-kpi-year' ? 'Análisis avanzado de KPIs de lectura anual' :
                'Resumen estadístico de las lecturas realizadas en el período seleccionado'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="reconciliation-filter-group">
              <label className="reconciliation-filter-label">
                {vm.activeTab === 'dashboard-kpi-year' ? 'Año de Operación' : t('readingData.filters.month', 'Mes de Operación')}
              </label>
              <div style={{ width: vm.activeTab === 'dashboard-kpi-month' ? '250px' : '200px' }}>
                {vm.activeTab === 'dashboard-kpi-month' ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Select
                      size="small"
                      value={vm.dashboardSelectedMonth.split('-')[1]}
                      onChange={(e) => vm.setDashboardSelectedMonth(`${vm.dashboardSelectedMonth.split('-')[0]}-${e.target.value}`)}
                    >
                      <option value="01">ENERO</option>
                      <option value="02">FEBRERO</option>
                      <option value="03">MARZO</option>
                      <option value="04">ABRIL</option>
                      <option value="05">MAYO</option>
                      <option value="06">JUNIO</option>
                      <option value="07">JULIO</option>
                      <option value="08">AGOSTO</option>
                      <option value="09">SEPTIEMBRE</option>
                      <option value="10">OCTUBRE</option>
                      <option value="11">NOVIEMBRE</option>
                      <option value="12">DICIEMBRE</option>
                    </Select>
                    <Select
                      size="small"
                      value={vm.dashboardSelectedMonth.split('-')[0]}
                      onChange={(e) => vm.setDashboardSelectedMonth(`${e.target.value}-${vm.dashboardSelectedMonth.split('-')[1]}`)}
                    >
                      {Array.from({ length: 5 }).map((_, i) => {
                        const year = (new Date().getFullYear() - i).toString();
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </Select>
                  </div>
                ) : vm.activeTab === 'dashboard-kpi-year' ? (
                  <Select
                    size="small"
                    value={vm.dashboardSelectedYear}
                    onChange={(e) => vm.setDashboardSelectedYear(e.target.value)}
                  >
                    {Array.from({ length: 5 }).map((_, i) => {
                      const year = (new Date().getFullYear() - i).toString();
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </Select>
                ) : (
                  <DatePicker
                    size="small"
                    view="month"
                    value={vm.selectedMonth}
                    onChange={(val: string) => vm.setSelectedMonth(val.substring(0, 7))}
                  />
                )}
              </div>
            </div>

            {vm.activeTab === 'dashboard-kpi-month' || vm.activeTab === 'dashboard-kpi-year' ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  onClick={vm.fetchAllData}
                  variant="dashed"
                  size="xs"
                  leftIcon={!vm.isLoading && <RefreshCcw size={14} />}
                  isLoading={vm.isLoading}
                  disabled={vm.isLoading}
                >
                  {t('common.actions.refresh', 'Actualizar Métricas')}
                </Button>
              </div>
            ) : (
              <Button
                onClick={vm.fetchAllData}
                variant="dashed"
                size="xs"
                leftIcon={!vm.isLoading && <RefreshCcw size={14} />}
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

interface ReadingsDashboardPageProps {
  initialMonth?: string;
  isModal?: boolean;
}

export const ReadingsDashboardPage: React.FC<ReadingsDashboardPageProps> = ({ initialMonth, isModal }) => {
  const currentHour = dateService.getCurrentDate().getHours();

  const startHourEnabled = 0; // 6:00 PM 
  const endHourEnabled = 24;  // 6:00 AM (next day)

  const isEnabledTime = currentHour >= startHourEnabled || currentHour < endHourEnabled;

  if (!isEnabledTime) {
    return (
      <EmptyState
        message="Módulo No Disponible"
        description={`La conciliación de lecturas solo está disponible entre las ${startHourEnabled}:00 y las ${endHourEnabled}:00.`}
        icon={<Clock size={48} />}
        variant="warning"
        minHeight="100vh"
      />
    );
  }

  return (
    <ReadingsReconciliationProvider>
      <ReadingsReconciliationContent initialMonth={initialMonth} isModal={isModal} />
    </ReadingsReconciliationProvider>
  );
};
