import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Search, RefreshCw } from 'lucide-react';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';

interface AllPropertiesFiltersProps {
  searchBy: string;
  setSearchBy: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onRefresh: () => void;
}

export const AllPropertiesFilters: React.FC<AllPropertiesFiltersProps> = ({
  searchBy,
  setSearchBy,
  searchQuery,
  setSearchQuery,
  onRefresh
}) => {
  const { t } = useTranslation();

  return (
    <div className="entry-filters">
      {/* ── LEFT: Search Config ── */}
      <div className="filter-section-left">
        <div className="filter-group">
          <label className="filter-label">
            {t('common.searchBy', 'SEARCH BY')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              size="compact"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              leftIcon={<Search size={18} />}
            >
              <option value="all">
                {t('properties.filters.allFields', 'All Fields')}
              </option>
              <option value="cadastralKey">
                {t('properties.filters.cadastralKey', 'Clave Catastral')}
              </option>
              <option value="clientId">
                {t('properties.filters.clientId', 'ID de Cliente')}
              </option>
              <option value="sector">
                {t('properties.filters.sector', 'Sector')}
              </option>
              <option value="propertyType">
                {t('properties.filters.propertyType', 'Tipo de Propiedad')}
              </option>
            </Select>
          </div>
        </div>

        <div className="filter-group filter-group--search">
          <label className="filter-label">{t('common.search', 'SEARCH')}</label>
          <div className="filter-input-wrapper">
            <Input
              size="compact"
              placeholder={t('common.searchRecords', 'Search records...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="filter-section-right">
        <Button
          variant="outline"
          size="compact"
          leftIcon={<RefreshCw size={16} />}
          onClick={onRefresh}
        >
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>
    </div>
  );
};
