import React from 'react';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal/PopoverModal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { History } from 'lucide-react';
import { useReadingAdjustmentHistory } from '../hooks/useReadingAdjustmentHistory';
import { ReadingDetailTabContent } from './ReadingDetailTabContent';
import type { HistorialAjusteLectura } from '../../domain/models/Reading';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { CircularProgress, useSimulatedProgress } from '@/shared/presentation/components/CircularProgress';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { CgArrowLongRightL } from "react-icons/cg";
import './ReadingAdjustmentHistoryPopover.css';
import { ConverDateTime } from '@/shared/utils/datetime/ConverDate';

interface ReadingAdjustmentHistoryPopoverProps {
  readingId: number;
  cadastralKey?: string | null;
  yearAndMonth?: string | null;
  customTrigger?: React.ReactElement<any>;
}

export const ReadingAdjustmentHistoryPopover: React.FC<ReadingAdjustmentHistoryPopoverProps> = ({ readingId, cadastralKey, yearAndMonth, customTrigger }) => {
  const { data, isLoading, error, fetchHistory } = useReadingAdjustmentHistory();
  const loadingProgress = useSimulatedProgress(isLoading);

  const handleOpen = () => {
    fetchHistory(readingId);
  };

  const columns: Column<HistorialAjusteLectura>[] = [
    {
      header: 'FECHA DE AJUSTE',
      accessor: (row) => ConverDateTime(row.createdAt)
    },
    {
      header: 'JUSTIFICACIÓN',
      accessor: (row) => {
        return (
          <Tooltip followCursor={false} themeColor="warning" content={
            <div>
              <p className="title-adjusted">
                {row.tipoAjuste}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <p className="subtitle-adjusted">
                  {row.descripcionTipoAjuste}
                </p>
                <p><strong>Justificación:</strong> {row.justificacion}</p>
                {/*<span>{row.justificacion}</span>*/}
              </div>
            </div>
          }

          >
            <p>{row.tipoAjuste}</p>
          </Tooltip>
        );
      }
    },
    /*
    {
      header: 'ESTADO',
      accessor: (row) => {
        let color: 'success' | 'warning' | 'error' | 'default' = 'default';
        if (row.estadoAprobacion === 'APROBADO') color = 'success';
        if (row.estadoAprobacion === 'RECHAZADO') color = 'error';
        if (row.estadoAprobacion === 'PENDIENTE') color = 'warning';

        return (
          <ColorChip
            label={row.estadoAprobacion}
            color={color}
            size="xs"
            variant="soft"
          />
        );
      }
    }
    */

    {
      header: 'Lecturas',
      accessor: (row) => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexDirection: 'column' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tooltip followCursor={false} themeColor="secondary" content={`Lectura anterior: ${row.lecturaAnteriorNueva}`}>
                <ColorChip label={`${row.lecturaAnteriorNueva}`} status="error" size="xs" variant="ghost" />
              </Tooltip>
              <CgArrowLongRightL color="var(--text-secondary)" size={16} />
              <Tooltip followCursor={false} themeColor="secondary" content={`Lectura actual: ${row.lecturaActualPrevia}`}>
                <ColorChip label={`${row.lecturaActualPrevia}`} status="success" size="xs" variant="ghost" />
              </Tooltip>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tooltip followCursor={false} themeColor="secondary" content={`Lectura previa anterior: ${row.lecturaAnteriorPrevia}`}>
                <ColorChip label={`${row.lecturaAnteriorPrevia}`} status="error" size="xs" variant="ghost" />
              </Tooltip>
              <CgArrowLongRightL color="var(--text-secondary)" size={16} />
              <Tooltip followCursor={false} themeColor="secondary" content={`Lectura previa actual: ${row.lecturaActualPrevia}`}>
                <ColorChip label={`${row.lecturaActualPrevia}`} status="success" size="xs" variant="ghost" />
              </Tooltip>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Consumos',
      accessor: (row) => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Tooltip followCursor={false} themeColor="secondary" content={`Consumo previo: ${row.consumoPrevio} m³`}>
              <ColorChip label={`${row.consumoPrevio} m³`} status="error" size="xs" variant="ghost" />
            </Tooltip>
            <CgArrowLongRightL color="var(--text-secondary)" size={16} />
            <Tooltip followCursor={false} themeColor="secondary" content={`Consumo actual: ${row.consumoNuevo} m³`}>
              <ColorChip label={`${row.consumoNuevo} m³`} status="success" size="xs" variant="ghost" />
            </Tooltip>
          </div>
        );
      }
    },
  ];

  return (
    <PopoverModal
      title="Detalle de Lectura y Ajustes"
      trigger={
        customTrigger ? (
          React.cloneElement(customTrigger, {
            onClick: (e: any) => {
              handleOpen();
              if (customTrigger.props.onClick) {
                customTrigger.props.onClick(e);
              }
            }
          })
        ) : (
          <Tooltip followCursor={false} themeColor="secondary" content="Ver Historial de Ajustes">
            <Button size="sm" variant="ghost" color="secondary" circle onClick={handleOpen}>
              <History size={16} />
            </Button>
          </Tooltip>
        )
      }
      size="xl"
    >
      <div style={{ minWidth: '900px', minHeight: '300px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        {cadastralKey && yearAndMonth && (
          <div style={{ borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <ReadingDetailTabContent
              cadastralKey={cadastralKey}
              yearAndMonth={yearAndMonth}
              hidePhotosAndObservations={true}
            />
          </div>
        )}

        <div style={{ padding: '16px', flexGrow: 1, overflowY: 'auto' }}>
          <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} /> Historial de Ajustes
          </h4>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px' }}>
              <CircularProgress progress={loadingProgress} size={60} label="Cargando historial..." />
            </div>
          ) : error ? (
            <EmptyState
              message="Error al cargar"
              description={error}
              variant="error"
              icon={History}
            />
          ) : (
            <Table<HistorialAjusteLectura>
              data={data}
              columns={columns}
              isLoading={isLoading}
              pagination
              pageSize={5}
              emptyState={
                <EmptyState
                  message="Sin ajustes"
                  description="No hay historial de ajustes para esta lectura."
                  icon={History}
                />
              }
            />
          )}
        </div>
      </div>
    </PopoverModal>
  );
};
