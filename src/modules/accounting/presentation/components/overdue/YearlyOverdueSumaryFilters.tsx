// Filter only for yearly overdue summary

import { useTranslation } from 'react-i18next';
import { RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import '../../styles/payments/PaymentFilters.css'; 

interface YearlyOverdueSumaryFiltersProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  searchField: string;
  setSearchField: (value: string) => void;
  searchOperator: string;
  setSearchOperator: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleClearSearch: () => void;
  isLoading: boolean;
  onRefresh?: () => void;
  availableYears?: number[];
}

const SEARCH_FIELDS = [
  { value: 'all', labelKey: 'common.all', labelDefault: 'Todos los campos' },
  { value: 'year', labelKey: 'accounting.overdue.year', labelDefault: 'Año' },
  {
    value: 'clientsWithDebt',
    labelKey: 'accounting.overdue.clientsWithDebt',
    labelDefault: 'Clientes con deuda'
  },
  {
    value: 'totalUniqueCadastralKeysByYear',
    labelKey: 'accounting.overdue.totalUniqueCadastralKeysByYear',
    labelDefault: 'Claves Catastrales'
  },
  {
    value: 'totalMonthsPastDue',
    labelKey: 'accounting.overdue.totalMonthsPastDue',
    labelDefault: 'Meses con mora'
  },
  {
    value: 'totalDebtAmount',
    labelKey: 'accounting.overdue.totalDebtAmount',
    labelDefault: 'Total deuda'
  }
];

export const YearlyOverdueSumaryFilters: React.FC<
  YearlyOverdueSumaryFiltersProps
> = ({
  searchField,
  setSearchField,
  searchOperator,
  setSearchOperator,
  searchQuery,
  setSearchQuery,
  handleClearSearch,
  isLoading,
  onRefresh
}) => {
  const { t } = useTranslation();

  return (
    <div className="payment-filters">
      {/* ── LEFT: Search Config ── */}
      <div className="filter-section-left">
        {/* 1. Field selector (Search Field) */}
        <div className="filter-group">
          <label className="filter-label">
            {t('accounting.filters.field', 'Columna')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              size="compact"
            >
              {SEARCH_FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {t(f.labelKey, f.labelDefault)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 2. Operator selector */}
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
              <option value="=">{t('common.operators.equal', 'Igual a')}</option>
              <option value=">">{t('common.operators.greater', 'Mayor a')}</option>
              <option value="<">{t('common.operators.less', 'Menor a')}</option>
              <option value=">=">
                {t('common.operators.greaterEqual', 'Mayor o igual a')}
              </option>
              <option value="<=">
                {t('common.operators.lessEqual', 'Menor o igual a')}
              </option>
              <option value="!=">
                {t('common.operators.different', 'Diferente a')}
              </option>
            </Select>
          </div>
        </div>

        {/* 3. Search input */}
        <div className="filter-group filter-group--search">
          <label className="filter-label">
            {t('accounting.filters.search', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder={t('accounting.filters.searchPlaceholder', 'Buscar...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="compact"
              leftIcon={<Search size={16} />}
            />
          </div>
        </div>

        {/* 4. Clear button */}
        {searchQuery && (
          <div className="filter-group">
            <label className="filter-label" style={{ visibility: 'hidden' }}>.</label>
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

      {/* ── RIGHT: Actions ── */}
      {onRefresh && (
        <div className="filter-section-right">
          <Button
            onClick={onRefresh}
            variant="outline"
            color="gray"
            size="compact"
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
