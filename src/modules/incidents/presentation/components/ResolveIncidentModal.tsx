import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { CheckBox } from '@/shared/presentation/components/Input/CheckBox';
import { useIncidentContext } from '../context/IncidentContext';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

interface ResolveIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

// Helper to compress images client-side before base64 conversion
const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas 2d context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  const { resolveIncident, incidents } = useIncidentContext();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Find the incident object from the list to display its information
  const incident = incidents.find((i) => i.incidentId === incidentId);

  // Form states
  const [description, setDescription] = useState('');
  const [repairCost, setRepairCost] = useState('0');
  const [chargeToUser, setChargeToUser] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Uploader ref & handlers
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setFormError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedBase64 = await compressImage(file);
        setImages((prev) => [...prev, compressedBase64]);
      } catch (err) {
        console.error('Error compressing image:', err);
        setFormError('No se pudo procesar una de las imágenes.');
      }
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError('Por favor describa la resolución/reparación.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await resolveIncident({
        incidentId,
        resolverUserId: user?.userId || '',
        description: description.trim(),
        repairCost: Number(repairCost) || 0,
        chargeToUser,
        images: images.length > 0 ? images : []
      });
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Error al resolver el incidente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="incident-modal-overlay" onClick={onClose}>
      <div className="incident-modal premium-theme" onClick={(e) => e.stopPropagation()}>
        <div className="incident-modal-header">
          <h3>Resolver Incidente {incident?.incidentCode}</h3>
          <Tooltip content="Cerrar" position="left">
            <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p">
              <X size={20} />
            </Button>
          </Tooltip>
        </div>

        <form onSubmit={handleSubmit} className="incident-modal-body">
          {/* Incident Details Card */}
          {incident && (
            <div className="incident-resolve-info-card">
              <div className="info-card-header">
                <span className="info-card-title">Información del Incidente</span>
                {incident.suggestedPriority && (
                  <span
                    className={`priority-badge priority-${incident.suggestedPriority.toLowerCase()}`}
                  >
                    {incident.suggestedPriority}
                  </span>
                )}
              </div>
              <div className="info-card-grid">
                {incident.connectionId && (
                  <div className="info-card-item">
                    <span className="info-label">Clave Catastral / Conexión:</span>
                    <span className="info-value">{incident.connectionId}</span>
                  </div>
                )}
                {(incident.categoryName || incident.incidentTypeName) && (
                  <div className="info-card-item">
                    <span className="info-label">Categoría / Tipo:</span>
                    <span className="info-value">
                      {incident.categoryName} - {incident.incidentTypeName}
                    </span>
                  </div>
                )}
              </div>
              {incident.reportDescription && (
                <div className="info-card-desc">
                  <span className="info-label">Descripción del Problema:</span>
                  <p className="info-desc-text">{incident.reportDescription}</p>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <TextArea
              label="Descripción del Trabajo Realizado / Resolución *"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa los trabajos de reparación o justifique la resolución..."
              required
            />
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '1.25rem' }}>
            <div className="form-group">
              <Input
                label="Costo de Reparación ($)"
                type="number"
                step="0.01"
                min="0"
                value={repairCost}
                onChange={(e) => setRepairCost(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.56rem' }}>
              <div className={`charge-checkbox-card ${chargeToUser ? 'is-checked' : ''}`}>
                <CheckBox
                  checked={chargeToUser}
                  onCheckedChange={setChargeToUser}
                  label="Cobrar a la Planilla del Usuario"
                  name="chargeToUser"
                  value="charge"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="input__label">Imágenes de Resolución / Reparación</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div className="evidence-upload-container">
              {/* Uploader Box */}
              <div
                className="evidence-upload-trigger-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={20} className="upload-trigger-icon" />
                <span className="upload-trigger-text">Cargar</span>
              </div>

              {/* Image Previews */}
              {images.map((img, idx) => (
                <div key={idx} className="evidence-image-preview-wrapper">
                  <img src={img} alt={`resolucion-${idx}`} className="evidence-image-preview" />
                  <Tooltip
                    content="Eliminar imagen"
                    position="top"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      zIndex: 10
                    }}
                  >
                    <button
                      type="button"
                      className="evidence-image-remove-btn"
                      onClick={() => handleRemoveImage(idx)}
                      title="Eliminar imagen"
                    >
                      <X size={12} />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {formError && (
            <div className="incident-error-banner" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="incident-modal-footer">
            <Tooltip content="Cancelar" position="top">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
            </Tooltip>
            <Tooltip content="Resolver Incidente" position="top">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Resolver Incidente'}
              </Button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
