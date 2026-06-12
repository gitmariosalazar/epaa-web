/**
 * WorkOrderWorkersCard
 *
 * SRP: Componente dedicado a la visualización y gestión inline del personal asignado a la OT (Maestro-Detalle).
 */
import React, { useState } from 'react';
import { UserPlus, UserMinus, ShieldCheck, Wrench, Plus } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { TrabajadorAsignado } from '../../../domain/schemas/dto/response/work-orders.get.response';

const ROL_OPTIONS = [
  { id: 1,    label: 'Técnico Responsable' },
  { id: 2,    label: 'Técnico Operativo' },
  { id: 3,    label: 'Supervisor GIS' },
  { id: null, label: 'Sin Rol' },
] as const;

interface WorkOrderWorkersCardProps {
  codigoOrden: string;
  personalAsignado: TrabajadorAsignado[];
  onAddWorker?: (
    workerId: string,
    roleId: number | null,
    isResponsible: boolean
  ) => Promise<void>;
  onRemoveWorker?: (workerId: string) => Promise<void>;
  isLoading?: boolean;
}

export const WorkOrderWorkersCard: React.FC<WorkOrderWorkersCardProps> = ({
  personalAsignado = [],
  onAddWorker,
  onRemoveWorker,
  isLoading = false,
}) => {
  const [workerId, setWorkerId] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [isResponsible, setIsResponsible] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim() || !onAddWorker) return;
    try {
      await onAddWorker(workerId.trim(), roleId, isResponsible);
      setWorkerId('');
      setRoleId(null);
      setIsResponsible(false);
    } catch (err) {
      // Error is toast-notified in parent
    }
  };

  const handleRemove = async (wid: string) => {
    if (!onRemoveWorker) return;
    setRemovingId(wid);
    try {
      await onRemoveWorker(wid);
    } finally {
      setRemovingId(null);
    }
  };

  const handleRoleChange = (val: number | null) => {
    setRoleId(val);
    if (val === 1) {
      setIsResponsible(true);
    } else {
      setIsResponsible(false);
    }
  };

  const handleResponsibleChange = (val: boolean) => {
    setIsResponsible(val);
    if (val) {
      setRoleId(1);
    } else {
      setRoleId(null);
    }
  };

  const responsibleExists = personalAsignado.some((w) => w.esResponsable);

  const columns: Column<TrabajadorAsignado>[] = [
    {
      header: 'Técnico',
      accessor: (w) => (
        <div className="wo-worker-info" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {w.esResponsable ? (
            <ShieldCheck size={16} style={{ color: '#6366f1' }} />
          ) : (
            <Wrench size={16} style={{ color: 'var(--text-muted)' }} />
          )}
          <span className="wo-worker-name" style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-main)' }}>
            {w.nombreTrabajador}
          </span>
        </div>
      )
    },
    {
      header: 'Rol',
      accessor: (w) => (
        <span className="wo-worker-role" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {w.esResponsable ? 'Técnico Responsable' : (w.rol ?? 'Sin Rol')}
        </span>
      )
    },
    {
      header: 'Tipo de Asignación',
      accessor: (w) => (
        w.esResponsable ? (
          <ColorChip
            color="var(--success, #10b981)"
            label="Responsable"
            size="xs"
            variant="soft"
            icon={<ShieldCheck size={12} />}
          />
        ) : (
          <ColorChip
            color="var(--neutral, #6b7280)"
            label="Auxiliar/Operativo"
            size="xs"
            variant="soft"
            icon={<Wrench size={12} />}
          />
        )
      )
    },
    ...(onRemoveWorker ? [{
      header: 'Acciones',
      accessor: (w: TrabajadorAsignado) => (
        <button
          type="button"
          onClick={() => handleRemove(w.idTrabajador)}
          disabled={isLoading || removingId === w.idTrabajador}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--error, #ef4444)',
            padding: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            opacity: removingId === w.idTrabajador ? 0.5 : 1
          }}
          title="Remover trabajador"
        >
          <UserMinus size={15} />
        </button>
      )
    }] : [])
  ];

  return (
    <Card title="Personal Asignado" className="wo-detail-card">
      <div className="wo-workers-section">
        <div style={{ marginBottom: onAddWorker ? '1.25rem' : '0' }}>
          <Table
            data={personalAsignado}
            columns={columns}
            isLoading={isLoading}
            pagination={false}
            showColumnModal={false}
            showTotalRecords={false}
            showRowsPerPage={false}
            fullHeight={false}
            emptyState={
              <p className="wo-empty-text" style={{ margin: 0, padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Aún no hay personal asignado a esta orden de trabajo.
              </p>
            }
          />
        </div>

        {/* Formulario Inline para agregar trabajador */}
        {onAddWorker && (
          <div className="wo-workers-inline-form-box" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <div className="wo-modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              <UserPlus size={14} /> Asignar Nuevo Trabajador
            </div>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="wo-inline-fields-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr auto', gap: '0.6rem', alignItems: 'end' }}>
                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    UUID del Trabajador <span className="wo-modal-required" style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="wo-modal-input"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    placeholder="UUID del técnico"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="wo-modal-field" style={{ margin: 0 }}>
                  <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rol</label>
                  <select
                    className="wo-modal-select"
                    style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                    value={roleId ?? ''}
                    onChange={(e) => handleRoleChange(e.target.value ? Number(e.target.value) : null)}
                    disabled={isLoading}
                  >
                    {ROL_OPTIONS.map((r) => (
                      <option 
                        key={String(r.id)} 
                        value={r.id ?? ''}
                        disabled={r.id === 1 && responsibleExists}
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="xs"
                  disabled={!workerId.trim() || isLoading}
                  leftIcon={<Plus size={12} />}
                  style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#6366f1' }}
                >
                  Asignar
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.1rem 0.2rem' }}>
                <label className="wo-worker-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isResponsible}
                    onChange={(e) => handleResponsibleChange(e.target.checked)}
                    disabled={isLoading || (responsibleExists && !isResponsible)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  <span>Técnico Responsable</span>
                </label>
                {responsibleExists && !isResponsible && (
                  <span className="wo-modal-hint" style={{ fontSize: '0.68rem', color: 'var(--warning, #f59e0b)' }}>
                    Ya existe un responsable asignado.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </Card>
  );
};
