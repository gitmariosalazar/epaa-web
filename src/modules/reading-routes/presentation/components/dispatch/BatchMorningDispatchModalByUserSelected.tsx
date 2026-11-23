import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Send,
  Zap,
  MapPin,
  Search,
  Check,
  Plus,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { User } from '@/modules/users/domain/models/User';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { BatchMorningDispatchRequest } from '../../../domain/dto/request/route-requests.dto';
import type { BatchDispatchProgress } from '../../../domain/dto/response/route-responses.dto';
import { RouteBadge } from '../common/RouteBadge';
import { BatchDispatchMapPreview } from './BatchDispatchMapPreview';
import {
  OPERATOR_PALETTE,
  getOperatorColor
} from '../map/ReadingRouteMapStyles';
import { notify } from '../../utils/notify';
import { defaultRouteDispatchPolicy } from '../../../domain/policies/RouteDispatchPolicy';
import './BatchMorningDispatchModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { sectors as DEFAULT_SECTORS } from '@/shared/utils/listSectors';
import { Input } from '@/shared/presentation/components/Input/Input';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export interface BatchMorningDispatchModalByOperatorProps {
  isOpen: boolean;
  selectedUserId: string;
  onClose: () => void;
  routes: ReadingRoute[];
  onDispatch: (
    request: BatchMorningDispatchRequest,
    onProgress?: (progress: BatchDispatchProgress) => void
  ) => Promise<unknown>;
}

type FilterTab = 'ALL' | 'UNASSIGNED' | 'ACTIVE_OP' | 'OTHER_OPS';

/**
 * Componente Modal: BatchMorningDispatchModal
 *
 * Enfoque Operator-First (Lecturista céntrico):
 * 1. El supervisor selecciona primero el lecturista deseado.
 * 2. Agrega rutas para ese lecturista haciendo clic en la lista o directamente sobre el polígono en el mapa SIG.
 * 3. Cada lecturista tiene un color identificativo único reflejado en el mapa SIG y en las tarjetas.
 * 4. Pasa al siguiente lecturista para continuar asignando su territorio.
 * 5. Guarda y confirma el despacho masivo con barra de progreso.
 *
 * Clean Architecture & SOLID:
 * - SRP: Separa la gestión del estado operativo de asignación y delega el visor SIG a BatchDispatchMapPreview.
 * - DIP: Obtiene casos de uso a través del contexto sin acoplarse a capas de infraestructura.
 * - OCP: Soporte para paleta extensible y asignaciones dinámicas.
 */
export const BatchMorningDispatchModalByUserSelected: React.FC<
  BatchMorningDispatchModalByOperatorProps
> = ({ isOpen, selectedUserId, onClose, routes, onDispatch }) => {
  const { getUsersUseCase } = useUsersContext();
  const { getLiveTrackingAssignmentsUseCase, getReadingRoutesUseCase } =
    useReadingRoutesContext();

  const currentMonth = useMemo(() => dateService.getCurrentMonthString(), []);
  const todayStr = useMemo(() => dateService.getCurrentDateString(), []);

  // Parámetros de formulario
  const [periodo, setPeriodo] = useState<string>(currentMonth);
  const [fechaProgramada, setFechaProgramada] = useState<string>(todayStr);
  const [selectedSector, setSelectedSector] = useState<number | undefined>(
    undefined
  );

  // Cálculo dinámico y reactivo de límites para Fecha Programada según el Periodo seleccionado
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
    // Al pasar el mes siguiente (m) y día 0, devuelve el último día del mes m
    const lastDayNum = new Date(y, m, 0).getDate();
    const lastDayOfMonth = `${y}-${pad(m)}-${pad(lastDayNum)}`;

    // Si el periodo seleccionado es el mes en curso, no permitir fechas pasadas (desde hoy hasta fin de mes)
    // Si el periodo es un mes futuro (ej. diciembre), todo el mes es hábil (desde el día 1 al último día)
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

      // Si la fecha programada no pertenece al nuevo período, actualizarla automáticamente
      if (currentFechaMonth !== newPeriodo) {
        if (newPeriodo === currentMonth) {
          // Si regresa al mes actual, sincronizar con la fecha de hoy
          setFechaProgramada(todayStr);
        } else {
          // Si pasa a otro mes (ej. diciembre), sincronizar con el primer día del mes
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

  // Operadores y asignaciones de campo
  const [operators, setOperators] = useState<User[]>([]);
  const [baseActiveCountByUser, setBaseActiveCountByUser] = useState<
    Record<string, number>
  >({});
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);

  // Lecturista actualmente seleccionado como objetivo de asignación
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(
    null
  );

  // Mapa de asignaciones: idRuta -> userId (lecturista)
  const [routeAssignments, setRouteAssignments] = useState<
    Record<number, string>
  >({});

  // Ruta enfocada en el visor SIG lateral
  const [selectedRouteIdForMap, setSelectedRouteIdForMap] = useState<
    number | null
  >(null);

  // Búsqueda y filtrado dentro de la lista de rutas
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL');

  // Estado de despacho y progreso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchProgress, setDispatchProgress] =
    useState<BatchDispatchProgress | null>(null);
  const [fallbackRoutes, setFallbackRoutes] = useState<ReadingRoute[]>([]);

  // Rutas frescas consultadas directamente desde la base de datos
  const [dbRoutes, setDbRoutes] = useState<ReadingRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  // Set reactivo de IDs de rutas que ya están asignadas en la base de datos para este período y fecha
  const [dbAssignedRouteIds, setDbAssignedRouteIds] = useState<Set<number>>(
    new Set()
  );

  // Filtrar lecturistas por cargo 'Lecturista' (o todos si no hay ese cargo específico)
  const lecturistaOperators = useMemo(() => {
    const filtered = operators.filter((op) =>
      op.userId === selectedUserId
    );
    return filtered.length > 0 ? filtered : operators;
  }, [operators]);

  // Asignar color único y determinista a cada lecturista
  const operatorColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    lecturistaOperators.forEach((op, index) => {
      map[op.userId] = getOperatorColor(op.userId, index);
    });
    return map;
  }, [lecturistaOperators]);

  // Reset al abrir o cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setDispatchProgress(null);
      setRouteAssignments({});
      setSelectedRouteIdForMap(null);
      setSearchQuery('');
      setFilterTab('ALL');
      setDbAssignedRouteIds(new Set());
    } else {
      const nowMonth = dateService.getCurrentMonthString();
      const nowToday = dateService.getCurrentDateString();
      setPeriodo(nowMonth);
      setFechaProgramada(nowToday);
    }
  }, [isOpen]);

  // Consulta directa a la base de datos de operadores, rutas y asignaciones existentes
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchDatabaseState = async () => {
      setIsLoadingOperators(true);
      setIsLoadingRoutes(true);

      try {
        const [usersRes, trackingRes, routesRes] = await Promise.allSettled([
          getUsersUseCase.execute(100, 0),
          getLiveTrackingAssignmentsUseCase.execute(
            periodo || undefined,
            fechaProgramada || undefined
          ),
          getReadingRoutesUseCase.execute({
            limit: 150,
            activa: true,
            periodo: periodo || undefined
          })
        ]);

        if (!isMounted) return;

        // 1. Cargar operadores
        if (usersRes.status === 'fulfilled') {
          setOperators(usersRes.value || []);
        }

        // 2. Cargar rutas frescas del catálogo desde la base de datos
        if (routesRes.status === 'fulfilled') {
          setDbRoutes(routesRes.value?.items || []);
        }

        // 3. Procesar asignaciones en la base de datos para el período y fecha programada
        const assignedIds = new Set<number>();
        const counts: Record<string, number> = {};

        if (trackingRes.status === 'fulfilled') {
          (trackingRes.value || []).forEach((a) => {
            const uId = a.usuarioId || a.lecturistaId;
            const rId = Number(a.rutaId || (a as any).idRuta);

            const aFecha =
              typeof a.fechaProgramada === 'string'
                ? a.fechaProgramada.split('T')[0]
                : a.fechaProgramada
                  ? new Date(a.fechaProgramada).toISOString().split('T')[0]
                  : null;

            const matchesDate =
              !fechaProgramada || !aFecha || aFecha === fechaProgramada;

            const estado = (a.estado || '').toUpperCase();
            const isActiveAssignment =
              estado !== 'CANCELADA' &&
              estado !== 'NO_ASIGNADA' &&
              estado !== 'SIN_ASIGNAR';

            if (
              uId &&
              matchesDate &&
              (estado === 'ASIGNADA' || estado === 'EN_PROCESO')
            ) {
              counts[uId] = (counts[uId] || 0) + 1;
            }

            if (rId && isActiveAssignment && matchesDate) {
              assignedIds.add(rId);
            }
          });
        }

        // 4. Si el catálogo para este período reporta rutas ya asignadas, consolidarlas
        if (routesRes.status === 'fulfilled') {
          (routesRes.value?.items || []).forEach((r) => {
            const rEstado = (r.estado || '').toUpperCase();
            const hasAssignment =
              Boolean(r.idAsignacion) ||
              (rEstado !== '' &&
                rEstado !== 'NO_ASIGNADA' &&
                rEstado !== 'SIN_ASIGNAR' &&
                rEstado !== 'CANCELADA');

            const isSamePeriod = !r.periodo || r.periodo === periodo;

            if (hasAssignment && isSamePeriod && r.idRuta) {
              assignedIds.add(Number(r.idRuta));
            }
          });
        }

        setBaseActiveCountByUser(counts);
        setDbAssignedRouteIds(assignedIds);
      } catch (err) {
        console.error(
          'Error al consultar estado de rutas en la base de datos:',
          err
        );
      } finally {
        if (isMounted) {
          setIsLoadingOperators(false);
          setIsLoadingRoutes(false);
        }
      }
    };

    void fetchDatabaseState();

    return () => {
      isMounted = false;
    };
  }, [
    isOpen,
    periodo,
    fechaProgramada,
    getUsersUseCase,
    getLiveTrackingAssignmentsUseCase,
    getReadingRoutesUseCase
  ]);

  // Carga de respaldo si no llegaron rutas por props y la base de datos está respondiendo
  useEffect(() => {
    if (!isOpen) return;
    if ((routes && routes.length > 0) || dbRoutes.length > 0) return;
    let isMounted = true;
    const fetchFallbackRoutes = async () => {
      try {
        const response = await getReadingRoutesUseCase.execute({
          limit: 150,
          activa: true
        });
        if (isMounted) {
          setFallbackRoutes(response.items || []);
        }
      } catch (err) {
        console.warn(
          'Error al cargar rutas de respaldo en modal de despacho:',
          err
        );
      }
    };
    void fetchFallbackRoutes();
    return () => {
      isMounted = false;
    };
  }, [isOpen, routes, dbRoutes.length, getReadingRoutesUseCase]);

  // Rutas base: Prioriza las consultadas directamente de la base de datos, luego props y fallback
  const baseRoutes = useMemo(() => {
    if (dbRoutes && dbRoutes.length > 0) return dbRoutes;
    if (routes && routes.length > 0) return routes;
    return fallbackRoutes;
  }, [dbRoutes, routes, fallbackRoutes]);

  // Rutas sin asignar: Excluye de forma estricta todas las rutas que ya tengan asignación en la base de datos
  const unassignedRoutes = useMemo(() => {
    return baseRoutes.filter((r) => {
      const isActiva = (r.activa ?? true) === true;
      if (!isActiva) return false;

      // Si la ruta ya tiene asignación en la BD para este período y fecha, se excluye
      if (dbAssignedRouteIds.has(Number(r.idRuta))) {
        return false;
      }

      return true;
    });
  }, [baseRoutes, dbAssignedRouteIds]);

  // Sectores estándar (1-40) combinados con los sectores de las rutas disponibles
  const sectors = useMemo(() => {
    const set = new Set<number>(DEFAULT_SECTORS.map((s) => s.id));
    (baseRoutes || []).forEach((r) => {
      const sec = r?.sectorId ?? r?.sector;
      if (typeof sec === 'number' && Number.isFinite(sec)) {
        set.add(sec);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [baseRoutes]);

  // Rutas activas y sin asignar del sector seleccionado
  const sectorRoutes = useMemo(() => {
    const getSector = (r: ReadingRoute) => r.sectorId ?? r.sector;

    if (!selectedSector) return unassignedRoutes;
    return unassignedRoutes.filter(
      (r) => Number(getSector(r)) === Number(selectedSector)
    );
  }, [unassignedRoutes, selectedSector]);

  // Lista detallada de lecturistas con estadísticas calculadas en tiempo real
  const operatorsWithStats = useMemo(() => {
    return lecturistaOperators.map((op, idx) => {
      const color =
        operatorColorMap[op.userId] ||
        OPERATOR_PALETTE[idx % OPERATOR_PALETTE.length];
      const name =
        op.firstName || op.lastName
          ? `${op.firstName || ''} ${op.lastName || ''}`.trim()
          : op.username;

      // Rutas asignadas a este operador en este modal
      const assignedRouteIds = Object.entries(routeAssignments)
        .filter(([_, uId]) => uId === op.userId)
        .map(([rId]) => Number(rId));

      const count = assignedRouteIds.length;
      const meters = baseRoutes
        .filter((r) => assignedRouteIds.includes(r.idRuta))
        .reduce((acc, r) => acc + (r.cantidadAcometidas || 0), 0);

      const baseTrackingCount = baseActiveCountByUser[op.userId] || 0;
      const totalActiveCount = baseTrackingCount + count;
      const isMaxReached =
        defaultRouteDispatchPolicy.hasReachedMaxLimit(totalActiveCount);
      const workloadLevel =
        defaultRouteDispatchPolicy.getWorkloadLevel(totalActiveCount);
      const remainingCapacity =
        defaultRouteDispatchPolicy.getRemainingCapacity(totalActiveCount);
      const cardId = op.cardId || '';

      return {
        userId: op.userId,
        username: op.username,
        cardId,
        name,
        color,
        count,
        meters,
        baseTrackingCount,
        totalActiveCount,
        isMaxReached,
        workloadLevel,
        remainingCapacity
      };
    });
  }, [
    lecturistaOperators,
    operatorColorMap,
    routeAssignments,
    baseRoutes,
    baseActiveCountByUser
  ]);

  // Auto-seleccionar primer lecturista por defecto si no hay ninguno seleccionado
  useEffect(() => {
    if (operatorsWithStats.length > 0 && !selectedOperatorId) {
      setSelectedOperatorId(operatorsWithStats[0].userId);
    }
  }, [operatorsWithStats, selectedOperatorId]);

  // Objeto del lecturista activo
  const activeOperator = useMemo(() => {
    if (!selectedOperatorId) return null;
    return (
      operatorsWithStats.find((op) => op.userId === selectedOperatorId) || null
    );
  }, [operatorsWithStats, selectedOperatorId]);

  // Filtrado de rutas según búsqueda y tab seleccionado
  const displayedRoutes = useMemo(() => {
    let list = sectorRoutes;

    // Filtro por tab
    if (filterTab === 'UNASSIGNED') {
      list = list.filter((r) => !routeAssignments[r.idRuta]);
    } else if (filterTab === 'ACTIVE_OP' && selectedOperatorId) {
      list = list.filter(
        (r) => routeAssignments[r.idRuta] === selectedOperatorId
      );
    } else if (filterTab === 'OTHER_OPS' && selectedOperatorId) {
      list = list.filter(
        (r) =>
          Boolean(routeAssignments[r.idRuta]) &&
          routeAssignments[r.idRuta] !== selectedOperatorId
      );
    }

    // Filtro por texto de búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const code = (
          r.codigo ||
          r.codigoRuta ||
          `R-${r.idRuta}`
        ).toLowerCase();
        const name = (r.nombre || r.nombreRuta || '').toLowerCase();
        return code.includes(q) || name.includes(q);
      });
    }

    return list;
  }, [
    sectorRoutes,
    filterTab,
    selectedOperatorId,
    routeAssignments,
    searchQuery
  ]);

  // Contadores de métricas
  const totalAssigned = Object.keys(routeAssignments).length;
  const unassignedCount = sectorRoutes.filter(
    (r) => !routeAssignments[r.idRuta]
  ).length;
  const activeOpAssignedCount = selectedOperatorId
    ? sectorRoutes.filter(
      (r) => routeAssignments[r.idRuta] === selectedOperatorId
    ).length
    : 0;
  const otherOpsAssignedCount = selectedOperatorId
    ? sectorRoutes.filter(
      (r) =>
        Boolean(routeAssignments[r.idRuta]) &&
        routeAssignments[r.idRuta] !== selectedOperatorId
    ).length
    : 0;

  // Acción: Alternar asignación de una ruta para el lecturista activo
  const handleToggleAssignToActiveOperator = useCallback(
    (routeId: number) => {
      if (!selectedOperatorId) return;

      // Si la ruta ya está asignada en la base de datos para esta fecha programada, impedir reasignación no controlada
      if (dbAssignedRouteIds.has(routeId)) {
        notify.warning(
          'Esta ruta ya se encuentra asignada en la base de datos para esta fecha programada.',
          'Ruta ya Asignada'
        );
        return;
      }

      // Si la ruta ya está asignada al activo, permitir quitarla siempre (libera capacidad)
      const isCurrentlyAssignedToActive =
        routeAssignments[routeId] === selectedOperatorId;
      if (!isCurrentlyAssignedToActive) {
        // Validar límite diario de la política
        const baseTracking = baseActiveCountByUser[selectedOperatorId] || 0;
        const currentBatchAssigned = Object.values(routeAssignments).filter(
          (uId) => uId === selectedOperatorId
        ).length;
        const currentTotal = baseTracking + currentBatchAssigned;

        if (!defaultRouteDispatchPolicy.canAssign(currentTotal, 1)) {
          notify.warning(
            defaultRouteDispatchPolicy.getLimitExceededMessage(
              activeOperator?.name
            ),
            'Límite de Asignación'
          );
          return;
        }
      }

      setRouteAssignments((prev) => {
        const next = { ...prev };
        if (next[routeId] === selectedOperatorId) {
          delete next[routeId];
        } else {
          next[routeId] = selectedOperatorId;
        }
        return next;
      });
    },
    [
      selectedOperatorId,
      routeAssignments,
      baseActiveCountByUser,
      activeOperator,
      dbAssignedRouteIds
    ]
  );

  // Acción: Asignar todas las rutas actualmente filtradas al lecturista activo (respetando límite)
  const handleAssignAllFilteredToActive = useCallback(() => {
    if (!selectedOperatorId || displayedRoutes.length === 0) return;

    const baseTracking = baseActiveCountByUser[selectedOperatorId] || 0;
    const currentBatchAssigned = Object.values(routeAssignments).filter(
      (uId) => uId === selectedOperatorId
    ).length;
    const currentTotal = baseTracking + currentBatchAssigned;
    const remainingCapacity =
      defaultRouteDispatchPolicy.getRemainingCapacity(currentTotal);

    if (remainingCapacity <= 0) {
      notify.warning(
        defaultRouteDispatchPolicy.getLimitExceededMessage(
          activeOperator?.name
        ),
        'Límite Diario Alcanzado'
      );
      return;
    }

    const unassignedToThisOp = displayedRoutes.filter(
      (r) => routeAssignments[r.idRuta] !== selectedOperatorId
    );

    if (unassignedToThisOp.length === 0) return;

    const routesToAssign = unassignedToThisOp.slice(0, remainingCapacity);

    setRouteAssignments((prev) => {
      const next = { ...prev };
      routesToAssign.forEach((r) => {
        next[r.idRuta] = selectedOperatorId;
      });
      return next;
    });

    if (unassignedToThisOp.length > remainingCapacity) {
      notify.info(
        `Se asignaron ${routesToAssign.length} rutas hasta alcanzar el límite diario (${defaultRouteDispatchPolicy.maxDailyRoutes} rutas).`,
        'Asignación Parcial'
      );
    }
  }, [
    selectedOperatorId,
    displayedRoutes,
    routeAssignments,
    baseActiveCountByUser,
    activeOperator
  ]);

  // Acción: Limpiar todas las asignaciones del lecturista activo
  const handleClearActiveOperatorRoutes = useCallback(() => {
    if (!selectedOperatorId) return;
    setRouteAssignments((prev) => {
      const next = { ...prev };
      Object.entries(next).forEach(([rId, uId]) => {
        if (uId === selectedOperatorId) {
          delete next[Number(rId)];
        }
      });
      return next;
    });
  }, [selectedOperatorId]);

  // Acción: Pasar al siguiente lecturista (workflow fluido 1 a 1)
  const handleSelectNextOperator = useCallback(() => {
    if (operatorsWithStats.length === 0) return;
    const currentIndex = operatorsWithStats.findIndex(
      (op) => op.userId === selectedOperatorId
    );
    const nextIndex = (currentIndex + 1) % operatorsWithStats.length;
    setSelectedOperatorId(operatorsWithStats[nextIndex].userId);
  }, [operatorsWithStats, selectedOperatorId]);

  // Acción auxiliar: Auto Asignar equitativo (Round-Robin balanceado con observancia de política de dominio)
  const handleAutoAssign = (fullDispatch: boolean = true) => {
    if (lecturistaOperators.length === 0 || sectorRoutes.length === 0) return;
    const newAssignments: Record<number, string> = {};
    const trackingCounts = { ...baseActiveCountByUser };

    for (const route of sectorRoutes) {
      const eligibleOperators = lecturistaOperators.filter((op) => {
        const count = trackingCounts[op.userId] || 0;
        return fullDispatch
          ? !defaultRouteDispatchPolicy.hasReachedMaxLimit(count)
          : count < defaultRouteDispatchPolicy.highLoadThreshold;
      });

      if (eligibleOperators.length === 0) {
        break;
      }

      eligibleOperators.sort((a, b) => {
        const countA = trackingCounts[a.userId] || 0;
        const countB = trackingCounts[b.userId] || 0;
        return countA - countB;
      });

      const bestCandidate = eligibleOperators[0];
      const currentCount = trackingCounts[bestCandidate.userId] || 0;

      newAssignments[route.idRuta] = bestCandidate.userId;
      trackingCounts[bestCandidate.userId] = currentCount + 1;
    }

    const assignedCount = Object.keys(newAssignments).length;
    if (assignedCount < sectorRoutes.length) {
      notify.info(
        `Se distribuyeron ${assignedCount} de ${sectorRoutes.length} rutas respetando el límite máximo diario de ${defaultRouteDispatchPolicy.maxDailyRoutes} rutas por lecturista.`,
        'Distribución Equitativa'
      );
    }

    setRouteAssignments(newAssignments);
  };

  // Guardar y confirmar despacho
  const handleSubmit = async () => {
    if (totalAssigned === 0 || isSubmitting) return;

    const asignaciones = Object.entries(routeAssignments).map(([rId, uId]) => ({
      rutaId: Number(rId),
      lecturistaId: uId
    }));

    const assignedSectors = Array.from(
      new Set(
        asignaciones
          .map((a) => {
            const r = baseRoutes.find((rt) => rt.idRuta === a.rutaId);
            return r?.sectorId ?? r?.sector;
          })
          .filter(
            (s): s is number => typeof s === 'number' && Number.isFinite(s)
          )
      )
    );

    // Si todas las rutas pertenecen a un único sector, enviar ese sector explícito
    const resolvedSector =
      selectedSector ??
      (assignedSectors.length === 1 ? assignedSectors[0] : undefined);

    setIsSubmitting(true);
    setDispatchProgress({
      completed: 0,
      total: asignaciones.length,
      currentChunk: 0,
      totalChunks: Math.ceil(asignaciones.length / 6),
      percent: 0
    });

    try {
      await onDispatch(
        {
          periodo,
          sector: resolvedSector,
          fechaProgramada,
          asignaciones
        },
        (progress) => {
          setDispatchProgress(progress);
        }
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
      <div
        className="morning-dispatch-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="morning-dispatch-header">
          <h2 className="morning-dispatch-title">
            <Send size={18} style={{ color: 'var(--accent)' }} />
            Despacho Masivo Matutino de Rutas (SIG)
          </h2>
          <Button
            variant="danger"
            onClick={onClose}
            aria-label="Cerrar modal"
            leftIcon={<X size={18} />}
            size="xs"
            circle
          />
        </div>

        {/* Body en 2 columnas: Control Operativo Izq y Mapa SIG Der */}
        <div className="morning-dispatch-body">
          {/* Panel Izquierdo */}
          <div className="morning-dispatch-panel-left">
            {/* Parámetros de Sesión y Filtro de Sector */}
            <div className="morning-dispatch-form-grid">
              <div className="morning-form-group">
                <label className="morning-form-label">Periodo (Mes):</label>
                <DatePicker
                  value={periodo}
                  onChange={handlePeriodoChange}
                  view="month"
                  size="small"
                  minDate={currentMonth}
                />
              </div>

              <div className="morning-form-group">
                <label className="morning-form-label">Fecha Programada:</label>
                <DatePicker
                  value={fechaProgramada}
                  onChange={handleFechaProgramadaChange}
                  view="date"
                  size="small"
                  minDate={minDateProgramada}
                  maxDate={maxDateProgramada}
                />
              </div>

              <div className="morning-form-group">
                <label className="morning-form-label">Sector:</label>
                <Select
                  size="small"
                  value={selectedSector ?? ''}
                  onChange={(e) =>
                    setSelectedSector(
                      e.target.value ? Number(e.target.value) : undefined
                    )
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

            {/* SECCIÓN 1: Selección de Lecturista (Operator-First) */}
            <div className="morning-dispatch-operators-section">
              <div className="morning-dispatch-section-header">
                <span>
                  1. Lecturista Seleccionado a Despachar (
                  {operatorsWithStats.length}):
                </span>
                <Button
                  onClick={() => handleAutoAssign(true)}
                  disabled={operatorsWithStats.length === 0}
                  variant="dashed"
                  size="xs"
                  title="Distribuir automáticamente las rutas de forma equitativa entre todos los lecturistas"
                  leftIcon={<Zap size={12} />}
                >
                  Auto-Distribuir
                </Button>
              </div>

              <div className="morning-dispatch-operators-deck">
                {isLoadingOperators ? (
                  <div
                    style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                  >
                    Cargando lecturistas...
                  </div>
                ) : (
                  operatorsWithStats.map((op) => {
                    const isActive = op.userId === selectedOperatorId;
                    const isMaxReached = op.isMaxReached;
                    const isHighLoad = op.workloadLevel === 'HIGH';

                    return (
                      <button
                        key={op.userId}
                        type="button"
                        className={`morning-operator-card-by-user ${isActive ? 'is-active' : ''}`}
                        onClick={() => setSelectedOperatorId(op.userId)}
                        style={{
                          borderColor: isActive ? op.color : undefined,
                          backgroundColor: isActive
                            ? `color-mix(in srgb, ${op.color} 10%, var(--surface))`
                            : undefined
                        }}
                      >
                        <div className="morning-operator-card-header">
                          <div className="morning-operator-card-header-left">
                            <span
                              className="morning-operator-dot"
                              style={{ backgroundColor: op.color }}
                            />
                            <span
                              className="morning-operator-username"
                              style={{ color: op.color }}
                            >
                              {op.username}
                            </span>
                          </div>
                          {isActive && (
                            <span
                              className="morning-operator-active-badge"
                              style={{ backgroundColor: op.color }}
                            >
                              Activo
                            </span>
                          )}
                          {isMaxReached && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                color: '#ef4444',
                                fontWeight: 700,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                padding: '1px 4px',
                                borderRadius: '4px'
                              }}
                              title={`Límite diario alcanzado (${op.totalActiveCount}/${defaultRouteDispatchPolicy.maxDailyRoutes})`}
                            >
                              Máx. ({op.totalActiveCount}/
                              {defaultRouteDispatchPolicy.maxDailyRoutes})
                            </span>
                          )}
                          {isHighLoad && !isMaxReached && !isActive && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                color: '#f59e0b',
                                fontWeight: 700
                              }}
                              title={`Carga alta (${op.totalActiveCount}/${defaultRouteDispatchPolicy.maxDailyRoutes})`}
                            >
                              {op.totalActiveCount}/
                              {defaultRouteDispatchPolicy.maxDailyRoutes}
                            </span>
                          )}
                        </div>

                        <div className="morning-operator-name" title={op.name}>
                          {op.name}
                        </div>

                        <div className="morning-operator-meta">
                          <span>
                            <strong>{op.count}</strong> asignada
                            {op.count === 1 ? '' : 's'}
                          </span>
                          <span>{op.meters} med.</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* SECCIÓN 2: Banner de Trabajo del Lecturista Activo */}
            {activeOperator && (
              <div
                className="morning-active-banner"
                style={{
                  borderColor: activeOperator.color,
                  backgroundColor: `color-mix(in srgb, ${activeOperator.color} 8%, var(--surface))`
                }}
              >
                <div className="morning-active-banner-info">
                  <span
                    className="morning-operator-dot"
                    style={{
                      backgroundColor: activeOperator.color,
                      width: '12px',
                      height: '12px'
                    }}
                  />
                  <div>
                    <span>
                      Asignando rutas a:{' '}
                      <strong style={{ color: activeOperator.color }}>
                        {activeOperator.name}
                      </strong>
                      {activeOperator.isMaxReached && (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.72rem',
                            color: '#ef4444',
                            fontWeight: 700,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          Límite Diario ({activeOperator.totalActiveCount}/
                          {defaultRouteDispatchPolicy.maxDailyRoutes})
                        </span>
                      )}
                    </span>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {activeOperator.count} asignadas en este lote • Total
                      diario:{' '}
                      <strong>
                        {activeOperator.totalActiveCount}/
                        {defaultRouteDispatchPolicy.maxDailyRoutes}
                      </strong>{' '}
                      (previas: {activeOperator.baseTrackingCount}) •{' '}
                      {activeOperator.meters} acometidas
                    </div>
                  </div>
                </div>

                <div className="morning-active-banner-actions">
                  <Button
                    size="xs"
                    variant="dashed"
                    onClick={handleAssignAllFilteredToActive}
                    disabled={
                      displayedRoutes.length === 0 ||
                      activeOperator.isMaxReached
                    }
                    title={
                      activeOperator.isMaxReached
                        ? `Lecturista al límite diario (${defaultRouteDispatchPolicy.maxDailyRoutes}/${defaultRouteDispatchPolicy.maxDailyRoutes})`
                        : 'Asigna todas las rutas posibles de la lista filtrada a este lecturista'
                    }
                  >
                    + Asignar filtradas ({displayedRoutes.length})
                  </Button>
                  {activeOperator.count > 0 && (
                    <Button
                      size="xs"
                      variant="dashed"
                      onClick={handleClearActiveOperatorRoutes}
                      title="Quita todas las rutas asignadas a este lecturista"
                      leftIcon={<RotateCcw size={12} />}
                      color="orange"
                    >
                      Limpiar
                    </Button>
                  )}
                  {operatorsWithStats.length > 1 && (
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={handleSelectNextOperator}
                      title="Pasar al siguiente lecturista"
                      rightIcon={<ArrowRight size={12} />}
                    >
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* SECCIÓN 3: Lista de Rutas para Asignar */}
            <div className="morning-routes-list-container">
              {/* Barra de Filtros y Búsqueda */}
              <div className="morning-routes-filter-bar">
                <div className="morning-routes-search-box">
                  <Input
                    type="text"
                    placeholder="Buscar ruta por código o nombre..."
                    className="morning-routes-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    leftIcon={<Search size={12} />}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: 0
                      }}
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="morning-routes-filter-tabs">
                  <button
                    type="button"
                    className={`morning-routes-filter-tab ${filterTab === 'ALL' ? 'is-active' : ''
                      }`}
                    onClick={() => setFilterTab('ALL')}
                  >
                    Todas ({sectorRoutes.length})
                  </button>
                  <button
                    type="button"
                    className={`morning-routes-filter-tab ${filterTab === 'UNASSIGNED' ? 'is-active' : ''
                      }`}
                    onClick={() => setFilterTab('UNASSIGNED')}
                  >
                    Sin Asignar ({unassignedCount})
                  </button>
                  {activeOperator && (
                    <button
                      type="button"
                      className={`morning-routes-filter-tab ${filterTab === 'ACTIVE_OP' ? 'is-active' : ''
                        }`}
                      onClick={() => setFilterTab('ACTIVE_OP')}
                    >
                      De {activeOperator.name.split(' ')[0]} (
                      {activeOpAssignedCount})
                    </button>
                  )}
                  {otherOpsAssignedCount > 0 && (
                    <button
                      type="button"
                      className={`morning-routes-filter-tab ${filterTab === 'OTHER_OPS' ? 'is-active' : ''
                        }`}
                      onClick={() => setFilterTab('OTHER_OPS')}
                    >
                      Otros ({otherOpsAssignedCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Filas de Rutas */}
              <div className="morning-routes-list-scroll">
                {isLoadingRoutes ? (
                  <div
                    style={{
                      padding: '2.5rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Consultando rutas sin asignar en la base de datos...
                  </div>
                ) : displayedRoutes.length === 0 ? (
                  <div
                    style={{
                      padding: '2.5rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {searchQuery
                      ? 'No se encontraron rutas con el término ingresado.'
                      : unassignedRoutes.length === 0 && dbAssignedRouteIds.size > 0
                        ? 'Todas las rutas activas ya están asignadas en la base de datos para este período y fecha.'
                        : 'No hay rutas para el filtro seleccionado.'}
                  </div>
                ) : (
                  displayedRoutes.map((r) => {
                    const assignedUserId = routeAssignments[r.idRuta];
                    const assignedOp = assignedUserId
                      ? operatorsWithStats.find(
                        (o) => o.userId === assignedUserId
                      )
                      : null;
                    const isAssignedToActive = Boolean(
                      selectedOperatorId &&
                      assignedUserId === selectedOperatorId
                    );
                    const isSelectedForMap = selectedRouteIdForMap === r.idRuta;

                    return (
                      <div
                        key={r.idRuta}
                        className={`morning-route-item-row ${isSelectedForMap ? 'is-selected-for-map' : ''
                          }`}
                        style={{
                          borderLeft: isAssignedToActive
                            ? `4px solid ${activeOperator?.color || 'var(--accent)'}`
                            : assignedOp
                              ? `4px solid ${assignedOp.color}`
                              : undefined
                        }}
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

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {/* Badge de estado de asignación con color del lecturista */}
                          {assignedOp ? (
                            <span
                              className="morning-route-assign-badge"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${assignedOp.color} 18%, transparent)`,
                                color: assignedOp.color,
                                border: `1px solid ${assignedOp.color}`
                              }}
                              title={`Asignada a ${assignedOp.name}`}
                            >
                              <span
                                className="morning-operator-dot"
                                style={{
                                  backgroundColor: assignedOp.color,
                                  width: '6px',
                                  height: '6px'
                                }}
                              />
                              {assignedOp.name}
                            </span>
                          ) : (
                            <span className="morning-route-assign-badge is-unassigned">
                              Sin asignar
                            </span>
                          )}

                          {/* Botón Ver en Mapa */}
                          <Button
                            size="xs"
                            variant={isSelectedForMap ? 'primary' : 'ghost'}
                            onClick={() =>
                              setSelectedRouteIdForMap((prev) =>
                                prev === r.idRuta ? null : r.idRuta
                              )
                            }
                            title={
                              isSelectedForMap
                                ? 'Ruta enfocada en el mapa (clic para deseleccionar)'
                                : 'Ver polígono y acometidas en el mapa'
                            }
                            leftIcon={<MapPin size={12} />}
                          >
                            {isSelectedForMap ? 'En mapa' : 'Mapa'}
                          </Button>

                          {/* Botón Acción para el Lecturista Activo */}
                          {activeOperator && (
                            <button
                              type="button"
                              className="morning-route-action-btn"
                              disabled={
                                !isAssignedToActive &&
                                activeOperator.isMaxReached
                              }
                              onClick={() =>
                                handleToggleAssignToActiveOperator(r.idRuta)
                              }
                              style={{
                                backgroundColor: isAssignedToActive
                                  ? activeOperator.color
                                  : 'transparent',
                                borderColor:
                                  !isAssignedToActive &&
                                    activeOperator.isMaxReached
                                    ? 'var(--border)'
                                    : activeOperator.color,
                                color: isAssignedToActive
                                  ? '#ffffff'
                                  : !isAssignedToActive &&
                                    activeOperator.isMaxReached
                                    ? 'var(--text-muted)'
                                    : activeOperator.color,
                                cursor:
                                  !isAssignedToActive &&
                                    activeOperator.isMaxReached
                                    ? 'not-allowed'
                                    : 'pointer',
                                opacity:
                                  !isAssignedToActive &&
                                    activeOperator.isMaxReached
                                    ? 0.6
                                    : 1
                              }}
                              title={
                                isAssignedToActive
                                  ? `Quitar ruta de ${activeOperator.name}`
                                  : activeOperator.isMaxReached
                                    ? `${activeOperator.name} alcanzó el límite diario (${defaultRouteDispatchPolicy.maxDailyRoutes} rutas)`
                                    : assignedOp
                                      ? `Reasignar de ${assignedOp.name} a ${activeOperator.name}`
                                      : `Asignar a ${activeOperator.name}`
                              }
                            >
                              {isAssignedToActive ? (
                                <>
                                  <Check size={12} />
                                  Quitar
                                </>
                              ) : activeOperator.isMaxReached ? (
                                <>
                                  Máx. (
                                  {defaultRouteDispatchPolicy.maxDailyRoutes}/
                                  {defaultRouteDispatchPolicy.maxDailyRoutes})
                                </>
                              ) : assignedOp ? (
                                <>
                                  <Plus size={12} />
                                  Reasignar
                                </>
                              ) : (
                                <>
                                  <Plus size={12} />
                                  Asignar
                                </>
                              )}
                            </button>
                          )}
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
              routes={unassignedRoutes}
              selectedRouteId={selectedRouteIdForMap}
              onSelectRouteId={setSelectedRouteIdForMap}
              isOpen={isOpen}
              assignments={routeAssignments}
              operatorColors={operatorColorMap}
              activeOperator={activeOperator}
              onToggleAssignRoute={handleToggleAssignToActiveOperator}
              operators={operatorsWithStats}
              dbAssignedRouteIds={dbAssignedRouteIds}
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
                  {dispatchProgress.totalChunks} ({dispatchProgress.completed}{' '}
                  de {dispatchProgress.total} rutas)...
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
              <strong>{totalAssigned}</strong> de {sectorRoutes.length} rutas
              asignadas a{' '}
              <strong>
                {new Set(Object.values(routeAssignments).filter(Boolean)).size}
              </strong>{' '}
              lecturistas
            </div>
          )}

          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <Button
              variant="dashed"
              onClick={onClose}
              disabled={isSubmitting}
              size="xs"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || totalAssigned === 0}
              leftIcon={
                <Send
                  size={14}
                  className={isSubmitting ? 'animate-spin' : ''}
                />
              }
              size="xs"
            >
              {isSubmitting
                ? 'Procesando Despacho...'
                : 'Confirmar y Despachar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
