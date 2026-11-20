import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Search, RotateCcw } from 'lucide-react';
import type { StateCatalogItem } from '../../domain/models/StateCatalog';
import '../styles/StateHistoryAudit.css';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker';

export interface StateHistoryFilterBarProps {
  catalog: StateCatalogItem[];
  connectionId: string;
  onConnectionIdChange: (val: string) => void;
  stateId: number | '';
  onStateIdChange: (val: number | '') => void;
  origin: string;
  onOriginChange: (val: string) => void;
  isReversal: boolean | '';
  onIsReversalChange: (val: boolean | '') => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const StateHistoryFilterBar: React.FC<StateHistoryFilterBarProps> = ({
  catalog,
  connectionId,
  onConnectionIdChange,
  stateId,
  onStateIdChange,
  origin,
  onOriginChange,
  isReversal,
  onIsReversalChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onSearch,
  onReset,
  isLoading
}) => {
  return (
    <div className="state-audit-filters">
      <div className="state-audit-filter-row">
        {/* Acometida ID */}
        <div style={{ flex: '1 1 180px' }}>
          <Input
            label="ID de Acometida"
            placeholder="Ej: 14-293"
            value={connectionId}
            onChange={(e) => onConnectionIdChange(e.target.value)}
            size="small"
          />
        </div>

        {/* Estado Alcanzado */}
        <div style={{ flex: '1 1 200px' }}>
          <Select
            label="Estado Alcanzado"
            value={stateId === '' ? '' : String(stateId)}
            onChange={(e) =>
              onStateIdChange(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            options={[
              { value: '', label: 'Todos los Estados' },
              ...catalog.map((c) => ({
                value: String(c.stateId),
                label: `${c.name} (${c.stateId})`
              }))
            ]}
            size="small"
          />
        </div>

        {/* Canal Origen */}
        <div style={{ flex: '1 1 180px' }}>
          <Select
            label="Canal de Registro"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            options={[
              { value: '', label: 'Todos los Canales' },
              { value: 'WEB', label: 'Web Portal' },
              { value: 'APP_MOVIL', label: 'App Móvil' },
              { value: 'CUADRILLA', label: 'Cuadrilla Campo' },
              { value: 'SISTEMA', label: 'Sistema Automático' },
              { value: 'INTEGRACION', label: 'Integración' },
              { value: 'MIGRACION', label: 'Migración' }
            ]}
            size="small"
          />
        </div>

        {/* Tipo de Registro */}
        <div style={{ flex: '1 1 160px' }}>
          <Select
            label="Tipo de Evento"
            value={isReversal === '' ? '' : isReversal ? 'true' : 'false'}
            onChange={(e) => {
              if (e.target.value === '') onIsReversalChange('');
              else onIsReversalChange(e.target.value === 'true');
            }}
            options={[
              { value: '', label: 'Todos los Eventos' },
              { value: 'true', label: 'Solo Reversos (Compensación)' },
              { value: 'false', label: 'Solo Transiciones Normales' }
            ]}
            size="small"
          />
        </div>

        {/* Fecha Desde */}
        <div style={{ flex: '1 1 160px' }}>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              onStartDateChange(start);
              onEndDateChange(end);
            }}
            size="small"
            mode="date"
          />
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="primary"
            leftIcon={<Search size={15} />}
            onClick={onSearch}
            disabled={isLoading}
            size="xs"
          >
            Filtrar
          </Button>
          <Button
            variant="subtle"
            leftIcon={<RotateCcw size={15} />}
            onClick={onReset}
            disabled={isLoading}
            size="xs"
            color="warning"
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};
