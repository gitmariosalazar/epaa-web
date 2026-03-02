import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import '../styles/CustomerFilters.css';

interface SearchOption {
  value: string;
  label: string;
}

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  searchType?: string;
  onSearchTypeChange?: (val: string) => void;
  searchOptions?: SearchOption[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  searchType,
  onSearchTypeChange,
  searchOptions,
  onRefresh,
  isLoading = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="customer-filters">
      {/* ── LEFT: Filters ── */}
      <div className="customer-filter-left">
        {searchType !== undefined &&
          onSearchTypeChange &&
          searchOptions &&
          searchOptions.length > 0 && (
            <div className="customer-filter-group">
              <label className="customer-filter-label">
                {t('common.searchMode', 'Search By')}
              </label>
              <div className="customer-filter-input-wrapper">
                <select
                  className="customer-filter-select"
                  value={searchType}
                  onChange={(e) => onSearchTypeChange(e.target.value)}
                >
                  {searchOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? (
            <div className="customer-filter-spinner" />
          ) : (
            <RefreshCw size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Loading...')
            : t('common.refresh', 'Refresh')}
        </Button>
      </div>

      {/* ── RIGHT: Search Box ── */}
      <div className="customer-filter-right">
        <div className="customer-filter-group customer-filter-group--search">
          <label className="customer-filter-label">
            {t('common.search', 'Search')}
          </label>
          <div className="customer-filter-input-wrapper">
            <Search className="customer-filter-icon" size={18} />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder', 'Search records...')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="customer-filter-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
