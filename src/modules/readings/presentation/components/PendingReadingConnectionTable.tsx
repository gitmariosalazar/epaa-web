import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { PendingReadingConnection } from '../../domain/models/Reading';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Eye } from 'lucide-react';
import { IoAdd } from 'react-icons/io5';

interface PropTypes {
  data: PendingReadingConnection[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
}

export const PendingReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading,
  onAction
}) => {
  const { t } = useTranslation();

  const columns: Column<PendingReadingConnection>[] = useMemo(
    () => [
      { header: t('readings.columns.cadastralKey'), accessor: 'cadastralKey' },
      {
        header: t('readings.columns.meter'),
        accessor: (r) => r.meterNumber || t('readings.columns.noMeter')
      },
      {
        header: t('readings.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.cardId}
              </div>
            </div>
          </div>
        )
      },
      { header: t('readings.columns.sector'), accessor: 'sector' },
      { header: t('readings.columns.account'), accessor: 'account' },
      { header: t('readings.columns.address'), accessor: 'address' },
      {
        header: t('readings.columns.average'),
        accessor: (r) => `${r.averageConsumption} m³`
      },
      {
        header: t('common.actions', 'Acciones'),
        accessor: (reading) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {}}
              title={t('common.viewDetails', 'Ver Detalles')}
              circle
            >
              <Eye size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="success"
              onClick={() => onAction && onAction('create', reading.cadastralKey)}
              title={t('common.add', 'Agregar Lectura')}
              circle
            >
              <IoAdd size={16} />
            </Button>
          </div>
        )
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        {t('readings.tabs.pending')}
      </h3>
      <Table<PendingReadingConnection>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={10}
      />
    </div>
  );
};
