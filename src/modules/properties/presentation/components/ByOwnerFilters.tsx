import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Hash } from 'lucide-react';
import { Input } from '@/shared/presentation/components/Input/Input';
import '../styles/ByOwnerFilters.css';

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
    <div className="cr-search-area">
      <div className="by-owner-filters-grid">
        <Input
          label={t('properties.filters.clientId', 'ID Cliente')}
          leftIcon={<Hash size={16} />}
          placeholder={t('properties.filters.clientIdPlaceholder', 'Ej: 1000472694')}
          type="text"
          value={clientId}
          onChange={(e) => onClientIdChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && clientId && !isLoading) {
              e.preventDefault();
              onFetch();
            }
          }}
          size="small"
        />
        <button
          className="btn-primary by-owner-filters-btn"
          onClick={onFetch}
          disabled={isLoading || !clientId}
        >
          <Search size={16} />
          {isLoading ? t('common.searching', 'Buscando...') : t('common.search', 'Buscar')}
        </button>
      </div>
    </div>
  );
};
