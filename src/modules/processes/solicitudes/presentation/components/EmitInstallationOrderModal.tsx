/**
 * EmitInstallationOrderModal — Fase 12
 * Usa DatePicker + SearchableSelect con lista de empleados activos.
 */
import React, { useState, useEffect } from 'react';
import { EmitInstallationOrderUseCase } from '../../application/usecases/EmitInstallationOrderUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { SearchableSelect } from '@/shared/presentation/components/Input/SearchableSelect';
import type { SearchableSelectOption } from '@/shared/presentation/components/Input/SearchableSelect';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import { Wrench, X, FileText, Clock } from 'lucide-react';
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
  const [employees, setEmployees] = useState<SearchableSelectOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoadingEmployees(true);
    apiClient
      .get<any>('/user-employee-gateway/find-all-active')
      .then((res) => {
        if (!mounted) return;
        const list: any[] = res.data?.data ?? res.data ?? [];
        const opts: SearchableSelectOption[] = list.map((emp: any) => ({
          value: emp.userId ?? emp.employeeId ?? emp.id,
          label: `${emp.firstName ?? emp.nombres ?? ''} ${emp.lastName ?? emp.apellidos ?? ''}`.trim() ||
                 emp.username || emp.userId
        }));
        setEmployees(opts);
      })
      .catch(() => { if (mounted) setEmployees([]); })
      .finally(() => { if (mounted) setLoadingEmployees(false); });
    return () => { mounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianId) {
      MessageToastCustom('error', 'Campo requerido', 'Seleccione el técnico de instalación.');
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
        technicianId: String(technicianId),
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
            <label className="action-modal__label">Técnico de Instalación *</label>
            <SearchableSelect
              value={technicianId}
              onChange={v => setTechnicianId(String(v))}
              options={employees}
              placeholder={loadingEmployees ? 'Cargando técnicos...' : 'Buscar técnico...'}
              disabled={loadingEmployees}
              size="medium"
            />
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label">Fecha Programada de Instalación *</label>
            <DatePicker
              value={scheduledDate}
              onChange={setScheduledDate}
              size="medium"
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
