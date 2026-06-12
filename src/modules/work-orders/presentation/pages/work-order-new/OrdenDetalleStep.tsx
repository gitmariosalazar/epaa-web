/**
 * OrdenDetalleStep — Paso 2 del wizard de creación de OT
 *
 * SRP : solo gestiona los campos de detalle de la orden.
 * ISP : props mínimas necesarias.
 */
import React from 'react';
import { Wrench, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input }  from '@/shared/presentation/components/Input/Input';
import { ORIGINS, WORK_TYPES, PRIORITIES } from './constants';
import type { WorkOrderForm } from './types';

interface OrdenDetalleStepProps {
  form:         WorkOrderForm;
  onFormChange: (fields: Partial<WorkOrderForm>) => void;
  errors?:      Record<string, string>;
}

export const OrdenDetalleStep: React.FC<OrdenDetalleStepProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  const field = <K extends keyof WorkOrderForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onFormChange({ [key]: e.target.value } as Partial<WorkOrderForm>);

  return (
    <div className="solicitud-form-section">

      {/* ── Clasificación ────────────────────────────────────────── */}
      <div className="solicitud-form-section__header">
        <AlertTriangle size={20} />
        <h3>Clasificación</h3>
      </div>

      <div className="wo-create-grid">
        <Select
          label="Origen *"
          name="origin"
          value={form.origin}
          onChange={field('origin')}
          required
        >
          {ORIGINS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>

        <Select
          label="Tipo de Trabajo *"
          name="workTypeId"
          value={String(form.workTypeId)}
          onChange={e => onFormChange({ workTypeId: Number(e.target.value) })}
          error={errors?.workTypeId}
          required
        >
          {WORK_TYPES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </Select>

        <Select
          label="Prioridad *"
          name="priorityId"
          value={String(form.priorityId)}
          onChange={e => onFormChange({ priorityId: Number(e.target.value) })}
          error={errors?.priorityId}
          required
        >
          {PRIORITIES.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </Select>
      </div>

      {/* ── Ubicación ─────────────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <MapPin size={20} />
        <h3>Ubicación</h3>
      </div>

      <Input
        label="Dirección / Lugar del trabajo *"
        name="location"
        value={form.location}
        onChange={field('location')}
        placeholder="Ej: Av. de los Shyris y Naciones Unidas"
        error={errors?.location}
        required
      />

      <div className="wo-create-grid" style={{ marginTop: '0.75rem' }}>
        <Input
          label="Clave Catastral"
          name="cadastralKey"
          value={form.cadastralKey}
          onChange={field('cadastralKey')}
          placeholder="Ej: 14-293"
        />
        <Input
          label="Longitud"
          name="longitude"
          type="number"
          value={form.longitude}
          onChange={field('longitude')}
          placeholder="-78.484"
        />
        <Input
          label="Latitud"
          name="latitude"
          type="number"
          value={form.latitude}
          onChange={field('latitude')}
          placeholder="-0.179"
        />
      </div>

      {/* ── Descripción ───────────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <FileText size={20} />
        <h3>Descripción del Problema</h3>
      </div>

      <div className="wo-create-textarea-wrapper">
        <Wrench size={14} className="wo-create-textarea-icon" />
        <textarea
          id="wo-create-description"
          className="wo-create-textarea"
          value={form.description}
          onChange={field('description')}
          placeholder="Describe brevemente el problema o requerimiento técnico..."
          rows={4}
        />
      </div>
    </div>
  );
};
