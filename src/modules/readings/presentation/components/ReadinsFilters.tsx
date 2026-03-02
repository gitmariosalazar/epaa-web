import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

// ── Tab type ──────────────────────────────────────────────────────────────────
export type ReadingDataTab = 'pending' | 'completed' | 'estimated' | 'all';

// ── Filter visibility rules per tab (SRP / OCP) ──────────────────────────────
const SHOW: Record<
  ReadingDataTab,
  {
    month: boolean;
    sector: boolean;
  }
> = {
  pending: {
    month: true,
    sector: true
  },
  completed: {
    month: true,
    sector: true
  },
  estimated: {
    month: true,
    sector: true
  },
  all: {
    month: true,
    sector: true
  }
};

// ── Props (ISP) ───────────────────────────────────────────────────────────────
export interface ReadingDataFiltersProps {
  activeTab: ReadingDataTab;

  // Month
  month: string;
  onMonthChange: (val: string) => void;

  // Sector
  sector: string;
  onSectorChange: (val: string) => void;

  // Fetch Action
  onFetch: () => void;
  isLoading: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ReadingDataFilters: React.FC<ReadingDataFiltersProps> = ({
  activeTab,
  month,
  onMonthChange,
  sector,
  onSectorChange,
  onFetch,
  isLoading
}) => {
  const { t } = useTranslation();

  // Business rule: allow fetching if not loading and month is selected
  const canFetch = !isLoading && Boolean(month);
  const show = SHOW[activeTab];

  return (
    <div className="entry-filters">
      {/* ── LEFT: Main filters + Fetch Action ── */}
      <div className="entry-filter-left">
        {show.month && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('readingData.filters.month', 'Mes')}
            </label>
            <div className="entry-filter-input-wrapper">
              <DatePicker
                view="month"
                value={month ? `${month}-01` : ''}
                onChange={(val: string) => onMonthChange(val.substring(0, 7))}
              />
            </div>
          </div>
        )}

        <Button onClick={onFetch} disabled={!canFetch} size="sm">
          {isLoading ? (
            <div className="entry-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('readingData.filters.fetch', 'Consultar')}
        </Button>
      </div>

      {/* ── RIGHT: Secondary/Conditional Filters ── */}
      <div className="entry-filter-right">
        {show.sector && (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('readingData.filters.sector', 'Sector')}
            </label>
            <div className="entry-filter-input-wrapper">
              <input
                type="text"
                placeholder={t(
                  'readingData.filters.sectorPlaceholder',
                  'Todos los sectores'
                )}
                className="entry-filter-input"
                value={sector}
                onChange={(e) => onSectorChange(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
