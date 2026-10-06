/**
 * WorkOrderAttachmentsCard
 *
 * SRP: galería de fotos de evidencia y adjuntos de la OT.
 */
import React, { useState } from 'react';
import { Paperclip, FileText, ExternalLink, UploadCloud, X } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { AdjuntoEvidencia } from '../../../domain/schemas/dto/response/work-orders.get.response';
import './WorkOrderAttachmentsCard.css';
import { EvidenceFiles } from '@/shared/files';
import type { FileCategory } from '@/shared/files';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { MdPhotoLibrary } from 'react-icons/md';
import { PhotoLightbox } from '@/modules/incidents/presentation/components/PhotoLightbox';

interface WorkOrderAttachmentsCardProps {
  adjuntos: AdjuntoEvidencia[];
  onAddAttachment?: (files: File[]) => Promise<void>;
  isLoading?: boolean;
  category?: FileCategory;
}

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'tif']);

const isImageAttachment = (adj: AdjuntoEvidencia): boolean => {
  if (!adj) return false;

  const mime = (adj.mimeType || (adj as any).mime_type || (adj as any).type || '').toLowerCase();
  if (mime.startsWith('image/')) return true;

  const tipo = (adj.tipoAdjunto || (adj as any).tipo_adjunto || '').toLowerCase();
  if (tipo.startsWith('image/') || tipo === 'foto' || tipo === 'imagen') return true;

  const filename = adj.nombreArchivo || (adj as any).nombre_archivo || adj.url || '';
  const ext = filename.split('?')[0].split('.').pop()?.toLowerCase();
  return ext ? IMAGE_EXTENSIONS.has(ext) : false;
};

export const WorkOrderAttachmentsCard: React.FC<WorkOrderAttachmentsCardProps> = ({
  adjuntos: adjuntosRaw,
  onAddAttachment,
  isLoading = false,
  category = 'work_orders',
}) => {
  const adjuntos = adjuntosRaw ?? [];

  // Form states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxResolutionIndex, setLightboxResolutionIndex] = useState<number | null>(null);


  const handleFilesSelected = (files: File[]) => {
    if (files.length + selectedFiles.length > 10) {
      alert('Máximo 10 archivos a la vez.');
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate previews
    const newPreviews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return ''; // No preview for docs
    });
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Cleanup object urls on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(p => {
        if (p) URL.revokeObjectURL(p);
      });
    };
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !onAddAttachment) return;
    try {
      await onAddAttachment(selectedFiles);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) { }
  };

  if (adjuntos.length === 0 && !onAddAttachment) {
    return (
      <Card title="Evidencia de Campo" className="wo-detail-card">
        <p className="wo-empty-text">No se han cargado adjuntos para esta orden.</p>
      </Card>
    );
  }

  const imagenes = adjuntos.filter(isImageAttachment);
  const documentos = adjuntos.filter((a) => !isImageAttachment(a));

  const isResolutionPhoto = (adj: AdjuntoEvidencia) => {
    const t = (adj.tipoAdjunto || '').toUpperCase();
    return (
      t.includes('RESOLUCION') ||
      t.includes('RESOLUC') ||
      t.includes('EJECUC') ||
      t.includes('FINAL') ||
      t.includes('DESPUES') ||
      t.includes('SALIDA')
    );
  };

  const photosReport = imagenes.filter((a) => !isResolutionPhoto(a));
  const photosResolution = imagenes.filter((a) => isResolutionPhoto(a));

  return (
    <Card title={`Evidencia de Campo (${adjuntos.length})`} className="wo-detail-card">
      {adjuntos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: onAddAttachment ? '1rem' : '0' }}>
          <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay adjuntos cargados para esta orden.</p>
        </div>
      ) : (
        <>
          {/* ── Evidencia Fotográfica de Reporte ── */}
          <div className="detail-section" style={{ marginBottom: '1.25rem' }}>
            <h4 className="detail-section-title" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              Evidencia Fotográfica de Reporte ({photosReport.length})
            </h4>
            {photosReport.length > 0 ? (
              <div className="photos-gallery">
                {photosReport.map((photo, idx) => (
                  <EvidenceFiles
                    key={photo.idAdjunto}
                    fileId={photo.idAdjunto}
                    filePath={photo.url}
                    type={photo.mimeType}
                    category={category}
                    onClick={() => setLightboxIndex(idx)}
                  />
                ))}
              </div>
            ) : (
              <div className="evidence-empty-state">
                <EmptyState
                  message="Sin evidencia de reporte"
                  description="No se ha agregado evidencia fotográfica de reporte."
                  icon={<MdPhotoLibrary size={35} className="icon-error-color" />}
                  variant="warning"
                />
              </div>
            )}
          </div>

          {/* ── Evidencia Fotográfica de Resolución ── */}
          <div className="detail-section" style={{ marginBottom: '1.25rem' }}>
            <h4 className="detail-section-title" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              Evidencia Fotográfica de Resolución ({photosResolution.length})
            </h4>
            {photosResolution.length > 0 ? (
              <div className="photos-gallery">
                {photosResolution.map((photo, idx) => (
                  <EvidenceFiles
                    key={photo.idAdjunto}
                    fileId={photo.idAdjunto}
                    filePath={photo.url}
                    type={photo.mimeType}
                    category={category}
                    onClick={() => setLightboxResolutionIndex(idx)}
                  />
                ))}
              </div>
            ) : (
              <div className="evidence-empty-state">
                <EmptyState
                  message="Sin evidencia de resolución"
                  description="No se ha agregado evidencia fotográfica de resolución."
                  icon={<MdPhotoLibrary size={35} className="icon-error-color" />}
                  variant="warning"
                />
              </div>
            )}
          </div>

          {/* Documentos (no imágenes) */}
          {documentos.length > 0 && (
            <div className="wo-attachments-docs" style={{ marginTop: '1rem', marginBottom: onAddAttachment ? '1rem' : '0' }}>
              {documentos.map((doc) => (
                <a
                  key={doc.idAdjunto}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="wo-attachment-doc-row"
                >
                  <FileText size={14} />
                  <span>{doc.nombreArchivo}</span>
                  <span className="wo-attachment-doc-row__type">{doc.tipoAdjunto}</span>
                  <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* Formulario Inline para adjuntar archivo */}
      {onAddAttachment && (
        <div
          className="wo-attachments-upload-container"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="wo-modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <UploadCloud size={16} /> Subir Evidencia (Max. 10 archivos)
          </div>

          <form onSubmit={handleSubmit} className="wo-attachments-upload-form">
            <div className="wo-attachments-upload-grid">
              {/* Box de Carga */}
              <div className={`wo-attachments-upload-trigger ${isDragging ? 'dragging' : ''}`}>
                <UploadCloud size={24} className="wo-attachments-upload-trigger__icon" />
                <span className="wo-attachments-upload-trigger__text">CARGAR</span>
                <input
                  type="file"
                  className="wo-attachments-upload-trigger__input"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFilesSelected(Array.from(e.target.files));
                      e.target.value = ''; // Reset
                    }
                  }}
                  multiple
                  disabled={isLoading}
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
                />
              </div>

              {/* Miniaturas de Archivos */}
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="wo-attachments-preview-card">
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
                      alt={file.name}
                      className="wo-attachments-preview-card__img"
                    />
                  ) : (
                    <div className="wo-attachments-preview-card__doc">
                      <FileText size={24} className="wo-attachments-preview-card__doc-icon" />
                      <span className="wo-attachments-preview-card__doc-name">
                        {file.name}
                      </span>
                    </div>
                  )}

                  {/* Botón X */}
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(idx)}
                    className="wo-attachments-preview-card__remove-btn"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="wo-attachments-upload-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={selectedFiles.length === 0 || isLoading}
                leftIcon={<UploadCloud size={14} />}
                isLoading={isLoading}
                style={{ padding: '0 1.5rem', background: '#0891b2', fontWeight: 600 }}
              >
                Subir Archivos ({selectedFiles.length})
              </Button>
            </div>
          </form>
        </div>
      )}

      {adjuntos.length > 0 && (
        <div className="wo-attachments-legend" style={{ marginTop: '1rem' }}>
          <Paperclip size={11} />
          <span>{imagenes.length} fotos · {documentos.length} documentos</span>
        </div>
      )}

      {lightboxIndex !== null && photosReport.length > 0 && (
        <PhotoLightbox
          photos={photosReport.map((p) => ({
            photoId: p.idAdjunto,
            filePath: p.url,
            type: p.mimeType
          }))}
          activeIndex={lightboxIndex}
          category={category}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}

      {lightboxResolutionIndex !== null && photosResolution.length > 0 && (
        <PhotoLightbox
          photos={photosResolution.map((p) => ({
            photoId: p.idAdjunto,
            filePath: p.url,
            type: p.mimeType
          }))}
          activeIndex={lightboxResolutionIndex}
          category={category}
          onClose={() => setLightboxResolutionIndex(null)}
          onIndexChange={setLightboxResolutionIndex}
        />
      )}
    </Card>
  );
};
