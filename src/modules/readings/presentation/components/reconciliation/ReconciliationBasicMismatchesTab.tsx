import React, { useEffect } from 'react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import type { ReconciliationMismatchRecord } from '../../../domain/models/lecturas-reconciliation';
import { ShieldAlert } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

interface Props {
  mismatchesData: ReconciliationMismatchRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReconciliationBasicMismatchesTab: React.FC<Props> = ({
  mismatchesData,
  isLoading,
  onRefresh
}) => {
  const progress = useSimulatedProgress(isLoading);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: Column<ReconciliationMismatchRecord>[] = [
    {
      header: 'ID Acometida',
      accessor: (item) => <span style={{ fontWeight: 600 }}>{item.acometidaId}</span>,
      id: 'acometidaId'
    },
    {
      header: 'Mes Lectura',
      accessor: (item) => <span>{item.mesLectura}</span>,
      id: 'mesLectura'
    },
    {
      header: 'Lectura Anterior (PG | AP)',
      accessor: (item) => (
        <span>{item.postgresLecturaAnterior} | {item.legacyLecturaAnterior ?? '-'}</span>
      ),
      id: 'lecturaAnterior'
    },
    {
      header: 'Lectura Actual (PG | AP)',
      accessor: (item) => (
        <span>{item.postgresLecturaActual} | {item.legacyLecturaActual ?? '-'}</span>
      ),
      id: 'lecturaActual'
    },
    {
      header: 'Estado',
      accessor: (item) => (
        <ColorChip
          label={item.status.replace(/_/g, ' ')}
          color={item.status === 'DIFERENTE' ? 'red' : 'blue'}
          variant="soft"
          size="xs"
        />
      ),
      id: 'status'
    }
  ];

  if (isLoading && mismatchesData.length === 0) {
    return (
      <div className="circular-progress">
        <CircularProgress progress={progress} size={80} label="Buscando discrepancias..." />
      </div>
    );
  }

  return (
    <div className="reconciliation-tab-content">
      <Table<ReconciliationMismatchRecord>
        data={mismatchesData}
        columns={columns}
        isLoading={isLoading}
        loadingState={
          <div className="circular-progress">
            <CircularProgress progress={progress} size={80} label="Buscando discrepancias..." />
          </div>
        }
        emptyState={
          <EmptyState
            message="No hay Discrepancias"
            description="Las lecturas coinciden perfectamente en este mes."
            icon={ShieldAlert}
            variant="success"
            minHeight="300px"
          />
        }
        pagination={true}
      />
    </div>
  );
};
