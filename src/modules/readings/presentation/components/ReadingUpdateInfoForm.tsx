import React from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { FaFileAlt, FaTachometerAlt, FaHistory } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import '@/shared/presentation/styles/Input.css';

interface PropTypes {
  info: ReadingInfo | null;
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
  return (
    <div className="cr-reading-grid">
      <div className="cr-reading-col">
        <Input
          label={`Lectura Anterior ${info?.monthReading || '---'}`}
          leftIcon={<FaHistory color="var(--text-muted)" />}
          type="text"
          value={
            info?.hasCurrentReading
              ? '' + info?.currentReading
              : info?.previousReading
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
