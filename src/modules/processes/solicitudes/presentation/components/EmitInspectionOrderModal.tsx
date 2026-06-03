/**
 * EmitInspectionOrderModal — Fase 6
 *
 * SRP: solo gestiona la UI para emitir OT de inspección.
 * DIP: recibe repo/useCaseFactory por prop o importa use case directamente.
 * OCP: agregar campos → extender este modal sin modificar la página.
 */
import React, { useState } from 'react';
import { EmitInspectionOrderUseCase } from '../../application/usecases/EmitInspectionOrderUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Search, X, Calendar, User, FileText, Clock } from 'lucide-react';
import './ActionModal.css';

interface EmitInspectionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  emitterId: string;
  onSuccess: () => void;
}

const useCase = new EmitInspectionOrderUseCase(new SolicitudRepositoryImpl());

export const EmitInspectionOrderModal: React.FC<EmitInspectionOrderModalProps> = ({
  isOpen, onClose, solicitudId, solicitudNumero, emitterId, onSuccess
}) => {
  const [technicianId, setTechnicianId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianId.trim()) {
      MessageToastCustom('error', 'Campo requerido', 'Ingrese el ID del técnico inspector.');
      return;
    }
    if (!scheduledDate) {
      MessageToastCustom('error', 'Campo requerido', 'Seleccione la fecha de inspección.');
      return;
    }
    setLoading(true);
    try {
      await useCase.execute({
        solicitudId,
        technicianId: technicianId.trim(),
        scheduledDate,
        notes: notes.trim() || undefined,
        emitterId
      });
      MessageToastCustom('success', 'OT Emitida', 'Orden de trabajo de inspección emitida correctamente.');
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo emitir la orden de inspección.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--indigo">
          <div className="action-modal__header-icon"><Search size={20} /></div>
          <div>
            <h3 className="action-modal__title">Emitir Orden de Inspección</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 6</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__field">
            <label className="action-modal__label"><User size={13} /> ID del Técnico Inspector</label>
            <input
              type="text"
              className="action-modal__input"
              placeholder="Ej: TEC-001 o username del técnico"
              value={technicianId}
              onChange={e => setTechnicianId(e.target.value)}
              autoFocus
            />
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label"><Calendar size={13} /> Fecha Programada</label>
            <input
              type="datetime-local"
              className="action-modal__input"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label"><FileText size={13} /> Notas (opcional)</label>
            <textarea
              className="action-modal__textarea"
              placeholder="Instrucciones especiales para el inspector..."
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="action-modal__actions">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : <Search size={15} />}
            >
              {loading ? 'Emitiendo...' : 'Emitir Orden'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
