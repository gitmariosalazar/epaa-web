/**
 * WorkOrdersDashboardPage
 *
 * Clean Architecture — Presentation Layer.
 * Primary analytical hub for Work Orders.
 *
 * SOLID:
 *   SRP: Page orchestrator connecting UI components with ViewModel and routing.
 *   DIP: Consumes useWorkOrdersDashboardViewModel.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { RefreshCcw, Plus, List, AlertCircle } from 'lucide-react';
import { useWorkOrdersDashboardViewModel } from '../hooks/useWorkOrdersDashboardViewModel';
import { WorkOrdersDashboardView } from '../components/dashboard/WorkOrdersDashboardView';

export const WorkOrdersDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const vm = useWorkOrdersDashboardViewModel();

  const handleNavigateToOrder = (orderCode: string) => {
    navigate(`/work-orders/${encodeURIComponent(orderCode)}`);
  };

  const handleViewAllOrders = () => {
    navigate('/work-orders/list');
  };

  const handleNewOrder = () => {
    navigate('/work-orders/new');
  };

  return (
    <PageLayout
      className="work-orders-dashboard-page"
      header={
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            gap: '1rem'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Dashboard de Gestión — Órdenes de Trabajo
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                margin: '0.25rem 0 0 0'
              }}
            >
              Métricas ejecutivas en tiempo real, trazabilidad de incidentes, cuadrillas, SLA y costos
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => vm.refresh()}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCcw size={14} className={vm.isRefreshing ? 'animate-spin' : ''} />}
              isLoading={vm.isRefreshing}
              disabled={vm.isLoading || vm.isRefreshing}
            >
              Actualizar
            </Button>

            <Button
              onClick={handleViewAllOrders}
              variant="dashed"
              size="sm"
              leftIcon={<List size={14} />}
            >
              Ver todas las OTs
            </Button>

            <Button
              onClick={handleNewOrder}
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
            >
              Nueva OT
            </Button>
          </div>
        </div>
      }
    >
      {vm.error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#b91c1c',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Error al cargar métricas del dashboard:</strong> {vm.error}
          </div>
        </div>
      )}

      <WorkOrdersDashboardView
        vm={vm}
        onNavigateToOrder={handleNavigateToOrder}
        onViewAllOrders={handleViewAllOrders}
      />
    </PageLayout>
  );
};
