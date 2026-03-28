import React from 'react';
import '../styles/ConnectionsFilters.css';
import { Search } from 'lucide-react';
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
  onSewerageChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="conn-filters">
      {/* ── LEFT: fetch inputs + Consultar ── */}
      <div className="conn-filter-section-left">
        {/* Sector input — sector tab only */}
        {activeTab === 'sector' && (
          <Input
            className="conn-filter-group"
            label={t('connections.filters.sector', 'Sector')}
            type="text"
            size="compact"
            placeholder={t('connections.filters.sectorPlaceholder', 'Ej: 1')}
            value={sectorInput}
            onChange={(e) => onSectorInputChange(e.target.value)}
            leftIcon={<HiChartPie size={18} />}
          />
        )}

        {/* Client ID input — client tab only */}
        {activeTab === 'client' && (
          <Input
            className="conn-filter-group"
            label={t('connections.filters.clientId', 'ID Cliente')}
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
        )}

        <div className="conn-filter-group conn-filter-group--btn">
          <label className="input__label" style={{ visibility: 'hidden' }}>
            .
          </label>
          <Button onClick={onFetch} disabled={!canFetch} size="compact">
            {isLoading ? (
              <div className="conn-filter-spinner" />
            ) : (
              <Search size={18} />
            )}
            {isLoading
              ? t('common.loading', 'Loading...')
              : t('connections.filters.fetch', 'Consultar')}
          </Button>
        </div>
      </div>

      {/* ── RIGHT: local search + dropdown filters ── */}
      <div className="conn-filter-section-right">
        {/* Search Field Selector (ListBox) */}
        <Select
          className="conn-filter-group conn-filter-group--search-field"
          label={t('connections.filters.field', 'Filtrar por')}
          size="compact"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
          leftIcon={<FaFilter size={18} />}
        >
          <option value="all">{t('common.all', 'Todos')}</option>
          <option value="connectionCadastralKey">
            {t('connections.fields.cadastralKey', 'Clave Catastral')}
          </option>
          <option value="connectionAccount">
            {t('connections.fields.account', 'Cuenta / Abonado')}
          </option>
          <option value="connectionMeterNumber">
            {t('connections.fields.meterNumber', 'Número de Medidor')}
          </option>
          <option value="clientId">
            {t('connections.fields.clientId', 'ID Cliente / RUC')}
          </option>
          <option value="connectionAddress">
            {t('connections.fields.address', 'Dirección')}
          </option>
          <option value="connectionContractNumber">
            {t('connections.fields.contractNumber', 'Número de Contrato')}
          </option>
          <option value="connectionReference">
            {t('connections.fields.reference', 'Referencia')}
          </option>
          <option value="connectionSector">
            {t('connections.fields.sector', 'Sector')}
          </option>
        </Select>

        {/* Multi-field search */}
        <Input
          className="conn-filter-group conn-filter-group--search"
          label={t('connections.filters.search', 'Buscar')}
          type="text"
          size="compact"
          placeholder={t(
            'connections.filters.searchPlaceholder',
            'Buscar registros...'
          )}
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          leftIcon={<Search size={18} />}
        />

        {/* Status filter */}
        <Select
          className="conn-filter-group"
          label={t('connections.filters.status', 'Estado')}
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

        {/* Sewerage filter */}
        <Select
          className="conn-filter-group"
          label={t('connections.filters.sewerage', 'Alcantarillado')}
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
    </div>
  );
};
