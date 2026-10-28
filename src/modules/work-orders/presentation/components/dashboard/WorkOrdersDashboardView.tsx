/**
 * WorkOrdersDashboardView
 *
 * Clean Architecture — Presentation Layer.
 * Orchestrates dashboard navigation tabs, search filter, and tab views.
 *
 * SOLID:
 *   SRP: Orchestrates top-level dashboard layout and tab dispatch.
 *   DIP: Consumes ViewModel contracts without coupling to concrete transports.
 */

import React, { useMemo } from 'react';
import {
  LayoutDashboard,
  GitCompare,
  Users,
  TrendingUp,
  Search,
  X
} from 'lucide-react';
import { Tabs, type TabItem } from '@/shared/presentation/components/Tabs';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { WorkOrdersOverviewTab } from './tabs/WorkOrdersOverviewTab';
import { IncidentsVsWorkOrdersTab } from './tabs/IncidentsVsWorkOrdersTab';
import { TechniciansAndSlaTab } from './tabs/TechniciansAndSlaTab';
import { FinanceAndTrendsTab } from './tabs/FinanceAndTrendsTab';
import type {
  DashboardTabKey,
  UseWorkOrdersDashboardViewModelReturn
} from '../../hooks/useWorkOrdersDashboardViewModel';
import '../../styles/WorkOrdersDashboard.css';

interface WorkOrdersDashboardViewProps {
  vm: UseWorkOrdersDashboardViewModelReturn;
  onNavigateToOrder?: (orderCode: string) => void;
  onViewAllOrders?: () => void;
}

export const WorkOrdersDashboardView: React.FC<WorkOrdersDashboardViewProps> = ({
  vm,
  onNavigateToOrder,
  onViewAllOrders
}) => {
  const tabs: TabItem<DashboardTabKey>[] = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Resumen Ejecutivo & KPIs',
        icon: <LayoutDashboard size={16} />
      },
      {
        id: 'incidents-vs-ot',
        label: 'Incidentes vs Órdenes de Trabajo',
        icon: <GitCompare size={16} />
      },
      {
        id: 'technicians-sla',
        label: 'Técnicos, SLA & Calidad',
        icon: <Users size={16} />
      },
      {
        id: 'finance-trends',
        label: 'Finanzas, Costos & Tendencias',
        icon: <TrendingUp size={16} />
      }
    ],
    []
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Controls: Tabs & Search Filter */}
      <div className="wo-dashboard__header-bar">
        <Tabs<DashboardTabKey>
          tabs={tabs}
          activeTab={vm.activeTab}
          onTabChange={vm.setActiveTab}
        />

        {/* Quick Search in Tables */}
        {(vm.activeTab === 'incidents-vs-ot' || vm.activeTab === 'technicians-sla') && (
          <div style={{ position: 'relative', minWidth: '240px', maxWidth: '320px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder={
                vm.activeTab === 'incidents-vs-ot'
                  ? 'Filtrar por código, técnico u origen...'
                  : 'Filtrar por técnico o cédula...'
              }
              value={vm.searchFilter}
              onChange={(e) => vm.setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 1.8rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
            {vm.searchFilter && (
              <button
                type="button"
                onClick={() => vm.setSearchFilter('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {vm.isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
          <CircularProgress strokeWidth={7} label="Cargando estadísticas de órdenes de trabajo..." />
        </div>
      )}

      {/* Active Tab Panel */}
      {!vm.isLoading && (
        <>
          {vm.activeTab === 'overview' && (
            <WorkOrdersOverviewTab
              headerKpis={vm.headerKpis}
              executiveOverview={vm.executiveOverview}
              statusStats={vm.statusStats}
              priorityStats={vm.priorityStats}
              workTypeStats={vm.workTypeStats}
              keySummary={vm.keySummary}
              onNavigateToOrder={onNavigateToOrder}
              onViewAllOrders={onViewAllOrders}
            />
          )}

          {vm.activeTab === 'incidents-vs-ot' && (
            <IncidentsVsWorkOrdersTab
              funnelSummary={vm.funnelSummary}
              stateMatrix={vm.stateMatrix}
              originChannels={vm.originChannels}
              categoryDepartments={vm.categoryDepartments}
              syncDiscrepancies={vm.syncDiscrepancies}
              dispatchControl={vm.dispatchControl}
              searchFilter={vm.searchFilter}
              onNavigateToOrder={onNavigateToOrder}
            />
          )}

          {vm.activeTab === 'technicians-sla' && (
            <TechniciansAndSlaTab
              technicianPerformance={vm.technicianPerformance}
              crewAssignments={vm.crewAssignments}
              slaMonitor={vm.slaMonitor}
              qualityIndicators={vm.qualityIndicators}
              escalationAudit={vm.escalationAudit}
              searchFilter={vm.searchFilter}
              onNavigateToOrder={onNavigateToOrder}
            />
          )}

          {vm.activeTab === 'finance-trends' && (
            <FinanceAndTrendsTab
              materialCosts={vm.materialCosts}
              economicBalance={vm.economicBalance}
              dailyTrend={vm.dailyTrend}
              territorialConcentration={vm.territorialConcentration}
            />
          )}
        </>
      )}
    </div>
  );
};
