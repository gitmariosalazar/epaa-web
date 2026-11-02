import { useMemo, useState, useCallback } from 'react';
import type { RouteAssignment, RouteAssignmentStatus } from '../../domain/models/RouteAssignment';
import type {
  FilterOperatorOption,
  LiveTrackingFilterCriteria,
  LiveTrackingSortOption,
  LiveTrackingStatusCounts,
} from '../../domain/models/LiveTrackingFilterCriteria';

const INITIAL_CRITERIA: LiveTrackingFilterCriteria = {
  searchTerm: '',
  estado: 'TODOS',
  sectorId: 'TODOS',
  operatorId: 'TODOS',
  onlyWithNovelties: false,
  onlyPending: false,
  sortBy: 'DEFAULT',
};

export interface UseLiveTrackingFiltersReturn {
  filters: LiveTrackingFilterCriteria;
  setSearchTerm: (term: string) => void;
  setEstado: (estado: RouteAssignmentStatus | 'TODOS') => void;
  setSectorId: (sectorId: number | 'TODOS') => void;
  setOperatorId: (opId: string | 'TODOS') => void;
  setOnlyWithNovelties: (val: boolean | ((prev: boolean) => boolean)) => void;
  setOnlyPending: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSortBy: (sort: LiveTrackingSortOption) => void;
  resetFilters: () => void;
  filteredAssignments: RouteAssignment[];
  statusCounts: LiveTrackingStatusCounts;
  availableSectors: number[];
  availableOperators: FilterOperatorOption[];
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  totalCount: number;
  filteredCount: number;
}

export const useLiveTrackingFilters = (
  assignments: RouteAssignment[],
): UseLiveTrackingFiltersReturn => {
  const [filters, setFilters] = useState<LiveTrackingFilterCriteria>(INITIAL_CRITERIA);

  // Setters con inmutabilidad
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setEstado = useCallback((estado: RouteAssignmentStatus | 'TODOS') => {
    setFilters(prev => ({ ...prev, estado }));
  }, []);

  const setSectorId = useCallback((sectorId: number | 'TODOS') => {
    setFilters(prev => ({ ...prev, sectorId }));
  }, []);

  const setOperatorId = useCallback((operatorId: string | 'TODOS') => {
    setFilters(prev => ({ ...prev, operatorId }));
  }, []);

  const setOnlyWithNovelties = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      setFilters(prev => ({
        ...prev,
        onlyWithNovelties: typeof val === 'function' ? val(prev.onlyWithNovelties) : val,
      }));
    },
    [],
  );

  const setOnlyPending = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      setFilters(prev => ({
        ...prev,
        onlyPending: typeof val === 'function' ? val(prev.onlyPending) : val,
      }));
    },
    [],
  );

  const setSortBy = useCallback((sortBy: LiveTrackingSortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_CRITERIA);
  }, []);

  // 1. Extraer sectores únicos disponibles en los datos actuales
  const availableSectors = useMemo<number[]>(() => {
    const sectorsSet = new Set<number>();
    assignments.forEach(a => {
      const s = a.sector ?? a.sectorId;
      if (typeof s === 'number' && !isNaN(s)) {
        sectorsSet.add(s);
      }
    });
    return Array.from(sectorsSet).sort((a, b) => a - b);
  }, [assignments]);

  // 2. Extraer lecturistas únicos disponibles en los datos actuales
  const availableOperators = useMemo<FilterOperatorOption[]>(() => {
    const map = new Map<string, FilterOperatorOption>();
    assignments.forEach(a => {
      const uId = a.usuarioId || a.lecturistaId;
      if (!uId) return;

      const name =
        a.nombreLecturista ||
        `Operador #${String(uId).substring(0, 8)}`;

      const current = map.get(uId);
      if (current) {
        current.routeCount += 1;
      } else {
        map.set(uId, { id: uId, name, routeCount: 1 });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [assignments]);

  // 3. Conteo global por estado para pills / badges rápidos
  const statusCounts = useMemo<LiveTrackingStatusCounts>(() => {
    const counts: LiveTrackingStatusCounts = {
      todos: assignments.length,
      asignada: 0,
      enProceso: 0,
      pausada: 0,
      reasignada: 0,
      completada: 0,
    };

    assignments.forEach(a => {
      const estadoNorm = String(a.estado || '').toUpperCase();
      switch (estadoNorm) {
        case 'ASIGNADA':
          counts.asignada += 1;
          break;
        case 'EN_PROCESO':
          counts.enProceso += 1;
          break;
        case 'PAUSADA':
          counts.pausada += 1;
          break;
        case 'REASIGNADA':
          counts.reasignada += 1;
          break;
        case 'COMPLETADA':
          counts.completada += 1;
          break;
      }
    });

    return counts;
  }, [assignments]);

  // 4. Pipeline de filtrado y ordenamiento (Memoized)
  const filteredAssignments = useMemo<RouteAssignment[]>(() => {
    const termClean = filters.searchTerm.trim().toLowerCase();

    return assignments
      .filter(a => {
        // A. Filtro por término de búsqueda (Código, Nombre de Ruta, Lecturista, Cuenta/Sector)
        if (termClean) {
          const matchCode = (a.codigoRuta || '').toLowerCase().includes(termClean);
          const matchName = (a.nombreRuta || '').toLowerCase().includes(termClean);
          const matchReader = (a.nombreLecturista || '').toLowerCase().includes(termClean);
          const matchSector = `sector ${a.sector || ''}`.toLowerCase().includes(termClean);
          if (!matchCode && !matchName && !matchReader && !matchSector) {
            return false;
          }
        }

        // B. Filtro por Estado
        if (filters.estado !== 'TODOS') {
          const estadoNorm = String(a.estado || '').toUpperCase();
          if (estadoNorm !== filters.estado) {
            return false;
          }
        }

        // C. Filtro por Sector
        if (filters.sectorId !== 'TODOS') {
          const sec = a.sector ?? a.sectorId;
          if (sec !== filters.sectorId) {
            return false;
          }
        }

        // D. Filtro por Lecturista
        if (filters.operatorId !== 'TODOS') {
          const uId = a.usuarioId || a.lecturistaId;
          if (uId !== filters.operatorId) {
            return false;
          }
        }

        // E. Filtro Solo con Novedades
        if (filters.onlyWithNovelties && (a.lecturasNovedad ?? 0) === 0) {
          return false;
        }

        // F. Filtro Solo con Pendientes
        if (filters.onlyPending && (a.lecturasPendientes ?? 0) === 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const getPct = (item: RouteAssignment): number => {
          if (typeof item.porcentajeAvance === 'number') return item.porcentajeAvance;
          const esp = item.lecturasEsperadas ?? item.totalPredios ?? 0;
          const comp = item.lecturasCompletadas ?? item.prediosLeidos ?? 0;
          return esp > 0 ? (comp / esp) * 100 : 0;
        };

        switch (filters.sortBy) {
          case 'PROGRESS_ASC':
            return getPct(a) - getPct(b);
          case 'PROGRESS_DESC':
            return getPct(b) - getPct(a);
          case 'CODE_ASC':
            return (a.codigoRuta || '').localeCompare(b.codigoRuta || '');
          case 'READER_ASC':
            return (a.nombreLecturista || '').localeCompare(b.nombreLecturista || '');
          case 'NOVELTIES_DESC':
            return (b.lecturasNovedad ?? 0) - (a.lecturasNovedad ?? 0);
          case 'PENDING_DESC':
            return (b.lecturasPendientes ?? 0) - (a.lecturasPendientes ?? 0);
          case 'DEFAULT':
          default:
            return 0; // Conserva el orden original retornado por el backend
        }
      });
  }, [assignments, filters]);

  // Contador exacto de filtros activos
  const activeFiltersCount = useMemo<number>(() => {
    let count = 0;
    if (filters.searchTerm.trim() !== '') count += 1;
    if (filters.estado !== 'TODOS') count += 1;
    if (filters.sectorId !== 'TODOS') count += 1;
    if (filters.operatorId !== 'TODOS') count += 1;
    if (filters.onlyWithNovelties) count += 1;
    if (filters.onlyPending) count += 1;
    if (filters.sortBy !== 'DEFAULT') count += 1;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
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
    totalCount: assignments.length,
    filteredCount: filteredAssignments.length,
  };
};
