import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { PendingReadingConnection } from '../../domain/models/Reading';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MapPin } from 'lucide-react';
import { IoAdd, IoInformationCircleOutline } from 'react-icons/io5';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';

interface PropTypes {
  data: PendingReadingConnection[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
  onViewConnectionDetails?: (cadastralKey: string) => void;
}

export const PendingReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading,
  onAction,
  onViewConnectionDetails
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
      {
        header: t('readings.columns.address'),
        accessor: (r) => (
          <Tooltip
            content={`${r.address}, Sector: ${r.sector}`}
            themeColor="info"
            position="top"
            followCursor={false}
          >
            <span>{truncateText(`${r.address}, Sector: ${r.sector}`, 32)}</span>
          </Tooltip>
        )
      },
      {
        header: t('readings.columns.average'),
        accessor: (r) =>
          `${NumberFormatter.format(r.averageConsumption, 2)} m³`
      },
      {
        header: t('common.actions', 'Acciones'),
        accessor: (reading) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip
              themeColor="success"
              content={t('common.add', 'Agregar Lectura')}
            >
              <Button
                size="sm"
                variant="ghost"
                color="success"
                onClick={() =>
                  onAction && onAction('create', reading.cadastralKey)
                }
                circle
              >
                <IoAdd size={16} />
              </Button>
            </Tooltip>

            <Tooltip followCursor={false} themeColor="cyan" content="Ver Detalles de la Acometida">
              <Button
                size="sm"
                variant="ghost"
                color="cyan"
                onClick={() => onViewConnectionDetails && onViewConnectionDetails(reading.cadastralKey)}
                circle
              >
                <MapPin size={16} />
              </Button>
            </Tooltip>
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
        pageSize={15}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas pendientes"
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            icon={IoInformationCircleOutline}
            minHeight="300px"
            variant="info"
          />
        }
      />
    </div>
  );
};
