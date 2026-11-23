import React, { useMemo, useState } from 'react';
import {
  Activity,
  Calendar,
  Send,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Play,
  Inbox,
  FilterX,
  RotateCcw,
  SlidersHorizontal,
  X,
  User
} from 'lucide-react';
import type { RouteAssignment } from '../../../domain/models/RouteAssignment';
import './LiveTrackingBoard.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import { notify } from '../../utils/notify';
import { useLiveTrackingFilters } from '../../hooks/useLiveTrackingFilters';
import { LiveTrackingFilterPopover } from './LiveTrackingFilterPopover';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaDotCircle, FaRoute } from 'react-icons/fa';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { BiSolidLayerPlus } from 'react-icons/bi';
import { PercentageFormatter } from '@/shared/utils/formatters/PercentageFormatter';
import { BatchMorningDispatchModalByUserSelected } from './BatchMorningDispatchModalByUserSelected';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { BatchMorningDispatchRequest } from '../../../domain/dto/request/route-requests.dto';
import type { BatchDispatchProgress } from '../../../domain/dto/response/route-responses.dto';
import { TbExchangeFilled } from 'react-icons/tb';
import { FaMapLocationDot } from 'react-icons/fa6';
import { ReadingRouteMapModal } from '../map/ReadingRouteMapModal';
import type { UseRouteMapViewModelReturn } from '../../hooks/useRouteMapViewModel';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export interface LiveTrackingBoardProps {
  assignments: RouteAssignment[];
  isLoading: boolean;
  periodo: string;
  fecha: string;
  onPeriodoChange: (p: string) => void;
  onFechaChange: (f: string) => void;
  onOpenMorningDispatch: () => void;
  onOpenReassign: (assignment: RouteAssignment) => void;
  onCancelAssignment: (idAsignacion: number) => void;
  onResumeAssignment?: (idAsignacion: number) => void;
  onViewInMap?: (routeId: number) => void;
  onRefresh: () => void;
  routes?: ReadingRoute[];
  onDispatch?: (
    request: BatchMorningDispatchRequest,
    onProgress?: (progress: BatchDispatchProgress) => void
  ) => Promise<unknown>;

  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
  mapVm?: UseRouteMapViewModelReturn;

}

export interface UserAssignmentsGroup {
  readonly userId: string;
  readonly userName: string;
  readonly userIdentification?: string;
  readonly assignments: RouteAssignment[];
  readonly totalRoutes: number;
  readonly totalEsperadas: number;
  readonly totalCompletadas: number;
  readonly totalPendientes: number;
  readonly totalNovedades: number;
  readonly percent: number;
  readonly period: string;
  readonly date: string;
}

export const LiveTrackingBoard: React.FC<LiveTrackingBoardProps> = ({
  assignments,
  isLoading,
  periodo,
  fecha,

  onPeriodoChange,
  onFechaChange,
  onOpenMorningDispatch,
  onOpenReassign,
  onCancelAssignment,
  onResumeAssignment,
  onViewInMap,
  onRefresh,
  routes = [],
  onDispatch,
  mapVm,
  onAssignRoute,
  onReassignRoute,
}) => {
  const { resumeRouteAssignmentUseCase, executeBatchMorningDispatchUseCase } =
    useReadingRoutesContext();
  const [resumingId, setResumingId] = useState<number | null>(null);
  const [selectedUserForDispatch, setSelectedUserForDispatch] = useState<
    string | null
  >(null);
  const [isUserDispatchModalOpen, setIsUserDispatchModalOpen] =
    useState<boolean>(false);

  const handleOpenDispatchForUser = (userId: string) => {
    setSelectedUserForDispatch(userId);
    setIsUserDispatchModalOpen(true);
  };

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedRouteForMap, setSelectedRouteForMap] =
    useState<ReadingRoute | null>(null);

  const handleViewInMap = (assignment: RouteAssignment) => {
    const found = routes.find((r) => r.idRuta === assignment.rutaId);
    const assignedUser =
      assignment.nombreLecturista ||
      found?.nombreUsuario ||
      found?.usuario ||
      (assignment.usuarioId
        ? `Operador #${String(assignment.usuarioId).substring(0, 8)}`
        : '');

    const routeToView: ReadingRoute = {
      ...(found || {}),
      idRuta: assignment.rutaId,
      codigo:
        assignment.codigoRuta || found?.codigo || `R-${assignment.rutaId}`,
      codigoRuta:
        assignment.codigoRuta || found?.codigoRuta || `R-${assignment.rutaId}`,
      nombre: assignment.nombreRuta || found?.nombre || '',
      nombreRuta: assignment.nombreRuta || found?.nombreRuta || '',
      sectorId:
        assignment.sectorId ??
        assignment.sector ??
        found?.sectorId ??
        found?.sector ??
        0,
      sector:
        assignment.sectorId ??
        assignment.sector ??
        found?.sectorId ??
        found?.sector ??
        0,
      cantidadAcometidas:
        assignment.totalPredios ??
        assignment.lecturasEsperadas ??
        found?.cantidadAcometidas ??
        0,
      tiempoEstimadoHoras: found?.tiempoEstimadoHoras ?? 0,
      colorIdentificador: found?.colorIdentificador || '#0284c7',
      esRural: found?.esRural ?? false,
      activa: found?.activa ?? true,
      poligono: found?.poligono,
      // Datos de asignación en tiempo real (sobreescriben catálogo para reflejar despacho)
      idAsignacion: assignment.idAsignacion,
      estado: assignment.estado || found?.estado || 'ASIGNADA',
      periodo: assignment.periodoMes || found?.periodo || periodo,
      idUsuarioAsignado:
        assignment.usuarioId ||
        assignment.lecturistaId ||
        found?.idUsuarioAsignado,
      nombreUsuario: assignedUser,
      usuario: assignedUser,
      lecturasEsperadas:
        assignment.lecturasEsperadas ??
        assignment.totalPredios ??
        found?.lecturasEsperadas ??
        0,
      lecturasCompletadas:
        assignment.lecturasCompletadas ??
        assignment.prediosLeidos ??
        found?.lecturasCompletadas ??
        0,
      lecturasPendientes:
        assignment.lecturasPendientes ??
        assignment.prediosPendientes ??
        found?.lecturasPendientes ??
        0,
      observacionSupervisor: found?.observacionSupervisor
    };

    setSelectedRouteForMap(routeToView);
    setIsMapModalOpen(true);
    onViewInMap?.(assignment.rutaId);
  };

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const isFilterOpen = Boolean(filterAnchorEl);

  // Hook desacoplado de filtrado y ordenamiento en tiempo real (SRP - Clean Architecture)
  const {
    filters,
    setSearchTerm,
    setEstado,
    setSectorId,
    setOperatorId,
    setOnlyWithNovelties,
    setOnlyPending,
    setSortBy,
    resetFilters,
    filteredAssignments,
    statusCounts,
    availableSectors,
    availableOperators,
    hasActiveFilters,
    activeFiltersCount,
    totalCount,
    filteredCount
  } = useLiveTrackingFilters(assignments);

  const handleResume = async (idAsignacion: number) => {
    if (onResumeAssignment) {
      onResumeAssignment(idAsignacion);
      return;
    }
    try {
      setResumingId(idAsignacion);
      const res = await resumeRouteAssignmentUseCase.execute(idAsignacion);
      notify.success(
        res.message || `Asignación #${idAsignacion} reanudada con éxito.`
      );
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al reanudar asignación: ' + msg);
    } finally {
      setResumingId(null);
    }
  };
  // Aggregate KPIs
  const metrics = useMemo(() => {
    let esperadas = 0;
    let completadas = 0;
    let novedades = 0;

    assignments.forEach((a) => {
      esperadas += a.lecturasEsperadas || 0;
      completadas += a.lecturasCompletadas || 0;
      novedades += a.lecturasNovedad || 0;
    });

    const percent =
      esperadas > 0 ? Math.round((completadas / esperadas) * 100) : 0;

    return {
      total: assignments.length,
      esperadas,
      completadas,
      novedades,
      percent
    };
  }, [assignments]);

  console.log(metrics)

  const getStatusBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADA':
        return <span className="status-pill status-active">Completada</span>;
      case 'EN_PROCESO':
        return (
          <span
            className="status-pill"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#d97706'
            }}
          >
            En Progreso
          </span>
        );
      case 'PAUSADA':
        return (
          <span
            className="status-pill"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontWeight: 700
            }}
          >
            Pausada
          </span>
        );
      case 'REASIGNADA':
        return (
          <span
            className="status-pill"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#8b5cf6',
              fontWeight: 700
            }}
          >
            Reasignada
          </span>
        );
      case 'CANCELADA':
        return <span className="status-pill status-inactive">Cancelada</span>;
      default:
        return (
          <span
            className="status-pill"
            style={{
              backgroundColor: 'rgba(107, 114, 128, 0.15)',
              color: 'var(--text-secondary)'
            }}
          >
            Asignada
          </span>
        );
    }
  };

  // Agrupamiento inmutable de asignaciones por lecturista/usuario (SRP / Clean Architecture)
  const assignmentsGroupedByUser = useMemo<UserAssignmentsGroup[]>(() => {
    const map = new Map<
      string,
      {
        userId: string;
        userName: string;
        userIdentification?: string;
        assignments: RouteAssignment[];
        totalRoutes: number;
        totalEsperadas: number;
        totalCompletadas: number;
        totalPendientes: number;
        totalNovedades: number;
        percent: number;
        period: string;
        date: string;
      }
    >();

    filteredAssignments.forEach((a) => {
      const uId = String(
        a.usuarioId ||
        a.lecturistaId ||
        (a.nombreLecturista ? `name_${a.nombreLecturista}` : 'unassigned')
      );
      const name =
        a.nombreLecturista ||
        (a.usuarioId
          ? `Operador #${String(a.usuarioId).substring(0, 8)}`
          : a.lecturistaId
            ? `Operador #${String(a.lecturistaId).substring(0, 8)}`
            : 'Sin operador asignado');
      const id = a.identificacionUsuario || '';

      const esperadas = a.lecturasEsperadas ?? a.totalPredios ?? 0;
      const completadas = a.lecturasCompletadas ?? a.prediosLeidos ?? 0;
      const pendientes =
        a.lecturasPendientes ??
        (esperadas - completadas > 0 ? esperadas - completadas : 0);
      const novedades = a.lecturasNovedad ?? a.prediosConNovedad ?? 0;

      // Extraer periodo y fecha para el día en que fue programada
      const scheduledDate =
        a.fechaProgramada ||
        (a as any).fecha ||
        (a as any).fecha_programada ||
        fecha;
      const assignmentPeriod =
        a.periodoMes ||
        (a as any).periodo ||
        (a as any).periodo_mes ||
        periodo;

      const formattedDate = scheduledDate
        ? (typeof scheduledDate === 'string' && scheduledDate.includes('T')
            ? scheduledDate.split('T')[0]
            : String(scheduledDate))
        : '';

      let group = map.get(uId);
      if (!group) {
        group = {
          userId: uId,
          userName: name,
          userIdentification: id,
          assignments: [],
          totalRoutes: 0,
          totalEsperadas: 0,
          totalCompletadas: 0,
          totalPendientes: 0,
          totalNovedades: 0,
          percent: 0,
          period: assignmentPeriod || '',
          date: formattedDate || '',
        };
        map.set(uId, group);
      }

      if (!group.period && assignmentPeriod) {
        group.period = assignmentPeriod;
      }
      if (!group.date && formattedDate) {
        group.date = formattedDate;
      }

      if (
        (!group.userName || group.userName.startsWith('Operador #')) &&
        a.nombreLecturista
      ) {
        group.userName = a.nombreLecturista;
      }
      if (!group.userIdentification && a.identificacionUsuario) {
        group.userIdentification = a.identificacionUsuario;
      }

      group.assignments.push(a);
      group.totalEsperadas += esperadas;
      group.totalCompletadas += completadas;
      group.totalPendientes += pendientes;
      group.totalNovedades += novedades;
    });

    return Array.from(map.values()).map((g) => {
      const percent =
        g.totalEsperadas > 0
          ? Math.round((g.totalCompletadas / g.totalEsperadas) * 100)
          : 0;

      return {
        userId: g.userId,
        userName: g.userName,
        userIdentification: g.userIdentification,
        assignments: g.assignments,
        totalRoutes: g.assignments.length,
        totalEsperadas: g.totalEsperadas,
        totalCompletadas: g.totalCompletadas,
        totalPendientes: g.totalPendientes,
        totalNovedades: g.totalNovedades,
        percent: percent,
        period: g.period || periodo,
        date: g.date || fecha,
      };
    });
  }, [filteredAssignments]);


  return (
    <div className="live-tracking-container">
      {/* Header bar */}
      <div className="live-tracking-header">
        <div className="live-tracking-header-left">
          <h2 className="live-tracking-title">
            <Activity size={18} style={{ color: 'var(--accent)' }} />
            Monitoreo de Rutas
          </h2>

          <div className="live-tracking-inputs">
            <div className="live-tracking-input-group">
              <Calendar size={15} />
              <span>Fecha:</span>
              <DatePicker
                value={fecha}
                onChange={(newFecha) => {
                  onFechaChange(newFecha);
                  if (newFecha && /^\d{4}-\d{2}-\d{2}$/.test(newFecha)) {
                    const monthOfDate = newFecha.slice(0, 7);
                    if (monthOfDate !== periodo) {
                      onPeriodoChange(monthOfDate);
                    }
                  }
                }}
                size="small"
              />
            </div>

            <div className="live-tracking-input-group">
              <span>Periodo:</span>
              <DatePicker
                value={periodo}
                onChange={(newPeriodo) => {
                  onPeriodoChange(newPeriodo);
                  if (newPeriodo && fecha) {
                    const currentMonthOfFecha = fecha.slice(0, 7);
                    if (currentMonthOfFecha !== newPeriodo) {
                      const currentMonth = dateService.getCurrentMonthString();
                      if (newPeriodo === currentMonth) {
                        onFechaChange(dateService.getCurrentDateString());
                      } else {
                        onFechaChange(`${newPeriodo}-01`);
                      }
                    }
                  }
                }}
                size="small"
                view="month"
              />
            </div>
          </div>
        </div>

        <div className="live-tracking-header-actions">
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refrescar avance de operadores"
            leftIcon={
              <RefreshCw
                size={14}
                className={isLoading ? 'animate-spin' : ''}
              />
            }
            variant="dashed"
            size="xs"
          >
            Refrescar
          </Button>
          <Button
            onClick={onOpenMorningDispatch}
            title="Iniciar despacho masivo matutino automático para el día"
            leftIcon={<Send size={14} />}
            size="xs"
          >
            Despacho Matutino
          </Button>
          <Tooltip
            content={
              hasActiveFilters
                ? `${activeFiltersCount} filtro(s) activo(s)`
                : 'Abrir filtros de monitoreo'
            }
          >
            <Button
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              variant={hasActiveFilters ? 'primary' : 'dashed'}
              color={hasActiveFilters ? 'primary' : 'amber'}
              size="xs"
              leftIcon={<SlidersHorizontal size={14} />}
            >
              Filtros {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* KPIs Summary Grid */}
      <div className="live-tracking-kpis-grid">
        <div className="live-kpi-card">
          <div className="live-kpi-icon-wrapper">
            <Users size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">{metrics.total}</span>
            <span className="live-kpi-label">Rutas Asignadas</span>
          </div>
        </div>

        <div className="live-kpi-card">
          <div className="live-kpi-icon-wrapper" style={{ color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">{metrics.completadas}</span>
            <span className="live-kpi-label">Medidores Leídos</span>
          </div>
        </div>

        <div className="live-kpi-card">
          <div className="live-kpi-icon-wrapper" style={{ color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">
              {metrics.esperadas - metrics.completadas > 0
                ? metrics.esperadas - metrics.completadas
                : 0}
            </span>
            <span className="live-kpi-label">Lecturas Pendientes</span>
          </div>
        </div>

        <div className="live-kpi-card">
          <div className="live-kpi-icon-wrapper" style={{ color: '#ef4444' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">{metrics.novedades}</span>
            <span className="live-kpi-label">Novedades Reportadas</span>
          </div>
        </div>

        <div className="live-kpi-card">
          <div
            className="live-kpi-icon-wrapper"
            style={{ color: 'var(--accent)' }}
          >
            <Activity size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">{metrics.percent.toFixed(2)}%</span>
            <span className="live-kpi-label">Eficiencia de Avance</span>
          </div>
        </div>
      </div>

      {/* Resumen de resultados y badges de filtros activos */}
      {!isLoading && assignments.length > 0 && (
        <div className="live-tracking-status-bar">
          <div className="live-tracking-status-bar-left">
            <span className="live-tracking-results-count">
              Mostrando <strong>{filteredCount}</strong> de{' '}
              <strong>{totalCount}</strong> rutas
            </span>

            {hasActiveFilters && (
              <div className="live-tracking-active-tags">
                {filters.searchTerm && (
                  <span className="live-filter-tag">
                    <span>Texto: &ldquo;{filters.searchTerm}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro de búsqueda"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {filters.estado !== 'TODOS' && (
                  <span className="live-filter-tag">
                    <span>Estado: {filters.estado}</span>
                    <button
                      type="button"
                      onClick={() => setEstado('TODOS')}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro de estado"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {filters.sectorId !== 'TODOS' && (
                  <span className="live-filter-tag">
                    <span>Sector {filters.sectorId}</span>
                    <button
                      type="button"
                      onClick={() => setSectorId('TODOS')}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro de sector"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {filters.operatorId !== 'TODOS' && (
                  <span className="live-filter-tag">
                    <span>
                      Lecturista:{' '}
                      {availableOperators.find(
                        (o) => o.id === filters.operatorId
                      )?.name || filters.operatorId}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOperatorId('TODOS')}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro de operador"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {filters.onlyWithNovelties && (
                  <span className="live-filter-tag">
                    <span>Con Novedades</span>
                    <button
                      type="button"
                      onClick={() => setOnlyWithNovelties(false)}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {filters.onlyPending && (
                  <span className="live-filter-tag">
                    <span>Con Pendientes</span>
                    <button
                      type="button"
                      onClick={() => setOnlyPending(false)}
                      className="live-filter-tag-remove"
                      title="Eliminar filtro"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  className="live-filter-clear-all"
                  onClick={resetFilters}
                  title="Restablecer todos los filtros"
                >
                  <RotateCcw size={12} /> Limpiar todo
                </button>
              </div>
            )}
          </div>

          <div className="live-tracking-status-bar-right">
            <Button
              variant={hasActiveFilters ? 'primary' : 'outline'}
              size="xs"
              leftIcon={<SlidersHorizontal size={13} />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            >
              {hasActiveFilters
                ? `Filtros (${activeFiltersCount})`
                : 'Abrir Filtros'}
            </Button>
          </div>
        </div>
      )}

      {/* Assignments Cards */}
      {isLoading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--text-muted)'
          }}
        >
          <RefreshCw
            size={32}
            className="animate-spin"
            style={{ margin: '0 auto 0.75rem' }}
          />
          <div>Cargando asignaciones y avance de lecturistas en vivo...</div>
        </div>
      ) : assignments.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-muted)'
          }}
        >
          <Inbox size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-main)',
              marginBottom: '0.25rem'
            }}
          >
            No hay despachos registrados para esta fecha
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Utilice el botón de "Despacho Matutino" para asignar rutas a los
            lecturistas.
          </p>
          <Button
            onClick={onOpenMorningDispatch}
            leftIcon={<Send size={14} />}
            size="xs"
          >
            Asignar Rutas Ahora
          </Button>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-muted)'
          }}
        >
          <FilterX
            size={44}
            style={{
              margin: '0 auto 0.75rem',
              color: 'var(--accent)',
              opacity: 0.8
            }}
          />
          <h3
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-main)',
              marginBottom: '0.35rem'
            }}
          >
            No hay asignaciones que coincidan con los filtros aplicados
          </h3>
          <p
            style={{
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              maxWidth: '480px',
              margin: '0 auto 1.25rem'
            }}
          >
            Prueba ajustando el término de búsqueda, seleccionando otro estado o
            restableciendo los filtros para ver las {assignments.length}{' '}
            asignaciones del día.
          </p>
          <Button
            onClick={resetFilters}
            leftIcon={<RotateCcw size={14} />}
            variant="outline"
            size="xs"
          >
            Restablecer todos los filtros
          </Button>
        </div>
      ) : (
        <div className="live-assignments-by-user">
          {assignmentsGroupedByUser.map((group) => (
            <Card
              key={group.userId}
              accordion
              defaultOpen={false}
              className="live-user-group-card"
              icon={
                <Avatar
                  size="md"
                  name={group.userName}
                />
              }
              title={
                <div className="live-user-card-title">
                  <span className="live-user-card-name">{group.userName}</span>
                  {group.userIdentification && (
                    <ColorChip
                      label={group.userIdentification}
                      size="xs"
                      color="#1097B9"
                      variant="soft"
                      icon={<User size={12} />}
                    />
                  )}
                  {group.period && (
                    <Tooltip content={`Periodo: ${group.period}`} followCursor={false}>
                      <ColorChip
                        label={group.period}
                        size="xs"
                        color="#0284c7"
                        variant="soft"
                        icon={<Calendar size={12} />}
                      />
                    </Tooltip>
                  )}
                  {group.date && (
                    <Tooltip
                      content={`Fecha programada: ${ConverDate(group.date)}`}
                      followCursor={false}
                    >
                      <ColorChip
                        label={ConverDate(group.date)}
                        size="xs"
                        color="#0d9488"
                        variant="soft"
                        icon={<Clock size={12} />}
                      />
                    </Tooltip>
                  )}
                </div>
              }
              subtitle={
                <div className="live-user-card-subtitle">
                  <span>
                    {group.totalRoutes}{' '}
                    {group.totalRoutes === 1 ? 'ruta asignada' : 'rutas asignadas'}
                  </span>
                  <span>•</span>
                  <span>
                    {group.totalCompletadas} de {group.totalEsperadas} medidores (
                    {group.percent}%)
                  </span>
                  {group.totalNovedades > 0 && (
                    <>
                      <span>•</span>
                      <span className="live-user-card-novelties">
                        {group.totalNovedades}{' '}
                        {group.totalNovedades === 1 ? 'novedad' : 'novedades'}
                      </span>
                    </>
                  )}
                </div>
              }
              extra={
                <div className="live-user-card-extra" data-prevent-accordion>

                  <Tooltip
                    content={
                      group.totalRoutes >= 4
                        ? 'Ya se han asignado 4 rutas a este lecturista'
                        : `Asignar rutas a ${group.userName}`
                    }
                    followCursor={false}
                    themeColor={group.totalRoutes >= 4 ? 'gray' : 'cyan'}
                  >
                    <Button
                      variant="dashed"
                      onClick={() => handleOpenDispatchForUser(group.userId)}
                      leftIcon={<BiSolidLayerPlus size={13} />}
                      size="xs"
                      color={group.totalRoutes >= 4 ? 'gray' : 'cyan'}
                      disabled={group.totalRoutes >= 4}
                    >
                      Asignar rutas
                    </Button>
                  </Tooltip>

                  <Tooltip content={`Total de rutas asignadas: ${group.totalRoutes}`}
                    themeColor='blue'
                    followCursor={false}
                  >
                    <ColorChip
                      label={`${group.totalRoutes} ${group.totalRoutes === 1 ? 'ruta' : 'rutas'
                        }`}
                      color="#007bff"
                      variant="soft"
                      size="md"
                      icon={<FaRoute size={11} />}
                    />
                  </Tooltip>
                  <Tooltip content={`Porcentaje de avance: ${group.percent}%`} followCursor={false}
                    themeColor={
                      group.percent === 100
                        ? 'success'
                        : group.percent > 0
                          ? 'warning'
                          : 'gray'
                    }
                  >
                    <ColorChip
                      label={`${PercentageFormatter.formatWithDecimals(group.percent / 100)}`}
                      color={
                        group.percent === 100
                          ? '#10b981'
                          : group.percent > 0
                            ? '#f59e0b'
                            : '#6c757d'
                      }
                      variant="soft"
                      size="md"
                      icon={<FaDotCircle size={9} />}
                    />
                  </Tooltip>
                </div>
              }
            >
              <div className="live-assignments-grid">
                {group.assignments.map((a) => {
                  const esperadas = a.lecturasEsperadas ?? a.totalPredios ?? 0;
                  const completadas = a.lecturasCompletadas ?? a.prediosLeidos ?? 0;
                  const pct =
                    a.porcentajeAvance ??
                    (esperadas > 0 ? Math.round((completadas / esperadas) * 100) : 0);

                  const readerDisplayName =
                    a.nombreLecturista ||
                    (a.usuarioId
                      ? `Operador #${String(a.usuarioId).substring(0, 8)}`
                      : a.lecturistaId
                        ? `Operador #${String(a.lecturistaId).substring(0, 8)}`
                        : 'Lecturista en campo');

                  return (
                    <div key={a.idAsignacion} className="live-assignment-card">
                      {/* Header */}
                      <div className="live-assignment-header">
                        <div className="live-assignment-reader">
                          {/* User */}
                          <div className="route-drawer-user">
                            <Avatar
                              size="sm"
                              name={readerDisplayName || 'Consumidor desconocido'}
                            />
                            <div className="route-drawer-user-name">
                              <Tooltip
                                content={
                                  readerDisplayName || 'Consumidor desconocido'
                                }
                                followCursor={false}
                                themeColor="indigo"
                              >
                                <span className="route-drawer-user-name-text">
                                  {truncateText(readerDisplayName, 25) ||
                                    'Consumidor desconocido'}
                                </span>
                              </Tooltip>
                              <span className="route-drawer-user-id">
                                {a.identificacionUsuario}
                              </span>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(a.estado)}
                      </div>

                      {/* Route Info */}
                      <div className="live-assignment-route-row">
                        <ColorChip
                          label={a.codigoRuta || `R-${a.rutaId}`}
                          color="#007bff"
                          variant="soft"
                          size="xs"
                          icon={<FaRoute size={12} />}
                        />
                        <span
                          className="live-assignment-route-name"
                          title={a.nombreRuta || ''}
                        >
                          {a.nombreRuta || 'Ruta sin nombre'}
                        </span>
                        <ColorChip
                          label={`Sector ${a.sector || 'N/A'}`}
                          color="#6c757d"
                          variant="soft"
                          size="xs"
                          icon={<FaDotCircle size={12} />}
                        />
                      </div>

                      {/* Progress */}
                      <div className="live-progress-container">
                        <div className="live-progress-info">
                          <span>Avance</span>
                          <span>
                            {pct}% ({a.lecturasCompletadas}/{a.lecturasEsperadas})
                          </span>
                        </div>
                        <div className="live-progress-track">
                          <div
                            className="live-progress-fill"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="live-progress-stats">
                          <div className="live-stat-box">
                            <span
                              className="live-stat-val"
                              style={{ color: '#10b981' }}
                            >
                              {a.lecturasCompletadas}
                            </span>
                            <span className="live-stat-lbl">Leídas</span>
                          </div>
                          <div className="live-stat-box">
                            <span
                              className="live-stat-val"
                              style={{ color: '#f59e0b' }}
                            >
                              {a.lecturasPendientes}
                            </span>
                            <span className="live-stat-lbl">Pendientes</span>
                          </div>
                          <div className="live-stat-box">
                            <span
                              className="live-stat-val"
                              style={{ color: '#ef4444' }}
                            >
                              {a.lecturasNovedad}
                            </span>
                            <span className="live-stat-lbl">Novedades</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {a.estado === 'REASIGNADA' ? (
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.08)',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            marginTop: '0.5rem',
                            lineHeight: '1.25'
                          }}
                        >
                          <strong>Transferida:</strong>{' '}
                          {a.motivoReasignacion ||
                            'Acometidas pendientes transferidas a otro lecturista por contingencia.'}
                        </div>
                      ) : (
                        <div className="live-assignment-actions">
                          {a.estado === 'PAUSADA' ? (
                            <Button
                              variant="primary"
                              onClick={() => handleResume(a.idAsignacion)}
                              title="Reanudar el recorrido en campo para este mismo lecturista"
                              size="xs"
                              disabled={resumingId === a.idAsignacion}
                              leftIcon={
                                <Play
                                  size={13}
                                  className={
                                    resumingId === a.idAsignacion
                                      ? 'animate-spin'
                                      : ''
                                  }
                                />
                              }
                            >
                              {resumingId === a.idAsignacion
                                ? 'Reanudando...'
                                : 'Reanudar'}
                            </Button>
                          ) : (
                            a.estado !== 'CANCELADA' &&
                            a.estado !== 'COMPLETADA' && (
                              <Tooltip
                                content="Pausar temporalmente esta asignación"
                                themeColor="danger"
                                followCursor={false}
                              >
                                <Button
                                  variant="danger"
                                  onClick={() => onCancelAssignment(a.idAsignacion)}
                                  size="xs"
                                  leftIcon={<XCircle size={13} />}
                                >
                                  Pausar
                                </Button>
                              </Tooltip>
                            )
                          )}

                          <Tooltip
                            content="Ver polígono y centroide en el Visor GIS"
                            followCursor={false}
                            themeColor="cyan"
                          >
                            <Button
                              variant="dashed"
                              onClick={() => handleViewInMap(a)}
                              leftIcon={<FaMapLocationDot size={13} />}
                              size="xs"
                              color="cyan"
                              circle
                            ></Button>
                          </Tooltip>

                          <Tooltip
                            content={
                              (a.lecturasPendientes ?? 0) === 0
                                ? 'No hay lecturas pendientes para transferir'
                                : 'Transferir segmento de acometidas no leídas a otro lecturista'
                            }
                            themeColor="info"
                            followCursor={false}
                          >
                            <Button
                              className="live-btn-action"
                              onClick={() => onOpenReassign(a)}
                              disabled={
                                a.estado === 'COMPLETADA' ||
                                a.estado === 'CANCELADA' ||
                                (a.lecturasPendientes ?? 0) === 0
                              }
                              variant="ghost"
                              size="xs"
                              leftIcon={<TbExchangeFilled size={13} />}
                            >
                              Reasignar Segmento
                            </Button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para asignar rutas a usuario específico */}
      {isUserDispatchModalOpen && selectedUserForDispatch && (
        <BatchMorningDispatchModalByUserSelected
          isOpen={isUserDispatchModalOpen}
          selectedUserId={selectedUserForDispatch}
          onClose={() => {
            setIsUserDispatchModalOpen(false);
            setSelectedUserForDispatch(null);
          }}
          routes={routes}
          onDispatch={async (req, onProgress) => {
            if (onDispatch) {
              const res = await onDispatch(req, onProgress);
              void onRefresh();
              return res;
            }
            const res = await executeBatchMorningDispatchUseCase.execute(req);
            void onRefresh();
            return res;
          }}
        />
      )}

      {/* PopoverModal de Filtros de Monitoreo */}
      <LiveTrackingFilterPopover
        isOpen={isFilterOpen}
        onClose={() => setFilterAnchorEl(null)}
        anchorElement={filterAnchorEl}
        filters={filters}
        statusCounts={statusCounts}
        availableSectors={availableSectors}
        availableOperators={availableOperators}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        totalCount={totalCount}
        filteredCount={filteredCount}
        onSearchChange={setSearchTerm}
        onEstadoChange={setEstado}
        onSectorChange={setSectorId}
        onOperatorChange={setOperatorId}
        onToggleOnlyNovelties={() => setOnlyWithNovelties((prev) => !prev)}
        onToggleOnlyPending={() => setOnlyPending((prev) => !prev)}
        onSortChange={setSortBy}
        onResetFilters={resetFilters}
      />


      {/* Modal del Visor GIS: Polígono y Centroide de Ruta */}
      {isMapModalOpen && (
        <ReadingRouteMapModal
          isOpen={isMapModalOpen}
          onClose={() => {
            setIsMapModalOpen(false);
            setSelectedRouteForMap(null);
          }}
          selectedRoute={selectedRouteForMap}
          mapVm={mapVm}
          onAssignRoute={onAssignRoute}
          onReassignRoute={onReassignRoute}
        />
      )}
    </div>
  );
};
