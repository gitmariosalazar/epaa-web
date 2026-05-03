import React from 'react';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { TbChartPieFilled } from 'react-icons/tb';
import { Input } from '@/shared/presentation/components/Input/Input';

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
  /** Optional extra action rendered beside the Consultar button (e.g. Initialize Period) */
  extraAction?: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ReadingDataFilters: React.FC<ReadingDataFiltersProps> = ({
  activeTab,
  month,
  onMonthChange,
  sector,
  onSectorChange,
  onFetch,
  isLoading,
  extraAction
}) => {
  const { t } = useTranslation();

  // Business rule: allow fetching if not loading and month is selected
  const canFetch = !isLoading && Boolean(month);
  const show = SHOW[activeTab];

  return (
    <div className="entry-filters">
      {/* ── LEFT: Filters ── */}
      <div className="filter-section-left">
        {show.month && (
          <div className="filter-group">
            <label className="filter-label">
              {t('readingData.filters.month', 'Mes')}
            </label>
            <div className="filter-input-wrapper">
              <DatePicker
                size="compact"
                view="month"
                value={month}
                onChange={(val: string) => onMonthChange(val.substring(0, 7))}
              />
            </div>
          </div>
        )}

        {show.sector && (
          <div className="filter-group">
            <label className="filter-label">
              {t('readingData.filters.sector', 'Sector')}
            </label>
            <div className="filter-input-wrapper">
              <Input
                size="compact"
                placeholder={t(
                  'readingData.filters.sectorPlaceholder',
                  'Todos los sectores'
                )}
                value={sector}
                onChange={(e) => onSectorChange(e.target.value)}
                leftIcon={<TbChartPieFilled size={18} />}
              />
            </div>
          </div>
        )}

        <div className="filter-group">
          <label className="filter-label" style={{ visibility: 'hidden' }}>
            &nbsp;
          </label>
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
          >
            {!isLoading && <Search size={18} />}
            {isLoading ? t('common.loading') : t('common.fetch')}
          </Button>
          {extraAction}
        </div>
      </div>
    </div>
  );
};
