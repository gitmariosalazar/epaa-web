/**
 * AllWorkOrderToolbar — SRP: renders search, filter and action bar for the
 * global work-order list.
 *
 * DIP: receives all state and callbacks as props.
 * OCP: new filters → extend AllWorkOrderFilterState without touching the page.
 */
import React from 'react';
import { Search, RefreshCw, X, FilePlus2 } from 'lucide-react';
import { Select } from '@/shared/presentation/components/Input/Select';
import type { AllWorkOrderFilterState, AllWorkOrderSortKey } from '../hooks/useAllWorkOrdersViewModel';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

const STATUS_OPTIONS = [
  { value: 'NOTIFICADA', label: '⬜ Notificada' },
  { value: 'PENDIENTE', label: '🟡 Pendiente' },
  { value: 'ASIGNADA', label: '🔵 Asignada' },
  { value: 'EN_PREPARACION', label: '🟣 En Preparación' },
  { value: 'EN_PROCESO', label: '🟠 En Proceso' },
  { value: 'EJECUTADA', label: '🩵 Ejecutada' },
  { value: 'COMPLETADA', label: '🟢 Completada' },
  { value: 'CANCELADA', label: '⬛ Cancelada' },
];

const ORIGIN_OPTIONS = [
  { value: 'EMERGENCIA', label: '🚨 Emergencia' },
  { value: 'PLANIFICADA', label: '📅 Planificada' },
  { value: 'SOLICITUD', label: '📋 Solicitud' },
  { value: 'INSPECCION', label: '🔍 Inspección' },
];

const PRIORITY_OPTIONS = [
  { value: '1', label: '🔵 Baja' },
  { value: '2', label: '🟡 Media' },
  { value: '3', label: '🟠 Alta' },
  { value: '4', label: '🔴 Urgente' },
  { value: '5', label: '⚡ Emergencia' },
];

const SORT_OPTIONS: { value: AllWorkOrderSortKey; label: string }[] = [
  { value: 'fecha_desc', label: 'Más recientes' },
  { value: 'fecha_asc', label: 'Más antiguas' },
  { value: 'status', label: 'Estado' },
  { value: 'codigo', label: 'Código' },
  { value: 'priority', label: 'Prioridad' },
];

interface AllWorkOrderToolbarProps {
  filters: AllWorkOrderFilterState;
  sortBy: AllWorkOrderSortKey;
  totalCount: number;
  filteredCount: number;
  onFilterChange: (updates: Partial<AllWorkOrderFilterState>) => void;
  onSortChange: (key: AllWorkOrderSortKey) => void;
  onRefresh: () => void;
  onNuevaOT: () => void;
}

export const AllWorkOrderToolbar: React.FC<AllWorkOrderToolbarProps> = ({
  filters,
  sortBy,
  totalCount,
  filteredCount,
  onFilterChange,
  onSortChange,
  onRefresh,
  onNuevaOT,
}) => {
  const hasFilters = filters.search || filters.status || filters.priority || filters.origin;

  return (
    <div className="wo-toolbar">
      {/* Search input */}
      <div className="wo-toolbar__search">
        <Input
          id="wo-all-search-input"
          type="text"
          size='compact'
          placeholder="Buscar"
          value={filters.search}
          width={280}
          leftIcon={<Search size={14} />}
          onChange={e => onFilterChange({ search: e.target.value })}
        />


        {/* Filter by field */}
        <Select
          size="compact"
          value={filters.filterBy}
          onChange={e => onFilterChange({ filterBy: e.target.value })}
          aria-label="Filtrar por campo"
          width={150}
        >
          <option value="">Todos los campos</option>
          <option value="codigo">Código OT</option>
          <option value="cliente">Cliente</option>
          <option value="direccion">Dirección</option>
        </Select>

        {/* Status filter */}
        <Select
          size="compact"
          value={filters.status}
          onChange={e => onFilterChange({ status: e.target.value })}
          aria-label="Estado"
          width={155}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>

        {/* Priority filter */}
        <Select
          size="compact"
          value={filters.priority}
          onChange={e => onFilterChange({ priority: e.target.value })}
          aria-label="Prioridad"
          width={140}
        >
          <option value="">Todas las prioridades</option>
          {PRIORITY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>

        {/* Origin filter */}
        <Select
          size="compact"
          value={filters.origin}
          onChange={e => onFilterChange({ origin: e.target.value })}
          aria-label="Origen"
          width={145}
        >
          <option value="">Todos los orígenes</option>
          {ORIGIN_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>

        {/* Sort */}
        <Select
          size="compact"
          value={sortBy}
          onChange={e => onSortChange(e.target.value as AllWorkOrderSortKey)}
          aria-label="Ordenar"
          width={145}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            className="wo-toolbar__btn wo-toolbar__btn--ghost"
            onClick={() => onFilterChange({ search: '', status: '', priority: '', origin: '', filterBy: '' })}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <X size={14} />
          </button>
        )}

        {/* Counts */}
        <span className="wo-toolbar__count">
          {filteredCount !== totalCount ? `${filteredCount} / ` : ''}{totalCount} OT{totalCount !== 1 ? 's' : ''}
        </span>

        <div style={{ flex: 1 }} />

        {/* Refresh */}
        <Tooltip
          content='Actualizar'
          position='top'
          followCursor={false}
        >
          <Button
            id="btn-wo-all-refresh"
            onClick={onRefresh}
            aria-label="Actualizar lista"
            variant='dashed'
            size='sm'
          >
            <RefreshCw size={14} />
          </Button>
        </Tooltip>

        {/* Nueva OT */}
        <Tooltip
          content='Nueva OT'
          position='top'
          followCursor={false}
        >
          <Button
            id="btn-wo-all-nueva"
            onClick={onNuevaOT}
            variant='outline'
            color='success'
            size='sm'
          >
            <FilePlus2 size={14} /> Nueva OT
          </Button>
        </Tooltip>
      </div>

    </div>
  );
};
