import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';

export interface FormSuspensionData {
  tipo_suspension: string;
  tiempo_estimado: string;
  motivo: string;
}

export const INITIAL_FORM_SUSPENSION: FormSuspensionData = {
  tipo_suspension: '',
  tiempo_estimado: '',
  motivo: ''
};

interface FormSuspensionProps {
  data: FormSuspensionData;
  onChange: (data: FormSuspensionData) => void;
  errors?: Record<string, string>;
}

export const FormSuspension: React.FC<FormSuspensionProps> = ({ data, onChange, errors }) => {
  const update = (field: keyof FormSuspensionData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <>
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Detalles de la Suspensión</h3>
      </div>
      <div className="solicitud-grid-2">
        <Select
          label="Tipo de Suspensión"
          required
          value={data.tipo_suspension || ''}
          onChange={update('tipo_suspension')}
          size="compact"
          error={errors?.tipo_suspension}
        >
          <option value="">Seleccione el tipo...</option>
          <option value="temporal">Temporal</option>
          <option value="definitiva">Definitiva</option>
        </Select>
        
        {data.tipo_suspension === 'temporal' && (
          <Input
            id="sol-tiempo"
            label="Tiempo Estimado (meses)"
            placeholder="Ej: 3 meses"
            value={data.tiempo_estimado || ''}
            onChange={update('tiempo_estimado')}
            required
            error={errors?.tiempo_estimado}
          />
        )}

        <div className="input-component solicitud-grid-2__full">
          <label className="input__label">
            Motivo de la Solicitud
            <span className="input__required-mark"> *</span>
          </label>
          <div className="input__container">
            <textarea
              id="sol-motivo"
              className={`input__field solicitud-textarea ${errors?.motivo ? 'input__field--error' : ''}`}
              placeholder="Explique el motivo por el cual solicita la suspensión..."
              value={data.motivo || ''}
              onChange={update('motivo')}
              required
              rows={3}
            />
          </div>
          {errors?.motivo && <span className="input__error">{errors.motivo}</span>}
        </div>
      </div>
    </>
  );
};
