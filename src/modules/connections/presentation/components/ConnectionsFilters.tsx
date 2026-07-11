import React from 'react';
import '../styles/ConnectionsFilters.css';
import { AlertTriangle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import type { ConnectionTab } from '../hooks/useConnectionsViewModel';
import { FaCheck, FaFilter, FaList, FaUser } from 'react-icons/fa';
import { HiChartPie } from 'react-icons/hi';

// ── Props (ISP: each consumer only passes what it needs) ──────────────────────
interface ConnectionsFiltersProps {
  activeTab: ConnectionTab;

  // Sector tab only
  sectorInput: string;
  onSectorInputChange: (val: string) => void;

  // Client tab only
  clientIdInput: string;
  onClientIdInputChange: (val: string) => void;

  // Fetch
  onFetch: () => void;
  isLoading: boolean;
  canFetch: boolean;

  // Local search + dropdowns (all tabs)
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  searchField: string;
  onSearchFieldChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedSewerage: string;
  onSewerageChange: (val: string) => void;
  selectedIncidents: string;
  onIncidentsChange: (val: string) => void;
  selectedCoordinates: string;
  onCoordinatesChange: (val: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ConnectionsFilters: React.FC<ConnectionsFiltersProps> = ({
  activeTab,
  sectorInput,
  onSectorInputChange,
  clientIdInput,
  onClientIdInputChange,
  onFetch,
  isLoading,
  canFetch,
  searchQuery,
  onSearchQueryChange,
  searchField,
  onSearchFieldChange,
  selectedStatus,
  onStatusChange,
  selectedSewerage,
  onSewerageChange,
  selectedIncidents,
  onIncidentsChange,
  selectedCoordinates,
  onCoordinatesChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="conn-filters">
      {/* Sector input — sector tab only */}
      {activeTab === 'sector' && (
        <div className="conn-filter-group">
          <label className="conn-filter-label">{t('connections.filters.sector', 'Sector')}</label>
          <Input
            type="text"
            size="compact"
            placeholder={t('connections.filters.sectorPlaceholder', 'Ej: 1')}
            value={sectorInput}
            onChange={(e) => onSectorInputChange(e.target.value)}
            leftIcon={<HiChartPie size={18} />}
          />
        </div>
      )}

      {/* Client ID input — client tab only */}
      {activeTab === 'client' && (
        <div className="conn-filter-group">
          <label className="conn-filter-label">{t('connections.filters.clientId', 'ID Cliente')}</label>
          <Input
            type="text"
            size="compact"
            placeholder={t(
              'connections.filters.clientIdPlaceholder',
              'Ej: 0912645821'
            )}
            value={clientIdInput}
            onChange={(e) => onClientIdInputChange(e.target.value)}
            leftIcon={<FaUser size={18} />}
          />
        </div>
      )}

      <div className="conn-filter-group conn-filter-group--btn">
        <Button
          variant="outline"
          size="compact"
          onClick={onFetch}
          disabled={!canFetch}
          isLoading={isLoading}
          leftIcon={<Search size={16} />}
        >
          {t('common.consult', 'Consultar')}
        </Button>
      </div>

      <div className="conn-filter-group conn-filter-group--search">
        <label className="conn-filter-label">{t('common.search', 'Búsqueda Local')}</label>
        <Input
          type="text"
          size="compact"
          placeholder={t(
            'connections.filters.searchPlaceholder',
            'Buscar en resultados...'
          )}
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          leftIcon={<Search size={18} />}
        />
      </div>

      <div className="conn-filter-group">
        <label className="conn-filter-label">{t('connections.filters.searchField', 'Campo')}</label>
        <Select
          size="compact"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
          leftIcon={<FaFilter size={18} />}
        >
          <option value="all">
            {t('connections.filters.allFields', 'Todos')}
          </option>
          <option value="name">
            {t('connections.filters.name', 'Nombre')}
          </option>
          <option value="address">
            {t('connections.filters.address', 'Dirección')}
          </option>
          <option value="meter">
            {t('connections.filters.meter', 'Medidor')}
          </option>
        </Select>
      </div>

      {/* Status filter */}
      <div className="conn-filter-group">
        <label className="conn-filter-label">{t('connections.filters.status', 'Estado')}</label>
        <Select
          size="compact"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          leftIcon={<FaCheck size={18} />}
        >
          <option value="">
            {t('connections.filters.allStatuses', 'Todos los estados')}
          </option>
          <option value="active">
            {t('connections.filters.active', 'Activo')}
          </option>
          <option value="inactive">
            {t('connections.filters.inactive', 'Inactivo')}
          </option>
        </Select>
      </div>

      {/* Sewerage filter */}
      <div className="conn-filter-group">
        <label className="conn-filter-label">{t('connections.filters.sewerage', 'Alcantarillado')}</label>
        <Select
          size="compact"
          value={selectedSewerage}
          onChange={(e) => onSewerageChange(e.target.value)}
          leftIcon={<FaList size={18} />}
        >
          <option value="">
            {t('connections.filters.allSewerage', 'Todos')}
          </option>
          <option value="yes">
            {t('connections.filters.sewerageYes', 'Con alcantarillado')}
          </option>
          <option value="no">
            {t('connections.filters.sewerageNo', 'Sin alcantarillado')}
          </option>
        </Select>
      </div>

      {/* Incidents filter */}
      <div className="conn-filter-group">
        <label className="conn-filter-label">{t('connections.filters.incidents', 'Incidentes')}</label>
        <Select
          size="compact"
          value={selectedIncidents}
          onChange={(e) => onIncidentsChange(e.target.value)}
          leftIcon={<AlertTriangle size={18} />}
        >
          <option value="">
            {t('connections.filters.allIncidents', 'Todos')}
          </option>
          <option value="with">
            {t('connections.filters.withIncidents', 'Con incidentes')}
          </option>
          <option value="without">
            {t('connections.filters.withoutIncidents', 'Sin incidentes')}
          </option>
        </Select>
      </div>

        {/* Coordinates filter */}
      <div className="conn-filter-group">
        <label className="conn-filter-label">{t('connections.filters.coordinates', 'Coordenadas')}</label>
        <Select
          size="compact"
          value={selectedCoordinates}
          onChange={(e) => onCoordinatesChange(e.target.value)}
          leftIcon={<FaCheck size={18} />}
        >
          <option value="">
            {t('connections.filters.allCoordinates', 'Todos')}
          </option>
          <option value="yes">
            {t('connections.filters.hasCoordinates', 'Con coordenadas')}
          </option>
          <option value="no">
            {t('connections.filters.withoutCoordinates', 'Sin coordenadas')}
          </option>
        </Select>
      </div>
    </div>
  );
};
