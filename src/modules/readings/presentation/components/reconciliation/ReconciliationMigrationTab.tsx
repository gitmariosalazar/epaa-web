import React from 'react';
import { Database, Play, CheckCircle, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { StatsGrid, type StatCardItem } from '@/shared/presentation/components/Stats/StatsGrid';
import { Card } from '@/shared/presentation/components/Card/Card';
import { BsDatabaseFillGear } from 'react-icons/bs';
import { Alert } from '@/shared/presentation/components/Alert';

interface Props {
  migrationResult: any;
}

export const ReconciliationMigrationTab: React.FC<Props> = ({
  migrationResult
}) => {

  const mismatchColumns: Column<any>[] = [
    {
      header: 'Acometida ID',
      accessor: (item) => <span style={{ fontWeight: 600 }}>{item.acometidaId}</span>,
      id: 'acometidaId',
      style: { width: '120px' }
    },
    {
      header: 'Mes',
      accessor: (item) => <span>{item.mesLectura}</span>,
      id: 'mesLectura',
      style: { width: '100px' }
    },
    {
      header: 'Campo Discrepante',
      accessor: (item) => (
        <ColorChip label={item.field} color="amber" variant="soft" size="xs" />
      ),
      id: 'field',
      style: { width: '160px' }
    },
    {
      header: 'Valor Origen (PostgreSQL)',
      accessor: (item) => <span style={{ color: 'var(--text-secondary)' }}>{String(item.sourceValue)}</span>,
      id: 'sourceValue'
    },
    {
      header: 'Valor Destino (SQL Server)',
      accessor: (item) => <span style={{ color: 'var(--text-secondary)' }}>{String(item.targetValue)}</span>,
      id: 'targetValue'
    }
  ];

  const statItems: StatCardItem[] = [];

  if (migrationResult) {
    // If it comes from 'migrate', it has .comparison and .migration. If from 'compare', it's flat.
    const comparisonData = migrationResult.comparison || migrationResult;
    const migrationData = migrationResult.migration;

    if (comparisonData.totalSource !== undefined) {
      statItems.push({ title: 'Total Origen (PG)', value: comparisonData.totalSource, icon: Database, color: 'blue', desc: 'Lecturas en PostgreSQL' });
    }
    if (comparisonData.totalTarget !== undefined) {
      statItems.push({ title: 'Total Destino (SQL)', value: comparisonData.totalTarget, icon: Database, color: 'cyan', desc: 'Lecturas en SQL Server' });
    }
    if (comparisonData.matchedCount !== undefined) {
      statItems.push({ title: 'Conciliados (Match)', value: comparisonData.matchedCount, icon: CheckCircle2, color: 'green', desc: 'Registros idénticos' });
    }
    if (comparisonData.mismatchedCount !== undefined) {
      statItems.push({ title: 'Discrepancias', value: comparisonData.mismatchedCount, icon: XCircle, color: 'red', desc: 'Valores diferentes' });
    }
    if (comparisonData.missingInTargetCount !== undefined) {
      statItems.push({ title: 'Faltantes en Destino', value: comparisonData.missingInTargetCount, icon: AlertTriangle, color: 'amber', desc: 'No migrados' });
    }
    if (comparisonData.effectivenessPercentage !== undefined) {
      statItems.push({ title: 'Porcentaje Efectividad', value: `${comparisonData.effectivenessPercentage}%`, icon: Activity, color: 'emerald', desc: 'Nivel de similitud' });
    }

    // Migration stats
    if (migrationData) {
      if (migrationData.totalInserted !== undefined) {
        statItems.push({ title: 'Registros Insertados', value: migrationData.totalInserted, icon: CheckCircle2, color: 'green', desc: 'Filas agregadas' });
      }
      if (migrationData.durationMs !== undefined) {
        statItems.push({ title: 'Duración (ms)', value: migrationData.durationMs, icon: Play, color: 'slate', desc: 'Tiempo de ejecución' });
      }
    } else {
      // Fallback in case they were flat (legacy/compare)
      if (migrationResult.totalInserted !== undefined) {
        statItems.push({ title: 'Registros Insertados', value: migrationResult.totalInserted, icon: CheckCircle2, color: 'green', desc: 'Filas agregadas' });
      }
      if (migrationResult.durationMs !== undefined) {
        statItems.push({ title: 'Duración (ms)', value: migrationResult.durationMs, icon: Play, color: 'slate', desc: 'Tiempo de ejecución' });
      }
    }
  }

  return (
    <div className="reconciliation-tab-content">
      {migrationResult ? (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--success-color)' }}>
            <CheckCircle size={22} />
            <h3 style={{ margin: 0 }}>Resultado de la Operación</h3>
          </div>

          <StatsGrid items={statItems} />

          {(() => {
            const mismatchesData = migrationResult.comparison?.mismatches || migrationResult.mismatches;
            return mismatchesData && Array.isArray(mismatchesData) ? (
              <Card title="Detalle de Diferencias Encontradas">
                <Table<any>
                  data={mismatchesData}
                  columns={mismatchColumns}
                  isLoading={false}
                  pagination={true}
                  pageSize={10}
                  onEndReached={() => { }}
                  hasMore={false}
                  emptyState={
                    <EmptyState
                      message="Sin Discrepancias"
                      description="Ambas bases de datos están perfectamente sincronizadas."
                      icon={ShieldAlert}
                      variant="success"
                      minHeight="200px"
                    />
                  }
                />
              </Card>
            ) : null;
          })()}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          color: 'var(--text-secondary)'
        }}>
          <BsDatabaseFillGear size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Presiona "Migrar Datos" o "Comparar" en la parte superior derecha para comenzar.</p>
          <div className='info-migration'>
            <Alert title='Información Importante' message='Para que la migración y comparación sea exitosa, procure realizar cuando ya no se esten registrando nuevas lecturas para evitar inconsistencias en los datos' type={"info"} dismissible={false} size='medium' />
          </div>
        </div>
      )}
    </div>
  );
};
