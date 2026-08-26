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
import { FaEdit } from 'react-icons/fa';
import { MapPin, FileText } from 'lucide-react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';

interface PropTypes {
  data: TakenReadingConnection[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
  onViewConnectionDetails?: (cadastralKey: string) => void;
  onViewDetails?: (cadastralKey: string, readingDate: Date | null) => void;
}

export const EstimatedReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading,
  onAction,
  onViewConnectionDetails,
  onViewDetails
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
        header: t('readings.columns.readingDate'),
        accessor: (r) =>
          r.readingDate ? dateService.formatToLocaleString(r.readingDate) : '-'
      },
      {
        header: t('readings.columns.readings', 'Lecturas'),
        accessor: (item: TakenReadingConnection) => {
          return (
            <>
              <div className="readings-taken-content">
                <span className="readings-taken-info">
                  {' '}
                  <p>Ant.:</p>
                  <ColorChip
                    label={`${NumberFormatter.format(item.previousReading, 2)}`}
                    size="xs"
                    variant="ghost"
                  ></ColorChip>
                </span>
                <span className="readings-taken-info">
                  {' '}
                  <p>Act.:</p>
                  <ColorChip
                    label={`${NumberFormatter.format(item.currentReading, 2)}`}
                    size="xs"
                    variant="ghost"
                  ></ColorChip>
                </span>
              </div>
            </>
          );
        }
      },
      {
        header: t('readings.columns.consumption'),
        accessor: (r) =>
          `${NumberFormatter.format(r.calculatedConsumption, 2)} m³`
      },
      {
        header: t('readings.columns.novelty'),
        accessor: (r) => {
          const color = getNoveltyColor(r.novelty || 'NOT_READ');
          return (
            <ColorChip
              label={r.novelty || '-'}
              color={color}
              size="sm"
              borderRadius="10px"
              variant="soft"
            />
          );
        }
      },
      {
        header: t('readings.columns.userCreatedName', 'Creado por'),
        accessor: (r: TakenReadingConnection) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tooltip
              content={r.userCreatedName}
              themeColor="info"
              followCursor={false}
            >
              <div className="flex items-center gap-2">
                <ColorChip
                  label={`@${r.userCreatedId}`}
                  color="var(--text-secondary)"
                  size="xs"
                  variant="ghost"
                />
                <div
                  style={{
                    fontSize: '0.85em',
                    color: 'var(--text-secondary)',
                    marginLeft: '12px'
                  }}
                >
                  {r.readingDate
                    ? dateService.formatToLocaleString(r.readingDate)
                    : '-'}
                </div>
              </div>
            </Tooltip>
          </div>
        )
      },
      {
        header: t('readings.columns.userUpdatedName', 'Actualizado por'),
        accessor: (r: TakenReadingConnection) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {r.userUpdatedId ? (
              <Tooltip
                content={r.userUpdatedName}
                themeColor="info"
                followCursor={false}
              >
                <div className="flex items-center gap-2">
                  <ColorChip
                    label={`@${r.userUpdatedId}`}
                    color="var(--text-secondary)"
                    size="xs"
                    variant="ghost"
                  />
                  <div
                    style={{
                      fontSize: '0.85em',
                      color: 'var(--text-secondary)',
                      marginLeft: '12px'
                    }}
                  >
                    {r.readingDate
                      ? dateService.formatToLocaleString(r.readingDate)
                      : '-'}
                  </div>
                </div>
              </Tooltip>
            ) : (
              <div
                style={{
                  fontSize: '0.85em',
                  color: 'var(--text-secondary)',
                  marginLeft: '12px'
                }}
              >
                <ColorChip
                  label="Sin actualizar"
                  color="var(--text-secondary)"
                  size="xs"
                  variant="ghost"
                />
              </div>
            )}
          </div>
        )
      },
      {
        header: t('common.actions', 'Acciones'),
        accessor: (reading) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip
              themeColor="warning"
              content={t('common.edit', 'Editar')}
            >
              <Button
                size="sm"
                variant="ghost"
                color="warning"
                onClick={() =>
                  onAction && onAction('update', reading.cadastralKey)
                }
                circle
              >
                <FaEdit size={16} />
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

            <Tooltip
              themeColor="info"
              followCursor={false}
              content={t('common.viewDetails', 'Ver Detalles de Lectura')}
            >
              <Button size="sm" variant="ghost" onClick={() => onViewDetails && onViewDetails(reading.cadastralKey, reading.readingDate)} circle>
                <FileText size={16} />
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
        {t('readings.tabs.estimated')}
      </h3>
      <Table<TakenReadingConnection>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas estimadas."
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            variant="info"
            icon={IoInformationCircleOutline}
          />
        }
      />
    </div>
  );
};
