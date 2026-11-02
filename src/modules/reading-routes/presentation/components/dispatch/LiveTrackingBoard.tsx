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
  ArrowRightLeft,
  XCircle,
  Play,
  Inbox,
  FilterX,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { RouteAssignment } from '../../../domain/models/RouteAssignment';
import { RouteBadge } from '../common/RouteBadge';
import './LiveTrackingBoard.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import { notify } from '../../utils/notify';
import { useLiveTrackingFilters } from '../../hooks/useLiveTrackingFilters';
import { LiveTrackingFilterPopover } from './LiveTrackingFilterPopover';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

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
  onRefresh: () => void;
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
  onRefresh,
}) => {
  const { resumeRouteAssignmentUseCase } = useReadingRoutesContext();
  const [resumingId, setResumingId] = useState<number | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
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
    filteredCount,
  } = useLiveTrackingFilters(assignments);

  const handleResume = async (idAsignacion: number) => {
    if (onResumeAssignment) {
      onResumeAssignment(idAsignacion);
      return;
    }
    try {
      setResumingId(idAsignacion);
      const res = await resumeRouteAssignmentUseCase.execute(idAsignacion);
      notify.success(res.message || `Asignación #${idAsignacion} reanudada con éxito.`);
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

    assignments.forEach(a => {
      esperadas += a.lecturasEsperadas || 0;
      completadas += a.lecturasCompletadas || 0;
      novedades += a.lecturasNovedad || 0;
    });

    const percent = esperadas > 0 ? Math.round((completadas / esperadas) * 100) : 0;

    return {
      total: assignments.length,
      esperadas,
      completadas,
      novedades,
      percent,
    };
  }, [assignments]);

  const getStatusBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADA':
        return <span className="status-pill status-active">Completada</span>;
      case 'EN_PROCESO':
        return (
          <span
            className="status-pill"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}
          >
            En Progreso
          </span>
        );
      case 'PAUSADA':
        return (
          <span
            className="status-pill"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}
          >
            Pausada
          </span>
        );
      case 'REASIGNADA':
        return (
          <span
            className="status-pill"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontWeight: 700 }}
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
            style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: 'var(--text-secondary)' }}
          >
            Asignada
          </span>
        );
    }
  };

  return (
    <div className="live-tracking-container">
      {/* Header bar */}
      <div className="live-tracking-header">
        <div className="live-tracking-header-left">
          <h2 className="live-tracking-title">
            <Activity size={22} style={{ color: 'var(--accent)' }} />
            Monitoreo en Vivo de Rutas
          </h2>

          <div className="live-tracking-inputs">
            <div className="live-tracking-input-group">
              <Calendar size={15} />
              <span>Fecha:</span>
              <DatePicker
                value={fecha}
                onChange={e => onFechaChange(e)}
                size='small'
              />

            </div>

            <div className="live-tracking-input-group">
              <span>Periodo:</span>
              <DatePicker
                value={periodo}
                onChange={e => onPeriodoChange(e)}
                size='small'
                view='month'
              />
            </div>
          </div>
        </div>

        <div className="live-tracking-header-actions">
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refrescar avance de operadores"
            leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
            variant='dashed'
            size='xs'
          >
            Refrescar
          </Button>
          <Button
            onClick={onOpenMorningDispatch}
            title="Iniciar despacho masivo matutino automático para el día"
            leftIcon={<Send size={14} />}
            size='xs'
          >
            Despacho Matutino
          </Button>
          <Tooltip content={hasActiveFilters ? `${activeFiltersCount} filtro(s) activo(s)` : 'Abrir filtros de monitoreo'}>
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
          <div className="live-kpi-icon-wrapper" style={{ color: 'var(--accent)' }}>
            <Activity size={22} />
          </div>
          <div className="live-kpi-info">
            <span className="live-kpi-value">{metrics.percent}%</span>
            <span className="live-kpi-label">Eficiencia de Avance</span>
          </div>
        </div>
      </div>

      {/* Resumen de resultados y badges de filtros activos */}
      {!isLoading && assignments.length > 0 && (
        <div className="live-tracking-status-bar">
          <div className="live-tracking-status-bar-left">
            <span className="live-tracking-results-count">
              Mostrando <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> rutas
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
                      {availableOperators.find(o => o.id === filters.operatorId)?.name ||
                        filters.operatorId}
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
              {hasActiveFilters ? `Filtros (${activeFiltersCount})` : 'Abrir Filtros'}
            </Button>
          </div>
        </div>
      )}

      {/* Assignments Cards */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
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
            color: 'var(--text-muted)',
          }}
        >
          <Inbox size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            No hay despachos registrados para esta fecha
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            Utilice el botón de "Despacho Matutino" para asignar rutas a los lecturistas.
          </p>
          <Button onClick={onOpenMorningDispatch} leftIcon={<Send size={14} />} size='xs'>
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
            color: 'var(--text-muted)',
          }}
        >
          <FilterX size={44} style={{ margin: '0 auto 0.75rem', color: 'var(--accent)', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            No hay asignaciones que coincidan con los filtros aplicados
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
            Prueba ajustando el término de búsqueda, seleccionando otro estado o restableciendo los filtros para ver las {assignments.length} asignaciones del día.
          </p>
          <Button onClick={resetFilters} leftIcon={<RotateCcw size={14} />} variant="outline" size="xs">
            Restablecer todos los filtros
          </Button>
        </div>
      ) : (
        <div className="live-assignments-grid">
          {filteredAssignments.map(a => {
            const esperadas = a.lecturasEsperadas ?? a.totalPredios ?? 0;
            const completadas = a.lecturasCompletadas ?? a.prediosLeidos ?? 0;
            const pct =
              a.porcentajeAvance ??
              (esperadas > 0
                ? Math.round((completadas / esperadas) * 100)
                : 0);

            const initials = a.nombreLecturista
              ? a.nombreLecturista
                .split(' ')
                .filter(Boolean)
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              : a.usuarioId
                ? a.usuarioId.substring(0, 2).toUpperCase()
                : 'OP';

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
                    <div className="live-reader-avatar">{initials}</div>
                    <div className="live-reader-details">
                      <span className="live-reader-name">
                        {truncateText(readerDisplayName, 17)}
                      </span>
                      <span className="live-reader-role">Lecturista en campo</span>
                    </div>
                  </div>
                  {getStatusBadge(a.estado)}
                </div>

                {/* Route Info */}
                <div className="live-assignment-route-row">
                  <span className="live-assignment-route-code">
                    {a.codigoRuta || `R-${a.rutaId}`}
                  </span>
                  <span className="live-assignment-route-name" title={a.nombreRuta || ''}>
                    {a.nombreRuta || 'Ruta sin nombre'}
                  </span>
                  <RouteBadge sector={a.sector} />
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
                    <div className="live-progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="live-progress-stats">
                    <div className="live-stat-box">
                      <span className="live-stat-val" style={{ color: '#10b981' }}>
                        {a.lecturasCompletadas}
                      </span>
                      <span className="live-stat-lbl">Leídas</span>
                    </div>
                    <div className="live-stat-box">
                      <span className="live-stat-val" style={{ color: '#f59e0b' }}>
                        {a.lecturasPendientes}
                      </span>
                      <span className="live-stat-lbl">Pendientes</span>
                    </div>
                    <div className="live-stat-box">
                      <span className="live-stat-val" style={{ color: '#ef4444' }}>
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
                      lineHeight: '1.25',
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
                        variant='primary'
                        onClick={() => handleResume(a.idAsignacion)}
                        title="Reanudar el recorrido en campo para este mismo lecturista"
                        size='xs'
                        disabled={resumingId === a.idAsignacion}
                        leftIcon={<Play size={13} className={resumingId === a.idAsignacion ? 'animate-spin' : ''} />}
                      >
                        {resumingId === a.idAsignacion ? 'Reanudando...' : 'Reanudar'}
                      </Button>
                    ) : (
                      a.estado !== 'CANCELADA' &&
                      a.estado !== 'COMPLETADA' && (
                        <Button
                          variant='danger'
                          onClick={() => onCancelAssignment(a.idAsignacion)}
                          title="Pausar temporalmente esta asignación"
                          size='xs'
                          leftIcon={<XCircle size={13} />}
                        >
                          Pausar
                        </Button>
                      )
                    )}

                    <Button
                      className="live-btn-action"
                      onClick={() => onOpenReassign(a)}
                      title={
                        (a.lecturasPendientes ?? 0) === 0
                          ? 'No hay lecturas pendientes para transferir'
                          : 'Transferir segmento de acometidas no leídas a otro lecturista'
                      }
                      disabled={
                        a.estado === 'COMPLETADA' ||
                        a.estado === 'CANCELADA' ||
                        (a.lecturasPendientes ?? 0) === 0
                      }
                      variant='ghost'
                      size='xs'
                      leftIcon={<ArrowRightLeft size={13} />}
                    >
                      Reasignar Segmento
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
        onToggleOnlyNovelties={() => setOnlyWithNovelties(prev => !prev)}
        onToggleOnlyPending={() => setOnlyPending(prev => !prev)}
        onSortChange={setSortBy}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
