import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Hash } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

import { Input } from '@/shared/presentation/components/Input/Input';

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
      <div className="filter-section-left">
        <div className="filter-group filter-group--search">
          <label className="filter-label">
            {t('properties.filters.clientId', 'ID Cliente')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              size="compact"
              placeholder={t(
                'properties.filters.clientIdPlaceholder',
                'Ej: 1000472694'
              )}
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
              leftIcon={<Hash size={18} />}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && clientId && !isLoading) {
                  e.preventDefault();
                  onFetch();
                }
              }}
            />
          </div>
        </div>

        <Button
          onClick={onFetch}
          size="compact"
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
