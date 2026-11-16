import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProperties } from '@/modules/properties/presentation/hooks/useProperties';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MapPin, CheckCircle, Info, Building2 } from 'lucide-react';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

interface PropertySelectionStepProps {
  clientId: string;
  selectedPropertyKey: string | null;
  onSelectProperty: (key: string | null) => void;
  prevStep: () => void;
  handleWizardSave: () => void;
  wizardLoading: boolean;
}

export const PropertySelectionStep: React.FC<PropertySelectionStepProps> = ({
  clientId,
  selectedPropertyKey,
  onSelectProperty,
  prevStep,
  handleWizardSave,
  wizardLoading
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
        'Predio vinculado'
      );
    } else {
      MessageToastCustom(
        'info',
        'Se ha desvinculado el predio. La acometida se guardará sin predio asociado.',
        'Predio desvinculado'
      );
    }
  };

  const selectedProperty = properties.find(
    (p) => p.propertyCadastralKey === selectedPropertyKey
  );

  return (
    <div className="wizard-step-content animate-fade-in">
      <div className="wizard-step-header">
        <h3>{t('connections.wizard.propertySelection')}</h3>
        <p>{t('connections.wizard.propertySelectionDesc')}</p>
      </div>

      <div
        className="property-selection-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginTop: '1.25rem'
        }}
      >
        {/* Banner de estado de selección */}
        {selectedPropertyKey && selectedProperty ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.875rem',
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
              border: '1px solid var(--primary)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.12)'
            }}
          >
            <CheckCircle
              size={22}
              color="var(--primary)"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--primary)',
                  marginBottom: '0.35rem'
                }}
              >
                Predio seleccionado
              </div>
              <div
                style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}
              >
                <strong>Clave catastral:</strong>{' '}
                {selectedProperty.propertyCadastralKey}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.15rem'
                }}
              >
                <strong>{t('properties.table.address', 'Dirección')}:</strong>{' '}
                {selectedProperty.propertyAddress || 'No registrada'}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.15rem'
                }}
              >
                <strong>{t('properties.table.type', 'Tipo')}:</strong>{' '}
                {selectedProperty.propertyTypeName || 'No especificado'}
              </div>
            </div>
          </div>
        ) : (
          !loading &&
          properties.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px'
              }}
            >
              <Info
                size={20}
                color="var(--text-muted)"
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  Ningún predio seleccionado
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.45
                  }}
                >
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
          <div
            className="loading-spinner-container"
            style={{ padding: '2.5rem', textAlign: 'center' }}
          >
            <div className="spinner" />
            <p style={{ marginTop: '0.75rem' }}>{t('common.loading')}</p>
          </div>
        ) : properties.length === 0 ? (
          <div
            className="empty-state"
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)'
            }}
          >
            <Building2
              size={48}
              style={{
                margin: '0 auto 1rem',
                color: 'var(--text-muted)',
                opacity: 0.7
              }}
            />
            <p
              style={{
                fontWeight: 500,
                marginBottom: '0.35rem',
                color: 'var(--text-primary)'
              }}
            >
              {t('connections.wizard.noProperties')}
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              No se encontraron predios asociados a este cliente. Podrás guardar
              la acometida sin predio.
            </p>
          </div>
        ) : (
          <div
            className="properties-list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
              paddingBottom: '0.25rem'
            }}
          >
            {properties.map((prop) => {
              const isSelected =
                selectedPropertyKey === prop.propertyCadastralKey;

              return (
                <div
                  key={prop.propertyCadastralKey}
                  className={`property-card ${isSelected ? 'selected' : ''}`}
                  style={{
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: '10px',
                    padding: '1.1rem 1.15rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? 'rgba(var(--primary-rgb), 0.06)'
                      : 'var(--surface)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(var(--primary-rgb), 0.15)'
                      : '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                  onClick={() => handleSelect(prop.propertyCadastralKey)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 10px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow =
                        '0 1px 3px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        right: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px'
                      }}
                    >
                      <CheckCircle size={12} />
                      Seleccionado
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.65rem',
                      paddingRight: isSelected ? '5.5rem' : 0
                    }}
                  >
                    <MapPin size={17} color="var(--primary)" />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {prop.propertyCadastralKey}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.3rem',
                      lineHeight: 1.4
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {t('properties.table.address', 'Dirección')}:
                    </strong>{' '}
                    {prop.propertyAddress || 'No registrada'}
                  </div>

                  <div
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4
                    }}
                  >
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {t('properties.table.type', 'Tipo')}:
                    </strong>{' '}
                    {prop.propertyTypeName || 'No especificado'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Acciones */}
        <div className="wizard-step-actions sticky-wizard-footer">
          <Button variant="outline" onClick={prevStep} disabled={wizardLoading}>
            {t('common.back')}
          </Button>
          <Button
            variant="primary"
            onClick={handleWizardSave}
            disabled={wizardLoading}
          >
            {wizardLoading
              ? t('common.saving')
              : selectedPropertyKey
                ? t('connections.wizard.saveWithProperty')
                : t('connections.wizard.saveWithoutProperty')}
          </Button>
        </div>
      </div>
    </div>
  );
};
