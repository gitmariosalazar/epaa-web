import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Connection } from '@/modules/connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { 
  FaMapMarkerAlt, 
  FaLayerGroup, 
  FaKey, 
  FaShapes, 
  FaMountain, 
  FaBullseye, 
  FaStickyNote 
} from 'react-icons/fa';

interface TechnicalConnectionStepProps {
  formData: Omit<Connection, 'connectionId'>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const TechnicalConnectionStep: React.FC<
  TechnicalConnectionStepProps
> = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
      className="step-container step-animation"
    >
      <h3 className="step-title">{t('connections.wizard.technicalDetails.title')}</h3>

      <div className="form-grid">
        <Input
          label={t('connections.wizard.technicalDetails.longitude')}
          type="number"
          step="any"
          name="longitude"
          size="small"
          value={formData.longitude}
          onChange={handleInputChange}
          placeholder="-73.935242"
          required
          leftIcon={<FaMapMarkerAlt size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.latitude')}
          type="number"
          step="any"
          name="latitude"
          size="small"
          value={formData.latitude}
          onChange={handleInputChange}
          placeholder="40.73061"
          required
          leftIcon={<FaMapMarkerAlt size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.zoneId')}
          type="number"
          name="zoneId"
          size="small"
          value={formData.zoneId}
          onChange={handleInputChange}
          leftIcon={<FaLayerGroup size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.cadastralKey')}
          name="connectionCadastralKey"
          size="small"
          value={formData.connectionCadastralKey}
          onChange={handleInputChange}
          placeholder="e.g., 150-5500"
          info={t('connections.wizard.technicalDetails.cadastralInfo')}
          leftIcon={<FaKey size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.geometricZone')}
          name="connectionGeometricZone"
          size="small"
          value={formData.connectionGeometricZone}
          onChange={handleInputChange}
          leftIcon={<FaShapes size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.altitude')}
          type="number"
          name="connectionAltitude"
          size="small"
          value={formData.connectionAltitude}
          onChange={handleInputChange}
          leftIcon={<FaMountain size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.precision')}
          type="number"
          name="connectionPrecision"
          size="small"
          value={formData.connectionPrecision}
          onChange={handleInputChange}
          leftIcon={<FaBullseye size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.reference')}
          name="connectionReference"
          size="small"
          value={formData.connectionReference}
          onChange={handleInputChange}
          leftIcon={<FaStickyNote size={14} />}
        />
      </div>

      <div className="step-actions">
        <Button type="button" variant="ghost" onClick={prevStep}>
          {t('common.back')}
        </Button>
        <Button type="submit">
          {t('common.next')}
        </Button>
      </div>
    </form>
  );
};
