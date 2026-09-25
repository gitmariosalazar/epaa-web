import React from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { FaFileAlt, FaTachometerAlt, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import '@/shared/presentation/styles/Input.css';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

interface PropTypes {
  info: ReadingInfo[];
  previousReadingInput: number | '';
  setPreviousReadingInput: (value: number | '') => void;
  currentReadingInput: number | '';
  setCurrentReadingInput: (value: number | '') => void;
  observationInput: string;
  setObservationInput: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
}

export const HistoricalReadingCreateInfoForm: React.FC<PropTypes> = ({
  info,
  previousReadingInput,
  setPreviousReadingInput,
  currentReadingInput,
  setCurrentReadingInput,
  observationInput,
  setObservationInput,
  selectedMonth,
  setSelectedMonth
}) => {
  const readingInfoSelected = info[0];
  const previousReadingInfoSelected = info[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="cr-reading-grid">
        <div className="cr-reading-col">
          <Input
            label={
              previousReadingInfoSelected
                ? `Lectura Anterior ${ConverDate(previousReadingInfoSelected.previousReadingDate)} - ${previousReadingInfoSelected.readingTime || ''}`
                : 'Lectura Anterior (Editable)'
            }
            leftIcon={<FaHistory color="var(--text-muted)" />}
            type="number"
            placeholder="0.00"
            value={previousReadingInput}
            onChange={(e) =>
              setPreviousReadingInput(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            size='small'
          />
          <Input
            label={
              readingInfoSelected?.hasCurrentReading
                ? `Lectura Actual (Obligatorio)`
                : readingInfoSelected
                  ? `Lectura Actual ${ConverDate(readingInfoSelected.previousReadingDate)} - ${readingInfoSelected.readingTime || ''}`
                  : 'Lectura Actual ---'
            }
            leftIcon={<FaTachometerAlt color="var(--text-muted)" />}
            type="number"
            placeholder="0.00"
            value={currentReadingInput}
            onChange={(e) =>
              setCurrentReadingInput(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            size='small'
          />
        </div>

        <div className="cr-textarea-col">
          <TextArea
            label="Descripción o Novedades (Opcional)"
            leftIcon={<FaFileAlt color="var(--text-muted)" />}
            placeholder="Ingrese una descripción detallada..."
            value={observationInput}
            onChange={(e) => setObservationInput(e.target.value)}
            size='small'
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--background-alt)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <label style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
          <FaCalendarAlt color="var(--primary)" /> Periodo a Registrar:
        </label>
        <div style={{ maxWidth: '200px', width: '100%' }}>
          <DatePicker
            value={selectedMonth}
            onChange={(newMonth) => {
              setSelectedMonth(newMonth);
            }}
            size="xs"
            view='month'
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          (Automáticamente calculado. Modifíquelo si necesita registrar un mes diferente).
        </span>
      </div>
    </div>
  );
};
