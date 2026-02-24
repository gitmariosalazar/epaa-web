import React, { useMemo } from 'react';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';

interface PropTypes {
  history: ReadingHistory[];
  isLoading: boolean;
}

export const ReadingHistoryTable: React.FC<PropTypes> = ({
  history,
  isLoading
}) => {
  const columns: Column<ReadingHistory>[] = useMemo(
    () => [
      {
        header: 'Mes/Año',
        accessor: (row) => `${row.readingMonth} / ${row.readingYear}`
      },
      {
        header: 'Fecha Lect.',
        accessor: (row) => new Date(row.readingDate).toLocaleDateString()
      },
      {
        header: 'Hora Lect.',
        accessor: (row) => new Date(row.readingDate).toLocaleTimeString()
      },
      {
        header: 'Lectura Ant.',
        accessor: 'previousReading'
      },
      {
        header: 'Lectura Act.',
        accessor: 'currentReading'
      },
      {
        header: 'Consumo (m³)',
        accessor: (row) => (
          <span
            style={{
              fontWeight: 600,
              color:
                row.consumption > 20
                  ? 'var(--error, #e74c3c)'
                  : 'var(--success, #2ecc71)'
            }}
          >
            {row.consumption}
          </span>
        )
      },
      {
        header: 'Observación',
        accessor: (row) => row.observation || 'Ninguna'
      }
    ],
    []
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        Historial de Lecturas Recientes
      </h3>
      <Table<ReadingHistory>
        data={history}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={7}
      />
    </div>
  );
};
