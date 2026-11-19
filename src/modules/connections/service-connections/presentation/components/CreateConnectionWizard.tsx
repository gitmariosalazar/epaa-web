import React from 'react';
import { Home, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useConnectionsViewModel } from '@/modules/connections/service-connections/presentation/hooks/useConnectionsViewModel';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ClientSelectionStep } from './Steps/ClientSelectionStep';
import { PropertySelectionStep } from './Steps/PropertySelectionStep';
import { BasicConnectionStep } from './Steps/BasicConnectionStep';
import { TechnicalConnectionStep } from './Steps/TechnicalConnectionStep';
import { BasicUpdateConnectionStep } from './Steps/BasicUpdateConnectionStep';
import { GetPropertyContextProvider } from '@/modules/properties/presentation/context/GetPropertiesContext';
import type { CreateCustomerRequest } from '@/modules/customers/domain/repositories/CustomerRepository';
import type { CreateCompanyRequest } from '@/modules/customers/domain/repositories/CompanyRepository';
import './CreateConnectionWizard.css';
import { FaTools, FaUserCog, FaCheckCircle } from 'react-icons/fa';
import { TbListDetails } from 'react-icons/tb';

interface CreateConnectionWizardProps {
  onClose: () => void;
  viewModel: ReturnType<typeof useConnectionsViewModel>;
  isOpen?: boolean;
}

export const CreateConnectionWizard: React.FC<CreateConnectionWizardProps> = ({
  onClose,
  viewModel,
  isOpen = true
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
    selectedConnection,
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
            hideFooterActions={true}
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
            hideFooterActions={true}
          />
        );
      case 2:
        return (
          <TechnicalConnectionStep
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            hideFooterActions={true}
          />
        );
      case 3:
        return (
          <GetPropertyContextProvider>
            <PropertySelectionStep
              clientId={
                clientType === 'person'
                  ? (
                      pendingClientData as CreateCustomerRequest
                    )?.customerId.toString()
                  : (pendingClientData as CreateCompanyRequest)?.companyRuc
              }
              selectedPropertyKey={formData.propertyCadastralKey || null}
              onSelectProperty={(key) =>
                handleInputChange({
                  name: 'propertyCadastralKey',
                  value: key || ''
                })
              }
              prevStep={prevStep}
              nextStep={nextStep}
              handleWizardSave={handleWizardSave}
              wizardLoading={loading}
              hideFooterActions={true}
            />
          </GetPropertyContextProvider>
        );
      case 4:
        return (
          <BasicUpdateConnectionStep
            formData={formData}
            selectedConnection={selectedConnection}
            handleInputChange={handleInputChange}
            prevStep={prevStep}
            handleWizardSave={handleWizardSave}
            wizardLoading={loading}
            hideFooterActions={true}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    t('connections.wizard.steps.client', 'Cliente'),
    t('connections.wizard.steps.basic', 'Acometida'),
    t('connections.wizard.steps.technical', 'Técnico'),
    t('connections.wizard.steps.property', 'Predio'),
    t('connections.wizard.steps.evidence', 'Fotos y Medidor')
  ];

  const renderFooter = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={activeStep === 0 ? onClose : prevStep}
          disabled={loading}
        >
          {activeStep === 0
            ? t('common.cancel', 'Cancelar')
            : t('common.back', 'Atrás')}
        </Button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeStep === 0 && (
            <Button
              type="submit"
              form="client-selection-form"
              variant="primary"
              disabled={loading}
              isLoading={loading}
            >
              {loading
                ? t(
                    'connections.wizard.clientSelection.processing',
                    'Procesando...'
                  )
                : isClientExisting
                  ? t(
                      'connections.wizard.clientSelection.updateContinue',
                      'Actualizar y Continuar'
                    )
                  : t(
                      'connections.wizard.clientSelection.createContinue',
                      'Confirmar y Continuar'
                    )}
            </Button>
          )}

          {activeStep === 1 && (
            <Button
              type="submit"
              form="basic-connection-form"
              variant="primary"
              disabled={loading}
            >
              {t(
                'connections.wizard.basicDetails.nextTechnical',
                'Continuar a Detalles Técnicos'
              )}
            </Button>
          )}

          {activeStep === 2 && (
            <Button
              type="submit"
              form="technical-connection-form"
              variant="primary"
              disabled={loading}
            >
              {t('common.next', 'Siguiente')}
            </Button>
          )}

          {activeStep === 3 && (
            <Button
              type="button"
              variant="primary"
              onClick={nextStep}
              disabled={loading}
            >
              {t('common.next', 'Siguiente')}
            </Button>
          )}

          {activeStep === 4 && (
            <Button
              type="submit"
              form="basic-update-connection-form"
              variant="primary"
              disabled={loading}
              isLoading={loading}
            >
              {loading
                ? t('common.saving', 'Guardando...')
                : selectedConnection
                  ? t(
                      'connections.wizard.basicUpdate.saveUpdate',
                      'Actualizar Acometida'
                    )
                  : t(
                      'connections.wizard.basicUpdate.saveConnection',
                      'Guardar Acometida'
                    )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      icon={<FaTools size={20} />}
      headerColor="indigo"
      title={
        selectedConnection
          ? t('connections.wizard.editTitle', 'Actualizar Acometida')
          : t('connections.wizard.title', 'Registro de Acometida')
      }
      description={t('connections.wizard.stepInfo', {
        current: activeStep + 1,
        total: 5
      })}
      footer={renderFooter()}
    >
      <div
        className="wizard-content"
        style={{ padding: 0, background: 'transparent' }}
      >
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
                      {index === 4 && <Camera size={14} />}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="wizard-progress-track">
            <div
              className="wizard-progress-fill"
              style={{ width: `${((activeStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="wizard-steps">{renderStep()}</div>
    </Modal>
  );
};
