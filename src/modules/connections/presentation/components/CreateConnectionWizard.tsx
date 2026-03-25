import React from 'react';
import ReactDOM from 'react-dom';
import { X, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useConnectionsViewModel } from '@/modules/connections/presentation/hooks/useConnectionsViewModel';
import { ClientSelectionStep } from './Steps/ClientSelectionStep';
import { PropertySelectionStep } from './Steps/PropertySelectionStep';
import { BasicConnectionStep } from './Steps/BasicConnectionStep';
import { TechnicalConnectionStep } from './Steps/TechnicalConnectionStep';
import { GetPropertyContextProvider } from '@/modules/properties/presentation/context/GetPropertiesContext';
import './CreateConnectionWizard.css';
import { FaTools, FaUserCog, FaCheckCircle } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';

interface CreateConnectionWizardProps {
  onClose: () => void;
  viewModel: ReturnType<typeof useConnectionsViewModel>;
}

export const CreateConnectionWizard: React.FC<CreateConnectionWizardProps> = ({
  onClose,
  viewModel
}) => {
  const { t } = useTranslation();
  const { state, actions } = viewModel;
  const {
    activeStep,
    formData,
    rates,
    pendingClientData,
    isClientExisting,
    clientType,
    isLoading: loading
  } = state;

  const {
    setActiveStep,
    handleInputChange,
    handleWizardSave,
    onClientConfirm
  } = actions;

  const nextStep = () => setActiveStep((prev: number) => prev + 1);
  const prevStep = () => setActiveStep((prev: number) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <ClientSelectionStep
            onConfirm={onClientConfirm}
            initialData={pendingClientData}
            initialType={clientType}
            isClientExisting={isClientExisting}
            loading={loading}
          />
        );
      case 1:
        return (
          <BasicConnectionStep
            formData={formData}
            rates={rates}
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
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <GetPropertyContextProvider>
            <PropertySelectionStep
              clientId={clientType === 'person' ? pendingClientData?.customerId : pendingClientData?.companyRuc}
              selectedPropertyKey={formData.propertyCadastralKey || null}
              onSelectProperty={(key) => handleInputChange({ name: 'propertyCadastralKey', value: key })}
              prevStep={prevStep}
              handleWizardSave={handleWizardSave}
              wizardLoading={loading}
            />
          </GetPropertyContextProvider>
        );
      default:
        return null;
    }
  };

  const steps = [
    t('connections.wizard.steps.client'),
    t('connections.wizard.steps.basic'),
    t('connections.wizard.steps.technical'),
    t('connections.wizard.steps.property')
  ];

  return ReactDOM.createPortal(
    <div className="wizard-overlay">
      <div className="wizard-container">
        <div className="wizard-header">
          <div className="wizard-title">
            <h2>{t('connections.wizard.title')}</h2>
            <p>{t('connections.wizard.stepInfo', { current: activeStep + 1, total: 4 })}</p>
          </div>
          <button onClick={onClose} className="wizard-close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="wizard-content">
          {/* Progress Bar */}
          <div className="wizard-progress">
            <div className="wizard-progress-labels">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`wizard-step-item ${index <= activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                >
                  <span className="wizard-step-label">{step}</span>
                  <div className="wizard-step-icon">
                    {index < activeStep ? (
                      <FaCheckCircle size={14} className="success-icon" />
                    ) : (
                      <>
                        {index === 0 && <FaUserCog size={14} />}
                        {index === 1 && <TbListDetails size={14} />}
                        {index === 2 && <FaTools size={14} />}
                        {index === 3 && <Home size={14} />}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="wizard-progress-track">
              <div
                className="wizard-progress-fill"
                style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
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
