import React from 'react';
import type {
  Connection,
  Rate
} from '@/modules/connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="step-container step-animation">
      <h3 className="step-title">Step 2: Basic Connection Details</h3>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Rate Type</label>
          <select
            name="connectionRateId"
            value={formData.connectionRateId}
            onChange={handleInputChange}
            className="wizard-input"
            required
          >
            <option value="">Select a rate...</option>
            {rates.map((rate: Rate) => (
              <option key={rate.rateId} value={rate.rateId}>
                {rate.rateName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Meter Number</label>
          <input
            type="text"
            name="connectionMeterNumber"
            value={formData.connectionMeterNumber}
            onChange={handleInputChange}
            className="wizard-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contract Number</label>
          <input
            type="text"
            name="connectionContractNumber"
            value={formData.connectionContractNumber}
            onChange={handleInputChange}
            className="wizard-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="connectionAddress"
            value={formData.connectionAddress}
            onChange={handleInputChange}
            className="wizard-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Installation Date</label>
          <input
            type="date"
            name="connectionInstallationDate"
            value={
              formData.connectionInstallationDate
                ? new Date(formData.connectionInstallationDate)
                    .toISOString()
                    .split('T')[0]
                : ''
            }
            onChange={handleInputChange}
            className="wizard-input"
            required
          />
        </div>

        <div className="form-checkbox-group">
          <input
            type="checkbox"
            id="connectionSewerage"
            name="connectionSewerage"
            checked={formData.connectionSewerage}
            onChange={handleInputChange}
            className="wizard-checkbox"
          />
          <label
            htmlFor="connectionSewerage"
            className="form-label checkbox-label"
          >
            Includes Sewerage
          </label>
        </div>

        <div className="form-checkbox-group">
          <input
            type="checkbox"
            id="connectionStatus"
            name="connectionStatus"
            checked={formData.connectionStatus}
            onChange={handleInputChange}
            className="wizard-checkbox"
          />
          <label
            htmlFor="connectionStatus"
            className="form-label checkbox-label"
          >
            Active Status
          </label>
        </div>
      </div>

      <div className="step-actions">
        <Button type="button" variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit">Next: Technical Details</Button>
      </div>
    </form>
  );
};
