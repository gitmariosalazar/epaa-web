import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Search, RefreshCw } from 'lucide-react';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

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
      {/* Search By Filter */}
      <div className="entry-filter-group">
        <label className="entry-filter-label">{t('common.searchBy', 'SEARCH BY')}</label>
        <div className="entry-filter-input-wrapper">
          <select
            className="entry-filter-select"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="all">{t('properties.filters.allFields', 'All Fields')}</option>
            <option value="cadastralKey">{t('properties.filters.cadastralKey', 'Clave Catastral')}</option>
            <option value="clientId">{t('properties.filters.clientId', 'ID de Cliente')}</option>
            <option value="sector">{t('properties.filters.sector', 'Sector')}</option>
            <option value="propertyType">{t('properties.filters.propertyType', 'Tipo de Propiedad')}</option>
          </select>
        </div>
      </div>

      {/* Query Input */}
      <div className="entry-filter-group entry-filter-group--search">
        <label className="entry-filter-label">{t('common.search', 'SEARCH')}</label>
        <div className="entry-filter-input-wrapper">
          <Search className="entry-filter-icon" size={18} />
          <input
            type="text"
            className="entry-filter-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder={t('common.searchRecords', 'Search records...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Refresh Button */}
      <div className="entry-filter-group" style={{ flex: '0 1 auto', width: 'auto' }}>
        <label className="entry-filter-label" style={{ visibility: 'hidden' }}>
          &nbsp;
        </label>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          onClick={onRefresh}
        >
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>
    </div>
  );
};
