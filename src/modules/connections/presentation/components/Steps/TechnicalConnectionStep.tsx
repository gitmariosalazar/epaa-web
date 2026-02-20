import React from 'react';
import type { Connection } from '@/modules/connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';

interface TechnicalConnectionStepProps {
  formData: Omit<Connection, 'connectionId'>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleWizardSave: () => void;
  prevStep: () => void;
  loading: boolean;
}

export const TechnicalConnectionStep: React.FC<
  TechnicalConnectionStepProps
> = ({ formData, handleInputChange, handleWizardSave, prevStep, loading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWizardSave();
  };

  return (
    <form onSubmit={handleSubmit} className="step-container step-animation">
      <h3 className="step-title">Step 3: Technical & Location Details</h3>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Coordinates (Combined)</label>
          <input
            type="text"
            name="connectionCoordinates"
            value={formData.connectionCoordinates}
            onChange={handleInputChange}
            placeholder="e.g., -73.935242, 40.73061"
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Zone ID</label>
          <input
            type="number"
            name="zoneId"
            value={formData.zoneId}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cadastral Key</label>
          <input
            type="text"
            name="propertyCadastralKey"
            value={formData.propertyCadastralKey}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Geometric Zone</label>
          <input
            type="text"
            name="connectionGeometricZone"
            value={formData.connectionGeometricZone}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Altitude</label>
          <input
            type="number"
            name="connectionAltitude"
            value={formData.connectionAltitude}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Precision</label>
          <input
            type="number"
            name="connectionPrecision"
            value={formData.connectionPrecision}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reference</label>
          <input
            type="text"
            name="connectionReference"
            value={formData.connectionReference}
            onChange={handleInputChange}
            className="wizard-input"
          />
        </div>
      </div>

      <div className="step-actions">
        <Button type="button" variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Connection'}
        </Button>
      </div>
    </form>
  );
};
