import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CompletedReadingConnectionTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { TakenReadingConnection } from '../../domain/models/Reading';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Eye } from 'lucide-react';
import { FaEdit, FaCheckCircle, FaHome } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { ReadingLocationModal } from './draw-map/ReadingLocationModal';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';

interface PropTypes {
  data: TakenReadingConnection[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
  onViewDetails?: (cadastralKey: string, readingDate: Date | null) => void;
}

export const CompletedReadingConnectionTable: React.FC<PropTypes> = ({
  data,
  isLoading,
  onAction,
  onViewDetails
}) => {
  const { t } = useTranslation();

  const [selectedReading, setSelectedReading] =
    useState<TakenReadingConnection | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleOpenMap = (reading: TakenReadingConnection) => {
    setSelectedReading(reading);
    setIsMapModalOpen(true);
  };

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
        header: t('readings.columns.readings', 'Lecturas'),
        accessor: (item: TakenReadingConnection) => {
          return (
            <>
              <div className="readings-taken-content">
                <span className='readings-taken-info'>
                  {' '}
                  <p>Ant.:</p>
                  <ColorChip
                    label={`${NumberFormatter.format(item.previousReading, 2)}`}
                    size="xs"
                    variant="ghost"
                  ></ColorChip>
                </span>
                <span className='readings-taken-info'>
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
        accessor: (r) => `${NumberFormatter.format(r.calculatedConsumption, 2)} m³`
      },
      {
        header: t('readings.columns.readingCode', 'Código'),
        accessor: (r) => r.readingCode || '-'
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
        header: t('readings.columns.meterSeal', 'Información de Lectura'),
        accessor: (r) => {
          return (
            <div className="reading-info-container">
              <div className="reading-info-graphic">
                <Tooltip
                  content="Lugar de Acometida"
                  themeColor="info"
                  followCursor={false}
                >
                  <div className="reading-info-home-icon">
                    <FaHome size={16} />
                  </div>
                </Tooltip>

                <div className="reading-info-distance-container">
                  <span className="reading-info-distance-text">
                    {r.distanceMeters != null
                      ? `${r.distanceMeters.toFixed(2)} m`
                      : '-'}
                  </span>
                  <div className="reading-info-distance-line">
                    <div className="reading-info-distance-tick left" />
                    <div className="reading-info-distance-tick right" />
                  </div>
                </div>

                <Tooltip
                  content="Punto de Lectura"
                  themeColor="info"
                  followCursor={false}
                >
                  <div className="reading-info-location-icon">
                    <MdMyLocation size={16} />
                  </div>
                </Tooltip>
              </div>

              {r.isInsideAllowedRadius != null && (
                <ColorChip
                  label={
                    r.isInsideAllowedRadius
                      ? 'Dentro del radio'
                      : 'Fuera del radio'
                  }
                  color={r.isInsideAllowedRadius ? '#10b981' : '#ef4444'}
                  size="xs"
                  borderRadius={6}
                  variant="soft"
                  icon={
                    r.isInsideAllowedRadius ? (
                      <FaCheckCircle />
                    ) : (
                      <IoIosCloseCircle />
                    )
                  }
                />
              )}
            </div>
          );
        }
      },
      {
        header: t('common.actions', 'Acciones'),
        accessor: (reading) => (
          <div className="reading-table-actions">
            <Tooltip
              themeColor="info"
              followCursor={false}
              content={t('common.viewDetails', 'Ver Detalles')}
            >
              <Button size="sm" variant="ghost" onClick={() => onViewDetails && onViewDetails(reading.cadastralKey, reading.readingDate)} circle>
                <Eye size={16} />
              </Button>
            </Tooltip>
            <Tooltip
              themeColor="warning"
              followCursor={false}
              content={t('common.edit', 'Editar')}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onAction && onAction('update', reading.cadastralKey)
                }
                color="warning"
                circle
              >
                <FaEdit size={16} />
              </Button>
            </Tooltip>
            <Tooltip
              themeColor="cyan"
              followCursor={false}
              content={t('common.viewLocation', 'Ver Ubicación de la Lectura')}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenMap(reading)}
                color="cyan"
                circle
              >
                <FaLocationCrosshairs size={16} />
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
        {t('readings.tabs.completed')}
      </h3>
      <Table<TakenReadingConnection>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas completadas."
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      <ReadingLocationModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        reading={selectedReading}
      />
    </div>
  );
};
