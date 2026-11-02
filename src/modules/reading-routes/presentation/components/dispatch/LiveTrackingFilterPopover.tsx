import React from 'react';
import {
  SlidersHorizontal,
  Search,
  Layers,
  User,
  ArrowUpDown,
  AlertTriangle,
  Clock,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { RouteAssignmentStatus } from '../../../domain/models/RouteAssignment';
import type {
  FilterOperatorOption,
  LiveTrackingFilterCriteria,
  LiveTrackingSortOption,
  LiveTrackingStatusCounts,
} from '../../../domain/models/LiveTrackingFilterCriteria';
import './LiveTrackingFilterPopover.css';

export interface LiveTrackingFilterPopoverProps {
  trigger?: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
  filters: LiveTrackingFilterCriteria;
  statusCounts: LiveTrackingStatusCounts;
  availableSectors: number[];
  availableOperators: FilterOperatorOption[];
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  totalCount: number;
  filteredCount: number;
  onSearchChange: (term: string) => void;
  onEstadoChange: (estado: RouteAssignmentStatus | 'TODOS') => void;
  onSectorChange: (sectorId: number | 'TODOS') => void;
  onOperatorChange: (opId: string | 'TODOS') => void;
  onToggleOnlyNovelties: () => void;
  onToggleOnlyPending: () => void;
  onSortChange: (sort: LiveTrackingSortOption) => void;
  onResetFilters: () => void;
}

export const LiveTrackingFilterPopover: React.FC<LiveTrackingFilterPopoverProps> = ({
  trigger,
  isOpen,
  onClose,
  anchorElement,
  filters,
  statusCounts,
  availableSectors,
  availableOperators,
  hasActiveFilters,
  activeFiltersCount,
  totalCount,
  filteredCount,
  onSearchChange,
  onEstadoChange,
  onSectorChange,
  onOperatorChange,
  onToggleOnlyNovelties,
  onToggleOnlyPending,
  onSortChange,
  onResetFilters,
}) => {
  const statusOptions: Array<{
    key: RouteAssignmentStatus | 'TODOS';
    label: string;
    count: number;
    colorBadge: string;
  }> = [
    { key: 'TODOS', label: 'Todas', count: statusCounts.todos, colorBadge: 'status-tag-all' },
    { key: 'EN_PROCESO', label: 'En Progreso', count: statusCounts.enProceso, colorBadge: 'status-tag-progress' },
    { key: 'ASIGNADA', label: 'Asignadas', count: statusCounts.asignada, colorBadge: 'status-tag-assigned' },
    { key: 'PAUSADA', label: 'Pausadas', count: statusCounts.pausada, colorBadge: 'status-tag-paused' },
    { key: 'REASIGNADA', label: 'Reasignadas', count: statusCounts.reasignada, colorBadge: 'status-tag-reassigned' },
    { key: 'COMPLETADA', label: 'Completadas', count: statusCounts.completada, colorBadge: 'status-tag-completed' },
  ];

  return (
    <PopoverModal
      trigger={trigger}
      isOpen={isOpen}
      onClose={onClose}
      anchorElement={anchorElement}
      title={
        <div className="filter-popover-title">
          <span>Filtros de Monitoreo</span>
          {hasActiveFilters && (
            <span className="filter-popover-active-badge">
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      }
      description="Personaliza y segmenta rutas en tiempo real"
      icon={<SlidersHorizontal size={18} style={{ color: 'var(--accent)' }} />}
      size="md"
      footer={
        <div className="filter-popover-footer">
          <Button
            variant="ghost"
            size="xs"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            leftIcon={<RotateCcw size={13} />}
          >
            Restablecer
          </Button>

          <div className="filter-popover-footer-actions">
            <span className="filter-popover-footer-stats">
              <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> rutas
            </span>
            <Button
              variant="primary"
              size="xs"
              onClick={onClose}
              leftIcon={<Check size={13} />}
            >
              Aplicar
            </Button>
          </div>
        </div>
      }
    >
      <div className="filter-popover-body">
          {/* Section 1: Quick Search */}
          <div className="filter-popover-section">
            <label className="filter-popover-label">Búsqueda rápida</label>
            <div className="filter-popover-search-wrapper">
              <Search size={15} className="filter-popover-search-icon" />
              <input
                type="text"
                className="filter-popover-search-input"
                placeholder="Código (ej. SEC01-R01), sector o lecturista..."
                value={filters.searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                autoFocus
              />
              {filters.searchTerm && (
                <button
                  type="button"
                  className="filter-popover-search-clear"
                  onClick={() => onSearchChange('')}
                  title="Limpiar búsqueda"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Estado de la Asignación */}
          <div className="filter-popover-section">
            <div className="filter-popover-section-header">
              <label className="filter-popover-label">Estado de la Ruta</label>
              <span className="filter-popover-label-hint">Selecciona condición</span>
            </div>
            <div className="filter-popover-status-grid">
              {statusOptions.map(opt => {
                const isSelected = filters.estado === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={`filter-popover-status-card ${opt.colorBadge} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => onEstadoChange(opt.key)}
                  >
                    <div className="filter-popover-status-info">
                      <span className="filter-popover-status-label">{opt.label}</span>
                      <span className="filter-popover-status-count">{opt.count}</span>
                    </div>
                    {isSelected && <Check size={14} className="filter-popover-status-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Grid for Selects */}
          <div className="filter-popover-two-columns">
            {/* Sector */}
            <div className="filter-popover-section">
              <label className="filter-popover-label">Sector Territorial</label>
              <div className="filter-popover-select-wrapper">
                <Layers size={14} className="filter-popover-select-icon" />
                <select
                  className="filter-popover-select"
                  value={filters.sectorId}
                  onChange={e =>
                    onSectorChange(e.target.value === 'TODOS' ? 'TODOS' : Number(e.target.value))
                  }
                >
                  <option value="TODOS">Todos los sectores ({availableSectors.length})</option>
                  {availableSectors.map(s => (
                    <option key={s} value={s}>
                      Sector {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lecturista */}
            <div className="filter-popover-section">
              <label className="filter-popover-label">Lecturista en Campo</label>
              <div className="filter-popover-select-wrapper">
                <User size={14} className="filter-popover-select-icon" />
                <select
                  className="filter-popover-select"
                  value={filters.operatorId}
                  onChange={e => onOperatorChange(e.target.value)}
                >
                  <option value="TODOS">Todos los lecturistas ({availableOperators.length})</option>
                  {availableOperators.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.routeCount} {op.routeCount === 1 ? 'ruta' : 'rutas'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sort selection */}
          <div className="filter-popover-section">
            <label className="filter-popover-label">Ordenar Tarjetas Por</label>
            <div className="filter-popover-select-wrapper">
              <ArrowUpDown size={14} className="filter-popover-select-icon" />
              <select
                className="filter-popover-select"
                value={filters.sortBy}
                onChange={e => onSortChange(e.target.value as LiveTrackingSortOption)}
              >
                <option value="DEFAULT">Orden cronológico (Por defecto)</option>
                <option value="PROGRESS_ASC">Avance: Menor a Mayor (Rezagadas)</option>
                <option value="PROGRESS_DESC">Avance: Mayor a Menor (Adelantadas)</option>
                <option value="CODE_ASC">Código de Ruta (A - Z)</option>
                <option value="READER_ASC">Nombre de Lecturista (A - Z)</option>
                <option value="NOVELTIES_DESC">Mayor cantidad de Novedades</option>
                <option value="PENDING_DESC">Mayor cantidad de Pendientes</option>
              </select>
            </div>
          </div>

          {/* Operational Toggles */}
          <div className="filter-popover-section">
            <label className="filter-popover-label">Condiciones Operativas</label>
            <div className="filter-popover-toggles-list">
              <button
                type="button"
                className={`filter-popover-toggle-row ${filters.onlyWithNovelties ? 'active' : ''}`}
                onClick={onToggleOnlyNovelties}
              >
                <div className="filter-popover-toggle-info">
                  <div className="filter-popover-toggle-title">
                    <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                    <span>Solo rutas con novedades</span>
                  </div>
                  <span className="filter-popover-toggle-desc">
                    Medidores observados o inaccesibles
                  </span>
                </div>
                <div className="filter-popover-switch">
                  <span className="filter-popover-switch-handle" />
                </div>
              </button>

              <button
                type="button"
                className={`filter-popover-toggle-row ${filters.onlyPending ? 'active' : ''}`}
                onClick={onToggleOnlyPending}
              >
                <div className="filter-popover-toggle-info">
                  <div className="filter-popover-toggle-title">
                    <Clock size={14} style={{ color: '#f59e0b' }} />
                    <span>Solo rutas con lecturas pendientes</span>
                  </div>
                  <span className="filter-popover-toggle-desc">
                    Oculta rutas completadas al 100%
                  </span>
                </div>
                <div className="filter-popover-switch">
                  <span className="filter-popover-switch-handle" />
                </div>
              </button>
            </div>
          </div>
        </div>
    </PopoverModal>
  );
};
