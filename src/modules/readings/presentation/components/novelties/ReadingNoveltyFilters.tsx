import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import {
  NoveltyType,
  NoveltyTypeLabelMap
} from '@/shared/utils/types/novelties-type';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TbChartPieFilled } from 'react-icons/tb';
import { RiMenuSearchLine } from 'react-icons/ri';

export interface ReadingNoveltyFiltersProps {
  novelty: string;
  onNoveltyChange: (val: string) => void;
  month: string;
  onMonthChange: (val: string) => void;
  sector: string;
  onSectorChange: (val: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  /** Optional extra action rendered beside the Consultar button (e.g. Initialize Period) */
  extraAction?: ReactNode;
  onSearchChange?: (val: string) => void;
  searchTerm?: string;
  onNoveltySearchChange?: (val: string) => void;
  noveltySearchTerm?: string;
}

export const ReadingNoveltyFilters: React.FC<ReadingNoveltyFiltersProps> = ({
  month,
  novelty,
  onNoveltyChange,
  onMonthChange,
  sector,
  onSectorChange,
  onFetch,
  isLoading,
  extraAction,
  onSearchChange,
  searchTerm,
  onNoveltySearchChange,
  noveltySearchTerm
}) => {
  const { t } = useTranslation();

  // Business rule: allow fetching if not loading and both month and novelty are selected
  const canFetch = !isLoading && Boolean(month) && Boolean(novelty);

  const options = Object.entries(NoveltyTypeLabelMap).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <div className="entry-filters">
      <div className="filter-section-left">
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

        <div className="filter-group">
          <label htmlFor="filterSector" className="filter-label">
            {t('sectors.title', 'Sector')}
          </label>
          <Input
            type="number"
            id="filterSector"
            value={sector}
            onChange={(e) => onSectorChange(e.target.value)}
            size="compact"
            leftIcon={<TbChartPieFilled size={18} />}
            placeholder="E.j 1"
            min={0}
            max={40}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filterNovelty" className="filter-label">
            {t('readings.novelty', 'Novedad')}
          </label>
          <Select
            id="filterNovelty"
            value={novelty}
            onChange={(e) => onNoveltyChange(e.target.value)}
            options={options}
            size="compact"
            leftIcon={<RiMenuSearchLine size={18} />}
          />
        </div>

        <div className="filter-group">
          <Button
            onClick={onFetch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
            leftIcon={<Search size={16} />}
          >
            {t('readings.filters.consultar', 'Consultar')}
          </Button>
          {extraAction}
        </div>
      </div>
      {/* ── RIGHT: Stats ── */}
      <div className="filter-section-right">
        <div className="filter-group">
          <label className="filter-label">{t('common.search')}</label>
          <Input
            type="text"
            placeholder={t('common.search')}
            size="compact"
            leftIcon={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        {/** Filter by Novelty */}
        {novelty === NoveltyType.TODAS && (
          <div className="filter-group">
            <label className="filter-label">
              {t('readings.novelty', 'Filtrar por novedad')}
            </label>
            <Select
              id="filterNoveltySearch"
              value={noveltySearchTerm}
              onChange={(e) => onNoveltySearchChange?.(e.target.value)}
              options={options}
              size="compact"
              leftIcon={<RiMenuSearchLine size={18} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};
