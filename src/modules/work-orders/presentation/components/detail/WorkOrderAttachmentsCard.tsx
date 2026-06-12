/**
 * WorkOrderAttachmentsCard
 *
 * SRP: galería de fotos de evidencia y adjuntos de la OT.
 */
import React, { useState } from 'react';
import { Paperclip, Image, FileText, ExternalLink, Plus } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { AdjuntoEvidencia } from '../../../domain/schemas/dto/response/work-orders.get.response';

interface WorkOrderAttachmentsCardProps {
  adjuntos: AdjuntoEvidencia[];
  onAddAttachment?: (fileName: string, fileType: string, fileUrl: string) => Promise<void>;
  isLoading?: boolean;
}

const isImage = (mime: string) => mime?.startsWith('image/');

const FILE_TYPES = ['FOTO', 'VIDEO', 'DOCUMENTO', 'INFORME', 'OTRO'];

export const WorkOrderAttachmentsCard: React.FC<WorkOrderAttachmentsCardProps> = ({
  adjuntos: adjuntosRaw,
  onAddAttachment,
  isLoading = false,
}) => {
  const adjuntos = adjuntosRaw ?? [];
  const [preview, setPreview] = useState<string | null>(null);

  // Form states
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('FOTO');
  const [fileUrl, setFileUrl]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim() || !onAddAttachment) return;
    try {
      await onAddAttachment(fileName.trim(), fileType, fileUrl.trim());
      setFileName('');
      setFileType('FOTO');
      setFileUrl('');
    } catch (err) {}
  };

  if (adjuntos.length === 0 && !onAddAttachment) {
    return (
      <Card title="Evidencia de Campo" className="wo-detail-card">
        <p className="wo-empty-text">No se han cargado adjuntos para esta orden.</p>
      </Card>
    );
  }

  const imagenes   = adjuntos.filter((a) => isImage(a.mimeType));
  const documentos = adjuntos.filter((a) => !isImage(a.mimeType));

  return (
    <Card title={`Evidencia de Campo (${adjuntos.length})`} className="wo-detail-card">

      {adjuntos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.01)', borderRadius: '0.375rem', border: '1px dashed rgba(0,0,0,0.06)', marginBottom: onAddAttachment ? '1rem' : '0' }}>
          <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>No hay adjuntos cargados para esta orden.</p>
        </div>
      ) : (
        <>
          {/* Galería de imágenes */}
          {imagenes.length > 0 && (
            <div className="wo-attachments-gallery" style={{ marginBottom: onAddAttachment ? '1rem' : '0' }}>
              {imagenes.map((img) => (
                <div
                  key={img.idAdjunto}
                  className="wo-attachment-thumb"
                  onClick={() => setPreview(img.url)}
                  title={img.nombreArchivo}
                >
                  <img
                    src={img.url}
                    alt={img.nombreArchivo}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="wo-attachment-thumb__overlay">
                    <Image size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}

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
        <div className="wo-attachments-inline-form-box" style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
          <div className="wo-modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Plus size={14} /> Adjuntar Evidencia
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr auto', gap: '0.6rem', alignItems: 'end' }}>
            <div className="wo-modal-field" style={{ margin: 0 }}>
              <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Nombre Archivo *</label>
              <input
                type="text"
                className="wo-modal-input"
                style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Ej: foto-tubería.jpg"
                required
                disabled={isLoading}
              />
            </div>
            <div className="wo-modal-field" style={{ margin: 0 }}>
              <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Tipo *</label>
              <select
                className="wo-modal-select"
                style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                disabled={isLoading}
              >
                {FILE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="wo-modal-field" style={{ margin: 0 }}>
              <label className="wo-modal-label" style={{ fontSize: '0.72rem', fontWeight: 600 }}>URL Archivo *</label>
              <input
                type="url"
                className="wo-modal-input"
                style={{ height: '32px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://storage.empresa.com/..."
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              disabled={!fileName.trim() || !fileUrl.trim() || isLoading}
              leftIcon={<Plus size={12} />}
              style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.78rem', background: '#0891b2' }}
            >
              Adjuntar
            </Button>
          </form>
        </div>
      )}

      {/* Lightbox simple */}
      {preview && (
        <div className="wo-lightbox" onClick={() => setPreview(null)}>
          <img src={preview} alt="preview" />
          <span className="wo-lightbox__close">✕</span>
        </div>
      )}

      {adjuntos.length > 0 && (
        <div className="wo-attachments-legend" style={{ marginTop: '1rem' }}>
          <Paperclip size={11} />
          <span>{imagenes.length} fotos · {documentos.length} documentos</span>
        </div>
      )}
    </Card>
  );
};
