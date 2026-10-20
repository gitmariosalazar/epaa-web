import React, { useMemo } from 'react';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { getEstadoOrdenConfig } from '../WorkOrderConfig';
import { Tag, ArrowRight, Layers } from 'lucide-react';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import '../../styles/WorkOrderSelectPopoverModal.css';
import type { OrdenTrabajoTracking } from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export interface WorkOrderSelectPopoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrdenTrabajoTracking[];
  onSelect: (order: OrdenTrabajoTracking) => void;
  anchorElement?: HTMLElement | null;
  trigger?: React.ReactElement<any>;
}

/**
 * WorkOrderSelectPopoverModal
 * 
 * Componente modal basado en PopoverModal para permitir al usuario seleccionar
 * una orden de trabajo específica cuando una búsqueda arroja múltiples resultados.
 * 
 * Principios aplicados:
 * - SRP: Se encarga exclusivamente de la presentación y selección de la lista de órdenes devueltas.
 * - OCP: Estructura de columnas desacoplada y configurable sin alterar el layout principal.
 * - DIP: Consume la interfaz de dominio `OrdenTrabajoTracking`.
 */
export const WorkOrderSelectPopoverModal: React.FC<WorkOrderSelectPopoverModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelect,
  anchorElement,
  trigger
}) => {
  const columns: Column<OrdenTrabajoTracking>[] = useMemo(
    () => [
      {
        header: 'Código OT',
        accessor: (order) => (
          <Tooltip content={`Seleccionar orden ${order.codigoOrden}`} position="top" followCursor={false}
            themeColor='amber'
          >
            <button
              type="button"
              className="wo-select-popover-code-btn"
              onClick={() => onSelect(order)}
            >
              <Tag size={13} />
              <span>{order.codigoOrden}</span>
            </button>
          </Tooltip>
        )
      },
      {
        header: 'Estado',
        accessor: (order) => {
          const config = getEstadoOrdenConfig(order.estadoCodigo);
          return (
            <span
              className="wo-select-popover-badge"
              style={{
                color: config.color,
                backgroundColor: config.bg,
                borderColor: config.border
              }}
            >
              {config.label || order.estadoActualLabel || order.estadoCodigo}
            </span>
          );
        }
      },
      {
        header: 'Tipo de Trabajo',
        accessor: (order) => (
          <span className="wo-select-popover-text-main">
            {order.tipoTrabajo || '—'}
          </span>
        )
      },
      {
        header: 'Prioridad',
        accessor: (order) => (
          <span className="wo-select-popover-text-muted">
            {order.prioridad || '—'}
          </span>
        )
      },
      {
        header: 'Ubicación / Catastro',
        accessor: (order) => (
          <div className="wo-select-popover-col">
            <span className="wo-select-popover-text-secondary">
              {order.direccion || '—'}
            </span>
            {order.claveCatastral && (
              <span className="wo-select-popover-text-sub">
                Cat: {order.claveCatastral}
              </span>
            )}
          </div>
        )
      },
      {
        header: 'Fecha',
        accessor: (order) => (
          <span className="wo-select-popover-text-muted">
            {order.fechaCreacionEs ||
              (order.fechaCreacion
                ? new Date(order.fechaCreacion).toLocaleDateString('es-EC')
                : '—')}
          </span>
        )
      },
      {
        header: 'Acción',
        accessor: (order) => (
          <Button
            size="xs"
            variant="primary"
            onClick={() => onSelect(order)}
            leftIcon={<ArrowRight size={13} />}
          >
            Cargar
          </Button>
        )
      }
    ],
    [onSelect]
  );

  return (
    <PopoverModal
      isOpen={isOpen}
      onClose={onClose}
      anchorElement={anchorElement}
      trigger={trigger}
      title="Seleccionar Orden de Trabajo"
      description={`Se encontraron ${orders.length} órdenes para la búsqueda realizada.`}
      size="xl"
      headerColor="indigo"
      icon={<FaListUl size={18} />}
    >
      <div className="wo-select-popover-container">
        <div className="wo-select-popover-banner">
          <span>
            Se encontraron <strong>{orders.length}</strong> órdenes de trabajo asociadas. Haz clic en <strong>Cargar</strong> o en el código de la orden para seleccionarla.
          </span>
          <span className="wo-select-popover-count-chip">
            <Layers size={12} /> {orders.length} encontradas
          </span>
        </div>

        <Table<any>
          data={orders}
          columns={columns}
          pagination={orders.length > 5}
          pageSize={5}
          showColumnModal={false}
          showFilters={false}
          showRowsPerPage={false}
          showTotalRecords={false}
          fullHeight={false}
          emptyState={
            <EmptyState
              message="No se encontraron órdenes de trabajo"
              variant="warning"
              icon={<BsPatchQuestionFill size={32} />}
            />
          }
        />
      </div>
    </PopoverModal>
  );
};
