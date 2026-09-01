import React, { useEffect } from 'react';
import type { ReconciliationSummary } from '../../../domain/models/lecturas-reconciliation';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { Database, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { StatsGrid, type StatCardItem } from '@/shared/presentation/components/Stats/StatsGrid';

interface Props {
  summaryData: ReconciliationSummary | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReconciliationBasicSummaryTab: React.FC<Props> = ({
  summaryData,
  isLoading,
  onRefresh
}) => {
  const progress = useSimulatedProgress(isLoading);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !summaryData) {
    return (
      <div className="circular-progress">
        <CircularProgress progress={progress} size={80} label="Cargando resumen..." />
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="reconciliation-tab-content" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No hay datos disponibles para el mes seleccionado.</p>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm" 
          style={{ marginTop: '1rem' }}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Consultar
        </Button>
      </div>
    );
  }

  const statItems: StatCardItem[] = [
    {
      title: 'Total Origen (Postgres)',
      value: summaryData.totalPostgres,
      icon: Database,
      color: 'blue',
      desc: 'Total en lecturas_postgres'
    },
    {
      title: 'Total Destino (AP_LECTURAS)',
      value: summaryData.totalApLecturas,
      icon: Database,
      color: 'cyan',
      desc: 'Total en AP_LECTURAS'
    },
    {
      title: 'Conciliados (Match)',
      value: summaryData.matched,
      icon: CheckCircle2,
      color: 'green',
      desc: 'Registros idénticos'
    },
    {
      title: 'Discrepancias',
      value: summaryData.mismatched,
      icon: XCircle,
      color: 'red',
      desc: 'Valores diferentes'
    },
    {
      title: 'Faltantes en AP_LECTURAS',
      value: summaryData.missingInApLecturas,
      icon: AlertTriangle,
      color: 'amber',
      desc: 'Solo existen en origen'
    }
  ];

  return (
    <div className="reconciliation-tab-content">
      <StatsGrid items={statItems} />
    </div>
  );
};
