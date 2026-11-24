import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UploadCloud,
  Trash2,
  X,
  ZoomIn,
  AlertTriangle,
  Camera,
  Info
} from 'lucide-react';
import { BsSpeedometer } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import type { Connection } from '@/modules/connections/service-connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Alert } from '@/shared/presentation/components/Alert';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import './BasicUpdateConnectionStep.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { MdPhotoLibrary } from 'react-icons/md';
import { ConnectionPhotosPopoverModal } from '../ConnectionPhotosPopoverModal';

export interface BasicUpdatePayload {
  meterNumber?: string | null;
  photosFacade: File[];
  photosMeter: File[];
  photosFacadeDescriptions: string[];
  photosMeterDescriptions: string[];
}

export interface BasicUpdateConnectionStepProps {
  formData: Omit<Connection, 'connectionId'>;
  selectedConnection?: Connection | null;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string | number | boolean | Date | object }
  ) => void;
  prevStep: () => void;
  handleWizardSave: (basicUpdateData?: BasicUpdatePayload) => Promise<void>;
  wizardLoading: boolean;
  hideFooterActions?: boolean;
  formId?: string;
  headerTitle?: string;
}

export const BasicUpdateConnectionStep: React.FC<
  BasicUpdateConnectionStepProps
> = ({
  formData,
  selectedConnection,
  handleInputChange,
  prevStep,
  handleWizardSave,
  wizardLoading,
  hideFooterActions = false,
  formId = 'basic-update-connection-form',
  headerTitle
}) => {
  const { t } = useTranslation();

  // Local state for meter number
  const [meterNumber, setMeterNumber] = useState<string>(
    formData.connectionMeterNumber ||
      selectedConnection?.connectionMeterNumber ||
      ''
  );

  // File lists
  const [photosFacade, setPhotosFacade] = useState<File[]>([]);
  const [photosMeter, setPhotosMeter] = useState<File[]>([]);
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Lightbox preview modal state
  const [previewModal, setPreviewModal] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Refs for hidden file inputs
  const facadeInputRef = useRef<HTMLInputElement | null>(null);
  const meterInputRef = useRef<HTMLInputElement | null>(null);

  // Create and manage object URLs for previews to prevent memory leaks
  const facadePreviews = useMemo(() => {
    return photosFacade.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [photosFacade]);

  const meterPreviews = useMemo(() => {
    return photosMeter.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }, [photosMeter]);

  // Clean up object URLs on change or unmount
  useEffect(() => {
    return () => {
      facadePreviews.forEach((item) => URL.revokeObjectURL(item.url));
      meterPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [facadePreviews, meterPreviews]);

  // Resolved connection identifiers and existing photos for evidence inspection
  const resolvedCadastralKey = useMemo(() => {
    return (
      selectedConnection?.connectionCadastralKey ||
      selectedConnection?.connectionId ||
      formData.connectionCadastralKey ||
      null
    );
  }, [selectedConnection, formData.connectionCadastralKey]);

  const initialPhotosFacade = useMemo(() => {
    return (selectedConnection as any)?.photoFacade || null;
  }, [selectedConnection]);

  const initialPhotosMeter = useMemo(() => {
    return (selectedConnection as any)?.photoMeter || null;
  }, [selectedConnection]);

  // Handle meter number input change
  const handleMeterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMeterNumber(value);
    handleInputChange({ name: 'connectionMeterNumber', value });
  };

  // Handle file additions
  const handleAddPhotos = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'facade' | 'meter'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (newFiles.length === 0) {
      MessageToastCustom(
        'warning',
        'Solo se permiten archivos de imagen (JPG, PNG, WEBP).',
        'Formato no válido',
        {
          position: 'top-right'
        }
      );
      return;
    }

    if (type === 'facade') {
      if (photosFacade.length + newFiles.length > 10) {
        MessageToastCustom(
          'warning',
          'Máximo 10 fotos permitidas para la fachada.',
          'Límite de fotos',
          {
            position: 'top-right'
          }
        );
        const available = 10 - photosFacade.length;
        if (available > 0) {
          setPhotosFacade((prev) => [...prev, ...newFiles.slice(0, available)]);
        }
      } else {
        setPhotosFacade((prev) => [...prev, ...newFiles]);
      }
    } else {
      if (photosMeter.length + newFiles.length > 10) {
        MessageToastCustom(
          'warning',
          'Máximo 10 fotos permitidas para el medidor.',
          'Límite de fotos',
          {
            position: 'top-right'
          }
        );
        const available = 10 - photosMeter.length;
        if (available > 0) {
          setPhotosMeter((prev) => [...prev, ...newFiles.slice(0, available)]);
        }
      } else {
        setPhotosMeter((prev) => [...prev, ...newFiles]);
      }
    }

    e.target.value = '';
  };

  // Remove photo by index
  const handleRemovePhoto = (type: 'facade' | 'meter', index: number) => {
    if (type === 'facade') {
      setPhotosFacade((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPhotosMeter((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);

    const hasPhotosFacade = photosFacade.length > 0;
    const hasPhotosMeter = photosMeter.length > 0;

    // If user attached photos to only one category, warn that both are expected
    if (
      (hasPhotosFacade && !hasPhotosMeter) ||
      (!hasPhotosFacade && hasPhotosMeter)
    ) {
      MessageToastCustom(
        'warning',
        'Si vas a adjuntar fotos, debes incluir al menos 1 foto de la fachada y 1 del medidor.',
        'Fotos Incompletas',
        {
          position: 'top-right'
        }
      );
      return;
    }

    const basicUpdatePayload: BasicUpdatePayload = {
      meterNumber: meterNumber.trim() ? meterNumber.trim() : null,
      photosFacade,
      photosMeter,
      photosFacadeDescriptions: photosFacade.map(() => 'Fachada'),
      photosMeterDescriptions: photosMeter.map(() => 'Medidor')
    };

    await handleWizardSave(basicUpdatePayload);
  };

  const isFormPartiallyFilled =
    (photosFacade.length > 0 && photosMeter.length === 0) ||
    (photosFacade.length === 0 && photosMeter.length > 0);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="basic-update-step-container"
    >
      {/* Header */}
      <div className="basic-update-header">
        <div className="basic-update-header-content">
          <div>
            <h3>
              {headerTitle ||
                t(
                  'connections.wizard.basicUpdate.title',
                  'Paso 5: Evidencia Fotográfica y Medidor'
                )}
            </h3>
            <p>
              {t(
                'connections.wizard.basicUpdate.subtitle',
                'Adjunta las fotografías de la fachada del predio y del medidor para respaldar el registro de la acometida.'
              )}
            </p>
          </div>
          <div className="basic-update-header-actions">
            <ConnectionPhotosPopoverModal
              cadastralKey={resolvedCadastralKey}
              connectionId={selectedConnection?.connectionId || null}
              photosFacade={initialPhotosFacade}
              photosMeter={initialPhotosMeter}
              trigger={
                <Tooltip
                  content={t(
                    'connections.wizard.basicUpdate.viewPreviousPhotos',
                    'Ver fotos anteriores'
                  )}
                  position="top"
                  followCursor={false}
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="dashed"
                    color="amber"
                    aria-label={t(
                      'connections.wizard.basicUpdate.viewPreviousPhotos',
                      'Ver fotos anteriores'
                    )}
                    leftIcon={<MdPhotoLibrary size={18} />}
                  >
                    Ver fotos anteriores
                  </Button>
                </Tooltip>
              }
            />
          </div>
        </div>
      </div>

      {/* Connection Info Summary Card */}
      <div className="connection-summary-card">
        <div className="summary-item">
          <span className="summary-label">
            {t(
              'connections.wizard.basicUpdate.cadastralKey',
              'Clave Catastral'
            )}
          </span>
          <span className="summary-value">
            {formData.connectionCadastralKey ||
              selectedConnection?.connectionCadastralKey ||
              t('common.notAssigned', 'No asignada')}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">
            {t('connections.wizard.basicUpdate.client', 'Cliente')}
          </span>
          <span className="summary-value">
            {formData.clientId ||
              selectedConnection?.clientId ||
              t('common.notAssigned', 'No asignado')}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">
            {t('connections.wizard.basicUpdate.property', 'Predio')}
          </span>
          <span className="summary-value">
            {formData.propertyCadastralKey ||
              selectedConnection?.propertyCadastralKey ||
              t('common.unlinked', 'Sin predio vinculado')}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">
            {t('connections.wizard.basicUpdate.rate', 'Tarifa')}
          </span>
          <span className="summary-value">
            {formData.connectionRateName ||
              selectedConnection?.connectionRateName ||
              'Agua Potable'}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">
            {t(
              'connections.wizard.basicUpdate.meterNumber',
              'Número de Medidor'
            )}
          </span>
          <span className="summary-value">
            {formData.connectionMeterNumber ||
              selectedConnection?.connectionMeterNumber ||
              t('common.notAssigned', 'No asignado')}
          </span>
        </div>
      </div>

      {/* Meter Number Section */}
      <div className="photo-section-card">
        <div className="photo-section-header">
          <div className="photo-section-title-wrap">
            <div className="photo-section-icon">
              <BsSpeedometer size={20} />
            </div>
            <div className="photo-section-titles">
              <h4>
                {t(
                  'connections.wizard.basicUpdate.meterNumberTitle',
                  'Número de Medidor'
                )}
              </h4>
              <p>
                {t(
                  'connections.wizard.basicUpdate.meterNumberSubtitle',
                  'Verifica o ajusta el número de serie troquelado en el medidor físico.'
                )}
              </p>
            </div>
          </div>
        </div>

        <Input
          name="meterNumber"
          size="small"
          placeholder="Ej: 12345678"
          value={meterNumber}
          onChange={handleMeterNumberChange}
          leftIcon={<BsSpeedometer size={16} />}
        />
      </div>

      {/* Facade Photos Section */}
      <div className="photo-section-card">
        <div className="photo-section-header">
          <div className="photo-section-title-wrap">
            <div className="photo-section-icon">
              <FaHome size={20} />
            </div>
            <div className="photo-section-titles">
              <h4>
                {t(
                  'connections.wizard.basicUpdate.facadeTitle',
                  'Fotos de la Fachada'
                )}
              </h4>
              <p>
                {t(
                  'connections.wizard.basicUpdate.facadeSubtitle',
                  'Mínimo 1 foto recomendada • Máximo 10 fotos'
                )}
              </p>
            </div>
          </div>
          <span
            className={`photo-counter-badge ${
              photosFacade.length > 0 ? 'has-photos' : ''
            }`}
          >
            {photosFacade.length} / 10 fotos
          </span>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={facadeInputRef}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleAddPhotos(e, 'facade')}
        />

        {/* Upload Trigger */}
        {photosFacade.length < 10 && (
          <div
            className="photo-upload-zone"
            onClick={() => facadeInputRef.current?.click()}
          >
            <UploadCloud size={28} color="var(--primary, #3b82f6)" />
            <span>
              {t(
                'connections.wizard.basicUpdate.uploadFacade',
                'Haga clic para seleccionar o tomar fotos de la fachada'
              )}
            </span>
            <small>Formatos: PNG, JPG, JPEG, WEBP</small>
          </div>
        )}

        {/* Thumbnails Grid */}
        {facadePreviews.length > 0 && (
          <div className="photo-gallery-grid">
            {facadePreviews.map((item, index) => (
              <div
                key={index}
                className="photo-thumbnail-card"
                onClick={() =>
                  setPreviewModal({
                    url: item.url,
                    title: `Foto Fachada #${index + 1}`
                  })
                }
              >
                <img src={item.url} alt={`Fachada ${index + 1}`} />
                <div className="photo-thumbnail-overlay">
                  <span className="photo-tag">Fachada</span>
                  <ZoomIn size={14} color="#fff" />
                </div>
                <button
                  type="button"
                  className="photo-delete-btn"
                  title="Eliminar foto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto('facade', index);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {triedSubmit && photosFacade.length === 0 && photosMeter.length > 0 && (
          <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.8rem' }}>
            {t(
              'connections.wizard.basicUpdate.facadeRequiredWithMeter',
              'Debes agregar al menos 1 foto de la fachada al adjuntar fotos del medidor.'
            )}
          </span>
        )}
      </div>

      {/* Meter Photos Section */}
      <div className="photo-section-card">
        <div className="photo-section-header">
          <div className="photo-section-title-wrap">
            <div className="photo-section-icon">
              <Camera size={20} />
            </div>
            <div className="photo-section-titles">
              <h4>
                {t(
                  'connections.wizard.basicUpdate.meterPhotosTitle',
                  'Fotos del Medidor'
                )}
              </h4>
              <p>
                {t(
                  'connections.wizard.basicUpdate.meterPhotosSubtitle',
                  'Mínimo 1 foto recomendada • Máximo 10 fotos'
                )}
              </p>
            </div>
          </div>
          <span
            className={`photo-counter-badge ${
              photosMeter.length > 0 ? 'has-photos' : ''
            }`}
          >
            {photosMeter.length} / 10 fotos
          </span>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={meterInputRef}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleAddPhotos(e, 'meter')}
        />

        {/* Upload Trigger */}
        {photosMeter.length < 10 && (
          <div
            className="photo-upload-zone"
            onClick={() => meterInputRef.current?.click()}
          >
            <UploadCloud size={28} color="var(--primary, #3b82f6)" />
            <span>
              {t(
                'connections.wizard.basicUpdate.uploadMeter',
                'Haga clic para seleccionar o tomar fotos del medidor'
              )}
            </span>
            <small>Formatos: PNG, JPG, JPEG, WEBP</small>
          </div>
        )}

        {/* Thumbnails Grid */}
        {meterPreviews.length > 0 && (
          <div className="photo-gallery-grid">
            {meterPreviews.map((item, index) => (
              <div
                key={index}
                className="photo-thumbnail-card"
                onClick={() =>
                  setPreviewModal({
                    url: item.url,
                    title: `Foto Medidor #${index + 1}`
                  })
                }
              >
                <img src={item.url} alt={`Medidor ${index + 1}`} />
                <div className="photo-thumbnail-overlay">
                  <span className="photo-tag">Medidor</span>
                  <ZoomIn size={14} color="#fff" />
                </div>
                <button
                  type="button"
                  className="photo-delete-btn"
                  title="Eliminar foto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto('meter', index);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {triedSubmit && photosMeter.length === 0 && photosFacade.length > 0 && (
          <span style={{ color: 'var(--error, #ef4444)', fontSize: '0.8rem' }}>
            {t(
              'connections.wizard.basicUpdate.meterRequiredWithFacade',
              'Debes agregar al menos 1 foto del medidor al adjuntar fotos de la fachada.'
            )}
          </span>
        )}
      </div>

      {/* Info notice if no photos */}
      {photosFacade.length === 0 && photosMeter.length === 0 && (
        <Alert
          type="info"
          dismissible={false}
          title={t(
            'connections.wizard.basicUpdate.optionalNoticeTitle',
            'Evidencia fotográfica'
          )}
          message={t(
            'connections.wizard.basicUpdate.optionalNoticeMsg',
            'Las fotografías son opcionales para guardar la acometida, pero son altamente recomendadas para auditorías y comprobaciones de campo.'
          )}
          icon={<Info size={22} />}
        />
      )}

      {/* Warning notice if partially filled */}
      {isFormPartiallyFilled && triedSubmit && (
        <Alert
          type="warning"
          dismissible={false}
          title={t('common.attention', 'Atención')}
          message={t(
            'connections.wizard.basicUpdate.incompleteWarning',
            'Completa al menos 1 foto de fachada y 1 de medidor, o elimina las fotos pendientes para continuar sin evidencia.'
          )}
          icon={<AlertTriangle size={22} />}
        />
      )}

      {/* Actions */}
      {!hideFooterActions && (
        <div className="wizard-step-actions sticky-wizard-footer">
          <Button variant="outline" onClick={prevStep} disabled={wizardLoading}>
            {t('common.back', 'Atrás')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={wizardLoading}
            isLoading={wizardLoading}
          >
            {wizardLoading
              ? t('common.saving', 'Guardando...')
              : photosFacade.length > 0 || photosMeter.length > 0
                ? t(
                    'connections.wizard.basicUpdate.saveWithEvidence',
                    'Guardar Acometida y Fotos'
                  )
                : t(
                    'connections.wizard.basicUpdate.saveConnection',
                    'Guardar Acometida'
                  )}
          </Button>
        </div>
      )}

      {/* Full size image modal */}
      {previewModal && (
        <div
          className="image-preview-modal-backdrop"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="image-preview-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="image-preview-modal-close"
              onClick={() => setPreviewModal(null)}
            >
              <X size={28} />
            </button>
            <img src={previewModal.url} alt={previewModal.title} />
            <span className="image-preview-modal-title">
              {previewModal.title}
            </span>
          </div>
        </div>
      )}
    </form>
  );
};
