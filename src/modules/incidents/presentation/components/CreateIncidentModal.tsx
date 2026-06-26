import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useIncidentContext } from '../context/IncidentContext';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress/CircularProgress';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { GeoLocationDisplay, GeoSection, useGeolocation } from '@/shared/presentation/components/GeoLocation';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ isOpen, onClose }) => {
  const { categories, createIncident, isLoading } = useIncidentContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [connectionId, setConnectionId] = useState('');
  const [readingId, setReadingId] = useState('');
  const [incidentTypeId, setIncidentTypeId] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [referenceAddress, setReferenceAddress] = useState('');
  const [reportOrigin, setReportOrigin] = useState<'LECTURISTA' | 'ATENCION_AL_CLIENTE' | 'INSPECTOR' | 'WEB_USUARIO'>('ATENCION_AL_CLIENTE');
  const [priority, setPriority] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Geolocation and uploader state & refs
  const geo = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync lat/lng form state from geocoded address
  useEffect(() => {
    if (geo.address) {
      setLatitude(String(geo.address.latitude));
      setLongitude(String(geo.address.longitude));
    } else {
      setLatitude('');
      setLongitude('');
    }
  }, [geo.address]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTypeId) {
      setFormError('Por favor seleccione un tipo de incidente.');
      return;
    }
    if (!reportDescription.trim()) {
      setFormError('Por favor describa el reporte.');
      return;
    }
    if (!referenceAddress.trim()) {
      setFormError('Por favor ingrese la dirección de referencia.');
      return;
    }
    if (!latitude || !longitude) {
      setFormError('Por favor capture la ubicación GPS.');
      return;
    }
    if (images.length === 0) {
      setFormError('Por favor cargue al menos una imagen de evidencia.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createIncident({
        connectionId: connectionId.trim() || null,
        readingId: readingId ? Number(readingId) : null,
        incidentTypeId: Number(incidentTypeId),
        reportDescription: reportDescription.trim(),
        referenceAddress: referenceAddress.trim() || null,
        reportOrigin,
        priority,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        images: images.length > 0 ? images : []
      });
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Error al reportar el incidente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return createPortal(
      <div className="incident-modal-overlay" onClick={onClose}>
        <div className="incident-modal premium-theme" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }} onClick={(e) => e.stopPropagation()}>
          <CircularProgress size={60} label="Cargando..." />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="incident-modal-overlay" onClick={onClose}>
      <div className="incident-modal premium-theme" onClick={(e) => e.stopPropagation()}>
        <div className="incident-modal-header">
          <h3>Reportar Nuevo Incidente</h3>
          <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="incident-modal-body">
          <div className="form-grid">
            <div className="form-group">
              <Input
                label="Clave Catastral / Conexión ID (Opcional)"
                type="text"
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
                placeholder="Ej. 10-310"
              />
            </div>

            <div className="form-group">
              <Input
                label="ID de Lectura (Opcional)"
                type="number"
                value={readingId}
                onChange={(e) => setReadingId(e.target.value)}
                placeholder="Ej. 1482"
              />
            </div>
          </div>

          <div className="form-group">
            <Select
              label="Tipo de Incidente *"
              value={incidentTypeId}
              onChange={(e) => setIncidentTypeId(e.target.value)}
              required
            >
              <option value="">-- Seleccione un tipo --</option>
              {categories.flatMap((category) =>
                category.incidentTypes.map((type: any) => (
                  <option key={type.typeCode} value={type.typeCode}>
                    {`${category.categoryName} - ${type.typeName}`}
                  </option>
                ))
              )}
            </Select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Select
                label="Prioridad *"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </Select>
            </div>

            <div className="form-group">
              <Select
                label="Origen del Reporte *"
                value={reportOrigin}
                onChange={(e) => setReportOrigin(e.target.value as any)}
              >
                <option value="LECTURISTA">Lecturista</option>
                <option value="ATENCION_AL_CLIENTE">Atención al Cliente</option>
                <option value="INSPECTOR">Inspector</option>
                <option value="WEB_USUARIO">Web de Usuario</option>
              </Select>
            </div>
          </div>

          <div className="form-group">
            <TextArea
              label="Descripción detallada del reporte *"
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describa el problema detalladamente..."
              required
            />
          </div>

          <div className="form-group">
            <Input
              label="Dirección de Referencia *"
              type="text"
              value={referenceAddress}
              onChange={(e) => setReferenceAddress(e.target.value)}
              placeholder="Ej. Calle 10 de Agosto y Av. América"
            />
          </div>

          {/* GPS capture button + geocoded address display */}
          <div className="form-group">
            <label className="input__label">Ubicación GPS *</label>
            {/* Capture button + GPS status bar only (card hidden to avoid duplicate) */}
            <GeoLocationDisplay
              address={geo.address}
              isLocating={geo.isLocating}
              isGeocoding={geo.isGeocoding}
              error={geo.error}
              onGetLocation={geo.getLocation}
              onClear={geo.clear}
              hideAddressCard
            />
            {/* GeoSection renders the geocoded address card — same as IncidentDetailModal */}
            {latitude && longitude && (
              <div style={{ marginTop: '8px' }}>
                <GeoSection lat={Number(latitude)} lng={Number(longitude)} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="input__label">Imágenes de Evidencia *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--border-color)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                background: 'var(--surface-hover)',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <UploadCloud size={28} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Cargar Fotos de Evidencia</span>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>PNG, JPG, WEBP (Múltiple)</span>
            </div>

            {images.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                  gap: '10px',
                  marginTop: '12px'
                }}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%', // 1:1 Aspect Ratio
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={img}
                      alt={`evidencia-${idx}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
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
                      <Button
                        leftIcon={<X size={10} />}
                        variant="ghost"
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          minWidth: 'auto'
                        }}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formError && (
            <div className="incident-error-banner">
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
            <Tooltip content="Reportar Incidente" position="top">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Reportando...' : 'Reportar Incidente'}
              </Button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
