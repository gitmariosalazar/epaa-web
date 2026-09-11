import React from 'react';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { TbChartPieFilled } from 'react-icons/tb';
import { Input } from '@/shared/presentation/components/Input/Input';
import { User } from 'lucide-react';
import { useUsersViewModel } from '@/modules/users/presentation/hooks/useUsersViewModel';
import { Select } from '@/shared/presentation/components/Input/Select';

// ── Tab type ──────────────────────────────────────────────────────────────────
export type ReadingDataTab =
  | 'pending'
  | 'completed'
  | 'estimated'
  | 'all'
  | 'novelties';

// ── Filter visibility rules per tab (SRP / OCP) ──────────────────────────────
const SHOW: Record<
  ReadingDataTab,
  {
    month: boolean;
    sector: boolean;
    userId?: boolean;
  }
> = {
  pending: {
    month: true,
    sector: true
  },
  completed: {
    month: true,
    sector: true,
    userId: true
  },
  estimated: {
    month: true,
    sector: true,
    userId: true
  },
  all: {
    month: true,
    sector: true,
    userId: true
  },
  novelties: {
    month: true,
    sector: true,
    userId: true
  }
};

// ── Props (ISP) ───────────────────────────────────────────────────────────────
export interface ReadingDataFiltersProps {
  activeTab: ReadingDataTab;

  // Month
  month: string;
  onMonthChange: (val: string) => void;

  // Date
  date?: string;
  onDateChange?: (val: string) => void;

  // Sector
  sector: string;
  onSectorChange: (val: string) => void;

  // UserId
  userId?: string;
  onUserIdChange?: (val: string) => void;

  // Fetch Action
  onFetch: () => void;
  isLoading: boolean;
  /** Optional extra action rendered beside the Consultar button (e.g. Initialize Period) */
  extraAction?: ReactNode;

  // Search
  search: string;
  onSearchChange: (val: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const ReadingDataFilters: React.FC<ReadingDataFiltersProps> = ({
  activeTab,
  month,
  onMonthChange,
  date,
  onDateChange,
  sector,
  onSectorChange,
  userId,
  onUserIdChange,
  onFetch,
  isLoading,
  extraAction,
  search,
  onSearchChange
}) => {
  const { t } = useTranslation();
  const [dateFilterMode, setDateFilterMode] = React.useState<'month' | 'date'>('month');

  // Business rule: allow fetching if not loading and month is selected
  const canFetch = !isLoading && Boolean(month);
  const show = SHOW[activeTab];

  const { users } = useUsersViewModel();

  const readersUsers = users.filter((user) =>
    user.roles.find(
      (role) => role.name.includes('LECTURISTA')
    )
  );

  return (
    <div className="entry-filters">
      {/* ── LEFT: Filters ── */}
      <div className="filter-section-left">
        {show.month && (
          <div className="filter-group">
            <label className="filter-label">
              {t('readingData.filters.period', 'Período')}
            </label>
            <div className="filter-input-wrapper" style={{ display: 'flex', gap: '8px' }}>
              <Select
                size="small"
                width={120}
                value={dateFilterMode}
                onChange={(e) => {
                  setDateFilterMode(e.target.value as 'month' | 'date');
                  if (e.target.value === 'month' && onDateChange) {
                    onDateChange('');
                  }
                }}
                options={[
                  { value: 'month', label: 'Por Mes' },
                  { value: 'date', label: 'Por Fecha' }
                ]}
              />
              {dateFilterMode === 'month' ? (
                <DatePicker
                  size="small"
                  view="month"
                  value={month}
                  onChange={(val: string) => {
                    onMonthChange(val.substring(0, 7));
                    if (onDateChange) onDateChange('');
                  }}
                />
              ) : (
                <DatePicker
                  size="small"
                  view="date"
                  value={date || `${month}-01`}
                  onChange={(val: string) => {
                    if (onDateChange) onDateChange(val);
                    onMonthChange(val.substring(0, 7));
                  }}
                />
              )}
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
                size="small"
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

        {show.userId && onUserIdChange && (
          <div className="filter-group">
            <label className="filter-label">
              {t('readingData.filters.userId', 'Usuario ID')}
            </label>
            <div className="filter-input-wrapper">
              <Select
                size="small"
                width={180}
                value={userId || ''}
                options={[
                  { value: '', label: 'Todos los usuarios' },
                  ...readersUsers.map((user) => ({
                    value: user.cardId ?? '',
                    label: `${user.firstName} ${user.lastName}`
                  }))
                ]}
                onChange={(e) => onUserIdChange(e.target.value)}
                leftIcon={<User size={18} />}
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
            size="xs"
            isLoading={isLoading}
          >
            {!isLoading && <Search size={18} />}
            {isLoading ? t('common.loading') : t('common.fetch')}
          </Button>
          {extraAction}
        </div>
      </div>

      {/* ── RIGHT: Global Search ── */}
      <div className="filter-section-right" style={{ marginLeft: 'auto' }}>
        <div className="filter-group">
          <label className="filter-label">
            {t('common.search', 'Buscar')}
          </label>
          <div className="filter-input-wrapper">
            <Input
              size="small"
              placeholder={t('common.searchPlaceholder', 'Buscar...')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
