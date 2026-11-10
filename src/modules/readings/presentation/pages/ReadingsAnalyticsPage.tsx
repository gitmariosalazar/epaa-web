import React, { useMemo } from 'react';
import {
  BarChart3,
  Layers,
  TrendingUp,
  AlertTriangle,
  Trophy,
  GitCompare,
  Database,
  RefreshCw,
  Filter,
  Users
} from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Tabs, type TabItem } from '@/shared/presentation/components/Tabs';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  useReadingsAnalyticsViewModel,
  type AnalyticsTabType
} from '../hooks/useReadingsAnalyticsViewModel';
import { ExecutiveDashboardTab } from '../components/analytics/ExecutiveDashboardTab';
import { SectorPerformanceTab } from '../components/analytics/SectorPerformanceTab';
import { MonthlyTrendTab } from '../components/analytics/MonthlyTrendTab';
import { NoveltyEconomicImpactTab } from '../components/analytics/NoveltyEconomicImpactTab';
import { TopConsumersTab } from '../components/analytics/TopConsumersTab';
import { InterannualComparisonTab } from '../components/analytics/InterannualComparisonTab';
import { MonthlyConnectionGrowthTab } from '../components/analytics/MonthlyConnectionGrowthTab';
import '../styles/ReadingsAnalytics.css';

const MONTH_OPTIONS = [
  { value: '1', label: '01 - Enero' },
  { value: '2', label: '02 - Febrero' },
  { value: '3', label: '03 - Marzo' },
  { value: '4', label: '04 - Abril' },
  { value: '5', label: '05 - Mayo' },
  { value: '6', label: '06 - Junio' },
  { value: '7', label: '07 - Julio' },
  { value: '8', label: '08 - Agosto' },
  { value: '9', label: '09 - Septiembre' },
  { value: '10', label: '10 - Octubre' },
  { value: '11', label: '11 - Noviembre' },
  { value: '12', label: '12 - Diciembre' }
];

const YEAR_OPTIONS = [
  { value: 2026, label: '2026' },
  { value: 2025, label: '2025' },
  { value: 2024, label: '2024' },
  { value: 2023, label: '2023' },
  { value: 2022, label: '2022' },
  { value: 2021, label: '2021' },
  { value: 2020, label: '2020' }
];

const SECTOR_OPTIONS = [
  { value: '', label: 'Todos los sectores' },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: String(i + 1),
    label: `Sector ${i + 1}`
  }))
];

const SORT_BY_OPTIONS = [
  { value: 'revenue', label: 'Mayor Facturación ($)' },
  { value: 'volume', label: 'Mayor Consumo (m³)' },
  { value: 'readings', label: 'Mayor Cantidad Lecturas' },
  { value: 'sector', label: 'Orden por Sector' }
];

const LIMIT_OPTIONS = [
  { value: 25, label: 'Top 25' },
  { value: 50, label: 'Top 50' },
  { value: 100, label: 'Top 100' },
  { value: 200, label: 'Top 200' }
];

const MIN_M3_OPTIONS = [
  { value: 25, label: '≥ 25 m³' },
  { value: 50, label: '≥ 50 m³' },
  { value: 100, label: '≥ 100 m³' },
  { value: 200, label: '≥ 200 m³' },
  { value: 500, label: '≥ 500 m³' }
];

export const ReadingsAnalyticsPage: React.FC = () => {
  const vm = useReadingsAnalyticsViewModel();

  const ANALYTICS_TABS: TabItem<AnalyticsTabType>[] = useMemo(
    () => [
      {
        id: 'executive',
        label: 'Tablero Ejecutivo',
        icon: <BarChart3 size={16} />
      },
      {
        id: 'sectors',
        label: 'Matriz por Sectores',
        icon: <Layers size={16} />
      },
      {
        id: 'trend',
        label: 'Tendencia Mensual',
        icon: <TrendingUp size={16} />
      },
      {
        id: 'novelties',
        label: 'Impacto de Novedades',
        icon: <AlertTriangle size={16} />
      },
      {
        id: 'consumers',
        label: 'Grandes Consumidores',
        icon: <Trophy size={16} />
      },
      {
        id: 'interannual',
        label: 'Comparativa 1 a 1 Homólogos',
        icon: <GitCompare size={16} />
      },
      {
        id: 'connection-growth',
        label: 'Crecimiento de Acometidas',
        icon: <Users size={16} />
      }
    ],
    []
  );

  const renderActiveTabContent = () => {
    switch (vm.activeTab) {
      case 'executive':
        return (
          <ExecutiveDashboardTab
            data={vm.executiveData}
            isLoading={vm.isLoading}
            onRefresh={vm.refreshActiveTab}
          />
        );
      case 'sectors':
        return (
          <SectorPerformanceTab data={vm.sectorData} isLoading={vm.isLoading} />
        );
      case 'trend':
        return <MonthlyTrendTab data={vm.trendData} isLoading={vm.isLoading} />;
      case 'novelties':
        return (
          <NoveltyEconomicImpactTab
            data={vm.noveltiesData}
            isLoading={vm.isLoading}
          />
        );
      case 'consumers':
        return (
          <TopConsumersTab
            data={vm.topConsumersData}
            isLoading={vm.isLoading}
          />
        );
      case 'interannual':
        return (
          <InterannualComparisonTab
            data={vm.interannualData}
            isLoading={vm.isLoading}
            baseYear={vm.baseYear}
            targetYear={vm.targetYear}
          />
        );
      case 'connection-growth':
        return (
          <MonthlyConnectionGrowthTab
            data={vm.connectionGrowthData}
            isLoading={vm.isLoading}
            baseYear={vm.baseYear}
            targetYear={vm.targetYear}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      className="readings-analytics-page"
      header={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%'
          }}
        >
          {/* Engine Banner Switcher */}
          <div className="analytics-system-banner">
            <div className="analytics-system-info">
              <div className="analytics-system-icon-wrapper">
                <Database size={24} />
              </div>
              <div>
                <h3 className="analytics-system-title">
                  Centro de Analítica e Inteligencia Operativa de Lecturas
                </h3>
                <p className="analytics-system-subtitle">
                  Auditoría financiera, balance hídrico y evaluación comparativa
                  interanual
                </p>
              </div>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div className="analytics-system-toggle-group">
                {/*
                  
                <button
                  type="button"
                  className={`analytics-system-toggle-btn ${vm.system === 'modern' ? 'active' : ''}`}
                  onClick={() => vm.setSystem('modern')}
                  title="Motor SIGEPAA PostgreSQL"
                >
                  <Server size={15} />
                  SIGEPAA (PostgreSQL)
                </button>
                 */}
                <button
                  type="button"
                  className={`analytics-system-toggle-btn ${vm.system === 'legacy' ? 'active' : ''}`}
                  onClick={() => vm.setSystem('legacy')}
                  title="Motor Legacy SQL Server 2000 / 2022"
                >
                  <Database size={15} />
                  Legacy (SQL Server)
                </button>
              </div>

              <Button
                variant="outline"
                onClick={vm.refreshActiveTab}
                disabled={vm.isLoading}
                title="Actualizar datos"
              >
                <RefreshCw size={15} className={vm.isLoading ? 'spin' : ''} />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs<AnalyticsTabType>
            tabs={ANALYTICS_TABS}
            activeTab={vm.activeTab}
            onTabChange={vm.setActiveTab}
          />
        </div>
      }
      filters={
        <div className="analytics-filter-toolbar">
          <div className="analytics-filters-group">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginRight: '0.5rem'
              }}
            >
              <Filter size={16} color="var(--primary-color, #2563eb)" />
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary, #0f172a)'
                }}
              >
                Filtros:
              </span>
            </div>

            {/* Standard Filters: Year, Month, Sector */}
            {vm.activeTab !== 'interannual' &&
              vm.activeTab !== 'connection-growth' && (
                <>
                  <div className="analytics-filter-item">
                    <Select
                      label="Año"
                      options={YEAR_OPTIONS}
                      value={vm.selectedYear}
                      onChange={(e) =>
                        vm.setSelectedYear(parseInt(e.target.value, 10))
                      }
                      size="small"
                    />
                  </div>

                  <div className="analytics-filter-item">
                    <Select
                      label="Mes"
                      options={MONTH_OPTIONS}
                      value={vm.selectedMonth}
                      onChange={(e) => vm.setSelectedMonth(e.target.value)}
                      size="small"
                    />
                  </div>
                </>
              )}

            {vm.activeTab !== 'connection-growth' && (
              <div className="analytics-filter-item">
                <Select
                  label="Sector"
                  options={SECTOR_OPTIONS}
                  value={vm.selectedSector}
                  onChange={(e) => vm.setSelectedSector(e.target.value)}
                  size="small"
                />
              </div>
            )}

            {/* Tab Specific Filters */}
            {vm.activeTab === 'sectors' && (
              <div className="analytics-filter-item">
                <Select
                  label="Ordenar por"
                  options={SORT_BY_OPTIONS}
                  value={vm.selectedSortBy}
                  onChange={(e) =>
                    vm.setSelectedSortBy(
                      e.target.value as
                        | 'revenue'
                        | 'volume'
                        | 'readings'
                        | 'sector'
                    )
                  }
                  size="small"
                />
              </div>
            )}

            {vm.activeTab === 'consumers' && (
              <>
                <div className="analytics-filter-item">
                  <Select
                    label="Consumo Mínimo"
                    options={MIN_M3_OPTIONS}
                    value={vm.minConsumptionM3}
                    onChange={(e) =>
                      vm.setMinConsumptionM3(parseInt(e.target.value, 10))
                    }
                    size="small"
                  />
                </div>

                <div className="analytics-filter-item">
                  <Select
                    label="Límite"
                    options={LIMIT_OPTIONS}
                    value={vm.topConsumersLimit}
                    onChange={(e) =>
                      vm.setTopConsumersLimit(parseInt(e.target.value, 10))
                    }
                    size="small"
                  />
                </div>
              </>
            )}

            {(vm.activeTab === 'interannual' || vm.activeTab === 'connection-growth') && (
              <>
                <div className="analytics-filter-item">
                  <Select
                    label="Año Base"
                    options={YEAR_OPTIONS}
                    value={vm.baseYear}
                    onChange={(e) =>
                      vm.setBaseYear(parseInt(e.target.value, 10))
                    }
                    size="small"
                  />
                </div>

                <div className="analytics-filter-item">
                  <Select
                    label="Año Comparado"
                    options={YEAR_OPTIONS}
                    value={vm.targetYear}
                    onChange={(e) =>
                      vm.setTargetYear(parseInt(e.target.value, 10))
                    }
                    size="small"
                  />
                </div>

                {vm.activeTab === 'interannual' && (
                  <div
                    className="analytics-filter-item"
                    style={{ justifyContent: 'center' }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        marginTop: '1.25rem',
                        color: 'var(--text-primary, #0f172a)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={vm.onlyHomologous}
                        onChange={(e) => vm.setOnlyHomologous(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      Solo Cuentas Homólogas (1 a 1)
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      }
    >
      <div style={{ width: '100%', minHeight: '400px' }}>
        {renderActiveTabContent()}
      </div>
    </PageLayout>
  );
};
