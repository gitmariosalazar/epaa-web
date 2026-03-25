import React from 'react';
import { useTranslation } from 'react-i18next';
import type {
  Connection,
  Rate
} from '@/modules/connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { CheckBox } from '@/shared/presentation/components/Input/CheckBox';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { 
  FaFileContract, 
  FaHashtag, 
  FaMapMarkerAlt, 
  FaTag 
} from 'react-icons/fa';

interface BasicConnectionStepProps {
  formData: Omit<Connection, 'connectionId'>;
  rates: any[];
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const BasicConnectionStep: React.FC<BasicConnectionStepProps> = ({
  formData,
  rates,
  handleInputChange,
  nextStep,
  prevStep
}) => {
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
      <h3 className="step-title">{t('connections.wizard.basicDetails.title')}</h3>

      <div className="form-grid">
        <div className="form-group">
          <Select
            label={t('connections.wizard.basicDetails.rateType')}
            name="connectionRateId"
            size="small"
            value={formData.connectionRateId}
            onChange={handleInputChange}
            required
            leftIcon={<FaTag size={14} />}
          >
            <option value="">{t('connections.wizard.basicDetails.selectRate')}</option>
            {rates.map((rate: Rate) => (
              <option key={rate.rateId} value={rate.rateId}>
                {rate.rateName}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label={t('connections.wizard.basicDetails.meterNumber')}
          name="connectionMeterNumber"
          size="small"
          value={formData.connectionMeterNumber}
          onChange={handleInputChange}
          required
          leftIcon={<FaHashtag size={14} />}
        />
        <Input
          label={t('connections.wizard.basicDetails.contractNumber')}
          name="connectionContractNumber"
          size="small"
          value={formData.connectionContractNumber}
          onChange={handleInputChange}
          required
          leftIcon={<FaFileContract size={14} />}
        />
        <Input
          label={t('connections.wizard.clientSelection.address')}
          name="connectionAddress"
          size="small"
          value={formData.connectionAddress}
          onChange={handleInputChange}
          required
          leftIcon={<FaMapMarkerAlt size={14} />}
        />
        <div className="input-component input--small">
          <label className="input__label">{t('connections.wizard.basicDetails.installationDate')}</label>
          <DatePicker
            size="small"
            value={
              formData.connectionInstallationDate
                ? new Date(formData.connectionInstallationDate)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            onChange={(date) => handleInputChange({ target: { name: 'connectionInstallationDate', value: date } } as any)}
          />
        </div>
        <div className="checkbox-group" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <CheckBox
            label={t('connections.wizard.basicDetails.sewerage')}
            name="connectionSewerage"
            value="sewerage"
            checked={formData.connectionSewerage}
            onCheckedChange={(checked) =>
              handleInputChange({
                target: { name: 'connectionSewerage', checked, type: 'checkbox' }
              } as any)
            }
          />
          <CheckBox
            label={t('connections.wizard.basicDetails.activeStatus')}
            name="connectionStatus"
            value="status"
            checked={formData.connectionStatus}
            onCheckedChange={(checked) =>
              handleInputChange({
                target: { name: 'connectionStatus', checked, type: 'checkbox' }
              } as any)
            }
          />
        </div>
      </div>

      <div className="step-actions">
        <Button type="button" variant="ghost" onClick={prevStep}>
          {t('common.back')}
        </Button>
        <Button type="submit">{t('connections.wizard.basicDetails.nextTechnical')}</Button>
      </div>
    </form>
  );
};
