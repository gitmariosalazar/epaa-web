import React from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { FaFileAlt, FaTachometerAlt, FaHistory } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import '@/shared/presentation/styles/Input.css';

interface PropTypes {
  info: ReadingInfo | null;
  currentReadingInput: number | '';
  setCurrentReadingInput: (value: number | '') => void;
  observationInput: string;
  setObservationInput: (value: string) => void;
}

export const ReadingInfoForm: React.FC<PropTypes> = ({
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
          value={
            info?.hasCurrentReading
              ? currentReadingInput
              : '' + info?.currentReading
          }
          onChange={(e) =>
            setCurrentReadingInput(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
          readOnly={!info?.hasCurrentReading}
          disabled={!info?.hasCurrentReading}
        />
      </div>

      <div className="input-component cr-textarea-col">
        <label className="input__label">
          Descripción o Novedades (Opcional)
        </label>
        <div className="input__container">
          <span className="input__icon-left">
            <FaFileAlt color="var(--text-muted)" />
          </span>
          <textarea
            className="input__field input__field--with-icon cr-reading-textarea"
            placeholder="Ingrese una descripción detallada..."
            value={observationInput}
            onChange={(e) => setObservationInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
