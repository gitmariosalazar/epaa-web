import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Search, RefreshCw } from 'lucide-react';
import '../styles/AllPropertiesFilters.css';

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
    <div className="all-properties-filters-container">
      <div className="filters-left">
        <div className="filter-group">
          <label className="filter-label">{t('common.searchBy', 'SEARCH BY')}</label>
          <div className="filter-controls">
            <select
              className="search-by-select"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="all">{t('properties.filters.allFields', 'All Fields')}</option>
              <option value="cadastralKey">{t('properties.filters.cadastralKey', 'Clave Catastral')}</option>
              <option value="clientId">{t('properties.filters.clientId', 'ID de Cliente')}</option>
              <option value="sector">{t('properties.filters.sector', 'Sector')}</option>
              <option value="propertyType">{t('properties.filters.propertyType', 'Tipo de Propiedad')}</option>
            </select>
            <Button
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
              onClick={onRefresh}
              className="refresh-btn"
            >
              {t('common.refresh', 'Refresh')}
            </Button>
          </div>
        </div>
      </div>

      <div className="filters-right">
        <div className="filter-group">
          <label className="filter-label">{t('common.search', 'SEARCH')}</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder={t('common.searchRecords', 'Search records...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
