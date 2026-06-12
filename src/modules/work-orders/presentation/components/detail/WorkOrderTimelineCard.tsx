/**
 * WorkOrderTimelineCard
 *
 * SRP: timeline/historial completo de cambios de estado de una OT.
 * Espejo de SolicitudTimelineCard.
 * Consume HitoHistorialTimeline[] del campo `historial` (Q2) o `historial_estados` (Q3).
 */
import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { HitoHistorialTimeline } from '../../../domain/schemas/dto/response/work-orders.get.response';
import { getEstadoOrdenConfig } from '../WorkOrderConfig';

interface WorkOrderTimelineCardProps {
  historial: HitoHistorialTimeline[] | null | undefined;
  title?: string;
}

const getHitoIcon = (estado: string): React.ReactNode => {
  const upper = (estado || '').toUpperCase();
  if (upper === 'COMPLETADA') return <CheckCircle size={14} />;
  if (['CANCELADA', 'RECHAZADA_TECNICA', 'REVISION_RECHAZADA'].includes(upper))
    return <XCircle size={14} />;
  return <ArrowRight size={14} />;
};

export const WorkOrderTimelineCard: React.FC<WorkOrderTimelineCardProps> = ({
  historial,
  title = 'Historial de Estados',
}) => {
  if (!historial || historial.length === 0) {
    return (
      <Card title={title} className="wo-detail-card wo-timeline-card">
        <div className="wo-timeline-empty">
          <Clock size={28} style={{ opacity: 0.35 }} />
          <p>Sin historial de estados registrado.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className="wo-detail-card wo-timeline-card">
      <div className="wo-timeline">
        {historial.map((hito, idx) => {
          const cfg = getEstadoOrdenConfig(hito.estado);
          const isLast = idx === historial.length - 1;

          const fechaStr = hito.fecha
            ? new Date(hito.fecha).toLocaleString('es-EC', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—';

          return (
            <div
              key={`${hito.estado}-${idx}`}
              className={`wo-timeline__item${isLast ? ' wo-timeline__item--last' : ''}`}
            >
              {/* Línea vertical */}
              {!isLast && <div className="wo-timeline__line" />}

              {/* Dot */}
              <div
                className="wo-timeline__dot"
                style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color }}
              >
                {getHitoIcon(hito.estado)}
              </div>

              {/* Contenido */}
              <div className="wo-timeline__content">
                <div className="wo-timeline__estado" style={{ color: cfg.color }}>
                  {hito.estadoLabel || cfg.label}
                </div>
                {hito.estadoAnterior && (
                  <div className="wo-timeline__desde">
                    desde: <strong>{hito.estadoAnterior}</strong>
                  </div>
                )}
                <div className="wo-timeline__fecha">{fechaStr}</div>
                {hito.comentario && (
                  <div className="wo-timeline__comentario">
                    <MessageSquare size={11} style={{ display: 'inline', marginRight: 4 }} />
                    {hito.comentario}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
