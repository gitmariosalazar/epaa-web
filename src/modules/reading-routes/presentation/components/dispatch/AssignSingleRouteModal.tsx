import React, { useState, useEffect } from 'react';
import { X, UserPlus, Send } from 'lucide-react';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { User as UserModel } from '@/modules/users/domain/models/User';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { AssignSingleRouteRequest } from '../../../domain/dto/request/route-requests.dto';
import { RouteBadge } from '../common/RouteBadge';
import './AssignSingleRouteModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

export interface AssignSingleRouteModalProps {
  isOpen: boolean;
  route: ReadingRoute | null;
  onClose: () => void;
  onAssign: (request: AssignSingleRouteRequest) => Promise<unknown>;
}

export const AssignSingleRouteModal: React.FC<AssignSingleRouteModalProps> = ({
  isOpen,
  route,
  onClose,
  onAssign,
}) => {
  const { getUsersUseCase } = useUsersContext();
  const { getLiveTrackingAssignmentsUseCase } = useReadingRoutesContext();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const todayStr = now.toISOString().split('T')[0];

  const [periodo, setPeriodo] = useState<string>(currentMonth);
  const [fechaProgramada, setFechaProgramada] = useState<string>(todayStr);
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [operators, setOperators] = useState<UserModel[]>([]);
  const [activeRoutesCountByUser, setActiveRoutesCountByUser] = useState<Record<string, number>>({});
  const [operatorsAssignedToRoute, setOperatorsAssignedToRoute] = useState<Set<string>>(new Set());
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchUsersAndTracking = async () => {
      setIsLoadingOperators(true);
      try {
        const [list, liveAssignments] = await Promise.all([
          getUsersUseCase.execute(100, 0),
          getLiveTrackingAssignmentsUseCase.execute(periodo || undefined),
        ]);
        if (isMounted) {
          setOperators(list);
          const counts: Record<string, number> = {};
          const assignedToThisRoute = new Set<string>();

          (liveAssignments || []).forEach(a => {
            const uId = a.usuarioId || a.lecturistaId;
            if (uId && (a.estado === 'ASIGNADA' || a.estado === 'EN_PROCESO')) {
              counts[uId] = (counts[uId] || 0) + 1;
            }
            if (
              uId &&
              route &&
              Number(a.rutaId) === Number(route.idRuta) &&
              (a.estado === 'ASIGNADA' || a.estado === 'EN_PROCESO' || a.estado === 'COMPLETADA')
            ) {
              assignedToThisRoute.add(uId);
            }
          });
          setActiveRoutesCountByUser(counts);
          setOperatorsAssignedToRoute(assignedToThisRoute);
        }
      } catch (err) {
        console.error('Error al cargar operadores y asignaciones activas:', err);
      } finally {
        if (isMounted) {
          setIsLoadingOperators(false);
        }
      }
    };
    void fetchUsersAndTracking();
    return () => {
      isMounted = false;
    };
  }, [isOpen, periodo, route, getUsersUseCase, getLiveTrackingAssignmentsUseCase]);

  if (!isOpen || !route) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId) return;

    setIsSubmitting(true);
    try {
      await onAssign({
        rutaId: route.idRuta,
        usuarioId,
        periodo,
        fechaProgramada,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const codeLabel = route.codigoRuta || route.codigo || `R-${route.idRuta}`;
  const nameLabel = route.nombreRuta || route.nombre || 'Ruta sin nombre';
  const sectorVal = route.sector || route.sectorId;

  return (
    <div className="single-assign-overlay" onClick={onClose}>
      <div className="single-assign-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="single-assign-header">
          <h2 className="single-assign-title">
            <UserPlus size={18} style={{ color: 'var(--accent)' }} />
            Asignar Ruta a Lecturista
          </h2>
          <Button variant='ghost' onClick={onClose} aria-label="Cerrar panel" leftIcon={<X size={18} />} size='xs' />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="single-assign-body">
            {/* Route Summary Card */}
            <div className="single-assign-route-card">
              <div className="single-assign-route-info">
                <span className="single-assign-route-code">{codeLabel}</span>
                <span className="single-assign-route-name">{nameLabel}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <RouteBadge sector={sectorVal} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {route.cantidadAcometidas} medidores estimados
                  </span>
                </div>
              </div>
            </div>

            {/* Operator Selection */}
            <div className="single-assign-field">
              <label className="single-assign-label">Lecturista / Operador:</label>
              <select
                className="single-assign-select"
                required
                disabled={isLoadingOperators}
                value={usuarioId}
                onChange={e => setUsuarioId(e.target.value)}
              >
                <option value="">
                  {isLoadingOperators ? 'Cargando lecturistas...' : '-- Seleccionar lecturista --'}
                </option>
                {operators.map(op => {
                  const activeCount = activeRoutesCountByUser[op.userId] || 0;
                  const isAlreadyAssigned = operatorsAssignedToRoute.has(op.userId);
                  const isMaxReached = activeCount >= 3;
                  const isDisabled = isMaxReached || isAlreadyAssigned;
                  const name = op.firstName || op.lastName
                    ? `${op.firstName || ''} ${op.lastName || ''}`.trim()
                    : op.username;

                  return (
                    <option
                      key={op.userId}
                      value={op.userId}
                      disabled={isDisabled}
                    >
                      {name} ({activeCount}/3 rutas activas)
                      {isAlreadyAssigned
                        ? ' — Ya asignado a esta ruta'
                        : isMaxReached
                          ? ' — Límite alcanzado (máx 3)'
                          : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Period and Scheduled Date */}
            <div className="single-assign-form-grid">
              <div className="single-assign-field">
                <label className="single-assign-label">Periodo (Año-Mes):</label>
                <DatePicker
                  value={periodo}
                  onChange={e => setPeriodo(e)}
                  view="month"
                  size='small'
                />
              </div>

              <div className="single-assign-field">
                <label className="single-assign-label">Fecha Programada:</label>
                <DatePicker
                  value={fechaProgramada}
                  onChange={e => setFechaProgramada(e)}
                  view="date"
                  size='small'
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="single-assign-footer">
            <Button
              type="button"
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
              leftIcon={<X size={14} />}
              size='xs'
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !usuarioId}
              leftIcon={<Send size={14} className={isSubmitting ? 'animate-spin' : ''} />}
              size='xs'
            >
              {isSubmitting ? 'Asignando Ruta...' : 'Confirmar Asignación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
