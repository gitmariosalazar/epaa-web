import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProperties } from '@/modules/properties/presentation/hooks/useProperties';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Home, MapPin, CheckCircle } from 'lucide-react';

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
  wizardLoading,
}) => {
  const { t } = useTranslation();
  const { properties, loading, fetchPropertiesByOwner } = useProperties();

  useEffect(() => {
    if (clientId) {
      // Assuming a large limit to get all for selection, or standard 50
      fetchPropertiesByOwner(clientId, 100, 0);
    }
  }, [clientId, fetchPropertiesByOwner]);

  const handleSelect = (cadastralKey: string) => {
    onSelectProperty(selectedPropertyKey === cadastralKey ? null : cadastralKey);
  };

  return (
    <div className="wizard-step-content animate-fade-in">
      <div className="wizard-step-header">
        <h3>{t('connections.wizard.propertySelection')}</h3>
        <p>{t('connections.wizard.propertySelectionDesc')}</p>
      </div>

      <div className="property-selection-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {loading ? (
          <div className="loading-spinner-container" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Home size={48} style={{ margin: '0 auto', color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p>{t('connections.wizard.noProperties')}</p>
          </div>
        ) : (
          <div className="properties-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {properties.map((prop) => (
              <div 
                key={prop.propertyCadastralKey} 
                className={`property-card ${selectedPropertyKey === prop.propertyCadastralKey ? 'selected' : ''}`}
                style={{
                  border: `1px solid ${selectedPropertyKey === prop.propertyCadastralKey ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  backgroundColor: selectedPropertyKey === prop.propertyCadastralKey ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--surface)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onClick={() => handleSelect(prop.propertyCadastralKey)}
              >
                {selectedPropertyKey === prop.propertyCadastralKey && (
                  <CheckCircle size={20} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} color="var(--primary)" />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{prop.propertyCadastralKey}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  <strong>{t('properties.table.address', 'Dirección')}:</strong> {prop.propertyAddress || 'N/A'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>{t('properties.table.type', 'Tipo')}:</strong> {prop.propertyTypeName || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="wizard-step-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
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
              : (selectedPropertyKey 
                ? t('connections.wizard.saveWithProperty') 
                : t('connections.wizard.saveWithoutProperty'))}
          </Button>
        </div>
      </div>
    </div>
  );
};
