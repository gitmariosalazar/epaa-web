import React from 'react';
import '../../styles/TrashRateReportFilters.css';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';

export interface ClientDetailFiltersProps {
  searchParams: string;
  onSearchParamsChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const ClientDetailFilters: React.FC<ClientDetailFiltersProps> = ({
  searchParams,
  onSearchParamsChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();
  const canFetch = !isLoading && searchParams.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canFetch) onFetch();
  };

  return (
    <div className="trash-report-filters">
      <div className="trash-report-filter-left">
        <div className="trash-report-filter-group" style={{ width: '18rem' }}>
          <label className="trash-report-filter-label">
            {t(
              'trashRateReport.filters.clientSearch',
              'Buscar por Cédula / Clave Catastral'
            )}
          </label>
          <div className="trash-report-filter-input-wrapper">
            <Input
              size="small"
              type="text"
              placeholder={t(
                'trashRateReport.filters.clientSearchPlaceholder',
                'Ej: 0102030405 o 12-3456'
              )}
              value={searchParams}
              onChange={(e) => onSearchParamsChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <Button onClick={onFetch} disabled={!canFetch} size="xs">
          {isLoading ? (
            <div className="trash-report-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('trashRateReport.filters.fetch', 'Buscar')}
        </Button>
      </div>
    </div>
  );
};
