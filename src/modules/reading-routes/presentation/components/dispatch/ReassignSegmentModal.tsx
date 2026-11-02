import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Send } from 'lucide-react';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { User as UserModel } from '@/modules/users/domain/models/User';
import type { RouteAssignment } from '../../../domain/models/RouteAssignment';
import type { ReassignRouteSegmentRequest } from '../../../domain/dto/request/route-requests.dto';
import './ReassignSegmentModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';

export interface ReassignSegmentModalProps {
  isOpen: boolean;
  assignment: RouteAssignment | null;
  onClose: () => void;
  onReassign: (request: ReassignRouteSegmentRequest) => Promise<unknown>;
}

export const ReassignSegmentModal: React.FC<ReassignSegmentModalProps> = ({
  isOpen,
  assignment,
  onClose,
  onReassign,
}) => {
  const { getUsersUseCase } = useUsersContext();
  const { getLiveTrackingAssignmentsUseCase } = useReadingRoutesContext();

  const [operators, setOperators] = useState<UserModel[]>([]);
  const [activeRoutesCountByUser, setActiveRoutesCountByUser] = useState<Record<string, number>>({});
  const [nuevoLecturistaId, setNuevoLecturistaId] = useState<string>('');
  const [secuenciaInicio, setSecuenciaInicio] = useState<number>(1);
  const [secuenciaFin, setSecuenciaFin] = useState<number | ''>('');
  const [motivo, setMotivo] = useState<string>('Redistribución por asistencia en campo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchUsersAndTracking = async () => {
      try {
        const [list, liveAssignments] = await Promise.all([
          getUsersUseCase.execute(100, 0),
          getLiveTrackingAssignmentsUseCase.execute(assignment?.periodoMes || undefined),
        ]);
        if (isMounted) {
          const currentReaderId = assignment?.lecturistaId || assignment?.usuarioId;
          setOperators(list.filter(u => u.userId !== currentReaderId));
          const counts: Record<string, number> = {};
          (liveAssignments || []).forEach(a => {
            const uId = a.usuarioId || a.lecturistaId;
            if (uId && (a.estado === 'ASIGNADA' || a.estado === 'EN_PROCESO')) {
              counts[uId] = (counts[uId] || 0) + 1;
            }
          });
          setActiveRoutesCountByUser(counts);
        }
      } catch (e) {
        console.error('Error al cargar operadores y asignaciones activas:', e);
      }
    };
    void fetchUsersAndTracking();

    if (assignment) {
      const nextSeq = (assignment.lecturasCompletadas || 0) + 1;
      const expectedTotal = assignment.lecturasEsperadas || '';
      queueMicrotask(() => {
        if (isMounted) {
          setSecuenciaInicio(nextSeq);
          setSecuenciaFin(expectedTotal);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, assignment, getUsersUseCase, getLiveTrackingAssignmentsUseCase]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const originId = Number(
      assignment.idAsignacion ??
      (assignment as unknown as { asignacionId?: number }).asignacionId,
    );

    if (!originId || isNaN(originId)) {
      return;
    }

    if (!nuevoLecturistaId) {
      return;
    }

    if (!motivo || motivo.trim().length < 5) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onReassign({
        asignacionId: originId,
        nuevoUsuarioId: nuevoLecturistaId,
        motivo: motivo.trim(),
        secuenciaInicio: Number(secuenciaInicio),
        secuenciaFin: secuenciaFin ? Number(secuenciaFin) : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reassign-modal-overlay" onClick={onClose}>
      <div className="reassign-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="reassign-modal-header">
          <h2 className="reassign-modal-title">
            <ArrowRightLeft size={18} style={{ color: 'var(--accent)' }} />
            Reasignar Segmento de Ruta en Campo
          </h2>
          <Button onClick={onClose} aria-label="Cerrar" leftIcon={<X size={18} />} variant='ghost' size='xs' />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="reassign-modal-body">
            {/* Origin Details */}
            <div className="reassign-origin-box">
              <div className="reassign-origin-row">
                <span className="reassign-origin-label">Ruta Origen:</span>
                <span className="reassign-origin-val">
                  {assignment.codigoRuta} - {assignment.nombreRuta} (Sector {assignment.sector})
                </span>
              </div>
              <div className="reassign-origin-row">
                <span className="reassign-origin-label">Lecturista Actual:</span>
                <span className="reassign-origin-val">
                  {assignment.nombreLecturista || assignment.lecturistaId}
                </span>
              </div>
              <div className="reassign-origin-row">
                <span className="reassign-origin-label">Progreso Actual:</span>
                <span className="reassign-origin-val">
                  {assignment.lecturasCompletadas} completadas / {assignment.lecturasEsperadas} totales ({assignment.lecturasPendientes} pendientes)
                </span>
              </div>
            </div>

            {/* Target Reader */}
            <div className="reassign-field-group">
              <label className="reassign-field-label">Lecturista Destino (Asistencia):</label>
              <select
                className="reassign-field-select"
                required
                value={nuevoLecturistaId}
                onChange={e => setNuevoLecturistaId(e.target.value)}
              >
                <option value="">-- Seleccionar operador disponible --</option>
                {operators.map(op => {
                  const activeCount = activeRoutesCountByUser[op.userId] || 0;
                  const isMaxReached = activeCount >= 3;
                  const name = op.firstName || op.lastName
                    ? `${op.firstName || ''} ${op.lastName || ''}`.trim()
                    : op.username;

                  return (
                    <option
                      key={op.userId}
                      value={op.userId}
                      disabled={isMaxReached}
                    >
                      {name} ({activeCount}/3 rutas activas){isMaxReached ? ' — Límite alcanzado (máx 3)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Sequence Range */}
            <div className="reassign-fields-grid">
              <div className="reassign-field-group">
                <label className="reassign-field-label">Desde Secuencia #:</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="reassign-field-input"
                  value={secuenciaInicio}
                  onChange={e => setSecuenciaInicio(Number(e.target.value))}
                />
              </div>

              <div className="reassign-field-group">
                <label className="reassign-field-label">Hasta Secuencia # (Opcional):</label>
                <input
                  type="number"
                  min={secuenciaInicio}
                  className="reassign-field-input"
                  placeholder="Hasta el final"
                  value={secuenciaFin}
                  onChange={e =>
                    setSecuenciaFin(e.target.value ? Number(e.target.value) : '')
                  }
                />
              </div>
            </div>

            {/* Reason */}
            <div className="reassign-field-group">
              <label className="reassign-field-label">Motivo de Reasignación:</label>
              <textarea
                className="reassign-field-textarea"
                rows={2}
                required
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Ej. Avería de motocicleta, apoyo por final de turno, etc."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="reassign-modal-footer">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant='outline'
              size='xs'
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !nuevoLecturistaId || !secuenciaInicio}
              size='xs'
              leftIcon={<Send size={14} className={isSubmitting ? 'animate-spin' : ''} />}
            >
              {isSubmitting ? 'Reasignando Segmento...' : 'Transferir Segmento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
