import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProperties } from '@/modules/properties/presentation/hooks/useProperties';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MapPin, CheckCircle, Info, Building2, X } from 'lucide-react';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import './PropertySelectionStep.css';

interface PropertySelectionStepProps {
  clientId: string;
  selectedPropertyKey: string | null;
  onSelectProperty: (key: string | null) => void;
  prevStep: () => void;
  nextStep?: () => void;
  handleWizardSave?: () => void;
  wizardLoading: boolean;
  hideFooterActions?: boolean;
}

export const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({
  clientId,
  selectedPropertyKey,
  onSelectProperty,
  prevStep,
  nextStep,
  handleWizardSave,
  wizardLoading,
  hideFooterActions = false
}) => {
  const { t } = useTranslation();
  const { properties, loading, fetchPropertiesByOwner } = useProperties();

  useEffect(() => {
    if (clientId) {
      fetchPropertiesByOwner(clientId, 100, 0);
    }
  }, [clientId, fetchPropertiesByOwner]);

  const handleSelect = (cadastralKey: string) => {
    const isSelecting = selectedPropertyKey !== cadastralKey;
    onSelectProperty(isSelecting ? cadastralKey : null);

    if (isSelecting) {
      MessageToastCustom(
        'success',
        `El predio ${cadastralKey} ha sido vinculado correctamente a la acometida.`,
        'Predio vinculado',
        {
          position: 'top-right'
        }
      );
    } else {
      MessageToastCustom(
        'info',
        'Se ha desvinculado el predio. La acometida se guardará sin predio asociado.',
        'Predio desvinculado',
        {
          position: 'top-right'
        }
      );
    }
  };

  const handleDeselect = () => {
    onSelectProperty(null);
    MessageToastCustom(
      'info',
      'Se ha desvinculado el predio. La acometida se guardará sin predio asociado.',
      'Predio desvinculado',
      {
        position: 'top-right'
      }
    );
  };

  const selectedProperty = properties.find(
    (p) => p.propertyCadastralKey === selectedPropertyKey
  );

  return (
    <div className="wizard-step-content animate-fade-in property-selection-step">
      <div className="wizard-step-header">
        <h3>{t('connections.wizard.propertySelection')}</h3>
        <p>{t('connections.wizard.propertySelectionDesc')}</p>
      </div>

      <div className="property-selection-container">
        {/* Banner de estado de selección */}
        {selectedPropertyKey && selectedProperty ? (
          <div className="property-status-banner property-status-banner--selected">
            <div className="property-status-icon-wrap selected">
              <CheckCircle size={22} />
            </div>
            <div className="property-status-content">
              <div className="property-status-header-row">
                <div className="property-status-badge">
                  <span className="property-status-dot" />
                  Predio seleccionado
                </div>
                <button
                  type="button"
                  className="property-deselect-btn"
                  onClick={handleDeselect}
                  title="Desvincular este predio"
                >
                  <X size={14} />
                  Desvincular
                </button>
              </div>

              <div className="property-status-details">
                <div className="property-status-item">
                  <span className="property-status-label">
                    Clave catastral:
                  </span>
                  <span className="property-status-value key-value">
                    {selectedProperty.propertyCadastralKey}
                  </span>
                </div>
                <div className="property-status-item">
                  <span className="property-status-label">
                    {t('properties.table.address', 'Dirección')}:
                  </span>
                  <span className="property-status-value">
                    {selectedProperty.propertyAddress || 'No registrada'}
                  </span>
                </div>
                <div className="property-status-item">
                  <span className="property-status-label">
                    {t('properties.table.type', 'Tipo')}:
                  </span>
                  <span className="property-status-value type-badge">
                    {selectedProperty.propertyTypeName || 'No especificado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading &&
          properties.length > 0 && (
            <div className="property-status-banner property-status-banner--info">
              <div className="property-status-icon-wrap info">
                <Info size={20} />
              </div>
              <div className="property-status-content">
                <div className="property-status-title">
                  Ningún predio seleccionado (Opcional)
                </div>
                <p className="property-status-desc">
                  Puedes continuar y guardar la acometida sin vincular un
                  predio. Esta asociación se podrá realizar más adelante si es
                  necesario.
                </p>
              </div>
            </div>
          )
        )}

        {/* Lista de predios */}
        {loading ? (
          <div className="property-loading-container">
            <div className="spinner" />
            <p className="property-loading-text">{t('common.loading')}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="property-empty-container">
            <div className="property-empty-icon-wrap">
              <Building2 size={36} />
            </div>
            <p className="property-empty-title">
              {t('connections.wizard.noProperties')}
            </p>
            <p className="property-empty-desc">
              No se encontraron predios asociados a este cliente. Podrás guardar
              la acometida sin predio.
            </p>
          </div>
        ) : (
          <div className="properties-list-container">
            <div className="properties-list-header">
              <span className="properties-count-badge">
                {properties.length}{' '}
                {properties.length === 1
                  ? 'predio disponible'
                  : 'predios disponibles'}
              </span>
              <span className="properties-hint">
                Haz clic en una tarjeta para seleccionarla o desmarcarla
              </span>
            </div>

            <div className="properties-list">
              {properties.map((prop) => {
                const isSelected =
                  selectedPropertyKey === prop.propertyCadastralKey;

                return (
                  <div
                    key={prop.propertyCadastralKey}
                    className={`property-card ${isSelected ? 'selected property-card-selected' : ''}`}
                    onClick={() => handleSelect(prop.propertyCadastralKey)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(prop.propertyCadastralKey);
                      }
                    }}
                  >
                    {isSelected && (
                      <div className="property-card-selected-badge">
                        <CheckCircle size={12} />
                        <span>Seleccionado</span>
                      </div>
                    )}

                    <div className="property-card-header">
                      <div
                        className={`${isSelected ? 'property-card-pin-selected' : 'property-card-pin'}`}
                      >
                        <MapPin size={16} />
                      </div>
                      <span className="property-card-cadastral-key">
                        {prop.propertyCadastralKey}
                      </span>
                    </div>

                    <div className="property-card-body">
                      <div className="property-card-field">
                        <span className="field-label">
                          {t('properties.table.address', 'Dirección')}:
                        </span>
                        <span className="field-value">
                          {prop.propertyAddress || 'No registrada'}
                        </span>
                      </div>

                      <div className="property-card-field">
                        <span className="field-label">
                          {t('properties.table.type', 'Tipo')}:
                        </span>
                        <span className="field-value field-badge">
                          {prop.propertyTypeName || 'No especificado'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acciones */}
        {!hideFooterActions && (
          <div className="wizard-step-actions sticky-wizard-footer">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={wizardLoading}
            >
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              onClick={nextStep || handleWizardSave}
              disabled={wizardLoading}
            >
              {nextStep
                ? t('common.next', 'Siguiente')
                : wizardLoading
                  ? t('common.saving')
                  : selectedPropertyKey
                    ? t('connections.wizard.saveWithProperty')
                    : t('connections.wizard.saveWithoutProperty')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
