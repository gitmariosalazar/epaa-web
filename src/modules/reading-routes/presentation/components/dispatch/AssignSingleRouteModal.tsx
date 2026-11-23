import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, UserPlus, Send } from 'lucide-react';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { User as UserModel } from '@/modules/users/domain/models/User';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { AssignSingleRouteRequest } from '../../../domain/dto/request/route-requests.dto';
import { defaultRouteDispatchPolicy } from '../../../domain/policies/RouteDispatchPolicy';
import { RouteBadge } from '../common/RouteBadge';
import './AssignSingleRouteModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import {
  getRouteAssignmentStatusColor,
  getRouteAssignmentStatusLabel
} from '../../utils/notify';
import { FaDotCircle } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

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
  onAssign
}) => {
  const { getUsersUseCase } = useUsersContext();
  const { getLiveTrackingAssignmentsUseCase } = useReadingRoutesContext();

  const currentMonth = useMemo(() => dateService.getCurrentMonthString(), []);
  const todayStr = useMemo(() => dateService.getCurrentDateString(), []);

  const [periodo, setPeriodo] = useState<string>(currentMonth);
  const [fechaProgramada, setFechaProgramada] = useState<string>(todayStr);
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [operators, setOperators] = useState<UserModel[]>([]);
  const [activeRoutesCountByUser, setActiveRoutesCountByUser] = useState<
    Record<string, number>
  >({});
  const [operatorsAssignedToRoute, setOperatorsAssignedToRoute] = useState<
    Set<string>
  >(new Set());
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Límites dinámicos para Fecha Programada según el Periodo seleccionado
  const { minDateProgramada, maxDateProgramada } = useMemo(() => {
    if (!periodo) {
      return {
        minDateProgramada: todayStr,
        maxDateProgramada: undefined
      };
    }

    const [y, m] = periodo.split('-').map(Number);
    if (isNaN(y) || isNaN(m)) {
      return {
        minDateProgramada: todayStr,
        maxDateProgramada: undefined
      };
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const firstDayOfMonth = `${y}-${pad(m)}-01`;
    const lastDayNum = new Date(y, m, 0).getDate();
    const lastDayOfMonth = `${y}-${pad(m)}-${pad(lastDayNum)}`;

    const isCurrentMonth = periodo === currentMonth;
    const minDate = isCurrentMonth ? todayStr : firstDayOfMonth;
    const maxDate = lastDayOfMonth;

    return {
      minDateProgramada: minDate,
      maxDateProgramada: maxDate
    };
  }, [periodo, currentMonth, todayStr]);

  // Sincroniza automáticamente la fecha programada al cambiar el periodo
  const handlePeriodoChange = useCallback(
    (newPeriodo: string) => {
      setPeriodo(newPeriodo);

      if (!newPeriodo) return;

      const currentFechaMonth = fechaProgramada
        ? fechaProgramada.slice(0, 7)
        : '';

      if (currentFechaMonth !== newPeriodo) {
        if (newPeriodo === currentMonth) {
          setFechaProgramada(todayStr);
        } else {
          setFechaProgramada(`${newPeriodo}-01`);
        }
      }
    },
    [fechaProgramada, currentMonth, todayStr]
  );

  // Mantiene la sincronía bidireccional si se ingresa/selecciona manualmente una fecha de otro mes
  const handleFechaProgramadaChange = useCallback(
    (newDate: string) => {
      setFechaProgramada(newDate);

      if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        const monthOfDate = newDate.slice(0, 7);
        if (monthOfDate !== periodo) {
          setPeriodo(monthOfDate);
        }
      }
    },
    [periodo]
  );

  useEffect(() => {
    if (!isOpen) {
      setUsuarioId('');
    } else {
      const nowMonth = dateService.getCurrentMonthString();
      const nowToday = dateService.getCurrentDateString();
      setPeriodo(nowMonth);
      setFechaProgramada(nowToday);
    }
  }, [isOpen]);

  // Filter operators just by positionName Lecturista
  const lecturistaOperators = useMemo(() => {
    return operators.filter((op) => op.roles.some((role) => role.id === 4));
  }, [operators]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchUsersAndTracking = async () => {
      setIsLoadingOperators(true);
      try {
        const [list, liveAssignments] = await Promise.all([
          getUsersUseCase.execute(100, 0),
          getLiveTrackingAssignmentsUseCase.execute(
            periodo || undefined,
            fechaProgramada || undefined
          )
        ]);
        if (isMounted) {
          setOperators(list);
          const counts: Record<string, number> = {};
          const assignedToThisRoute = new Set<string>();

          (liveAssignments || []).forEach((a) => {
            const uId = a.usuarioId || a.lecturistaId;
            const aFecha =
              typeof a.fechaProgramada === 'string'
                ? a.fechaProgramada.split('T')[0]
                : a.fechaProgramada
                  ? new Date(a.fechaProgramada).toISOString().split('T')[0]
                  : null;
            const matchesDate =
              !fechaProgramada || !aFecha || aFecha === fechaProgramada;
            if (
              uId &&
              matchesDate &&
              (a.estado === 'ASIGNADA' || a.estado === 'EN_PROCESO')
            ) {
              counts[uId] = (counts[uId] || 0) + 1;
            }
            if (
              uId &&
              route &&
              Number(a.rutaId) === Number(route.idRuta) &&
              (a.estado === 'ASIGNADA' ||
                a.estado === 'EN_PROCESO' ||
                a.estado === 'COMPLETADA')
            ) {
              assignedToThisRoute.add(uId);
            }
          });
          setActiveRoutesCountByUser(counts);
          setOperatorsAssignedToRoute(assignedToThisRoute);
        }
      } catch (err) {
        console.error(
          'Error al cargar operadores y asignaciones activas:',
          err
        );
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
  }, [
    isOpen,
    periodo,
    fechaProgramada,
    route,
    getUsersUseCase,
    getLiveTrackingAssignmentsUseCase
  ]);

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
        fechaProgramada
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
      <div className="single-assign-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="single-assign-header">
          <h2 className="single-assign-title">
            <UserPlus size={18} style={{ color: 'var(--accent)' }} />
            Asignar Ruta a Lecturista
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Cerrar panel"
            leftIcon={<X size={18} />}
            size="xs"
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="single-assign-body">
            {/* Route Summary Card */}
            <div className="single-assign-route-card">
              <div className="single-assign-route-info">
                <span className="single-assign-route-code">{codeLabel}</span>
                <span className="single-assign-route-name">{nameLabel}</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '0.2rem'
                  }}
                >
                  <RouteBadge sector={sectorVal} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {route.cantidadAcometidas} medidores estimados
                  </span>
                </div>
              </div>
              <div className="chip-state">
                <ColorChip
                  label={getRouteAssignmentStatusLabel(route.estado)}
                  status={getRouteAssignmentStatusColor(route.estado)}
                  icon={<FaDotCircle size={12} />}
                />
              </div>
            </div>

            {/* Operator Selection */}
            <div className="single-assign-field">
              <label className="single-assign-label">
                Lecturista / Operador:
              </label>
              <select
                className="single-assign-select"
                required
                disabled={isLoadingOperators}
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
              >
                <option value="">
                  {isLoadingOperators
                    ? 'Cargando lecturistas...'
                    : '-- Seleccionar lecturista --'}
                </option>
                {lecturistaOperators.map((op) => {
                  const activeCount = activeRoutesCountByUser[op.userId] || 0;
                  const isAlreadyAssigned = operatorsAssignedToRoute.has(
                    op.userId
                  );
                  const isMaxReached =
                    defaultRouteDispatchPolicy.hasReachedMaxLimit(activeCount);
                  const isDisabled = isMaxReached || isAlreadyAssigned;
                  const name =
                    op.firstName || op.lastName
                      ? `${op.firstName || ''} ${op.lastName || ''}`.trim()
                      : op.username;

                  return (
                    <option
                      key={op.userId}
                      value={op.userId}
                      disabled={isDisabled}
                    >
                      {name} ({activeCount}/
                      {defaultRouteDispatchPolicy.maxDailyRoutes} rutas activas)
                      {isAlreadyAssigned
                        ? ' — Ya asignado a esta ruta'
                        : isMaxReached
                          ? ` — Límite alcanzado (máx ${defaultRouteDispatchPolicy.maxDailyRoutes})`
                          : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Period and Scheduled Date */}
            <div className="single-assign-form-grid">
              <div className="single-assign-field">
                <label className="single-assign-label">
                  Periodo (Año-Mes):
                </label>
                <DatePicker
                  value={periodo}
                  onChange={handlePeriodoChange}
                  view="month"
                  size="small"
                  minDate={currentMonth}
                />
              </div>

              <div className="single-assign-field">
                <label className="single-assign-label">Fecha Programada:</label>
                <DatePicker
                  value={fechaProgramada}
                  onChange={handleFechaProgramadaChange}
                  view="date"
                  size="small"
                  minDate={minDateProgramada}
                  maxDate={maxDateProgramada}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="single-assign-footer">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              leftIcon={<X size={14} />}
              size="xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !usuarioId}
              leftIcon={
                <Send
                  size={14}
                  className={isSubmitting ? 'animate-spin' : ''}
                />
              }
              size="xs"
            >
              {isSubmitting ? 'Asignando Ruta...' : 'Confirmar Asignación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
