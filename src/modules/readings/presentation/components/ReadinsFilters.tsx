import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

import { TbChartPieFilled } from 'react-icons/tb';

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

      {show.sector && (
        <div className="entry-filter-group">
          <label className="entry-filter-label">
            {t('readingData.filters.sector', 'Sector')}
          </label>
          <div className="entry-filter-input-wrapper">
            <TbChartPieFilled className="entry-filter-icon" size={18} />
            <input
              type="text"
              placeholder={t(
                'readingData.filters.sectorPlaceholder',
                'Todos los sectores'
              )}
              value={sector}
              className="entry-filter-input"
              style={{ paddingLeft: '2.25rem' }}
              onChange={(e) => onSectorChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="entry-filter-group" style={{ flex: '0 1 auto', width: 'auto' }}>
        <label className="entry-filter-label" style={{ visibility: 'hidden' }}>
          &nbsp;
        </label>
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
    </div>
  );
};
