import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { HistorialTrackingEntry, TrackingSolicitudResponse } from '../../../domain/models/Solicitud';
import '../../styles/SolicitudDetailTimelineCard.css';
import { StatusTimeline, type TimelineItem } from '@/shared/presentation/components/Timeline';
import { getEstadoConfig } from '../SolicitudConfig';
import { HistorialModal } from './HistorialModal';

interface SolicitudTimelineCardProps {
  matchedTracking?: TrackingSolicitudResponse | null;
}

// ─── Domain → generic adapter (pure function, module-level) ───────────────────

function toTimelineItem(entry: HistorialTrackingEntry): TimelineItem {
  const config = getEstadoConfig(entry.estado);
  const prevConfig = entry.estadoAnterior ? getEstadoConfig(entry.estadoAnterior) : null;

  return {
    status: entry.estado,
    statusLabel: entry.estadoLabel,
    previousStatus: entry.estadoAnterior ?? undefined,
    previousStatusLabel: prevConfig?.label ?? undefined,
    date: entry.fecha,
    comment: entry.comentario ?? undefined,
    color: config.color,
  };
}

export const SolicitudTimelineCard: React.FC<SolicitudTimelineCardProps> = ({
  matchedTracking
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const matchedHistorial = matchedTracking?.historial ?? [];
  const items: TimelineItem[] = matchedHistorial.map(toTimelineItem);

  return (
    <Card className="sol-detail-card sol-detail-card--timeline">
      <div className="sol-detail-timeline-scroll">
        <StatusTimeline
          title="Historial de Movimientos"
          items={items}
          limit={3}
          onViewAll={() => setIsModalOpen(true)}
          emptyMessage="No se registran movimientos de seguimiento."
          emptySubMessage="Los cambios de estado se mostrarán aquí."
        />
      </div>
      <HistorialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        historial={matchedHistorial}
      />
    </Card>
  );
};
