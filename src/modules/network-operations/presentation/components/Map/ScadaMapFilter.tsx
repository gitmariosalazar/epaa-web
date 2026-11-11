import React from 'react';
import { Filter, X } from 'lucide-react';

export interface TankOption {
  name: string;
  count: number;
}

export interface ScadaMapFilterProps {
  tankOptions: TankOption[];
  activeTankFilter: string | null;
  totalConnectionsCount: number;
  visibleConnectionsCount: number;
  plantsCount: number;
  theme: 'light' | 'dark';
  onFilterChange: (tank: string | null) => void;
}

/**
 * Presentation component dedicated exclusively to displaying the interactive
 * tank filter control on top of the SCADA Map. (Single Responsibility Principle)
 */
export const ScadaMapFilter: React.FC<ScadaMapFilterProps> = ({
  tankOptions,
  activeTankFilter,
  totalConnectionsCount,
  visibleConnectionsCount,
  plantsCount,
  theme,
  onFilterChange
}) => {
  return (
    <div className={`scada-floating-filter ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={15} />
          <span>Filtro de Red Hidráulica</span>
        </div>
        {activeTankFilter && (
          <button
            type="button"
            className="filter-clear-btn"
            onClick={() => onFilterChange(null)}
            title="Mostrar todos los sectores de la red"
          >
            <X size={13} />
            <span>Ver Todo</span>
          </button>
        )}
      </div>

      <div className="filter-select-wrapper">
        <select
          value={activeTankFilter || ''}
          onChange={(e) => onFilterChange(e.target.value || null)}
          className="filter-select"
          aria-label="Filtrar red por tanque de reserva"
        >
          <option value="">
            🌐 Todos los sectores ({totalConnectionsCount} acometidas)
          </option>
          {tankOptions.map((tank) => (
            <option key={tank.name} value={tank.name}>
              🛢️ {tank.name} ({tank.count} acometidas)
            </option>
          ))}
        </select>
      </div>

      <div className="filter-meta">
        <span
          className="filter-badge plant-badge"
          title="Plantas de Tratamiento visibles"
        >
          🏭 {plantsCount} {plantsCount === 1 ? 'Planta' : 'Plantas'}
        </span>
        <span
          className="filter-badge connection-badge"
          title="Acometidas actualmente visibles"
        >
          🏠 {visibleConnectionsCount} Acometidas
        </span>
      </div>
    </div>
  );
};
