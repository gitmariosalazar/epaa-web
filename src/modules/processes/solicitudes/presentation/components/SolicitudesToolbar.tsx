/**
 * SolicitudesToolbar — SRP: renders the search, filter, and action toolbar.
 *
 * DIP: receives all state and callbacks as props — no direct context reads.
 * OCP: to add a new filter, extend the props without modifying other components.
 */
import React from 'react';
import { Search, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { MdAssignmentAdd } from 'react-icons/md';
import { ESTADO_CONFIG } from './SolicitudConfig';

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterBy: string;
  onFilterByChange: (v: string) => void;
  event: string;
  onEventChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  totalCount: number;
  filteredCount: number;
  onRefresh: () => void;
  onNuevaSolicitud: () => void;
}

export const SolicitudesToolbar: React.FC<ToolbarProps> = ({
  search,
  onSearchChange,
  filterBy,
  onFilterByChange,
  event,
  onEventChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
  onRefresh,
  onNuevaSolicitud
}) => {
  const hasFilters = search || event || filterBy;

  return (
    <div className="sol-toolbar">
      {/* Search */}
      <div className="sol-toolbar__search">
        <Search size={15} className="sol-toolbar__search-icon" />
        <input
          type="text"
          placeholder="Buscar por N° solicitud, dirección, cédula..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="sol-search-input"
        />
      </div>

      <div className="sol-toolbar__divider" />

      {/* Filter by field */}
      <select
        className="sol-toolbar__select"
        value={filterBy}
        onChange={(e) => onFilterByChange(e.target.value)}
        title="Filtrar por campo"
        aria-label="Filtrar por"
      >
        <option value="">Todos los campos</option>
        <option value="codigo">Código</option>
        <option value="direccion">Dirección</option>
      </select>

      {/* Status filter */}
      <select
        className="sol-toolbar__select"
        value={event}
        onChange={(e) => onEventChange(e.target.value)}
        title="Filtrar por estado"
        aria-label="Estado"
      >
        <option value="">Todos los estados</option>
        {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>

      {/* Sort by */}
      <select
        className="sol-toolbar__select"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        title="Ordenar por"
        aria-label="Ordenar"
        style={{ minWidth: 120 }}
      >
        <option value="fecha_desc">Más recientes</option>
        <option value="fecha_asc">Más antiguos</option>
        <option value="estado">Estado</option>
        <option value="numero">N° Solicitud</option>
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          className="sol-toolbar__btn"
          onClick={() => {
            onSearchChange('');
            onFilterByChange('');
            onEventChange('');
          }}
          title="Limpiar filtros"
        >
          <X size={13} /> Limpiar
        </button>
      )}

      <div className="sol-toolbar__divider" />

      {/* Refresh */}
      <button
        className="sol-toolbar__btn"
        onClick={onRefresh}
        id="btn-refrescar-solicitudes"
        title="Actualizar"
      >
        <RefreshCw size={14} /> Actualizar
      </button>

      {/* Nueva solicitud */}
      <button
        className="sol-toolbar__btn sol-toolbar__btn--primary"
        onClick={onNuevaSolicitud}
        id="btn-nueva-solicitud"
      >
        <MdAssignmentAdd size={16} /> Nueva Solicitud
      </button>

      {/* Count */}
      <span className="sol-toolbar__count">
        <SlidersHorizontal size={12} style={{ display: 'inline', marginRight: 4 }} />
        {filteredCount} {filteredCount !== totalCount ? `/ ${totalCount}` : ''} resultado{filteredCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};
