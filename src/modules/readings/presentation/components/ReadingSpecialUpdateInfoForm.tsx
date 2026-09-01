import React from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { FaFileAlt, FaTachometerAlt, FaHistory, FaTools } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { Select } from '@/shared/presentation/components/Input/Select';
import '@/shared/presentation/styles/Input.css';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';

interface PropTypes {
  info: ReadingInfo[];
  currentReadingInput: number | '';
  setCurrentReadingInput: (value: number | '') => void;
  previousReadingInput: number | '';
  setPreviousReadingInput: (value: number | '') => void;
  observationInput: string;
  setObservationInput: (value: string) => void;
  tipoAjusteId: number | '';
  setTipoAjusteId: (value: number | '') => void;
}

const AJUSTE_OPTIONS = [
  { value: '', label: 'Seleccione un tipo de ajuste' },
  { value: '2', label: 'Corrección de Digitación' },
  { value: '3', label: 'Ajuste por Daño de Medidor' },
  { value: '4', label: 'Omisión de Cambio de Medidor' },
  { value: '5', label: 'Corrección por Estimación' },
];

export const ReadingSpecialUpdateInfoForm: React.FC<PropTypes> = ({
  info,
  currentReadingInput,
  setCurrentReadingInput,
  previousReadingInput,
  setPreviousReadingInput,
  observationInput,
  setObservationInput,
  tipoAjusteId,
  setTipoAjusteId
}) => {
  const currentReadingInfo = info[0];
  const previousReadingInfo = info[1];

  return (
    <div className="cr-reading-grid">
      <div className="cr-reading-col">
        <Input
          label={
            previousReadingInfo
              ? `Lectura Anterior ${ConverDate(currentReadingInfo?.previousReadingDate)} - ${previousReadingInfo.readingTime || ''}`
              : 'Lectura Anterior'
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
        <Select
          label="Tipo de Ajuste (Obligatorio)"

          leftIcon={<FaTools color="var(--text-muted)" />}
          options={AJUSTE_OPTIONS}
          value={tipoAjusteId.toString()}
          onChange={(e) => setTipoAjusteId(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="cr-textarea-col">

        <TextArea
          label="Justificación del Ajuste (Obligatorio)"
          leftIcon={<FaFileAlt color="var(--text-muted)" />}
          placeholder="Ingrese una justificación detallada..."
          value={observationInput}
          onChange={(e) => setObservationInput(e.target.value)}
        />
      </div>
    </div>
  );
};
