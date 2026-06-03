import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';

export interface FormAcometidaData {
  parroquia: string;
  barrio: string;
  calle_principal: string;
  calle_secundaria: string;
  referencia: string;
  tipo_uso: string;
  diametro_solicitado: string;
  observaciones: string;
}

export const INITIAL_FORM_ACOMETIDA: FormAcometidaData = {
  parroquia: '',
  barrio: '',
  calle_principal: '',
  calle_secundaria: '',
  referencia: '',
  tipo_uso: '',
  diametro_solicitado: '',
  observaciones: ''
};

interface FormAcometidaProps {
  data: FormAcometidaData;
  onChange: (data: FormAcometidaData) => void;
  errors?: Record<string, string>;
}

export const FormAcometida: React.FC<FormAcometidaProps> = ({ data, onChange, errors }) => {
  const update = (field: keyof FormAcometidaData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <>
      <div className="solicitud-grid-2">
        <Input
          id="sol-barrio"
          label="Barrio / Sector"
          placeholder="Ej: El Calvario"
          value={data.barrio || ''}
          onChange={update('barrio')}
          required
          error={errors?.barrio}
        />
        <Input
          id="sol-calle-principal"
          label="Calle Principal"
          placeholder="Ej: Av. 24 de Mayo"
          value={data.calle_principal || ''}
          onChange={update('calle_principal')}
          required
          error={errors?.calle_principal}
        />
        <Input
          id="sol-calle-secundaria"
          label="Calle Secundaria"
          placeholder="Ej: Calle Rocafuerte"
          value={data.calle_secundaria || ''}
          onChange={update('calle_secundaria')}
        />
        <Input
          id="sol-referencia"
          label="Referencia"
          placeholder="Ej: Frente al parque"
          value={data.referencia || ''}
          onChange={update('referencia')}
          className="solicitud-grid-2__full"
        />
      </div>

      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Detalles del Servicio</h3>
      </div>
      <div className="solicitud-grid-2">
        <Select
          label="Tipo de Uso"
          required
          value={data.tipo_uso || ''}
          onChange={update('tipo_uso')}
          size="compact"
          error={errors?.tipo_uso}
        >
          <option value="">Seleccione el tipo de uso...</option>
          <option value="Residencial">Residencial</option>
          <option value="Comercial">Comercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Servicio Público">Servicio Público</option>
        </Select>

        <Select
          id="sol-diametro"
          label="Diámetro Solicitado"
          required
          value={data.diametro_solicitado || ''}
          onChange={update('diametro_solicitado')}
          size="compact"
          error={errors?.diametro_solicitado}
        >
          <option value="">Seleccione el diámetro...</option>
          <option value="1/2">½ pulgada</option>
          <option value="3/4">¾ pulgada</option>
          <option value="1">1 pulgada</option>
          <option value="1.5">1½ pulgadas</option>
          <option value="2">2 pulgadas</option>
        </Select>

        <div className="input-component solicitud-grid-2__full">
          <label className="input__label">Observaciones Adicionales</label>
          <div className="input__container">
            <textarea
              id="sol-observaciones"
              className="input__field solicitud-textarea"
              placeholder="Información adicional sobre el predio o la solicitud..."
              value={data.observaciones || ''}
              onChange={update('observaciones')}
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  );
};
