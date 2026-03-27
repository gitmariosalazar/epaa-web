import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Hash } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

interface ByOwnerFiltersProps {
  clientId: string;
  onClientIdChange: (id: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const ByOwnerFilters: React.FC<ByOwnerFiltersProps> = ({
  clientId,
  onClientIdChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="entry-filters">
      <div className="entry-filter-group entry-filter-group--search">
        <label className="entry-filter-label">
          {t('properties.filters.clientId', 'ID Cliente')}
        </label>
        <div className="entry-filter-input-wrapper">
          <Hash className="entry-filter-icon" size={18} />
          <input
            type="text"
            className="entry-filter-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder={t(
              'properties.filters.clientIdPlaceholder',
              'Ej: 1000472694'
            )}
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && clientId && !isLoading) {
                e.preventDefault();
                onFetch();
              }
            }}
          />
        </div>
      </div>

      <div className="entry-filter-group" style={{ flex: '0 1 auto', width: 'auto' }}>
        <label className="entry-filter-label" style={{ visibility: 'hidden' }}>
          &nbsp;
        </label>
        <Button
          onClick={onFetch}
          disabled={isLoading || !clientId}
          leftIcon={isLoading ? undefined : <Search size={16} />}
          isLoading={isLoading}
        >
          {isLoading
            ? t('common.searching', 'Buscando...')
            : t('common.search', 'Buscar')}
        </Button>
      </div>
    </div>
  );
};
