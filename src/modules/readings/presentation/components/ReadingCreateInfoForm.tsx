import React from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { FaFileAlt, FaTachometerAlt, FaHistory } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import '@/shared/presentation/styles/Input.css';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';

interface PropTypes {
  info: ReadingInfo[];
  currentReadingInput: number | '';
  setCurrentReadingInput: (value: number | '') => void;
  observationInput: string;
  setObservationInput: (value: string) => void;
}

export const ReadingCreateInfoForm: React.FC<PropTypes> = ({
  info,
  currentReadingInput,
  setCurrentReadingInput,
  observationInput,
  setObservationInput
}) => {
  const readingInfoSelected = info[0];
  const previousReadingInfoSelected = info[1];
  return (
    <div className="cr-reading-grid">
      <div className="cr-reading-col">
        <Input
          label={`Lectura Anterior ${ConverDate(previousReadingInfoSelected?.previousReadingDate) + ' - ' + previousReadingInfoSelected.readingTime || ''}`}
          leftIcon={<FaHistory color="var(--text-muted)" />}
          type="text"
          value={
            readingInfoSelected?.hasCurrentReading
              ? '' + readingInfoSelected?.currentReading
              : readingInfoSelected?.previousReading
          }
          readOnly
          disabled
        />
        <Input
          label={
            readingInfoSelected?.hasCurrentReading
              ? `Lectura Actual (Obligatorio)`
              : `Lectura Actual ${ConverDate(readingInfoSelected?.previousReadingDate) + ' - ' + readingInfoSelected?.readingTime || ''}`
          }
          leftIcon={<FaTachometerAlt color="var(--text-muted)" />}
          type="number"
          placeholder="0.00"
          value={
            readingInfoSelected?.hasCurrentReading
              ? currentReadingInput
              : '' + readingInfoSelected?.currentReading
          }
          onChange={(e) =>
            setCurrentReadingInput(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          readOnly={!readingInfoSelected?.hasCurrentReading}
          disabled={!readingInfoSelected?.hasCurrentReading}
          focused={readingInfoSelected?.hasCurrentReading}
        />
      </div>

      <div className="cr-textarea-col">
        <TextArea
          label="Descripción o Novedades (Opcional)"
          leftIcon={<FaFileAlt color="var(--text-muted)" />}
          placeholder="Ingrese una descripción detallada..."
          value={observationInput}
          onChange={(e) => setObservationInput(e.target.value)}
        />
      </div>
    </div>
  );
};
