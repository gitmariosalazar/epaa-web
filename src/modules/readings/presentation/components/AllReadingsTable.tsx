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

import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { IoAdd } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import { MapPin, FileText } from 'lucide-react';

interface PropTypes {
  data: any[];
  isLoading: boolean;
  onAction?: (mode: 'create' | 'update', cadastralKey: string) => void;
  onViewConnectionDetails?: (cadastralKey: string) => void;
  onViewReadingDetails?: (cadastralKey: string, readingDate: Date | null) => void;
}

export const AllReadingsTable: React.FC<PropTypes> = ({ data, isLoading, onAction, onViewConnectionDetails, onViewReadingDetails }) => {
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
      },
      {
        header: t('common.actions', 'Acciones'),
        accessor: (row) => {
          const isPending = row._type === 'Pendiente';
          
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Acción: Crear o Editar */}
              {isPending ? (
                <Tooltip followCursor={false} themeColor="success" content={t('common.add', 'Agregar Lectura')}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="success"
                    onClick={() => onAction && onAction('create', row.cadastralKey)}
                    circle
                  >
                    <IoAdd size={16} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip followCursor={false} themeColor="warning" content={t('common.edit', 'Editar')}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="warning"
                    onClick={() => onAction && onAction('update', row.cadastralKey)}
                    circle
                  >
                    <FaEdit size={16} />
                  </Button>
                </Tooltip>
              )}

              {/* Acción: Ver Detalle de la Acometida */}
              <Tooltip followCursor={false} themeColor="cyan" content="Ver Detalles de la Acometida">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  color="cyan" 
                  onClick={() => onViewConnectionDetails && onViewConnectionDetails(row.cadastralKey)} 
                  circle
                >
                  <MapPin size={16} />
                </Button>
              </Tooltip>

              {/* Acción: Ver Detalle de la Lectura (Solo si ya fue tomada) */}
              {!isPending && (
                <Tooltip followCursor={false} themeColor="info" content="Ver Detalles de la Lectura">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onViewReadingDetails && onViewReadingDetails(row.cadastralKey, row.readingDate || null)} 
                    circle
                  >
                    <FileText size={16} />
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        }
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
        pageSize={15}
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
