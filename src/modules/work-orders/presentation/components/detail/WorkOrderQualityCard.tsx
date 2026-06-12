/**
 * WorkOrderQualityCard
 *
 * SRP: resultado del checklist de preparación y del control de calidad.
 */
import React from 'react';
import { ShieldCheck, ShieldX, ClipboardCheck } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { OrdenTrabajoDetalle } from '../../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrderQualityCardProps {
  orden: OrdenTrabajoDetalle;
}

const StatusBadge: React.FC<{ value: boolean | null; labelTrue: string; labelFalse: string }> = ({
  value,
  labelTrue,
  labelFalse,
}) => {
  if (value === null || value === undefined) {
    return <span className="wo-quality-badge wo-quality-badge--pending">Sin evaluar</span>;
  }
  return value ? (
    <span className="wo-quality-badge wo-quality-badge--ok">
      <ShieldCheck size={13} /> {labelTrue}
    </span>
  ) : (
    <span className="wo-quality-badge wo-quality-badge--fail">
      <ShieldX size={13} /> {labelFalse}
    </span>
  );
};

export const WorkOrderQualityCard: React.FC<WorkOrderQualityCardProps> = ({ orden }) => {
  const sinDatos =
    orden.checklistAprobado === null &&
    orden.calidadAprobada === null &&
    !orden.idInspeccion &&
    !orden.idControl;

  if (sinDatos) {
    return (
      <Card title="Control de Calidad" className="wo-detail-card">
        <p className="wo-empty-text">Aún no se ha realizado el control de calidad.</p>
      </Card>
    );
  }

  return (
    <Card title="Control de Calidad" className="wo-detail-card">
      <div className="wo-quality-grid">

        {/* Checklist de preparación */}
        {orden.idInspeccion && (
          <div className="wo-quality-section">
            <div className="wo-quality-section__title">
              <ClipboardCheck size={14} /> Checklist de Preparación
            </div>
            <div className="wo-quality-section__row">
              <span>Resultado</span>
              <StatusBadge
                value={orden.checklistAprobado}
                labelTrue="Aprobado"
                labelFalse="Rechazado"
              />
            </div>
            {orden.observacionesChecklist && (
              <div className="wo-quality-section__obs">
                {orden.observacionesChecklist}
              </div>
            )}
          </div>
        )}

        {/* Control de calidad */}
        {orden.idControl && (
          <div className="wo-quality-section">
            <div className="wo-quality-section__title">
              <ShieldCheck size={14} /> Control de Calidad
            </div>
            <div className="wo-quality-section__row">
              <span>Resultado</span>
              <StatusBadge
                value={orden.calidadAprobada}
                labelTrue="Aprobado"
                labelFalse="Rechazado"
              />
            </div>
            {orden.comentariosCalidad && (
              <div className="wo-quality-section__obs">
                {orden.comentariosCalidad}
              </div>
            )}
          </div>
        )}

      </div>
    </Card>
  );
};
