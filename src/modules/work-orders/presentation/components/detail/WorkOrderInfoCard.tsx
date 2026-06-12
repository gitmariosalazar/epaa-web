/**
 * WorkOrderInfoCard
 *
 * SRP: información general de la OT (tipo, departamento, dirección, cliente).
 */
import React from 'react';
import { MapPin, Building2, Wrench, User, Hash, Users } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { OrdenTrabajoDetalle } from '../../../domain/schemas/dto/response/work-orders.get.response';
import { TIPO_ASIGNACION_LABELS } from '../WorkOrderConfig';

interface WorkOrderInfoCardProps {
  orden: OrdenTrabajoDetalle;
  onManageWorkers?: () => void;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="wo-info-row">
    <span className="wo-info-row__icon">{icon}</span>
    <span className="wo-info-row__label">{label}</span>
    <span className="wo-info-row__value">{value || '—'}</span>
  </div>
);

export const WorkOrderInfoCard: React.FC<WorkOrderInfoCardProps> = ({ orden, onManageWorkers }) => {
  const tipoAsignacionLabel =
    TIPO_ASIGNACION_LABELS[orden.tipoAsignacion] ?? orden.tipoAsignacion;

  const ejecutorLabel =
    false
      ? orden.inspectorNombre ?? '—'
      : orden.inspectorNombre
      ? `${orden.inspectorNombre} (${orden.inspectorUsername ?? '—'})`
      : 'Sin asignar';

  return (
    <Card title="Información General" className="wo-detail-card">
      <div className="wo-info-grid">
        <InfoRow
          icon={<Wrench size={14} />}
          label="Tipo de Trabajo"
          value={orden.tipoTrabajoDescripcion ?? orden.tipoTrabajo}
        />
        <InfoRow
          icon={<Building2 size={14} />}
          label="Departamento"
          value={orden.departamento}
        />
        <InfoRow
          icon={<Hash size={14} />}
          label="Origen"
          value={orden.origenLabel ?? orden.origen}
        />
        {orden.descripcion && (
          <InfoRow
            icon={<Hash size={14} />}
            label="Descripción"
            value={orden.descripcion}
          />
        )}

        <div className="wo-info-section-title">Ubicación</div>

        {orden.direccion && (
          <InfoRow
            icon={<MapPin size={14} />}
            label="Dirección"
            value={orden.direccion}
          />
        )}
        {orden.claveCatastral && (
          <InfoRow
            icon={<Hash size={14} />}
            label="Clave Catastral"
            value={orden.claveCatastral}
          />
        )}
        {orden.latitud != null && orden.longitud != null && (
          <InfoRow
            icon={<MapPin size={14} />}
            label="Coordenadas"
            value={`${orden.latitud.toFixed(6)}, ${orden.longitud.toFixed(6)}`}
          />
        )}
        {orden.ubicacionDetalles && (
          <InfoRow
            icon={<MapPin size={14} />}
            label="Detalles Ubicación"
            value={orden.ubicacionDetalles}
          />
        )}

        <div className="wo-info-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Asignación</span>
          {onManageWorkers && (
            <Button
              variant="secondary"
              size="xs"
              onClick={onManageWorkers}
              leftIcon={<Users size={12} />}
              style={{ padding: '0.25rem 0.5rem', height: 'auto', fontSize: '0.75rem' }}
            >
              Gestionar Personal
            </Button>
          )}
        </div>

        <InfoRow
          icon={<User size={14} />}
          label="Tipo Asignación"
          value={tipoAsignacionLabel}
        />
        <InfoRow
          icon={<User size={14} />}
          label="Ejecutor"
          value={ejecutorLabel}
        />
        {orden.personalAsignado && orden.personalAsignado.length > 0 && (
          <InfoRow
            icon={<Users size={14} />}
            label="Personal Asignado"
            value={
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.15rem' }}>
                {orden.personalAsignado.map((w) => (
                  <span
                    key={w.idTrabajador}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(99, 102, 241, 0.08)',
                      color: '#6366f1',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                    }}
                  >
                    {w.nombreTrabajador}
                    {w.esResponsable && (
                      <span style={{ fontSize: '0.62rem', marginLeft: '0.25rem', opacity: 0.8 }}>
                        (Resp.)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            }
          />
        )}
        {orden.idCliente && (
          <InfoRow
            icon={<User size={14} />}
            label="Cliente"
            value={orden.idCliente}
          />
        )}
      </div>
    </Card>
  );
};
