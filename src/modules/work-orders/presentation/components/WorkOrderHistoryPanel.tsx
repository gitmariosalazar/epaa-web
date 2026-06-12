import { Card } from '@/shared/presentation/components/Card/Card';
import {
  ProcessTimeline,
  type TimelineStep
} from '@/shared/presentation/components/Timeline/ProcessTimeline';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { OrdenTrabajoTracking } from '../../domain/schemas/dto/response/work-orders.get.response';
import type { WorkOrderHistoryRow } from '../hooks/workOrderProcess.types';

interface WorkOrderHistoryPanelProps {
  tracking: OrdenTrabajoTracking | null;
  rows: WorkOrderHistoryRow[];
  totalRows: number;
}

const timelineSteps: TimelineStep<string>[] = [
  { id: 'NOTIFICADA', label: 'Notificada' },
  { id: 'PENDIENTE', label: 'Pendiente' },
  { id: 'ASIGNADA', label: 'Asignada' },
  { id: 'PREPARACION', label: 'Preparacion' },
  { id: 'EN_PROCESO', label: 'En proceso' },
  { id: 'COMPLETADA', label: 'Completada' }
];

const columns: Column<WorkOrderHistoryRow>[] = [
  { header: 'Estado', accessor: 'estado', sortable: true },
  { header: 'Fecha', accessor: 'fecha', sortable: true },
  { header: 'Comentario', accessor: 'comentario' },
  { header: 'Usuario', accessor: 'usuarioId' }
];

const resolveTimelineState = (
  tracking: OrdenTrabajoTracking | null
): string => {
  if (!tracking) return 'NOTIFICADA';

  const status = (tracking.estadoCodigo ?? '').toUpperCase();
  if (status === 'REVISION_RECHAZADA') return 'PREPARACION';
  if (status === 'RECHAZADA_TECNICA') return 'EN_PROCESO';
  if (timelineSteps.some((step) => step.id === status)) return status;

  return 'NOTIFICADA';
};

export const WorkOrderHistoryPanel = ({
  tracking,
  rows,
  totalRows
}: WorkOrderHistoryPanelProps) => {
  return (
    <Card title="Historial y tracking" className="work-order-process__card">
      {tracking ? (
        <div className="work-order-process__history-content">
          <div className="work-order-process__timeline-container">
            <ProcessTimeline
              steps={timelineSteps}
              currentStep={resolveTimelineState(tracking)}
            />
          </div>

          <div className="work-order-process__tracking-kpis">
            <span>Estado actual: {tracking.estadoActualLabel}</span>
            <span>SLA horas: {tracking.slaHoras}</span>
            <span>SLA vencido: {tracking.slaVencido ? 'Si' : 'No'}</span>
            <span>Horas en proceso: {tracking.horasTotalesProceso}</span>
            <span>
              Movimientos: {rows.length} / {totalRows}
            </span>
          </div>

          <Table
            data={rows}
            columns={columns}
            pagination
            pageSize={6}
            fullHeight={false}
            width="100"
          />
        </div>
      ) : (
        <p className="work-order-process__empty">
          Consulta una OT para visualizar su historial completo.
        </p>
      )}
    </Card>
  );
};
