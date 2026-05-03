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

export const ReadingUpdateInfoForm: React.FC<PropTypes> = ({
  info,
  currentReadingInput,
  setCurrentReadingInput,
  observationInput,
  setObservationInput
}) => {
  const currentReadingInfo = info[0];
  const previousReadingInfo = info[1];

  return (
    <div className="cr-reading-grid">
      <div className="cr-reading-col">
        <Input
          label={`Lectura Anterior ${ConverDate(currentReadingInfo?.previousReadingDate) + ' ' + previousReadingInfo.readingTime || '---'}`}
          leftIcon={<FaHistory color="var(--text-muted)" />}
          type="text"
          value={
            currentReadingInfo?.hasCurrentReading
              ? '' + currentReadingInfo?.currentReading
              : currentReadingInfo?.previousReading
          }
          readOnly
          disabled
        />
        <Input
          label="Lectura Actual (Obligatorio)"
          leftIcon={<FaTachometerAlt color="var(--text-muted)" />}
          type="number"
          placeholder="0.00"
          value={currentReadingInput}
          onChange={(e) =>
            setCurrentReadingInput(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          focused
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
