import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

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
          <ColorChip
            label={row._type}
            status={row._type === 'Pendiente' ? 'warning' : 'success'}
            size="sm"
            variant="soft"
          />
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
