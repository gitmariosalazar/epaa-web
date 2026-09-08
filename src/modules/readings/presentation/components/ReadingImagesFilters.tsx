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

export type SearchMode = 'month_sector' | 'cadastral_key' | 'date';

interface ReadingImagesFiltersProps {
  isLoading: boolean;
  onFetch: (filters: {
    monthIso?: string;
    sector?: string;
    cadastralKey?: string;
    date?: string;
    novelty?: string;
    updatedStatus?: string;
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
  const [date, setDate] = useState('');
  const [novelty, setNovelty] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');

  const handleSearch = () => {
    if (mode === 'month_sector') {
      onFetch({ monthIso: month, sector, novelty, updatedStatus });
    } else if (mode === 'cadastral_key') {
      onFetch({ cadastralKey, novelty, updatedStatus });
    } else if (mode === 'date') {
      onFetch({ date, novelty, updatedStatus });
    }
  };

  const canFetch =
    !isLoading &&
    (mode === 'month_sector' ||
      mode === 'date' ||
      Boolean(month) ||
      Boolean(cadastralKey));

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
              <option value="date">
                {t('readings.filters.date', 'Fecha')}
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
                  value={month ? `${month}` : ''}
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

            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.noveltyOptional', 'NOVEDAD (OPCIONAL)')}
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={novelty}
                  onChange={(e) => setNovelty(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="ALERTA CONSUMO BAJO">Alerta Consumo Bajo</option>
                  <option value="LECTURA INVÁLIDA">Lectura Inválida</option>
                  <option value="ALERTA CONSUMO ALTO">Alerta Consumo Alto</option>
                  <option value="NORMAL">Normal</option>
                  <option value="CONSUMO EXCESIVO">Consumo Excesivo</option>
                  <option value="SIN LECTURA">Sin Lectura</option>
                </Select>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                ESTADO (OPCIONAL)
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="updated">Actualizadas</option>
                  <option value="not_updated">No Actualizadas</option>
                </Select>
              </div>
            </div>
          </>
        ) : mode === 'cadastral_key' ? (
          <>
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
            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.noveltyOptional', 'NOVEDAD (OPCIONAL)')}
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={novelty}
                  onChange={(e) => setNovelty(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="ALERTA CONSUMO BAJO">Alerta Consumo Bajo</option>
                  <option value="LECTURA INVÁLIDA">Lectura Inválida</option>
                  <option value="ALERTA CONSUMO ALTO">Alerta Consumo Alto</option>
                  <option value="NORMAL">Normal</option>
                  <option value="CONSUMO EXCESIVO">Consumo Excesivo</option>
                  <option value="SIN LECTURA">Sin Lectura</option>
                </Select>
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">
                ESTADO (OPCIONAL)
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="updated">Actualizadas</option>
                  <option value="not_updated">No Actualizadas</option>
                </Select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.date', 'Fecha')}
              </label>
              <div className="filter-input-wrapper">
                <DatePicker
                  size="compact"
                  value={date}
                  onChange={(val: string) => setDate(val)}
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">
                {t('readings.filters.noveltyOptional', 'NOVEDAD (OPCIONAL)')}
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={novelty}
                  onChange={(e) => setNovelty(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="ALERTA CONSUMO BAJO">Alerta Consumo Bajo</option>
                  <option value="LECTURA INVÁLIDA">Lectura Inválida</option>
                  <option value="ALERTA CONSUMO ALTO">Alerta Consumo Alto</option>
                  <option value="NORMAL">Normal</option>
                  <option value="CONSUMO EXCESIVO">Consumo Excesivo</option>
                  <option value="SIN LECTURA">Sin Lectura</option>
                </Select>
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">
                ESTADO (OPCIONAL)
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="updated">Actualizadas</option>
                  <option value="not_updated">No Actualizadas</option>
                </Select>
              </div>
            </div>
          </>
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
