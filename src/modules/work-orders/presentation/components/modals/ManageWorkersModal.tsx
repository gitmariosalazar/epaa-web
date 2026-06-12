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
import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, ShieldCheck, Wrench } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

// ── Rol labels (deben coincidir con work_orders.rol_trabajador) ──────────────
const ROL_OPTIONS = [
  { id: 1,    label: 'Técnico Responsable' },
  { id: 2,    label: 'Técnico Operativo' },
  { id: 3,    label: 'Supervisor GIS' },
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
  /** Callback para agregar un trabajador */
  onAddWorker: (
    workerId: string,
    roleId: number | null,
    isResponsible: boolean
  ) => Promise<void>;
  /** Callback para remover un trabajador */
  onRemoveWorker: (workerId: string) => Promise<void>;
  isLoading?: boolean;
}

export const ManageWorkersModal: React.FC<ManageWorkersModalProps> = ({
  isOpen,
  onClose,
  workOrderCode,
  currentWorkers,
  onAddWorker,
  onRemoveWorker,
  isLoading,
}) => {
  const [workerId, setWorkerId]       = useState('');
  const [roleId, setRoleId]           = useState<number | null>(null);
  const [isResponsible, setIsRes]     = useState(false);
  const [removingId, setRemovingId]   = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim()) return;
    await onAddWorker(workerId.trim(), roleId, isResponsible);
    setWorkerId('');
    setRoleId(null);
    setIsRes(false);
  };

  const handleRemove = async (wid: string) => {
    setRemovingId(wid);
    await onRemoveWorker(wid);
    setRemovingId(null);
  };

  const responsibleExists = currentWorkers.some((w) => w.isResponsible);

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Personal en Campo"
      subtitle={`OT: ${workOrderCode}`}
      color="#6366f1"
    >
      {/* ── Personal actual ─────────────────────────────────────────── */}
      <div className="wo-modal-section-title">
        <Users size={14} />
        Personal asignado ({currentWorkers.length})
      </div>

      {currentWorkers.length === 0 ? (
        <p className="wo-modal-empty-note">
          Aún no hay personal asignado a esta orden.
        </p>
      ) : (
        <ul className="wo-workers-list">
          {currentWorkers.map((w) => (
            <li key={w.workerId} className="wo-worker-item">
              <div className="wo-worker-info">
                {w.isResponsible ? (
                  <ShieldCheck size={14} className="wo-worker-icon wo-worker-icon--resp" />
                ) : (
                  <Wrench size={14} className="wo-worker-icon wo-worker-icon--field" />
                )}
                <div>
                  <span className="wo-worker-name">{w.workerName}</span>
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
          ))}
        </ul>
      )}

      {/* ── Agregar nuevo ──────────────────────────────────────────── */}
      <div className="wo-modal-section-title" style={{ marginTop: '1.25rem' }}>
        <UserPlus size={14} />
        Agregar trabajador
      </div>

      <form onSubmit={handleAdd} className="wo-modal-form" style={{ marginTop: '0.5rem' }}>
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            UUID del Trabajador <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-worker-id"
            type="text"
            className="wo-modal-input"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
            autoFocus
          />
        </div>

        <div className="wo-modal-row">
          <div className="wo-modal-field">
            <label className="wo-modal-label">Rol</label>
            <select
              id="wo-worker-role"
              className="wo-modal-input"
              value={roleId ?? ''}
              onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : null)}
            >
              {ROL_OPTIONS.map((r) => (
                <option key={String(r.id)} value={r.id ?? ''}>
                  {r.label}
                </option>
              ))}
            </select>
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
        </div>

        <div className="wo-modal-actions">
          <button
            type="button"
            className="wo-modal-btn wo-modal-btn--cancel"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#6366f1' } as React.CSSProperties}
            disabled={!workerId.trim() || isLoading}
          >
            {isLoading ? 'Guardando...' : 'Agregar Trabajador'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
