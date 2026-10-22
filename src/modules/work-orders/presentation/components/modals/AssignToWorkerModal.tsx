/**
 * AssignToWorkerModal — Asignación de Técnico Responsable
 *
 * SRP: formulario para asignar OT a técnico individual.
 * Command: AssignWorkOrderToWorkerCommand { workOrderId, workerId, assignedByUserId, comment? }
 */
import React, { useEffect, useState, useMemo } from 'react';
import {
  User,
  UserCheck,
  Wrench,
  Calendar,
  FileText,
  CheckCircle2,
  Layers,
  Mail,
  Phone,
} from 'lucide-react';
import { WoModalShell } from './WoModalShell';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import type { User as UserModel } from '@/modules/users/domain/models/User';
import { SearchableSelect } from '@/shared/presentation/components/Input/SearchableSelect';
import type { OrdenTrabajoDetalle } from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import '../../styles/AssignToWorkerModal.css';
import { MdCable } from 'react-icons/md';
import { Button } from '@/shared/presentation/components/Button/Button';

interface AssignToWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  workOrder?: OrdenTrabajoDetalle;
  onSubmit: (workerId: string, comment: string) => Promise<void>;
  isLoading?: boolean;
}

const getInitials = (firstName?: string, lastName?: string, fallback = 'U'): string => {
  const f = (firstName || '').trim().charAt(0);
  const l = (lastName || '').trim().charAt(0);
  const res = `${f}${l}`.toUpperCase();
  return res || fallback.charAt(0).toUpperCase();
};

const getPriorityMeta = (priority?: string) => {
  const p = (priority || '').toUpperCase();
  switch (p) {
    case 'EMERGENCIA':
      return { label: 'Emergencia', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)', icon: '⚡' };
    case 'URGENTE':
      return { label: 'Urgente', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)', icon: '🔴' };
    case 'ALTA':
      return { label: 'Alta', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.25)', icon: '🟠' };
    case 'MEDIA':
      return { label: 'Media', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', icon: '🟡' };
    case 'BAJA':
    default:
      return { label: priority || 'Normal', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.25)', icon: '🔵' };
  }
};

export const AssignToWorkerModal: React.FC<AssignToWorkerModalProps> = ({
  isOpen,
  onClose,
  workOrderId,
  workOrder,
  onSubmit,
  isLoading = false,
}) => {
  const [workerId, setWorkerId] = useState('');
  const [comment, setComment] = useState('');
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const { getUsersUseCase } = useUsersContext();
  const [users, setUsers] = useState<UserModel[]>([]);

  // Limpiar campos al abrir/cambiar OT
  useEffect(() => {
    if (isOpen) {
      setWorkerId('');
      setComment('');
    }
  }, [isOpen, workOrderId]);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      setIsUsersLoading(true);
      try {
        const fetchedUsers = await getUsersUseCase.execute();
        if (isMounted) setUsers(fetchedUsers || []);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        if (isMounted) setIsUsersLoading(false);
      }
    };
    if (isOpen) {
      loadUsers();
    }
    return () => {
      isMounted = false;
    };
  }, [getUsersUseCase, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim() || isLoading) return;
    await onSubmit(workerId.trim(), comment.trim());
  };

  const selectedWorker = useMemo(
    () => users.find((u) => u.userId === workerId),
    [users, workerId]
  );

  const userOptions = useMemo(
    () =>
      users
        .filter((user) => user.isActive !== false)
        .map((user) => {
          const fullName = `${user.firstName?.toUpperCase() ?? ''} ${user.lastName?.toUpperCase() ?? ''}`.trim() || user.username;
          const position = user.positionName ? ` — ${user.positionName}` : '';
          return {
            value: user.userId,
            label: `${fullName}${position}`,
          };
        }),
    [users]
  );

  // Datos amigables de la orden
  const clientDisplayName =
    workOrder?.person
      ? `${workOrder.person.firstName} ${workOrder.person.lastName}`.trim()
      : workOrder?.company?.businessName ??
      workOrder?.codigoEntidadOrigen ??
      (workOrder?.idEntidadOrigen ? `Cliente (${workOrder.idEntidadOrigen.substring(0, 8)}...)` : 'Cliente no especificado');

  const clientDoc = workOrder?.person?.personId ?? workOrder?.company?.ruc ?? null;

  const cadastralKeyText = workOrder?.claveCatastral || 'N/A';

  const formattedDate = workOrder?.fechaCreacion
    ? new Date(workOrder.fechaCreacion).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : null;

  const priorityMeta = getPriorityMeta(workOrder?.prioridad);

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Técnico Responsable"
      subtitle={workOrder?.codigoOrden ? `Orden de Trabajo #${workOrder.codigoOrden}` : `OT: ${workOrderId}`}
      color="#6366f1"
      maxWidth="540px"
    >
      <div className="atw-container">
        {/* ── Tarjeta Resumen de la Orden ────────────────────────────── */}
        <div className="atw-order-card">
          <div className="atw-order-header">
            <div className="atw-order-id-group">
              <span className="atw-order-code">
                {workOrder?.codigoOrden ?? workOrderId.substring(0, 8)}
              </span>
              {workOrder?.tipoTrabajo && (
                <span className="atw-order-type-badge">
                  <Wrench size={12} />
                  {workOrder.tipoTrabajo}
                </span>
              )}
            </div>

            <div className="atw-order-badges">
              {workOrder?.prioridad && (
                <span
                  className="atw-priority-pill"
                  style={{
                    backgroundColor: priorityMeta.bg,
                    color: priorityMeta.color,
                    borderColor: priorityMeta.border,
                  }}
                >
                  <span>{priorityMeta.icon}</span>
                  {priorityMeta.label}
                </span>
              )}

              {workOrder?.estado && (
                <span className="atw-status-pill">
                  {workOrder.estadoLabel || workOrder.estado}
                </span>
              )}
            </div>
          </div>

          <div className="atw-order-grid">
            <div className="atw-info-item">
              <User size={14} className="atw-info-icon" />
              <div className="atw-info-content">
                <span className="atw-info-label">Cliente</span>
                <span className="atw-info-value" title={clientDisplayName}>
                  {clientDisplayName}
                  {clientDoc && ` (${clientDoc})`}
                </span>
              </div>
            </div>

            <div className="atw-info-item">
              <MdCable size={14} className="atw-info-icon" />
              <div className="atw-info-content">
                <span className="atw-info-label">Clave Catastral</span>
                <span className="atw-info-value" title={cadastralKeyText}>
                  {cadastralKeyText}
                </span>
              </div>
            </div>

            <div className="atw-info-item">
              <Layers size={14} className="atw-info-icon" />
              <div className="atw-info-content">
                <span className="atw-info-label">Departamento</span>
                <span className="atw-info-value">
                  {workOrder?.departamento || 'Operativo'}
                </span>
              </div>
            </div>

            <div className="atw-info-item">
              <Calendar size={14} className="atw-info-icon" />
              <div className="atw-info-content">
                <span className="atw-info-label">Fecha Registro</span>
                <span className="atw-info-value">
                  {formattedDate || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Formulario de Asignación ───────────────────────────────── */}
        <form onSubmit={handleSubmit} className="wo-modal-form">
          <div className="atw-field-group">
            <div className="atw-field-label">
              <div className="atw-label-left">
                <UserCheck size={14} className="atw-label-icon" />
                <span>Técnico Responsable <span className="wo-modal-required">*</span></span>
              </div>
              <span className="atw-count-badge">
                {isUsersLoading ? 'Cargando...' : `${userOptions.length} disponibles`}
              </span>
            </div>

            <SearchableSelect
              options={userOptions}
              placeholder="Buscar técnico por nombre, apellido o cargo..."
              size="small"
              value={workerId}
              onChange={(value) => setWorkerId(String(value))}
              disabled={isLoading || isUsersLoading}
            />

            {/* Vista previa atractiva del técnico seleccionado */}
            {selectedWorker && (
              <div className="atw-worker-preview">
                <div className="atw-worker-main">
                  <div className="atw-avatar">
                    {getInitials(selectedWorker.firstName, selectedWorker.lastName, selectedWorker.username)}
                    <span className="atw-avatar-online" title="Técnico activo" />
                  </div>
                  <div className="atw-worker-details">
                    <span className="atw-worker-name">
                      {`${selectedWorker.firstName ?? ''} ${selectedWorker.lastName ?? ''}`.trim() || selectedWorker.username}
                    </span>
                    <div className="atw-worker-meta">
                      {selectedWorker.positionName && (
                        <span className="atw-worker-position-tag">
                          {selectedWorker.positionName}
                        </span>
                      )}
                      {selectedWorker.email && (
                        <span className="atw-worker-contact">
                          <Mail size={11} />
                          {selectedWorker.email}
                        </span>
                      )}
                      {selectedWorker.internalPhone && (
                        <span className="atw-worker-contact">
                          <Phone size={11} />
                          {selectedWorker.internalPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="atw-worker-badge-assigned">
                  <CheckCircle2 size={13} />
                  <span>Responsable asignado</span>
                </div>
              </div>
            )}
          </div>

          <div className="atw-field-group" style={{ marginTop: '0.4rem' }}>
            <div className="atw-field-label">
              <div className="atw-label-left">
                <FileText size={14} className="atw-label-icon" />
                <span>Instrucciones / Observaciones</span>
              </div>
              <span className="atw-optional-badge">(Opcional)</span>
            </div>
            <div className="atw-textarea-wrapper">
              <textarea
                id="wo-assign-worker-comment"
                className="atw-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Indica observaciones clave, prioridades de acceso o herramientas necesarias para la ejecución..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="atw-actions">
            <Button
              type="button"
              variant='dashed'
              color='red'
              size='xs'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant='info'
              size='xs'
              disabled={!workerId.trim() || isLoading}
            >
              <UserCheck size={16} />
              {isLoading ? 'Asignando Técnico...' : 'Asignar Técnico'}
            </Button>
          </div>
        </form>
      </div>
    </WoModalShell>
  );
};
