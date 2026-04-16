import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface PropTypes {
  data: any[];
  isLoading: boolean;
}

export const AllReadingsTable: React.FC<PropTypes> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  const columns: Column<any>[] = useMemo(
    () => [
      {
        header: t('readings.columns.state', 'Estado'),
        accessor: (row) => (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.8em',
              background:
                row._type === 'Pendiente'
                  ? 'var(--warning-light, #FFF3E0)'
                  : 'var(--success-light, #E8F5E9)',
              color:
                row._type === 'Pendiente'
                  ? 'var(--warning-dark, #E65100)'
                  : 'var(--success-dark, #1B5E20)'
            }}
          >
            {row._type}
          </span>
        )
      },
      { header: t('readings.columns.cadastralKey'), accessor: 'cadastralKey' },
      {
        header: t('readings.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div style={{ fontWeight: 300 }}>{row.clientName}</div>
          </div>
        )
      },
      {
        header: t('readings.columns.meter'),
        accessor: (r) => r.meterNumber || t('readings.columns.noMeter')
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        {t('readings.tabs.all')}
      </h3>
      <Table<any>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={10}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas"
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
    </div>
  );
};
