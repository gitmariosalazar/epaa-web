import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIncidentContext } from '../context/IncidentContext';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

export type IncidentSortKey =
  | 'fecha_desc'
  | 'fecha_asc'
  | 'status'
  | 'priority'
  | 'connection'
  | 'sector'
  | 'reference'
  | 'reportDate';

// ── Tab type (Open/Closed: add tabs here without touching logic) ─────────────
export type IncidentTab = 'list' | 'map';

export interface IncidentsFilterState {
  search: string;
  searchField: string;
  status: string;
  priority: string;
  categoryId: number | null;
  sector?: string | null;
  reference?: string | null;
  reportDate?: Date | null;
}

const sortFn = (
  a: IncidentDetailRowResponse,
  b: IncidentDetailRowResponse,
  key: IncidentSortKey
): number => {
  switch (key) {
    case 'fecha_desc':
      return (
        new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
      );
    case 'fecha_asc':
      return (
        new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
      );
    case 'status':
      return a.status.localeCompare(b.status);
    case 'priority':
      return a.suggestedPriority.localeCompare(b.suggestedPriority);
    case 'connection':
      return (a.connectionId ?? '').localeCompare(b.connectionId ?? '');
    default:
      return 0;
  }
};

/**
 * useIncidentsViewModel
 *
 * Presentation-layer ViewModel (MVVM).
 * Responsabilidades (SRP):
 *   - Leer parámetros de URL para pre-filtrar por acometida.
 *   - Coordinar filtros locales y llamadas al contexto.
 *   - Exponer estado derivado (filteredSorted, paginated).
 *
 * Dependency Inversion: depende del contexto (abstracción),
 * no de repositorios concretos.
 */
export const useIncidentsViewModel = () => {
  const {
    incidents,
    categories,
    isLoading,
    error,
    loadIncidents,
    loadActiveByConnection,
    createIncident,
    resolveIncident,
    refresh
  } = useIncidentContext();

  // ── Leer connectionId desde query-string (?connectionId=14-293) ──────────
  const [searchParams, setSearchParams] = useSearchParams();
  const connectionIdFromUrl = searchParams.get('connectionId');

  // ── Tab activo (Open/Closed: similar a ConnectionsViewModel) ─────────────
  const [activeTab, setActiveTab] = useState<IncidentTab>('list');

  // ── Estado de filtros ────────────────────────────────────────────────────
  const [filters, setFilters] = useState<IncidentsFilterState>({
    search: connectionIdFromUrl ?? '',
    searchField: 'all',
    status: '',
    priority: '',
    categoryId: null,
    sector: null,
    reference: null,
    reportDate: null
  });

  // ── Modo "por acometida": true cuando llegamos desde ConnectionsPage ──────
  const [connectionMode, setConnectionMode] = useState<boolean>(
    Boolean(connectionIdFromUrl)
  );

  const [sortBy, setSortBy] = useState<IncidentSortKey>('fecha_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // ── Carga inicial según el modo ──────────────────────────────────────────
  useEffect(() => {
    if (connectionIdFromUrl) {
      // Modo "acometida": carga solo incidentes activos (≠ RESUELTO)
      loadActiveByConnection(connectionIdFromUrl);
    } else {
      // Modo "todos": carga usando filtros normales
      loadIncidents({
        status: filters.status || null,
        priority: filters.priority || null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        connectionId: filters.searchField === 'connectionId' ? filters.search : (filters.searchField === 'all' && filters.search.includes('-') ? filters.search : null),
        sector: filters.searchField === 'sector' ? filters.search : (filters.sector || null),
        reference: filters.searchField === 'reference' ? filters.search : (filters.reference || null),
        reportDate: filters.reportDate || null
      });
    }
    // Solo se ejecuta una vez al montar (o si cambia el connectionId de la URL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionIdFromUrl]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Cambia filtros. En modo-conexión, limpia la URL param al modificar. */
  const handleFilterChange = useCallback(
    (updates: Partial<IncidentsFilterState>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
      setPage(1);

      // Si el usuario edita los filtros manualmente, salimos del modo-conexión
      if (connectionMode) {
        setConnectionMode(false);
        setSearchParams({});
      }
    },
    [connectionMode, setSearchParams]
  );

  // Ref estable para loadIncidents — evita loop isLoading → useEffect → fetch
  const loadIncidentsRef = useRef(loadIncidents);
  useEffect(() => {
    loadIncidentsRef.current = loadIncidents;
  }, [loadIncidents]);

  /** Auto-fetch cuando cambian los filtros (solo fuera del modo-conexión). */
  useEffect(() => {
    if (connectionMode) return; // ya cargado por la carga inicial

    const delay = filters.search && !filters.search.includes('-') ? 300 : 0;
    const timer = setTimeout(() => {
      loadIncidentsRef.current({
        status: filters.status || null,
        priority: filters.priority || null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        connectionId: filters.searchField === 'connectionId' ? filters.search : (filters.searchField === 'all' && filters.search.includes('-') ? filters.search : null),
        sector: filters.searchField === 'sector' ? filters.search : (filters.sector || null),
        reference: filters.searchField === 'reference' ? filters.search : (filters.reference || null),
        reportDate: filters.reportDate || null
      });
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, connectionMode]);

  /** Botón Consultar: recarga manualmente con los filtros actuales. */
  const handleConsultar = useCallback(() => {
    setConnectionMode(false);
    setSearchParams({});
    loadIncidents({
      status: filters.status || null,
      priority: filters.priority || null,
      categoryId: filters.categoryId ? Number(filters.categoryId) : null,
      connectionId: filters.searchField === 'connectionId' ? filters.search : (filters.searchField === 'all' && filters.search.includes('-') ? filters.search : null),
      sector: filters.searchField === 'sector' ? filters.search : (filters.sector || null),
      reference: filters.searchField === 'reference' ? filters.search : (filters.reference || null),
      reportDate: filters.reportDate || null
    });
    setPage(1);
  }, [filters, loadIncidents, setSearchParams]);

  const handleSortChange = useCallback((key: IncidentSortKey) => {
    setSortBy(key);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  /**
   * handleTabChange — cambia el tab activo (lista ↔ mapa).
   * SRP: solo cambia el tab; la navegación la controla la Page.
   */
  const handleTabChange = useCallback((tab: IncidentTab) => {
    setActiveTab(tab);
  }, []);

  // ── Estado derivado ───────────────────────────────────────────────────────
  const filteredSorted = useMemo(() => {
    let list = [...incidents];
    list.sort((a, b) => sortFn(a, b, sortBy));
    return list;
  }, [incidents, sortBy]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  return {
    // ── List state ─────────────────────────────────────────────────────────
    incidents: filteredSorted,
    totalCount: filteredSorted.length,
    categories,
    paginated,
    page,
    pageSize,
    setPage,
    setPageSize: handlePageSizeChange,
    isLoading,
    error,
    filters,
    sortBy,
    /** true cuando se llegó desde ConnectionsPage con una acometida específica */
    connectionMode,
    connectionIdFromUrl,
    // ── Tab state (patrón ConnectionsViewModel) ────────────────────────────
    activeTab,
    // ── Handlers ──────────────────────────────────────────────────────────
    handleFilterChange,
    handleSortChange,
    handleConsultar,
    handleTabChange,
    createIncident,
    resolveIncident,
    refresh
  };
};
