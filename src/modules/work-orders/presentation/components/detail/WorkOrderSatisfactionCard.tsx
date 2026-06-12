/**
 * WorkOrderSatisfactionCard
 *
 * SRP: encuesta de satisfacción del cliente para una OT completada.
 */
import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { OrdenTrabajoDetalle } from '../../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrderSatisfactionCardProps {
  orden: OrdenTrabajoDetalle;
}

const StarRating: React.FC<{ value: number }> = ({ value }) => (
  <div className="wo-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={20}
        fill={n <= value ? '#f59e0b' : 'none'}
        stroke={n <= value ? '#f59e0b' : 'var(--border)'}
      />
    ))}
  </div>
);

export const WorkOrderSatisfactionCard: React.FC<WorkOrderSatisfactionCardProps> = ({ orden }) => {
  if (!orden.idEncuesta && orden.calificacionSatisfaccion === null) {
    return (
      <Card title="Encuesta de Satisfacción" className="wo-detail-card">
        <p className="wo-empty-text">El cliente aún no ha calificado este servicio.</p>
      </Card>
    );
  }

  const calificacion = orden.calificacionSatisfaccion ?? 0;
  const label =
    calificacion >= 5 ? 'Excelente' :
    calificacion >= 4 ? 'Muy bueno' :
    calificacion >= 3 ? 'Aceptable' :
    calificacion >= 2 ? 'Regular' :
    'Deficiente';

  return (
    <Card title="Encuesta de Satisfacción" className="wo-detail-card">
      <div className="wo-satisfaction">
        <StarRating value={calificacion} />
        <div className="wo-satisfaction__label" style={{ color: '#f59e0b' }}>
          {calificacion}/5 — {label}
        </div>
        {orden.comentariosSatisfaccion && (
          <blockquote className="wo-satisfaction__comment">
            "{orden.comentariosSatisfaccion}"
          </blockquote>
        )}
      </div>
    </Card>
  );
};
