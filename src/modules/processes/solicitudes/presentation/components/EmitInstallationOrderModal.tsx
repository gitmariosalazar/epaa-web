/**
 * EmitInstallationOrderModal — Fase 12
 * SRP: gestiona la emisión de la OT de instalación.
 */
import React, { useState } from 'react';
import { EmitInstallationOrderUseCase } from '../../application/usecases/EmitInstallationOrderUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Wrench, X, Calendar, User, FileText, Clock } from 'lucide-react';
import './ActionModal.css';

interface EmitInstallationOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  emitterId: string;
  onSuccess: () => void;
}

const useCase = new EmitInstallationOrderUseCase(new SolicitudRepositoryImpl());

export const EmitInstallationOrderModal: React.FC<EmitInstallationOrderModalProps> = ({
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
      MessageToastCustom('error', 'Campo requerido', 'Ingrese el ID del técnico de instalación.');
      return;
    }
    if (!scheduledDate) {
      MessageToastCustom('error', 'Campo requerido', 'Seleccione la fecha programada.');
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
      MessageToastCustom('success', 'OT Instalación Emitida', 'Orden de trabajo de instalación emitida correctamente.');
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo emitir la orden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--orange">
          <div className="action-modal__header-icon"><Wrench size={20} /></div>
          <div>
            <h3 className="action-modal__title">Emitir Orden de Instalación</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 12</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__field">
            <label className="action-modal__label"><User size={13} /> ID del Técnico de Instalación *</label>
            <input
              type="text"
              className="action-modal__input"
              placeholder="Ej: TEC-INS-003"
              value={technicianId}
              onChange={e => setTechnicianId(e.target.value)}
              autoFocus
            />
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label"><Calendar size={13} /> Fecha Programada de Instalación *</label>
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
              placeholder="Instrucciones especiales para el equipo de instalación..."
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
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : <Wrench size={15} />}
            >
              {loading ? 'Emitiendo...' : 'Emitir OT Instalación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
