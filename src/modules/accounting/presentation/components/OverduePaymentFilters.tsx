import React from 'react';
import '../styles/PaymentFilters.css';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';

interface OverduePaymentFiltersProps {
  searchField: string;
  setSearchField: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
}

const SEARCH_FIELDS = [
  { value: 'all', labelKey: 'common.all', labelDefault: 'Todos los campos' },
  { value: 'clientId', labelKey: 'accounting.overdue.clientId', labelDefault: 'ID Cliente' },
  { value: 'cadastralKey', labelKey: 'accounting.overdue.cadastralKey', labelDefault: 'Clave Catastral' },
  { value: 'name', labelKey: 'accounting.overdue.name', labelDefault: 'Nombre' },
  { value: 'monthsPastDue', labelKey: 'accounting.overdue.monthsPastDue', labelDefault: 'Meses de mora' }
];

export const OverduePaymentFilters: React.FC<OverduePaymentFiltersProps> = ({
  searchField,
  setSearchField,
  searchQuery,
  setSearchQuery,
  handleClearSearch
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      <div className="filter-section-left">
        {/* Field selector */}
        <div className="filter-group">
          <label className="filter-label">
            {t('accounting.filters.field', 'Filtrar por')}
          </label>
          <div className="filter-input-wrapper">
            <select
              className="filter-input filter-select"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(f.labelKey, f.labelDefault)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="filter-group filter-group--search">
          <label className="filter-label">
            {t('accounting.filters.search', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Search className="filter-icon" size={16} />
            <input
              type="text"
              className="filter-input filter-input--with-icon"
              placeholder={t('accounting.filters.searchPlaceholder', 'Buscar...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Clear button — only visible when there's a query */}
        {searchQuery && (
          <div className="filter-group filter-group--btn">
            <label className="filter-label" style={{ visibility: 'hidden' }}>.</label>
            <Button onClick={handleClearSearch} size="sm" variant="ghost">
              <X size={16} />
              {t('common.clear', 'Limpiar')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
