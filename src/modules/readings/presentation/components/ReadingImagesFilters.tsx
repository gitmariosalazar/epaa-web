import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

// Importamos los estilos de entry-filters (asumiendo que están en Accounting o global)
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import { Input } from '@/shared/presentation/components/Input/Input';

import { Select } from '@/shared/presentation/components/Input/Select';

export type SearchMode = 'month_sector' | 'cadastral_key';

interface ReadingImagesFiltersProps {
  isLoading: boolean;
  onFetch: (filters: {
    monthIso?: string;
    sector?: string;
    cadastralKey?: string;
  }) => void;
}

export const ReadingImagesFilters: React.FC<ReadingImagesFiltersProps> = ({
  isLoading,
  onFetch
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SearchMode>('month_sector');

  // Fields
  const currentMonthStr = dateService.getCurrentMonthString();
  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');
  const [cadastralKey, setCadastralKey] = useState('');

  const handleSearch = () => {
    if (mode === 'month_sector') {
      onFetch({ monthIso: month, sector });
    } else {
      onFetch({ cadastralKey });
    }
  };

  const canFetch =
    !isLoading &&
    (mode === 'month_sector' ? Boolean(month) : Boolean(cadastralKey));

  return (
    <div className="entry-filters">
      {/* ── LEFT: Filters ── */}
      <div className="filter-section-left">
        {/* Dropdown de Modo de Búsqueda */}
        <div className="filter-group">
          <label className="filter-label">
            {t('readings.filters.searchMode')}
          </label>
          <div className="filter-input-wrapper">
            <Select
              size="compact"
              value={mode}
              onChange={(e) => setMode(e.target.value as SearchMode)}
            >
              <option value="month_sector">
                {t('readings.filters.monthAndSector')}
              </option>
              <option value="cadastral_key">
                {t('readings.filters.cadastralKey')}
              </option>
            </Select>
          </div>
        </div>

        {/* Campos Condicionales según el Modo */}
        {mode === 'month_sector' ? (
          <>
            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.month', 'Mes exacto')}
              </label>
              <div className="filter-input-wrapper">
                <DatePicker
                  size="compact"
                  view="month"
                  value={month ? `${month}-01` : ''}
                  onChange={(val: string) => setMonth(val.substring(0, 7))}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.sectorOptional')}
              </label>
              <div className="filter-input-wrapper">
                <Input
                  size="compact"
                  placeholder={t('readings.filters.allSectors')}
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  leftIcon={<Search size={18} />}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="filter-group">
            <label className="filter-label">
              {t('common.cadastralKey', 'Clave Catastral')}
            </label>
            <div className="filter-input-wrapper">
              <InputCadastralKey
                placeholder="Ej: 1-125 o 40-5"
                size="compact"
                value={cadastralKey}
                onChange={(val) => setCadastralKey(val)}
              />
            </div>
          </div>
        )}

        {/* Botón Consultar */}
        <div className="filter-group">
          <label className="filter-label" style={{ visibility: 'hidden' }}>
            &nbsp;
          </label>
          <Button
            onClick={handleSearch}
            disabled={!canFetch}
            size="compact"
            isLoading={isLoading}
          >
            {!isLoading && <Search size={18} />}
            {isLoading ? t('common.loading') : t('common.fetch')}
          </Button>
        </div>
      </div>
    </div>
  );
};
