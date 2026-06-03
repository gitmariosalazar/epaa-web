import React from 'react';
import { Search, Filter, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import '@/shared/presentation/styles/LayoutFilters.css';

export interface SolicitudesFilterState {
  userId: string;
  initDate: string;
  endDate: string;
  filterBy: string;
  search: string;
  event: string;
}

export const defaultSolicitudesFilters: SolicitudesFilterState = {
  userId: '',
  initDate: '',
  endDate: '',
  filterBy: '',
  search: '',
  event: ''
};

interface SolicitudesGlobalFiltersProps {
  filters: SolicitudesFilterState;
  onChange: (newFilters: Partial<SolicitudesFilterState>) => void;
  onConsultar?: () => void;
  onRefresh?: () => void;
  eventOptions?: { value: string; label: string }[];
}

export const SolicitudesGlobalFilters: React.FC<
  SolicitudesGlobalFiltersProps
> = ({
  filters,
  onChange,
  onRefresh,
  eventOptions = [
    { value: 'solicitud', label: 'Solicitud' },
    { value: 'validacion', label: 'Validación' },
    { value: 'inspeccion', label: 'Inspección' },
    { value: 'pago', label: 'Pago' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'instalacion', label: 'Instalación' },
    { value: 'activo', label: 'Activo' }
  ]
}) => {
  return (
    <div className="layout-filters" style={{ justifyContent: 'flex-end' }}>
      {/* ── RIGHT: Local search + filters ── */}
      <div className="layout-filter-section-right">
        <div className="filter-group">
          <label className="filter-label">FILTRAR POR</label>
          <div className="filter-input-wrapper">
            <Select
              value={filters.filterBy}
              onChange={(e) => onChange({ filterBy: e.target.value })}
              size="compact"
              leftIcon={<Filter size={18} />}
            >
              <option value="">Todos los campos</option>
              <option value="codigo">Código</option>
              <option value="direccion">Dirección</option>
            </Select>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">BUSCAR</label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder="Buscar registros..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              size="compact"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">EVENTO</label>
          <div className="filter-input-wrapper">
            <Select
              value={filters.event}
              onChange={(e) => onChange({ event: e.target.value })}
              size="compact"
              leftIcon={<Activity size={18} />}
            >
              <option value="">Todos los eventos</option>
              {eventOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={15} />}
            onClick={onRefresh}
            id="btn-refrescar-solicitudes"
          >
            Actualizar
          </Button>
        )}
      </div>
    </div>
  );
};
