import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { TakenReadingConnection } from '../../domain/models/Reading';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Eye } from 'lucide-react';
import { FaEdit } from 'react-icons/fa';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface PropTypes {
  data: TakenReadingConnection[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
}

export const CompletedReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading,
  onAction
}) => {
  const { t } = useTranslation();

  const columns: Column<TakenReadingConnection>[] = useMemo(
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
      {
        header: t('readings.columns.readingDate'),
        accessor: (r) =>
          r.readingDate ? dateService.formatToLocaleString(r.readingDate) : '-'
      },
      {
        header: t('readings.columns.prevReading'),
        accessor: 'previousReading'
      },
      { header: t('readings.columns.currReading'), accessor: 'currentReading' },
      {
        header: t('readings.columns.consumption'),
        accessor: (r) => `${r.calculatedConsumption} m³`
      },
      {
        header: t('readings.columns.novelty'),
        accessor: (r) => r.novelty || t('readings.columns.none')
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
              color="warning"
              onClick={() =>
                onAction && onAction('update', reading.cadastralKey)
              }
              title={t('common.edit', 'Editar')}
              circle
            >
              <FaEdit size={16} />
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
        {t('readings.tabs.completed')}
      </h3>
      <Table<TakenReadingConnection>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={10}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas completadas."
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
    </div>
  );
};
