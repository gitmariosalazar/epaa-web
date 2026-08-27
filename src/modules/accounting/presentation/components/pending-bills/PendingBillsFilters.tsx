import React from 'react';
import '../../styles/payments/PaymentFilters.css'; // Reusing the same CSS to maintain identical structure
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';

interface PendingBillsFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const PendingBillsFilters: React.FC<PendingBillsFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();

  const canFetch = !isLoading && searchQuery.trim().length > 0;

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canFetch) {
      onFetch();
    }
  };

  return (
    <div className="payment-filters">
      <div className="filter-section-left">
        <div className="filter-group filter-group--search" style={{ minWidth: '350px' }}>
          <label className="filter-label">
            {t('accounting.filters.clientId', 'Cédula / RUC o Clave Catastral')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder="Ej: 1712345678 o 8-100"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              size="compact"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        <div className="filter-group">
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
            leftIcon={<Search size={18} />}
          >
            {t('common.fetch', 'Consultar')}
          </Button>
        </div>
      </div>
    </div>
  );
};
