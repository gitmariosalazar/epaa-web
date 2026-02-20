import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { useConnectionViewModel } from '@/modules/connections/presentation/hooks/useConnectionViewModel';
import { ClientSelectionStep } from './Steps/ClientSelectionStep';
import { BasicConnectionStep } from './Steps/BasicConnectionStep';
import { TechnicalConnectionStep } from './Steps/TechnicalConnectionStep';
import './CreateConnectionWizard.css';

interface CreateConnectionWizardProps {
  onClose: () => void;
}

export const CreateConnectionWizard: React.FC<CreateConnectionWizardProps> = ({
  onClose
}) => {
  const {
    activeStep,
    setActiveStep,
    formData,
    handleInputChange,
    handleWizardSave,
    searchClient,
    createClient,
    createCompany,
    foundClient,
    loading
  } = useConnectionViewModel();

  const nextStep = () => setActiveStep((prev: number) => prev + 1);
  const prevStep = () => setActiveStep((prev: number) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <ClientSelectionStep
            foundClient={foundClient}
            searchClient={searchClient}
            createClient={createClient}
            createCompany={createCompany}
            loading={loading}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <BasicConnectionStep
            formData={formData}
            handleInputChange={handleInputChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <TechnicalConnectionStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleWizardSave={handleWizardSave}
            prevStep={prevStep}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <div className="wizard-overlay">
      <div className="wizard-container">
        <div className="wizard-header">
          <div className="wizard-title">
            <h2>New Connection Wizard</h2>
            <p>Step {activeStep + 1} of 3</p>
          </div>
          <button onClick={onClose} className="wizard-close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="wizard-content">
          {/* Progress Bar */}
          <div className="wizard-progress">
            <div className="wizard-progress-labels">
              {['Client', 'Basic Details', 'Technical'].map((step, index) => (
                <span
                  key={index}
                  className={`wizard-progress-step ${index <= activeStep ? 'active' : ''}`}
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="wizard-progress-track">
              <div
                className="wizard-progress-fill"
                style={{ width: `${((activeStep + 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>,
    document.body
  );
};
