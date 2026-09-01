import React, { useEffect } from 'react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import type { DuplicateReconciliationRecord } from '../../../domain/models/lecturas-reconciliation';
import { ShieldAlert } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface Props {
  duplicatesData: DuplicateReconciliationRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ReconciliationDuplicatesTab: React.FC<Props> = ({
  duplicatesData,
  isLoading,
  onRefresh
}) => {
  const progress = useSimulatedProgress(isLoading);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: Column<DuplicateReconciliationRecord>[] = [
    {
      header: 'Origen (Tabla)',
      accessor: (item) => <span>{item.source}</span>,
      id: 'source',
      style: { width: '200px' }
    },
    {
      header: 'Acometida / Identificador',
      accessor: (item) => <span style={{ fontWeight: 600 }}>{item.identifier}</span>,
      id: 'identifier',
      style: { width: '180px' }
    },
    {
      header: 'Año',
      accessor: (item) => <span>{item.anio}</span>,
      id: 'anio',
      style: { width: '100px' }
    },
    {
      header: 'Mes',
      accessor: (item) => <span>{item.mes}</span>,
      id: 'mes',
      style: { width: '120px' }
    },
    {
      header: 'Apariciones (Ocurrencias)',
      accessor: (item) => (
        <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>
          {item.occurrences}
        </span>
      ),
      id: 'occurrences'
    }
  ];

  if (isLoading && duplicatesData.length === 0) {
    return (
      <div className="circular-progress">
        <CircularProgress progress={progress} size={80} label="Buscando duplicados..." />
      </div>
    );
  }

  return (
    <div className="reconciliation-tab-content">
      <Table<DuplicateReconciliationRecord>
        data={duplicatesData}
        columns={columns}
        isLoading={isLoading}
        loadingState={
          <div className="circular-progress">
            <CircularProgress progress={progress} size={80} label="Buscando duplicados..." />
          </div>
        }
        emptyState={
          <EmptyState
            message="No hay Duplicados"
            description="No se encontraron registros duplicados en el mes seleccionado."
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
