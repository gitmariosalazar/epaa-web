/**
 * WorkOrderAttachmentsCard
 *
 * Clean Architecture — Presentation layer.
 * Espejo web de `work_order_attachments_card.dart` (Mobile).
 *
 * Principios SOLID:
 *   - SRP: responsable únicamente de visualizar y recolectar adjuntos y evidencias clasificados por etapa.
 *   - OCP: admite nuevas etapas de evidencia definidas en `evidence-stage.ts`.
 *   - DIP: delega la acción de subida a través de la función `onAddAttachment`.
 */
import React, { useState, useMemo } from 'react';
import { Paperclip, FileText, ExternalLink, UploadCloud, X, Layers } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { AdjuntoEvidencia } from '../../../domain/schemas/dto/response/work-orders.get.response';
import './WorkOrderAttachmentsCard.css';
import { EvidenceFiles } from '@/shared/files';
import type { FileCategory } from '@/shared/files';
import { PhotoLightbox } from '@/modules/incidents/presentation/components/PhotoLightbox';
import { EVIDENCE_STAGES, type EvidenceStageCode } from '../../../domain/constants/evidence-stage';
import { Select } from '@/shared/presentation/components/Input/Select';

interface WorkOrderAttachmentsCardProps {
  adjuntos: AdjuntoEvidencia[];
  onAddAttachment?: (files: File[], stage?: EvidenceStageCode) => Promise<void>;
  isLoading?: boolean;
  category?: FileCategory;
  defaultStage?: EvidenceStageCode;
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

const STAGE_LABELS: Record<string, string> = {
  [EVIDENCE_STAGES.INITIAL_REPORT]: 'Reporte Inicial',
  [EVIDENCE_STAGES.SAFETY_INSPECTION]: 'Inspección Previa / Seguridad',
  [EVIDENCE_STAGES.IN_PROGRESS]: 'En Proceso',
  [EVIDENCE_STAGES.WORK_COMPLETED]: 'Trabajo Terminado',
  [EVIDENCE_STAGES.CUSTOMER_APPROVAL]: 'Conformidad del Cliente',
};

const STAGE_ORDER: string[] = [
  EVIDENCE_STAGES.INITIAL_REPORT,
  EVIDENCE_STAGES.SAFETY_INSPECTION,
  EVIDENCE_STAGES.IN_PROGRESS,
  EVIDENCE_STAGES.WORK_COMPLETED,
  EVIDENCE_STAGES.CUSTOMER_APPROVAL,
];

export const WorkOrderAttachmentsCard: React.FC<WorkOrderAttachmentsCardProps> = ({
  adjuntos: adjuntosRaw,
  onAddAttachment,
  isLoading = false,
  category = 'work_orders',
  defaultStage = EVIDENCE_STAGES.IN_PROGRESS,
}) => {
  const adjuntos = adjuntosRaw ?? [];

  // Form states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<EvidenceStageCode>(defaultStage);
  const [isDragging, setIsDragging] = useState(false);

  // Lightbox state
  const [activeLightboxGroup, setActiveLightboxGroup] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length + selectedFiles.length > 10) {
      alert('Máximo 10 archivos a la vez.');
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
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
      previews.forEach((p) => {
        if (p) URL.revokeObjectURL(p);
      });
    };
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !onAddAttachment) return;
    try {
      await onAddAttachment(selectedFiles, selectedStage);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error('Error al subir adjuntos:', err);
    }
  };

  // Agrupamiento por etapa de evidencia (exacto como en Flutter mobile)
  const groupedEvidence = useMemo(() => {
    const map: Record<string, AdjuntoEvidencia[]> = {};

    for (const a of adjuntos) {
      const rawStep = (a.evidenceStep || '').trim().toUpperCase();
      let key = rawStep;

      if (!key) {
        // Fallback por tipo/nombre para compatibilidad retroactiva
        const t = (a.tipoAdjunto || '').toUpperCase();
        if (
          t.includes('RESOLUC') ||
          t.includes('EJECUC') ||
          t.includes('FINAL') ||
          t.includes('DESPUES')
        ) {
          key = EVIDENCE_STAGES.WORK_COMPLETED;
        } else {
          key = EVIDENCE_STAGES.INITIAL_REPORT;
        }
      }

      if (!map[key]) map[key] = [];
      map[key].push(a);
    }

    // Ordenar claves según STAGE_ORDER
    const keys = Object.keys(map).sort((a, b) => {
      const ia = STAGE_ORDER.indexOf(a);
      const ib = STAGE_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    return { map, keys };
  }, [adjuntos]);

  const totalImagenes = useMemo(() => adjuntos.filter(isImageAttachment).length, [adjuntos]);
  const totalDocumentos = useMemo(() => adjuntos.filter((a) => !isImageAttachment(a)).length, [adjuntos]);

  const currentLightboxPhotos = useMemo(() => {
    if (!activeLightboxGroup || !groupedEvidence.map[activeLightboxGroup]) return [];
    return groupedEvidence.map[activeLightboxGroup].filter(isImageAttachment);
  }, [activeLightboxGroup, groupedEvidence]);

  return (
    <Card title={`Evidencias y Archivos Adjuntos (${adjuntos.length})`} className="wo-detail-card">
      {adjuntos.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.01)',
            borderRadius: '0.375rem',
            border: '1px dashed rgba(0,0,0,0.06)',
            marginBottom: onAddAttachment ? '1rem' : '0',
          }}
        >
          <p className="wo-empty-text" style={{ margin: 0, fontSize: '0.78rem' }}>
            No hay adjuntos cargados para esta orden.
          </p>
        </div>
      ) : (
        <>
          {/* Secciones agrupadas por etapa */}
          {groupedEvidence.keys.map((stageKey) => {
            const items = groupedEvidence.map[stageKey] || [];
            const imgs = items.filter(isImageAttachment);
            const docs = items.filter((a) => !isImageAttachment(a));
            const label = STAGE_LABELS[stageKey] || stageKey;

            return (
              <div key={stageKey} className="detail-section" style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <Layers size={14} color="#0284c7" />
                  <h4
                    className="detail-section-title"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      textTransform: 'uppercase',
                      margin: 0,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {label} ({items.length})
                  </h4>
                </div>

                {/* Galería de imágenes */}
                {imgs.length > 0 && (
                  <div className="photos-gallery" style={{ marginBottom: docs.length > 0 ? '0.75rem' : '0' }}>
                    {imgs.map((photo, idx) => (
                      <EvidenceFiles
                        key={photo.idAdjunto}
                        fileId={photo.idAdjunto}
                        filePath={photo.url}
                        type={photo.mimeType}
                        category={category}
                        onClick={() => {
                          setActiveLightboxGroup(stageKey);
                          setLightboxIndex(idx);
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Lista de documentos */}
                {docs.length > 0 && (
                  <div className="wo-attachments-docs">
                    {docs.map((doc) => (
                      <a
                        key={doc.idAdjunto}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="wo-attachment-doc-row"
                      >
                        <FileText size={14} />
                        <span>{doc.nombreArchivo}</span>
                        <span className="wo-attachment-doc-row__type">
                          {doc.tipoAdjunto || 'Documento'}
                        </span>
                        <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
          <div
            className="wo-modal-section-title"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UploadCloud size={16} /> Subir Evidencia (Max. 10 archivos)
            </div>

            {/* Selector de Etapa de Evidencia */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Etapa:
              </label>
              <Select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as EvidenceStageCode)}
                size="small"
                width={180}
                options={STAGE_ORDER.map((stage) => ({
                  value: stage,
                  label: STAGE_LABELS[stage] || stage,
                }))}
              />
            </div>
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
                      e.target.value = '';
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

                  <button
                    type="button"
                    onClick={() => removeSelectedFile(idx)}
                    className="wo-attachments-preview-card__remove-btn"
                    title="Eliminar archivo"
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
                style={{ padding: '0 1.5rem', background: '#0284c7', fontWeight: 600 }}
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
          <span>{totalImagenes} fotos · {totalDocumentos} documentos</span>
        </div>
      )}

      {/* Lightbox para fotos */}
      {lightboxIndex !== null && currentLightboxPhotos.length > 0 && (
        <PhotoLightbox
          photos={currentLightboxPhotos.map((p) => ({
            photoId: p.idAdjunto,
            filePath: p.url,
            type: p.mimeType,
          }))}
          activeIndex={lightboxIndex}
          category={category}
          onClose={() => {
            setLightboxIndex(null);
            setActiveLightboxGroup(null);
          }}
          onIndexChange={setLightboxIndex}
        />
      )}
    </Card>
  );
};
