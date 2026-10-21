/**
 * ConfirmacionStep — Paso 3 del wizard de creación de OT
 *
 * SRP : solo muestra el resumen, no ejecuta lógica de negocio.
 * DIP : recibe datos ya procesados como props, sin importar de dónde vienen.
 */
import React, { useState } from 'react';
import { User, MapPin, Wrench, AlertTriangle, Mail, Phone, FileText, Camera, Maximize2 } from 'lucide-react';
import { Alert } from '@/shared/presentation/components/Alert';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ORIGINS, WORK_TYPES, PRIORITIES } from './constants';
import type { WorkOrderForm } from './types';
import { useObjectUrls } from './useObjectUrls';

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
  const previews = useObjectUrls(form.images);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const origin = ORIGINS.find(o => o.value === form.origin)?.label ?? form.origin;
  const workType = form.workTypeName
    ?? WORK_TYPES.find(t => t.id === form.workTypeId)?.label
    ?? (form.workTypeId ? String(form.workTypeId) : '—');
  const priority = PRIORITIES.find(p => p.id === form.priorityId)?.label ?? String(form.priorityId);

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
        <Row icon={<User size={14} />} label="Identificación" value={form.clientId} />
        <Row icon={<User size={14} />} label="Nombre" value={form.clientName} />
        <Row icon={<Mail size={14} />} label="Correo" value={form.clientEmail} />
        <Row icon={<Phone size={14} />} label="Teléfono" value={form.clientPhone} />
      </div>

      {/* ── Sección Orden ───────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: '1.5rem' }}>
        <Wrench size={20} />
        <h3>Detalle de la Orden</h3>
      </div>
      <div className="wo-confirm-card">
        <Row icon={<AlertTriangle size={14} />} label="Origen" value={origin} />
        <Row icon={<Wrench size={14} />} label="Tipo de Trabajo" value={workType} />
        <Row icon={<AlertTriangle size={14} />} label="Prioridad" value={priority} />
        <Row icon={<MapPin size={14} />} label="Dirección" value={form.location} />
        {form.cadastralKey && (
          <Row icon={<FileText size={14} />} label="Clave Catastral" value={form.cadastralKey} />
        )}
        {form.longitude && (
          <Row icon={<MapPin size={14} />} label="Coordenadas" value={`${form.latitude}, ${form.longitude}`} />
        )}
        {form.description && (
          <Row icon={<FileText size={14} />} label="Descripción" value={form.description} />
        )}
      </div>

      <div className="wo-confirm-footer-note">
        <span className="wo-badge wo-badge--notificada">NOTIFICADA</span>
        <span>Estado inicial de la nueva orden de trabajo</span>
      </div>

      {/* ── Evidencias ─────────────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <Camera size={20} />
        <h3>Evidencias</h3>
        {previews.length > 0 && (
          <span className="wo-badge wo-badge--count" style={{ marginLeft: '0.5rem' }}>
            {previews.length} {previews.length === 1 ? 'adjunta' : 'adjuntas'}
          </span>
        )}
      </div>
      <div className="wo-confirm-card wo-confirm-card--evidence">
        {previews.length > 0 ? (
          previews.map((src, idx) => (
            <div
              key={src}
              className="evidence-image-preview-wrapper wo-confirm-evidence-item"
              onClick={() => setSelectedImage(src)}
              title="Clic para ampliar imagen"
            >
              <img src={src} alt={`evidencia-${idx}`} className="evidence-image-preview" />
              <div className="wo-confirm-evidence-overlay">
                <Maximize2 size={16} />
              </div>
            </div>
          ))
        ) : (
          <div className="wo-confirm-evidence-empty">
            <Camera size={18} />
            <span>No se adjuntaron evidencias para esta orden</span>
          </div>
        )}
      </div>

      {/* ── Modal de vista previa ampliada ────────────────────────── */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title="Vista previa de evidencia"
          size="lg"
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <img
              src={selectedImage}
              alt="Evidencia ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
