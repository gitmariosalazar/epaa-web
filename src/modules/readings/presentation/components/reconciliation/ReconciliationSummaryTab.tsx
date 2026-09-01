import React, { useEffect } from 'react';
import type { ResumenAuditoriaResponse } from '../../../domain/models/lecturas-reconciliation';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Activity, Clock } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { StatsGrid, type StatCardItem } from '@/shared/presentation/components/Stats/StatsGrid';
import { DonutChart, type DonutSlice } from '@/shared/presentation/components/Charts/DonutChart';
import { Card } from '@/shared/presentation/components/Card/Card';

interface Props {
  kpiData: ResumenAuditoriaResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReconciliationSummaryTab: React.FC<Props> = ({
  kpiData,
  isLoading,
  onRefresh
}) => {
  const { t } = useTranslation();
  const progress = useSimulatedProgress(isLoading);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !kpiData) {
    return (
      <div className="circular-progress">
        <CircularProgress progress={progress} size={80} label="Cargando KPIs..." />
      </div>
    );
  }

  if (!kpiData) {
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

  const { data } = kpiData;

  const mainStats: StatCardItem[] = [
    {
      title: t('readings.reconciliation.totalCuentas', 'Cuentas Revisadas'),
      value: data.total_cuentas_revisadas,
      icon: FileText,
      color: 'blue',
      desc: 'Total de lecturas evaluadas en el mes'
    },
    {
      title: t('readings.reconciliation.totalConciliados', 'Conciliados OK'),
      value: data.total_conciliados_ok,
      icon: CheckCircle2,
      color: 'green',
      desc: 'Lecturas idénticas en origen y destino'
    },
    {
      title: t('readings.reconciliation.totalDiscrepancias', 'Discrepancias'),
      value: data.total_lecturas_discrepantes,
      icon: XCircle,
      color: 'red',
      desc: 'Lecturas con diferencias de valores'
    },
    {
      title: t('readings.reconciliation.totalDuplicados', 'Con Duplicados'),
      value: data.total_con_duplicados,
      icon: AlertTriangle,
      color: 'amber',
      desc: 'Acometidas con múltiples lecturas'
    },
  ];

  const secondaryStats: StatCardItem[] = [
    {
      title: t('readings.reconciliation.syncPercentage', 'Efectividad de Sincronización'),
      value: `${data.porcentaje_sincronizacion.toFixed(2)}%`,
      icon: Activity,
      color: 'green',
      desc: 'Proporción de lecturas exitosas'
    },
    {
      title: t('readings.reconciliation.totalPendientes', 'Pendientes de Migrar'),
      value: data.total_pendientes_migrar,
      icon: Clock,
      color: 'orange',
      desc: 'Lecturas faltantes en base de destino'
    },
    {
      title: 'Duplicadas en Postgres',
      value: data.cuentas_duplicadas_en_origen,
      icon: AlertTriangle,
      color: 'blue',
      desc: 'Acometidas con múltiples lecturas origen'
    },
    {
      title: 'Duplicadas en SQL Server',
      value: data.cuentas_duplicadas_en_ap_lecturas,
      icon: AlertTriangle,
      color: 'amber',
      desc: 'Acometidas con múltiples lecturas destino'
    },
    {
      title: 'Huérfanas en SQL Server',
      value: data.total_huerfanas_en_ap,
      icon: XCircle,
      color: 'amber',
      desc: 'Lecturas sin contraparte en origen'
    },
  ];

  const chartSlices: DonutSlice[] = [
    { label: 'Conciliados OK', value: data.total_conciliados_ok, color: 'green' },
    { label: 'Discrepancias', value: data.total_lecturas_discrepantes, color: 'red' },
    { label: 'Duplicados (SQL Server)', value: data.total_con_duplicados, color: 'amber' }
  ].filter(s => s.value >= 0);

  return (
    <div className="reconciliation-tab-content">


      <StatsGrid className='reconcillation-stats-grid' items={mainStats} />

      <div className="reconciliation-charts-grid">
        <Card title="Estado de Reconciliación">
          <DonutChart
            title="Distribución de Lecturas"
            slices={chartSlices}
            centerLabel="Revisadas"
            centerValue={data.total_cuentas_revisadas.toString()}
          />
        </Card>

        <Card title="Indicadores de Progreso" className="h-full">
          <div style={{ padding: '1rem 0' }}>
            <StatsGrid className="reconciliation-progress-stats" items={secondaryStats} />
          </div>
        </Card>
      </div>
    </div>
  );
};
