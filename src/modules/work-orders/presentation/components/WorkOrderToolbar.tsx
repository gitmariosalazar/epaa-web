/**
 * WorkOrderToolbar
 *
 * SRP: barra de búsqueda, filtros y sort para la lista de OTs.
 * Espejo de SolicitudesToolbar.
 */
import React from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';

export interface WorkOrderFilterState {
  search: string;
  filterBy: string;
  estado: string;
  prioridad: string;
  tipoOrden: string;
}

export const defaultWorkOrderFilters: WorkOrderFilterState = {
  search: '',
  filterBy: 'codigo',
  estado: '',
  prioridad: '',
  tipoOrden: '',
};

export type WorkOrderSortKey = 'fecha_desc' | 'fecha_asc' | 'estado' | 'codigo' | 'prioridad';

interface WorkOrderToolbarProps {
  filters: WorkOrderFilterState;
  sortBy: WorkOrderSortKey;
  totalCount: number;
  filteredCount: number;
  onFilterChange: (updates: Partial<WorkOrderFilterState>) => void;
  onSortChange: (key: WorkOrderSortKey) => void;
  onRefresh: () => void;
}

export const WorkOrderToolbar: React.FC<WorkOrderToolbarProps> = ({
  filters,
  sortBy,
  totalCount,
  filteredCount,
  onFilterChange,
  onSortChange,
  onRefresh,
}) => (
  <div className="wo-toolbar">
    {/* Buscador */}
    <div className="wo-toolbar__search">
      <Search size={15} className="wo-toolbar__search-icon" />
      <input
        type="text"
        placeholder="Buscar por código, tipo, ejecutor..."
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="wo-toolbar__input"
        id="wo-list-search"
      />
      {/* Campo de búsqueda */}
      <select
        value={filters.filterBy}
        onChange={(e) => onFilterChange({ filterBy: e.target.value })}
        className="wo-toolbar__select wo-toolbar__select--sm"
        id="wo-list-filter-by"
      >
        <option value="codigo">Por código</option>
        <option value="tipo">Por tipo</option>
        <option value="ejecutor">Por ejecutor</option>
        <option value="direccion">Por dirección</option>
      </select>
    </div>

    {/* Filtros rápidos */}
    <div className="wo-toolbar__filters">
      <Filter size={14} style={{ opacity: 0.5 }} />

      <select
        value={filters.estado}
        onChange={(e) => onFilterChange({ estado: e.target.value })}
        className="wo-toolbar__select"
        id="wo-list-filter-estado"
      >
        <option value="">Todos los estados</option>
        <option value="NOTIFICADA">Notificada</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="ASIGNADA">Asignada</option>
        <option value="PREPARACION">En Preparación</option>
        <option value="EN_PROCESO">En Proceso</option>
        <option value="EJECUTADA">Ejecutada</option>
        <option value="COMPLETADA">Completada</option>
        <option value="CANCELADA">Cancelada</option>
        <option value="RECHAZADA_TECNICA">Rechazada</option>
      </select>

      <select
        value={filters.prioridad}
        onChange={(e) => onFilterChange({ prioridad: e.target.value })}
        className="wo-toolbar__select"
        id="wo-list-filter-prioridad"
      >
        <option value="">Todas las prioridades</option>
        <option value="Baja">Baja</option>
        <option value="Media">Media</option>
        <option value="Alta">Alta</option>
        <option value="Urgente">Urgente</option>
        <option value="Emergencia">Emergencia</option>
      </select>

      <select
        value={filters.tipoOrden}
        onChange={(e) => onFilterChange({ tipoOrden: e.target.value })}
        className="wo-toolbar__select"
        id="wo-list-filter-tipo"
      >
        <option value="">Todos los tipos</option>
        <option value="INSPECCION">Inspección</option>
        <option value="INSTALACION">Instalación</option>
        <option value="MANTENIMIENTO">Mantenimiento</option>
        <option value="REPARACION">Reparación</option>
        <option value="EMERGENCIA">Emergencia</option>
      </select>
    </div>

    {/* Sort + refresh */}
    <div className="wo-toolbar__right">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as WorkOrderSortKey)}
        className="wo-toolbar__select"
        id="wo-list-sort"
      >
        <option value="fecha_desc">Más recientes</option>
        <option value="fecha_asc">Más antiguas</option>
        <option value="estado">Estado</option>
        <option value="codigo">Código OT</option>
        <option value="prioridad">Prioridad</option>
      </select>

      <span className="wo-toolbar__count">
        {filteredCount} / {totalCount} OTs
      </span>

      <button
        className="wo-toolbar__btn"
        onClick={onRefresh}
        title="Actualizar lista"
        id="wo-list-refresh"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  </div>
);
