/**
 * ManageWorkersModal — Gestión de Personal en Campo
 *
 * SRP: modal dedicado exclusivamente a agregar / remover trabajadores de una OT.
 * Soporta:
 *   - Técnico responsable (isResponsible = TRUE) → solo 1 por OT
 *   - Trabajadores de campo adicionales (isResponsible = FALSE) → N por OT
 *   - Lista de personal actual asignado con botón de remoción
 *   - Inspección individual (1 solo usuario, sin miembros)
 *
 * Commands:
 *   AddWorkerToWorkOrderCommand    → POST /process-work-orders/add-worker
 *   RemoveWorkerFromWorkOrderCommand → POST /process-work-orders/remove-worker
 */
import React, { useEffect, useState } from 'react';
import { Users, UserPlus, UserMinus, ShieldCheck, Wrench } from 'lucide-react';
import { WoModalShell } from './WoModalShell';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { SearchableSelect, type SearchableSelectOption } from '@/shared/presentation/components/Input/SearchableSelect';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import { FindTechniciansUseCase } from '@/modules/users/application/usecases/FindTechniciansUseCase';
import '../../styles/ManageWorkersModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FaUserPlus } from 'react-icons/fa';

// ── Rol labels (deben coincidir con work_orders.rol_trabajador) ──────────────
const ROL_OPTIONS = [
  { id: 1, label: 'Técnico Responsable' },
  { id: 2, label: 'Técnico Operativo' },
  { id: 3, label: 'Supervisor GIS' },
  { id: null, label: 'Sin Rol' },
] as const;

export interface WorkerAssignment {
  workerId: string;
  workerName: string;
  roleName?: string;
  roleId?: number | null;
  isResponsible: boolean;
}

interface ManageWorkersModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderCode: string;
  /** Lista actual de personal asignado (obtenida del detalle de la OT) */
  currentWorkers: WorkerAssignment[];
  /** Callback para agregar trabajadores en lote */
  onSaveWorkersBatch?: (workers: { workerId: string; roleId?: number | null; isResponsible?: boolean }[]) => Promise<void>;
  /** Callback para remover un trabajador */
  onRemoveWorker: (workerId: string) => Promise<void>;
  isLoading?: boolean;
}

export const ManageWorkersModal: React.FC<ManageWorkersModalProps> = ({
  isOpen,
  onClose,
  workOrderCode,
  currentWorkers,
  onSaveWorkersBatch,
  onRemoveWorker,
  isLoading,
}) => {
  const [workerId, setWorkerId] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isResponsible, setIsRes] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pendingWorkers, setPendingWorkers] = useState<WorkerAssignment[]>([]);

  const handleAddLocal = (e: React.FormEvent) => {
    e.preventDefault();
    const id = workerId.trim();
    if (!id) return;

    // Validación 1: No repetir trabajadores
    const alreadyExists = currentWorkers.some(w => w.workerId === id) ||
      pendingWorkers.some(w => w.workerId === id);
    if (alreadyExists) {
      MessageToastCustom('warning', 'Trabajador duplicado', 'Este trabajador ya está en la lista.');
      return;
    }

    // Validación 2: Máximo un responsable
    if (isResponsible || roleId === 1) {
      const responsibleExistsNow = currentWorkers.some(w => w.isResponsible) ||
        pendingWorkers.some(w => w.isResponsible || w.roleId === 1);
      if (responsibleExistsNow) {
        MessageToastCustom('warning', 'Límite de responsable', 'Ya existe un Técnico Responsable asignado.');
        return;
      }
    }

    const roleObj = ROL_OPTIONS.find(r => r.id === roleId);
    const selectedEmployee = employees.find(e => e.value === id);
    const employeeName = selectedEmployee ? selectedEmployee.label : `Trabajador (${id.substring(0, 8)}...)`;

    setPendingWorkers([
      ...pendingWorkers,
      {
        workerId: id,
        workerName: employeeName,
        roleId: roleObj?.id ?? null,
        roleName: roleObj ? roleObj.label : 'Sin Rol',
        isResponsible: isResponsible || roleId === 1
      }
    ]);

    setWorkerId('');
    setRoleId(null);
    setIsRes(false);
  };

  const handleSaveBatch = async () => {
    if (!onSaveWorkersBatch || pendingWorkers.length === 0) return;
    const batch = pendingWorkers.map(w => ({
      workerId: w.workerId,
      roleId: w.roleId,
      isResponsible: w.isResponsible
    }));
    await onSaveWorkersBatch(batch);
    setPendingWorkers([]);
    onClose();
  };

  const handleRemove = async (wid: string) => {
    if (pendingWorkers.some(w => w.workerId === wid)) {
      setPendingWorkers(pendingWorkers.filter(w => w.workerId !== wid));
      return;
    }
    setRemovingId(wid);
    await onRemoveWorker(wid);
    setRemovingId(null);
  };


  const [employees, setEmployees] = useState<SearchableSelectOption[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);



  useEffect(() => {
    let mounted = true;
    setLoadingEmployees(true);

    const repository = new UserRepositoryImpl();
    const useCase = new FindTechniciansUseCase(repository);

    useCase.execute('INSPECTOR')
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
      .catch(() => {
        if (mounted) setEmployees([]);
      })
      .finally(() => {
        if (mounted) setLoadingEmployees(false);
      });

    return () => { mounted = false; };
  }, []);

  const responsibleExists = currentWorkers.some((w) => w.isResponsible);

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Personal en Campo"
      subtitle={`OT: ${workOrderCode}`}
      color="#6366f1"
      maxWidth="750px"
    >


      {/* ── Agregar nuevo ──────────────────────────────────────────── */}
      {onSaveWorkersBatch && (
        <div className="wo-modal-section-title" style={{ marginTop: '1.25rem' }}>
          <UserPlus size={14} />
          Agregar trabajador
        </div>
      )}

      {onSaveWorkersBatch && (
        <form onSubmit={handleAddLocal} className="wo-modal-form wo-modal-form-manage-workers" style={{ marginTop: '0.5rem' }}>
          <div className="wo-modal-field">
            <label className="wo-modal-label">
              UUID del Trabajador <span className="wo-modal-required">*</span>
            </label>
            <SearchableSelect
              value={workerId}
              onChange={v => setWorkerId(String(v))}
              options={employees}
              placeholder={loadingEmployees ? 'Cargando técnicos...' : 'Buscar técnico...'}
              disabled={loadingEmployees}
              size="compact"
            />
          </div>

          <div className="wo-modal-row wo-modal-row-manage-workers">
            <div className="wo-modal-field">
              <label className="wo-modal-label">Rol</label>
              <SearchableSelect
                value={roleId !== null ? String(roleId) : 'null'}
                onChange={(v) => setRoleId(v && v !== 'null' ? Number(v) : null)}
                options={ROL_OPTIONS
                  .filter(r => !(responsibleExists && r.id === 1)) // Hide if responsible already exists
                  .map((r) => ({
                    value: String(r.id),
                    label: r.label
                  }))}
              />
            </div>

            <div className="wo-modal-field" style={{ justifyContent: 'flex-end' }}>
              <label className="wo-modal-label">Tipo</label>
              <label className="wo-worker-toggle">
                <input
                  id="wo-worker-responsible"
                  type="checkbox"
                  checked={isResponsible}
                  onChange={(e) => setIsRes(e.target.checked)}
                  disabled={responsibleExists && !isResponsible}
                />
                <span>Técnico Responsable</span>
              </label>
              {responsibleExists && !isResponsible && (
                <small className="wo-modal-hint">
                  Ya existe un responsable. Remuévelo primero para cambiar.
                </small>
              )}
            </div>
            <div className="wo-modal-actions wo-modal-actions-manage-workers" style={{ marginTop: '1rem' }}>
              <Button
                type="submit"
                variant='secondary'
                disabled={!workerId.trim() || isLoading}
                leftIcon={<FaUserPlus size={14} />}
                size='compact'
              >
                Agregar
              </Button>
            </div>
          </div>


        </form>
      )}

      {/* ── Personal actual ─────────────────────────────────────────── */}
      <div className="wo-modal-section-title" style={{ marginTop: '1.5rem' }}>
        <Users size={14} />
        Personal asignado ({currentWorkers.length})
      </div>

      {currentWorkers.length === 0 && pendingWorkers.length === 0 ? (
        <p className="wo-modal-empty-note">
          Aún no hay personal asignado a esta orden.
        </p>

      ) : (
        <ul className="wo-workers-list">
          {[...currentWorkers, ...pendingWorkers].map((w, idx) => {
            const isPending = pendingWorkers.some(pw => pw.workerId === w.workerId && pw.isResponsible === w.isResponsible);
            return (
              <li key={`${w.workerId}-${idx}`} className="wo-worker-item" style={{ opacity: isPending ? 0.7 : 1 }}>
                <div className="wo-worker-info">
                  {w.isResponsible ? (
                    <ShieldCheck size={14} className="wo-worker-icon wo-worker-icon--resp" />
                  ) : (
                    <Wrench size={14} className="wo-worker-icon wo-worker-icon--field" />
                  )}
                  <div>
                    <span className="wo-worker-name">{w.workerName} {isPending && <span style={{ color: 'var(--warning, #f59e0b)', fontSize: '0.7rem' }}>(Pendiente)</span>}</span>
                    <span className="wo-worker-role">
                      {w.isResponsible ? 'Técnico Responsable' : (w.roleName ?? 'Sin Rol')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="wo-worker-remove-btn"
                  onClick={() => handleRemove(w.workerId)}
                  disabled={isLoading || removingId === w.workerId}
                  title="Remover de la orden"
                >
                  <UserMinus size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}



      <div className="wo-modal-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <button
          type="button"
          className="wo-modal-btn wo-modal-btn--cancel"
          onClick={onClose}
        >
          Cerrar
        </button>
        {onSaveWorkersBatch && pendingWorkers.length > 0 && (
          <button
            type="button"
            onClick={handleSaveBatch}
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#10b981' } as React.CSSProperties}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : `Guardar ${pendingWorkers.length} Trabajador(es)`}
          </button>
        )}
      </div>
    </WoModalShell>
  );
};
