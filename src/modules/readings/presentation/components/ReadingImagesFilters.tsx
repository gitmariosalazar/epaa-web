import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

// Importamos los estilos de entry-filters (asumiendo que están en Accounting o global)
import '@/modules/accounting/presentation/styles/EntryDataFilters.css';

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
      <div className="entry-filter-left">
        {/* Dropdown de Modo de Búsqueda */}
        <div className="entry-filter-group">
          <label className="entry-filter-label">
            {t('readings.filters.searchMode')}
          </label>
          <div className="entry-filter-input-wrapper">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as SearchMode)}
              className="entry-filter-select"
            >
              <option value="month_sector">
                {t('readings.filters.monthAndSector')}
              </option>
              <option value="cadastral_key">
                {t('readings.filters.cadastralKey')}
              </option>
            </select>
          </div>
        </div>

        {/* Campos Condicionales según el Modo */}
        {mode === 'month_sector' ? (
          <>
            <div className="entry-filter-group" style={{ flex: 1 }}>
              <label className="entry-filter-label">
                {t('readings.filters.exactCadastralKey')}
              </label>
              <div className="entry-filter-input-wrapper">
                <DatePicker
                  view="month"
                  value={month ? `${month}-01` : ''}
                  onChange={(val: string) => setMonth(val.substring(0, 7))}
                />
              </div>
            </div>

            <div className="entry-filter-group">
              <label className="entry-filter-label">
                {t('readings.filters.sectorOptional')}
              </label>
              <div className="entry-filter-input-wrapper">
                <input
                  type="text"
                  placeholder={t('readings.filters.allSectors')}
                  className="entry-filter-input"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="entry-filter-group">
            <label className="entry-filter-label">
              {t('common.cadastralKey', 'Clave Catastral')}
            </label>
            <div className="entry-filter-input-wrapper">
              <InputCadastralKey
                placeholder="Ej: 1-125 o 40-5"
                className="entry-filter-input"
                value={cadastralKey}
                onChange={(val) => setCadastralKey(val)}
              />
            </div>
          </div>
        )}

        {/* Botón Consultar */}
        <Button onClick={handleSearch} disabled={!canFetch} size="sm">
          {isLoading ? (
            <div className="entry-filter-spinner" />
          ) : (
            <Search size={18} />
          )}
          {isLoading
            ? t('common.loading', 'Cargando...')
            : t('common.consult', 'Consultar')}
        </Button>
      </div>
    </div>
  );
};
