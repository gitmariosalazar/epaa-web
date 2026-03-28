import React from 'react';
import '../styles/PaymentFilters.css';
import { Search, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import { FaFilter } from 'react-icons/fa';

interface OverduePaymentFiltersProps {
  searchField: string;
  setSearchField: (value: string) => void;
  searchOperator: string;
  setSearchOperator: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const SEARCH_FIELDS = [
  { value: 'all', labelKey: 'common.all', labelDefault: 'Todos los campos' },
  {
    value: 'clientId',
    labelKey: 'accounting.overdue.clientId',
    labelDefault: 'ID Cliente'
  },
  {
    value: 'cadastralKey',
    labelKey: 'accounting.overdue.cadastralKey',
    labelDefault: 'Clave Catastral'
  },
  {
    value: 'name',
    labelKey: 'accounting.overdue.name',
    labelDefault: 'Nombre'
  },
  {
    value: 'monthsPastDue',
    labelKey: 'accounting.overdue.monthsPastDue',
    labelDefault: 'Meses de mora'
  }
];

export const OverduePaymentFilters: React.FC<OverduePaymentFiltersProps> = ({
  searchField,
  setSearchField,
  searchOperator,
  setSearchOperator,
  searchQuery,
  setSearchQuery,
  handleClearSearch,
  onRefresh,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      {/* ── LEFT: Search Config ── */}
      <div className="filter-section-left">
        {/* Field selector */}
        <div className="filter-group">
          <label className="filter-label">
            {t('accounting.filters.field', 'Filtrar por')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              size="compact"
              leftIcon={<FaFilter size={18} />}
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(f.labelKey, f.labelDefault)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Operator selector — only for monthsPastDue */}
        {searchField === 'monthsPastDue' && (
          <div className="filter-group filter-group--operator">
            <label className="filter-label">
              {t('accounting.filters.operator', 'Operador')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                value={searchOperator}
                onChange={(e) => setSearchOperator(e.target.value)}
                size="compact"
              >
                <option value="=">Igual a</option>
                <option value=">">Mayor a</option>
                <option value="<">Menor a</option>
                <option value=">=">Mayor o igual a</option>
                <option value="<=">Menor o igual a</option>
                <option value="!=">Diferente a</option>
              </Select>
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="filter-group filter-group--search">
          <label className="filter-label">
            {t('accounting.filters.search', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder={t(
                'accounting.filters.searchPlaceholder',
                'Buscar...'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="compact"
              leftIcon={<Search size={16} />}
            />
          </div>
        </div>

        {/* Clear button — only visible when there's a query */}
        {searchQuery && (
          <div className="filter-group">
            <label className="filter-label" style={{ visibility: 'hidden' }}>
              .
            </label>
            <Button
              onClick={handleClearSearch}
              size="compact"
              variant="ghost"
              leftIcon={<X size={16} />}
            >
              {t('common.clear', 'Limpiar')}
            </Button>
          </div>
        )}
      </div>

      {/* ── RIGHT: Global Actions ── */}
      {onRefresh && (
        <div className="filter-section-right">
          <Button
            onClick={onRefresh}
            size="compact"
            variant="outline"
            color="gray"
            isLoading={isLoading}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('common.refresh', 'Refrescar')}
          </Button>
        </div>
      )}
    </div>
  );
};
