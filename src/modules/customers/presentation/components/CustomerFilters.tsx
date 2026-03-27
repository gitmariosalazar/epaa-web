import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

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
    <div className="entry-filters">
      {/* ── Filter Mode Selector ── */}
      {searchType !== undefined &&
        onSearchTypeChange &&
        searchOptions &&
        searchOptions.length > 0 && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('common.searchMode', 'Search By')}
            </label>
            <div className="entry-filter-input-wrapper">
              <select
                className="entry-filter-select"
                value={searchType}
                onChange={(e) => onSearchTypeChange?.(e.target.value)}
              >
                {searchOptions?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

      {/* ── Search Input ── */}
      <div className="entry-filter-group entry-filter-group--search">
        <label className="entry-filter-label">
          {t('common.search', 'Search')}
        </label>
        <div className="entry-filter-input-wrapper">
          <Search className="entry-filter-icon" size={18} />
          <input
            type="text"
            className="entry-filter-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder={t('common.searchPlaceholder', 'Search records...')}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>

      {/* ── Refresh Button ── */}
      <div className="entry-filter-group" style={{ flex: '0 1 auto', width: 'auto' }}>
        <label className="entry-filter-label" style={{ visibility: 'hidden' }}>
          &nbsp;
        </label>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          leftIcon={
            isLoading ? (
              <div className="filter-button-spinner" />
            ) : (
              <RefreshCw size={16} />
            )
          }
        >
          {isLoading
            ? t('common.loading', 'Loading...')
            : t('common.refresh', 'Refresh')}
        </Button>
      </div>
    </div>
  );
};
