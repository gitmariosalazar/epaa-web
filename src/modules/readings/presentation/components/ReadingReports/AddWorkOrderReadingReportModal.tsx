import React, { useState, useEffect } from 'react';
import type { IncidentDetailRowResponse } from "../../../../incidents/domain/schemas/dtos/response/view_incident.response";
import { Tooltip } from "@/shared/presentation/components/common/Tooltip/Tooltip";
import { Button } from "@/shared/presentation/components/Button/Button";
import { Plus, X, Tag, Calendar, MapPin, AlignLeft, Network } from "lucide-react";
import { SearchableSelect, type SearchableSelectOption } from '@/shared/presentation/components/Input/SearchableSelect';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Alert } from '@/shared/presentation/components/Alert';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';

import { FindTechniciansUseCase } from '@/modules/users/application/usecases/FindTechniciansUseCase';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { CreateWorkOrderFromIncidentUseCase } from '@/modules/work-orders/application/usecases/CreateWorkOrderFromIncidentUseCase';
import { ProcessWorkOrderRepositoryImpl } from '@/modules/work-orders/infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// ─── 1. Custom Hooks (Clean Architecture & SRP) ───────────────────────────────
// Separamos la lógica de negocio y llamadas a infraestructura fuera de la vista.

function useTechnicians(role: string) {
  const [employees, setEmployees] = useState<SearchableSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Dependency Inversion: Instanciamos los repositorios y casos de uso
    const repository = new UserRepositoryImpl();
    const useCase = new FindTechniciansUseCase(repository);

    useCase.execute(role)
      .then((list) => {
        if (!mounted) return;
        const opts: SearchableSelectOption[] = (list || [])
          .filter((emp: any) => emp != null)
          .map((emp: any) => {
            const firstName = emp.firstName ?? emp.first_name ?? emp.nombres ?? '';
            const lastName = emp.lastName ?? emp.last_name ?? emp.apellidos ?? '';
            const fullName = emp.fullName ?? emp.full_name ?? `${firstName} ${lastName}`.trim();
            const id = emp.userId ?? emp.user_id ?? emp.employeeId ?? emp.employee_id ?? emp.id;
            return {
              value: String(id ?? ''),
              label: fullName || id || '(sin nombre)'
            } as SearchableSelectOption;
          })
          .filter(opt => opt.value !== '');
        setEmployees(opts);
      })
      .catch(() => { if (mounted) setEmployees([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [role]);

  return { employees, loading };
}

function useCreateIncidentWorkOrder(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createWorkOrder = async (incidentCode: string, technicianId: string) => {
    setIsSubmitting(true);
    try {
      const repository = new ProcessWorkOrderRepositoryImpl();
      const useCase = new CreateWorkOrderFromIncidentUseCase(repository);

      await useCase.execute({
        incidentCode,
        userIdAssignee: technicianId || null,
      });

      MessageToastCustom('success', 'OT Creada', `Se creó la OT para el incidente ${incidentCode}`);
      onSuccess();
    } catch (error: any) {
      MessageToastCustom('error', 'Error', error.message || 'No se pudo generar la orden de trabajo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createWorkOrder, isSubmitting };
}

// ─── 2. Presentational Components (SRP) ───────────────────────────────────────
// Componente dedicado EXCLUSIVAMENTE a mostrar la información bonita del incidente

const IncidentSummaryInfo: React.FC<{ incident: IncidentDetailRowResponse }> = ({ incident }) => {
  return (
    <div style={{
      background: 'var(--bg-body)',
      padding: '1.25rem',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <AlignLeft size={16} color="var(--accent)" />
        Resumen del Incidente
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
        
        {/* Categoría y Tipo */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px' }}>
            <Tag size={16} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Categoría / Tipo</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{incident.categoryName} <br/> <span style={{fontWeight:400, color: 'var(--text-muted)'}}>{incident.incidentTypeName}</span></span>
          </div>
        </div>

        {/* Fecha de Reporte */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ padding: '8px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderRadius: '8px' }}>
            <Calendar size={16} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Fecha de Reporte</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{ConverDate(incident.reportDate)}</span>
          </div>
        </div>

        {/* Acometida (Opcional) */}
        {incident.connectionId && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '8px' }}>
              <Network size={16} />
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Acometida Asociada</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{incident.connectionId}</span>
            </div>
          </div>
        )}

        {/* Ubicación */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>
            <MapPin size={16} />
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>Ubicación</span>
            <span style={{ fontWeight: 500, color: 'var(--text)' }}>{incident.referenceAddress || 'Sin dirección registrada'}</span>
          </div>
        </div>

        {/* Descripción (Caja destacada) */}
        <div style={{ gridColumn: '1 / -1', background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--border)', marginTop: '4px' }}>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>Descripción del Reporte:</span>
          <span style={{ color: 'var(--text)', fontStyle: incident.reportDescription ? 'normal' : 'italic', lineHeight: '1.4' }}>
            {incident.reportDescription || 'El usuario no proporcionó una descripción detallada.'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── 3. Main Modal Component ──────────────────────────────────────────────────
// Actúa como el Orquestador (Controller) entre la Vista (UI) y los Casos de Uso (Hooks)

interface AddWorkOrderReadingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentDetailRowResponse | null;
  onSubmit: (data?: any) => void;
}

export const AddWorkOrderReadingReportModal: React.FC<AddWorkOrderReadingReportModalProps> = ({ isOpen, onClose, onSubmit, incident }) => {
  const [technicianId, setTechnicianId] = useState('');
  
  // Consumimos los Custom Hooks (Single Responsibility + Dependency Inversion)
  const { employees, loading: loadingEmployees } = useTechnicians('INSPECTOR');
  const { createWorkOrder, isSubmitting } = useCreateIncidentWorkOrder(onSubmit);

  if (!isOpen || !incident) return null;

  const handleSubmit = () => {
    createWorkOrder(incident.incidentCode, technicianId);
  };

  const canSubmit: boolean = technicianId !== '' && !isSubmitting;

  return (
    <div className="incident-modal-overlay">
      <div className="incident-modal incident-detail-modal premium-theme" style={{ maxWidth: '480px' }}>
        
        {/* ── Header ── */}
        <div className="incident-modal-header">
          <div className="incident-modal-header-badges">
            <h3>Generar OT - {incident.incidentCode}</h3>
          </div>
          <Tooltip content='Cerrar' position='bottom' followCursor={false}>
            <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p" color='red'>
              <X size={20} />
            </Button>
          </Tooltip>
        </div>
        
        {/* ── Body ── */}
        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <IncidentSummaryInfo incident={incident} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert
              type='info'
              size='small'
              dismissible={false}
              message="Seleccione un técnico inspector para asignarle la orden de trabajo."
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="employee-select" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                Técnico Inspector <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <SearchableSelect
                value={technicianId}
                onChange={v => setTechnicianId(String(v))}
                options={employees}
                placeholder={loadingEmployees ? 'Cargando técnicos...' : 'Buscar e.g. Juan Perez...'}
                disabled={loadingEmployees || isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="incident-modal-footer" style={{ background: 'var(--bg-surface)' }}>
          <Tooltip content='Cancelar y cerrar' position='bottom' followCursor={false}>
            <Button variant="outline" onClick={onClose} color='neutral'>
              Cancelar
            </Button>
          </Tooltip>
          <Tooltip content='Generar orden de trabajo' position='bottom' followCursor={false}>
            <Button variant="primary" onClick={handleSubmit} color='green' disabled={!canSubmit}>
              <Plus size={18} />
              {isSubmitting ? 'Generando...' : 'Generar OT'}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}