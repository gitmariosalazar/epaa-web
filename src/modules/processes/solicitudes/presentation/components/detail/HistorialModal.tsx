import React from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { StatusTimeline, type TimelineItem } from '@/shared/presentation/components/Timeline';
import type { HistorialTrackingEntry } from '../../../domain/models/Solicitud';
import { getEstadoConfig } from '../SolicitudConfig';

interface HistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  historial: HistorialTrackingEntry[];
}

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

export const HistorialModal: React.FC<HistorialModalProps> = ({
  isOpen,
  onClose,
  historial
}) => {
  const items = historial.map(toTimelineItem);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Movimientos Completo"
      size="md"
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
        <StatusTimeline
          title="Todos los Eventos"
          items={items}
        />
      </div>
    </Modal>
  );
};
