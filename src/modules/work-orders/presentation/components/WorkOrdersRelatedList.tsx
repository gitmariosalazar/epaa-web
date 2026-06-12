import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrdersRelatedListProps {
  ordenes: OrdenTrabajoVistaCliente[];
}

export const WorkOrdersRelatedList = ({
  ordenes
}: WorkOrdersRelatedListProps) => {
  if (ordenes.length === 0) {
    return (
      <p className="work-order-process__empty">
        No hay ordenes cargadas para la solicitud.
      </p>
    );
  }

  return (
    <div className="work-order-process__list">
      {ordenes.map((item) => (
        <article
          key={item.idOrdenTrabajo}
          className="work-order-process__list-item"
        >
          <strong>{item.codigoOrden}</strong>
          <span>{item.estadoLabel}</span>
          <span>{item.tipoTrabajo}</span>
          <span>Prioridad: {item.prioridad}</span>
          <span>SLA: {item.slaHoras}h</span>
          <span>Progreso: {item.progresoPct}%</span>
        </article>
      ))}
    </div>
  );
};
