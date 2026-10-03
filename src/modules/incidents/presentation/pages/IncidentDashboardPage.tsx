import React from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { useIncidentDashboardViewModel } from '../hooks/useIncidentDashboardViewModel';
import { IncidentDashboardView } from '../components/dashboard/IncidentDashboardView';
import { Button } from '@/shared/presentation/components/Button/Button';
import { RefreshCcw } from 'lucide-react';

export const IncidentDashboardPage: React.FC = () => {
  const { dashboardKpis, isLoading, error, refresh } = useIncidentDashboardViewModel();

  return (
    <PageLayout
      className="incident-dashboard-page"
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Dashboard de Incidentes</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Métricas y KPIs operativos en tiempo real</p>
          </div>
          <Button
            onClick={refresh}
            variant="dashed"
            size="sm"
            leftIcon={!isLoading && <RefreshCcw size={14} />}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Actualizar Datos
          </Button>
        </div>
      }
    >
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>Error al cargar el dashboard: </strong> {error}
        </div>
      )}
      <div style={{ width: '100%' }}>
        <IncidentDashboardView data={dashboardKpis} isLoading={isLoading} />
      </div>
    </PageLayout>
  );
};
