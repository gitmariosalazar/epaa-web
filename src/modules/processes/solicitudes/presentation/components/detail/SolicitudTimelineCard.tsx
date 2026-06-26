import React from 'react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { StatusTimeline } from '@/shared/presentation/components/Timeline';
import type { TimelineItem } from '@/shared/presentation/components/Timeline';
import type {
  TrackingSolicitudResponse,
  HistorialTrackingEntry
} from '../../../domain/models/Solicitud';
import { getEstadoConfig } from '../SolicitudConfig';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SolicitudTimelineCardProps {
  matchedTracking: TrackingSolicitudResponse | null;
}

// ─── Domain → generic adapter (pure function, module-level) ───────────────────

/**
 * Maps a domain `HistorialTrackingEntry` to the generic `TimelineItem`.
 *
 * OCP: SolicitudTimelineCard is closed for modification — new field mappings
 *      go here, not inside StatusTimeline.
 * DIP: StatusTimeline depends on TimelineItem, not on HistorialTrackingEntry.
 */
function toTimelineItem(entry: HistorialTrackingEntry): TimelineItem {
  const config         = getEstadoConfig(entry.estado);
  const prevConfig     = entry.estadoAnterior ? getEstadoConfig(entry.estadoAnterior) : null;

  return {
    status:              entry.estado,
    statusLabel:         entry.estadoLabel,
    previousStatus:      entry.estadoAnterior ?? undefined,
    // Use the config label (e.g. "Documentos Recibidos") instead of the
    // generic formatLabel fallback (e.g. "Docs Submitted").
    previousStatusLabel: prevConfig?.label ?? undefined,
    date:                entry.fecha,
    comment:             entry.comentario ?? undefined,
    color:               config.color,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * SolicitudTimelineCard
 *
 * Thin wrapper: adapts `TrackingSolicitudResponse` to the generic StatusTimeline.
 *
 * SRP: responsible only for Card layout + domain-to-generic mapping.
 * DIP: delegates all timeline rendering to StatusTimeline (shared).
 */
export const SolicitudTimelineCard: React.FC<SolicitudTimelineCardProps> = ({
  matchedTracking
}) => {
  const historial = matchedTracking?.historial ?? [];
  const items: TimelineItem[] = historial.map(toTimelineItem);

  return (
    <Card className="sol-detail-card sol-detail-card--timeline">
      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <StatusTimeline
          title="Historial de Movimientos"
          items={items}
          emptyMessage="No se registran movimientos de seguimiento."
          emptySubMessage="Los cambios de estado se mostrarán aquí."
        />
      </div>
    </Card>
  );
};
