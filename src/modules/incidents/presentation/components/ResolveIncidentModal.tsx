import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import { CheckBox } from '@/shared/presentation/components/Input/CheckBox';
import { useIncidentContext } from '../context/IncidentContext';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import '../styles/ResolveIncidentModal.css';
import { IncidentWorkorderDetail } from './IncidentWorkorderDetail';
import { EvidenceFiles, FileRepositoryImpl } from '@/shared/files';

import type { OrdenTrabajoDetalle } from '@/modules/work-orders/domain/schemas/dto/response/work-orders.get.response';
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '@/modules/work-orders/application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { ProcessWorkOrderRepositoryImpl } from '@/modules/work-orders/infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

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

// ─── Custom Hook (Clean Architecture & SRP) ──────────────────────────────────
function useWorkOrderDetail(orderCode: string | null | undefined) {
  const [workOrder, setWorkOrder] = useState<OrdenTrabajoDetalle | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!orderCode) {
      setWorkOrder(null);
      return;
    }

    setLoadingOrder(true);
    // Dependency Inversion: Instantiating infrastructure in the hook layer
    const repo = new ProcessWorkOrderRepositoryImpl();
    const useCase = new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repo);

    useCase.execute(orderCode)
      .then((data) => {
        if (mounted) setWorkOrder(data);
      })
      .catch((err) => {
        console.error('Error fetching work order:', err);
        if (mounted) setWorkOrder(null);
      })
      .finally(() => {
        if (mounted) setLoadingOrder(false);
      });

    return () => { mounted = false; };
  }, [orderCode]);

  return { workOrder, loadingOrder };
}

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

  // Consuming the Hook
  const { workOrder, loadingOrder } = useWorkOrderDetail(incident?.orderCode);

  const workOrderCost = React.useMemo(() => {
    if (!workOrder) return 0;
    const matTotal = (workOrder.materiales || []).reduce((acc, m) => acc + (m.subtotal || 0), 0);
    const addTotal = (workOrder.costosAdicionales || []).reduce((acc, c) => acc + (c.total || 0), 0);
    return matTotal + addTotal;
  }, [workOrder]);

  // Form states
  const [description, setDescription] = useState('');
  const [chargeToUser, setChargeToUser] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [hiddenWoImages, setHiddenWoImages] = useState<Set<string>>(new Set());

  const handleRemoveWoImage = (idAdjunto: string) => {
    setHiddenWoImages(prev => {
      const next = new Set(prev);
      next.add(idAdjunto);
      return next;
    });
  };

  // Helper to extract true filename from backend URLs that might end in /preview or /download
  const getFilenameFromUrl = (url: string, fallback: string) => {
    if (!url) return fallback;
    try {
      const parts = url.split('?')[0].split('/').filter(Boolean);
      if (parts[parts.length - 1] === 'preview' || parts[parts.length - 1] === 'download') {
        parts.pop();
      }
      return parts.pop() || fallback;
    } catch {
      return fallback;
    }
  };

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

    // Filter out hidden work order images and get their true filenames
    const activeWoFilenames = workOrder?.adjuntos
      ?.filter((a, idx) => !hiddenWoImages.has(a.idAdjunto || idx.toString()))
      ?.map(a => getFilenameFromUrl(a.url, a.nombreArchivo)) || [];

    // Fetch the blobs for the active work order images and convert them to Base64
    let resolvedWoImagesBase64: string[] = [];
    if (activeWoFilenames.length > 0) {
      const fileRepo = new FileRepositoryImpl();
      const base64Promises = activeWoFilenames.map(async (filename) => {
        try {
          const blob = await fileRepo.preview('work_orders', filename);
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.error('Error fetching WO image for upload:', err);
          return null;
        }
      });
      const results = await Promise.all(base64Promises);
      resolvedWoImagesBase64 = results.filter(Boolean) as string[];
    }

    // Combine Base64 WO images and newly uploaded Base64 images
    const finalImages = [...resolvedWoImagesBase64, ...images];

    try {
      await resolveIncident({
        incidentId,
        resolverUserId: user?.userId || '',
        description: description.trim(),
        repairCost: workOrderCost,
        chargeToUser,
        images: finalImages
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
      <div className="incident-modal premium-theme resolve-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="incident-modal-header">
          <h3>Resolver Incidente {incident?.incidentCode}</h3>
          <Tooltip content="Cerrar" position="left">
            <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p">
              <X size={20} />
            </Button>
          </Tooltip>
        </div>

        <div className="incident-resolve-modal-body">
          {/* Left Panel - Work Order Info */}
          <div className="incident-modal-content-left">
            {loadingOrder ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Cargando detalles de orden...
              </div>
            ) : workOrder ? (
              <IncidentWorkorderDetail orden={workOrder} />
            ) : incident?.orderCode ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                No se pudo cargar la orden de trabajo.
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Este incidente no tiene una orden de trabajo asociada.
              </div>
            )}
          </div>

          {/* Right Panel - Resolution Form */}
          <div className="incident-modal-content-right">
            <form onSubmit={handleSubmit} className="incident-modal-body-form">

              {/* Incident Details Card */}
              {incident && (
                <div className="incident-resolve-info-card" style={{ margin: 0 }}>
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
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describa los trabajos de reparación o justifique la resolución..."
                  required
                />
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="input__label">Costo de Reparación ($)</label>
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>TOTAL OT</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#818cf8' }}>
                      ${workOrderCost.toFixed(2)}
                    </span>
                  </div>
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

                  {/* Existing Work Order Evidences */}
                  {workOrder?.adjuntos?.map((a, idx) => {
                    const idAdjunto = a.idAdjunto || idx.toString();
                    if (hiddenWoImages.has(idAdjunto)) return null;

                    const realFilename = getFilenameFromUrl(a.url, a.nombreArchivo);
                    return (
                      <div key={`wo-img-wrapper-${idAdjunto}`} className="evidence-image-preview-wrapper" style={{ border: 'none', background: 'transparent' }}>
                        <EvidenceFiles
                          fileId={idAdjunto}
                          filePath={realFilename}
                          category="work_orders"
                          type="OT"
                          allowDownload={false}
                          className="incident-evidence-thumb"
                        />
                        <Tooltip
                          content="Ocultar imagen"
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
                            onClick={() => handleRemoveWoImage(idAdjunto)}
                            title="Ocultar imagen"
                          >
                            <X size={12} />
                          </button>
                        </Tooltip>
                      </div>
                    );
                  })}

                  {/* New Image Previews */}
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

              <div className="incident-modal-footer" style={{ marginTop: 'auto', padding: '1rem 0 0 0', borderTop: 'none', background: 'transparent' }}>
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
        </div>

      </div>
    </div>,
    document.body
  );
};
