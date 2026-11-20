import React, { useState, useEffect, useMemo } from 'react';
import { X, Send, CheckSquare, Square, Zap, MapPin } from 'lucide-react';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { User } from '@/modules/users/domain/models/User';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { BatchMorningDispatchRequest } from '../../../domain/dto/request/route-requests.dto';
import type { BatchDispatchProgress } from '../../../domain/dto/response/route-responses.dto';
import { RouteBadge } from '../common/RouteBadge';
import { BatchDispatchMapPreview } from './BatchDispatchMapPreview';
import './BatchMorningDispatchModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { sectors as DEFAULT_SECTORS } from '@/shared/utils/listSectors';

export interface BatchMorningDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: ReadingRoute[];
  onDispatch: (
    request: BatchMorningDispatchRequest,
    onProgress?: (progress: BatchDispatchProgress) => void,
  ) => Promise<unknown>;
}

/**
 * Componente Modal: BatchMorningDispatchModal
 *
 * Arquitectura Limpia (Clean Architecture) y SOLID:
 * - SRP: Orquesta el flujo de despacho matutino, formulario de asignaciones y divide
 *   el layout en panel de control operativo (izq) y visor SIG interactivo (der).
 * - DIP: Obtiene casos de uso a través del Contexto (UseCases) sin depender de HTTP directo.
 * - Modularidad: Delega la visualización del mapa al componente especializado `BatchDispatchMapPreview`.
 */
export const BatchMorningDispatchModal: React.FC<BatchMorningDispatchModalProps> = ({
  isOpen,
  onClose,
  routes,
  onDispatch,
}) => {
  const { getUsersUseCase } = useUsersContext();
  const { getLiveTrackingAssignmentsUseCase, getReadingRoutesUseCase } =
    useReadingRoutesContext();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const todayStr = now.toISOString().split('T')[0];

  const [periodo, setPeriodo] = useState<string>(currentMonth);
  const [fechaProgramada, setFechaProgramada] = useState<string>(todayStr);
  const [selectedSector, setSelectedSector] = useState<number | undefined>(undefined);
  const [operators, setOperators] = useState<User[]>([]);
  const [baseActiveCountByUser, setBaseActiveCountByUser] = useState<Record<string, number>>({});
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState<BatchDispatchProgress | null>(null);
  const [fallbackRoutes, setFallbackRoutes] = useState<ReadingRoute[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setDispatchProgress(null);
    }
  }, [isOpen]);

  // Estado para la ruta actualmente enfocada en el mapa lateral
  const [selectedRouteIdForMap, setSelectedRouteIdForMap] = useState<number | null>(null);

  // Selected routes map: routeId -> lecturistaId
  const [routeAssignments, setRouteAssignments] = useState<Record<number, string>>({});

  // Fallback: Si no se pasaron rutas en props, cargarlas directamente desde el caso de uso
  useEffect(() => {
    if (!isOpen) return;
    if (routes && routes.length > 0) return;
    let isMounted = true;
    const fetchFallbackRoutes = async () => {
      try {
        const response = await getReadingRoutesUseCase.execute({ limit: 150, activa: true });
        if (isMounted) {
          setFallbackRoutes(response.items || []);
        }
      } catch (err) {
        console.warn('Error al cargar rutas de respaldo en modal de despacho:', err);
      }
    };
    void fetchFallbackRoutes();
    return () => {
      isMounted = false;
    };
  }, [isOpen, routes, getReadingRoutesUseCase]);

  const effectiveRoutes = routes && routes.length > 0 ? routes : fallbackRoutes;

  // Al cambiar de sector, limpiar la ruta enfocada en el mapa
  useEffect(() => {
    setSelectedRouteIdForMap(null);
  }, [selectedSector]);

  // Total acumulado por operador (base previa + asignaciones en este modal)
  const currentTotalAssignedByUser = useMemo(() => {
    const counts = { ...baseActiveCountByUser };
    Object.values(routeAssignments).forEach(uId => {
      if (uId) {
        counts[uId] = (counts[uId] || 0) + 1;
      }
    });
    return counts;
  }, [baseActiveCountByUser, routeAssignments]);

  // Load available users and active assignments safely with allSettled
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchUsersAndTracking = async () => {
      setIsLoadingOperators(true);
      try {
        const [usersRes, trackingRes] = await Promise.allSettled([
          getUsersUseCase.execute(100, 0),
          getLiveTrackingAssignmentsUseCase.execute(periodo || undefined),
        ]);
        if (isMounted) {
          if (usersRes.status === 'fulfilled') {
            setOperators(usersRes.value || []);
          }
          if (trackingRes.status === 'fulfilled') {
            const counts: Record<string, number> = {};
            (trackingRes.value || []).forEach(a => {
              const uId = a.usuarioId || a.lecturistaId;
              if (uId && (a.estado === 'ASIGNADA' || a.estado === 'EN_PROCESO')) {
                counts[uId] = (counts[uId] || 0) + 1;
              }
            });
            setBaseActiveCountByUser(counts);
          }
        }
      } catch (err) {
        console.error('Error al cargar operadores y asignaciones en lote:', err);
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
  }, [isOpen, periodo, getUsersUseCase, getLiveTrackingAssignmentsUseCase]);

  // Sectores estándar (1-40) combinados con los sectores de las rutas cargadas
  const sectors = useMemo(() => {
    const set = new Set<number>(DEFAULT_SECTORS.map((s) => s.id));
    (effectiveRoutes || []).forEach((r) => {
      const sec = r?.sectorId ?? r?.sector;
      if (typeof sec === 'number' && Number.isFinite(sec)) {
        set.add(sec);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [effectiveRoutes]);

  // Filter routes based on selectedSector supporting both activa/activo and sectorId/sector
  const filteredRoutes = useMemo(() => {
    const isActiva = (r: ReadingRoute) => (r.activa ?? r.activo ?? true) === true;
    const getSector = (r: ReadingRoute) => r.sectorId ?? r.sector;

    if (!selectedSector) return effectiveRoutes.filter(isActiva);
    return effectiveRoutes.filter(
      r => isActiva(r) && Number(getSector(r)) === Number(selectedSector),
    );
  }, [effectiveRoutes, selectedSector]);

  // Métricas rápidas del sector
  const totalMetersEstimated = useMemo(() => {
    return filteredRoutes.reduce((acc, r) => acc + (r.cantidadAcometidas || 0), 0);
  }, [filteredRoutes]);

  // Auto assign balanceado (Least-Loaded First):
  // Si fullDispatch=true, distribuye TODAS las rutas equitativamente entre los operadores cargados.
  // Si fullDispatch=false, distribuye respetando un límite recomendado de 3 rutas por lecturista.
  const handleAutoAssign = (fullDispatch: boolean = true) => {
    if (operators.length === 0 || filteredRoutes.length === 0) return;
    const newAssignments: Record<number, string> = {};
    const trackingCounts = { ...baseActiveCountByUser };

    for (const route of filteredRoutes) {
      // Ordenar operadores por menor carga acumulada (Least-Loaded First)
      const sortedOperators = [...operators].sort((a, b) => {
        const countA = trackingCounts[a.userId] || 0;
        const countB = trackingCounts[b.userId] || 0;
        return countA - countB;
      });

      const bestCandidate = sortedOperators[0];
      const currentCount = trackingCounts[bestCandidate.userId] || 0;

      if (!fullDispatch && currentCount >= 3) {
        // Se alcanzó el umbral recomendado para todos los operadores
        break;
      }

      newAssignments[route.idRuta] = bestCandidate.userId;
      trackingCounts[bestCandidate.userId] = currentCount + 1;
    }

    setRouteAssignments(newAssignments);
  };

  const handleSelectRouteOperator = (routeId: number, userId: string) => {
    setRouteAssignments(prev => {
      const copy = { ...prev };
      if (!userId) {
        delete copy[routeId];
      } else {
        copy[routeId] = userId;
      }
      return copy;
    });
  };

  const handleToggleAllRoutes = () => {
    const allSelected =
      filteredRoutes.length > 0 &&
      filteredRoutes.every((r) => !!routeAssignments[r.idRuta]);
    if (allSelected) {
      setRouteAssignments({});
    } else {
      handleAutoAssign(true); // Asigna TODAS las rutas disponibles balanceando la carga
    }
  };

  const totalAssigned = Object.keys(routeAssignments).length;

  const handleSubmit = async () => {
    if (totalAssigned === 0 || isSubmitting) return;

    const asignaciones = Object.entries(routeAssignments).map(([rId, uId]) => ({
      rutaId: Number(rId),
      lecturistaId: uId,
    }));

    setIsSubmitting(true);
    setDispatchProgress({
      completed: 0,
      total: asignaciones.length,
      currentChunk: 0,
      totalChunks: Math.ceil(asignaciones.length / 6),
      percent: 0,
    });

    try {
      await onDispatch(
        {
          periodo,
          sector: selectedSector,
          fechaProgramada,
          asignaciones,
        },
        (progress) => {
          setDispatchProgress(progress);
        },
      );
    } catch (err: unknown) {
      console.error('Error al despachar lote matutino:', err);
    } finally {
      setIsSubmitting(false);
      setDispatchProgress(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="morning-dispatch-overlay" onClick={onClose}>
      <div className="morning-dispatch-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="morning-dispatch-header">
          <h2 className="morning-dispatch-title">
            <Send size={18} style={{ color: 'var(--accent)' }} />
            Despacho Masivo Matutino de Rutas (SIG)
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Cerrar modal"
            leftIcon={<X size={18} />}
            size="xs"
          />
        </div>

        {/* Body dividido en 2 columnas: Control Izq y Mapa SIG Der */}
        <div className="morning-dispatch-body">
          {/* Panel Izquierdo: Configuración, Filtros y Tabla de Rutas */}
          <div className="morning-dispatch-panel-left">
            {/* Controles de Formulario */}
            <div className="morning-dispatch-form-grid">
              <div className="morning-form-group">
                <label className="morning-form-label">Periodo (Año-Mes)1:</label>
                <DatePicker
                  value={periodo}
                  onChange={e => setPeriodo(e)}
                  view="month"
                  size='small'
                />
              </div>

              <div className="morning-form-group">
                <label className="morning-form-label">Fecha Programada:</label>
                <DatePicker
                  value={fechaProgramada}
                  onChange={e => setFechaProgramada(e)}
                  view="date"
                  size='small'
                />
              </div>

              <div className="morning-form-group-K">
                <label className="morning-form-label">Sector:</label>
                <Select
                  size='small'
                  value={selectedSector ?? ''}
                  onChange={e =>
                    setSelectedSector(e.target.value ? Number(e.target.value) : undefined)
                  }
                >
                  <option value="">Todos los sectores</option>
                  {sectors.map((sec) => (
                    <option key={sec} value={sec}>
                      Sector {sec}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Barra de Métricas Rápidas */}
            <div className="morning-dispatch-stats-bar">
              <div className="morning-stat-item">
                <span className="morning-stat-label">Rutas Activas</span>
                <span className="morning-stat-val">{filteredRoutes.length}</span>
              </div>
              <div className="morning-stat-item">
                <span className="morning-stat-label">Acometidas Estimadas</span>
                <span className="morning-stat-val">{totalMetersEstimated.toLocaleString()}</span>
              </div>
              <div className="morning-stat-item">
                <span className="morning-stat-label">Lecturistas Listos</span>
                <span className="morning-stat-val">{operators.length}</span>
              </div>
            </div>

            {/* Lista y Asignación de Rutas */}
            <div className="morning-routes-list-container">
              <div className="morning-routes-list-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    onClick={handleToggleAllRoutes}
                    title="Seleccionar o deseleccionar todas"
                    variant="ghost"
                    size="xs"
                    leftIcon={
                      filteredRoutes.length > 0 &&
                        filteredRoutes.every(r => !!routeAssignments[r.idRuta]) ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )
                    }
                  >
                    Todas
                  </Button>
                  <span>Rutas Disponibles ({filteredRoutes.length})</span>
                </div>

                <Button
                  onClick={() => handleAutoAssign(true)}
                  disabled={operators.length === 0}
                  variant="ghost"
                  size="xs"
                  title="Distribuir rutas de forma equitativa entre los lecturistas cargados"
                  leftIcon={<Zap size={12} />}
                >
                  Auto Asignar (Round-Robin)
                </Button>
              </div>

              <div className="morning-routes-list-scroll">
                {filteredRoutes.length === 0 ? (
                  <div
                    style={{
                      padding: '2.5rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No hay rutas activas para el sector seleccionado.
                  </div>
                ) : (
                  filteredRoutes.map(r => {
                    const assignedUser = routeAssignments[r.idRuta] || '';
                    const isSelectedForMap = selectedRouteIdForMap === r.idRuta;

                    return (
                      <div
                        key={r.idRuta}
                        className={`morning-route-item-row ${isSelectedForMap ? 'is-selected-for-map' : ''}`}
                      >
                        <div className="morning-route-item-info">
                          <span className="morning-route-code">
                            {r.codigo || r.codigoRuta || `R-${r.idRuta}`}
                          </span>
                          <span className="morning-route-name">
                            {r.nombre || r.nombreRuta || 'Ruta sin nombre'}
                          </span>
                          <RouteBadge sector={r.sectorId ?? r.sector} />
                          <span className="morning-route-meters-count">
                            {r.cantidadAcometidas || 0} med.
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Button
                            size="xs"
                            variant={isSelectedForMap ? 'primary' : 'ghost'}
                            onClick={() =>
                              setSelectedRouteIdForMap(prev =>
                                prev === r.idRuta ? null : r.idRuta,
                              )
                            }
                            title={
                              isSelectedForMap
                                ? 'Ruta activa en el mapa (clic para quitar)'
                                : 'Ver polígono y acometidas en el mapa'
                            }
                            leftIcon={<MapPin size={12} />}
                          >
                            {isSelectedForMap ? 'En mapa' : 'Mapa'}
                          </Button>

                          <select
                            className="morning-form-select"
                            style={{
                              minWidth: '185px',
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.5rem',
                            }}
                            value={assignedUser}
                            disabled={isLoadingOperators}
                            onChange={e =>
                              handleSelectRouteOperator(r.idRuta, e.target.value)
                            }
                          >
                            <option value="">-- Sin asignar --</option>
                            {operators.map(op => {
                              const count = currentTotalAssignedByUser[op.userId] || 0;
                              const isHeavy = count >= 4;
                              const name =
                                op.firstName || op.lastName
                                  ? `${op.firstName || ''} ${op.lastName || ''}`.trim()
                                  : op.username;

                              return (
                                <option key={op.userId} value={op.userId}>
                                  {name} ({count} ruta{count === 1 ? '' : 's'}){isHeavy ? ' — Carga alta' : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Panel Derecho: Mapa SIG Interactivo de Sectores, Polígonos y Acometidas */}
          <div className="morning-dispatch-panel-right">
            <BatchDispatchMapPreview
              selectedSector={selectedSector}
              routes={effectiveRoutes}
              selectedRouteId={selectedRouteIdForMap}
              onSelectRouteId={setSelectedRouteIdForMap}
              isOpen={isOpen}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="morning-dispatch-footer">
          {dispatchProgress ? (
            <div className="morning-dispatch-progress-container">
              <div className="morning-dispatch-progress-text">
                <span>
                  Despachando lote {dispatchProgress.currentChunk} de{' '}
                  {dispatchProgress.totalChunks} ({dispatchProgress.completed} de{' '}
                  {dispatchProgress.total} rutas)...
                </span>
                <span className="morning-dispatch-progress-percentage">
                  {dispatchProgress.percent}%
                </span>
              </div>
              <div className="morning-dispatch-progress-track">
                <div
                  className="morning-dispatch-progress-bar"
                  style={{ width: `${dispatchProgress.percent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="morning-dispatch-summary">
              <strong>{totalAssigned}</strong> de {filteredRoutes.length} rutas seleccionadas
              para despacho
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting} size="xs">
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || totalAssigned === 0}
              leftIcon={<Send size={14} className={isSubmitting ? 'animate-spin' : ''} />}
              size="xs"
            >
              {isSubmitting ? 'Procesando Despacho...' : 'Confirmar y Despachar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
