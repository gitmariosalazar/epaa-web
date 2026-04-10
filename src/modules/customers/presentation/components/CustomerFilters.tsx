import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';

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
      {/* ── LEFT: Filters ── */}
      <div className="filter-section-left" style={{ flexWrap: 'wrap' }}>
        {/* ── Filter Mode Selector ── */}
        {searchType !== undefined &&
          onSearchTypeChange &&
          searchOptions &&
          searchOptions.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">
                {t('common.searchMode', 'Search By')}
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={searchType}
                  onChange={(e) => onSearchTypeChange?.(e.target.value)}
                  leftIcon={<Search size={18} />}
                >
                  {searchOptions?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

        {/* ── Search Input ── */}
        <div className="filter-group filter-group--search">
          <label className="filter-label">{t('common.search', 'Search')}</label>
          <div className="filter-input-wrapper">
            <Input
              size="compact"
              placeholder={t('common.searchPlaceholder', 'Search records...')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="filter-section-right">
        <div className="filter-group">
          <label className="filter-label" style={{ visibility: 'hidden' }}>
            &nbsp;
          </label>
          <Button
            variant="outline"
            color="gray"
            size="compact"
            onClick={onRefresh}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('common.refresh', 'Refresh')}
          </Button>
        </div>
      </div>
    </div>
  );
};
