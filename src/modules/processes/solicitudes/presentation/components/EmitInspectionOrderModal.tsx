/**
 * EmitInspectionOrderModal — Fase 6
 *
 * SRP: solo gestiona la UI para emitir OT de inspección.
 * OCP: agregar campos → extender este modal sin modificar la página.
 * Usa: DatePicker (componente corporativo) + SearchableSelect (lista de empleados activos).
 */
import React, { useState, useEffect } from 'react';
import { EmitInspectionOrderUseCase } from '../../application/usecases/EmitInspectionOrderUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { SearchableSelect } from '@/shared/presentation/components/Input/SearchableSelect';
import type { SearchableSelectOption } from '@/shared/presentation/components/Input/SearchableSelect';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import { Search, X, FileText, Clock } from 'lucide-react';
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
  const [employees, setEmployees] = useState<SearchableSelectOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Cargar empleados activos al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoadingEmployees(true);
    apiClient
      .get<any>('/user-employee-gateway/find-technicians?type=INSPECTOR')
      .then((res) => {
        if (!mounted) return;
        const list: any[] = res.data?.data ?? res.data ?? [];
        const opts: SearchableSelectOption[] = list.map((emp: any) => ({
          value: emp.userId ?? emp.employeeId ?? emp.id,
          label: `${emp.firstName ?? emp.nombres ?? ''} ${emp.lastName ?? emp.apellidos ?? ''}`.trim() ||
                 emp.username ||
                 emp.userId
        }));
        setEmployees(opts);
      })
      .catch(() => {
        if (mounted) setEmployees([]);
      })
      .finally(() => { if (mounted) setLoadingEmployees(false); });
    return () => { mounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianId) {
      MessageToastCustom('error', 'Campo requerido', 'Seleccione el técnico inspector.');
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
        technicianId: String(technicianId),
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
            <label className="action-modal__label">Técnico Inspector *</label>
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
            <label className="action-modal__label">Fecha Programada *</label>
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
