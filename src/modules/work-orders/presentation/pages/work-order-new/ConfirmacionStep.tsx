/**
 * ConfirmacionStep — Paso 3 del wizard de creación de OT
 *
 * SRP : solo muestra el resumen, no ejecuta lógica de negocio.
 * DIP : recibe datos ya procesados como props, sin importar de dónde vienen.
 */
import React from 'react';
import { User, MapPin, Wrench, AlertTriangle, Mail, Phone, FileText } from 'lucide-react';
import { Alert } from '@/shared/presentation/components/Alert';
import { ORIGINS, WORK_TYPES, PRIORITIES } from './constants';
import type { WorkOrderForm } from './types';

interface ConfirmacionStepProps {
  form: WorkOrderForm;
}

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="wo-confirm-row">
    <div className="wo-confirm-row__icon">{icon}</div>
    <div>
      <span className="wo-confirm-row__label">{label}</span>
      <strong className="wo-confirm-row__value">{value || '—'}</strong>
    </div>
  </div>
);

export const ConfirmacionStep: React.FC<ConfirmacionStepProps> = ({ form }) => {
  const origin    = ORIGINS.find(o => o.value === form.origin)?.label    ?? form.origin;
  const workType  = WORK_TYPES.find(t => t.id  === form.workTypeId)?.label ?? String(form.workTypeId);
  const priority  = PRIORITIES.find(p => p.id  === form.priorityId)?.label ?? String(form.priorityId);

  return (
    <div className="solicitud-form-section">
      <Alert
        type="info"
        title="Revisa antes de confirmar"
        dismissible={false}
        message="Verifica que todos los datos sean correctos. Una vez creada, la OT entrará al estado NOTIFICADA."
      />

      {/* ── Sección Cliente ─────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: '1.5rem' }}>
        <User size={20} />
        <h3>Cliente</h3>
      </div>
      <div className="wo-confirm-card">
        <Row icon={<User size={14} />}    label="Identificación" value={form.clientId} />
        <Row icon={<User size={14} />}    label="Nombre"         value={form.clientName} />
        <Row icon={<Mail size={14} />}    label="Correo"         value={form.clientEmail} />
        <Row icon={<Phone size={14} />}   label="Teléfono"       value={form.clientPhone} />
      </div>

      {/* ── Sección Orden ───────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: '1.5rem' }}>
        <Wrench size={20} />
        <h3>Detalle de la Orden</h3>
      </div>
      <div className="wo-confirm-card">
        <Row icon={<AlertTriangle size={14} />} label="Origen"          value={origin} />
        <Row icon={<Wrench size={14} />}        label="Tipo de Trabajo"  value={workType} />
        <Row icon={<AlertTriangle size={14} />} label="Prioridad"        value={priority} />
        <Row icon={<MapPin size={14} />}        label="Dirección"        value={form.location} />
        {form.cadastralKey && (
          <Row icon={<FileText size={14} />}    label="Clave Catastral"  value={form.cadastralKey} />
        )}
        {form.longitude && (
          <Row icon={<MapPin size={14} />}      label="Coordenadas"      value={`${form.latitude}, ${form.longitude}`} />
        )}
        {form.description && (
          <Row icon={<FileText size={14} />}    label="Descripción"      value={form.description} />
        )}
      </div>

      <div className="wo-confirm-footer-note">
        <span className="wo-badge wo-badge--notificada">NOTIFICADA</span>
        <span>Estado inicial de la nueva orden de trabajo</span>
      </div>
    </div>
  );
};
