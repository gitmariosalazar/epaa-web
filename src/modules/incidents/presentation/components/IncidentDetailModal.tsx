import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, User, CheckCircle, Loader2, ImageOff } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { useFilePreview } from '@/shared/files';
import { PhotoLightbox } from './PhotoLightbox';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { StatusTimeline } from '@/shared/presentation/components/Timeline';
import { GeoSection } from '@/shared/presentation/components/GeoLocation';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentDetailRowResponse | null;
}


// ─── Pure helpers (module-level — no closures, no re-creation on render) ───────

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'RESUELTO': return 'green';
    case 'EN_INSPECCION': return 'orange';
    case 'REPORTADO': return 'blue';
    case 'FALSO_REPORTE': return 'red';
    default: return 'neutral';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority.toUpperCase()) {
    case 'CRITICA': return 'red';
    case 'ALTA': return 'orange';
    case 'MEDIA': return 'amber';
    case 'BAJA': return 'green';
    default: return 'neutral';
  }
}

function extractFilename(filePath: string): string {
  return filePath.split('/').pop() ?? filePath;
}

// ─── EvidencePhoto sub-component ───────────────────────────────────────────────

interface EvidencePhotoProps {
  photoId: number;
  filePath: string;
  type: string;
  /** Opens the lightbox at this thumbnail's position. */
  onClick: () => void;
}

/**
 * EvidencePhoto
 *
 * Renders a single clickable thumbnail that opens the lightbox on click.
 *
 * SRP: load and display one authenticated thumbnail.
 * DIP: depends on useFilePreview (hook abstraction).
 *
 * Sub-component pattern: required because hooks cannot be called inside loops.
 * Each instance owns its blob URL lifecycle, preventing memory leaks.
 */
const EvidencePhoto: React.FC<EvidencePhotoProps> = ({ photoId, filePath, type, onClick }) => {
  const filename = extractFilename(filePath);
  const { blobUrl, loading, error } = useFilePreview('incidents', filename);

  return (
    <div className="gallery-item">
      <Tooltip content={blobUrl ? 'Clic para ampliar' : ''} position='bottom'>
        <button
          className="gallery-img gallery-img--clickable"
          onClick={blobUrl ? onClick : undefined}
          disabled={!blobUrl}
          aria-label={`Ver evidencia ${type} #${photoId} en pantalla completa`}
          style={{
            position: 'relative', overflow: 'hidden',
            padding: 0, border: 'none',
            cursor: blobUrl ? 'zoom-in' : 'default',
            background: 'none', width: '100%'
          }}
        >
          {loading && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2, rgba(0,0,0,0.06))'
            }}>
              <Loader2 size={22} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          {!loading && blobUrl && (
            <>
              <img
                src={blobUrl}
                alt={`Evidencia #${photoId}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="gallery-zoom-hint">
                <span>🔍 Ampliar</span>
              </div>
            </>
          )}
          {!loading && (error || !blobUrl) && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '4px',
              background: 'var(--surface-2, rgba(0,0,0,0.06))',
              color: 'var(--text-muted)', fontSize: '0.72rem'
            }}>
              <ImageOff size={20} style={{ opacity: 0.5 }} />
              <span>Sin imagen</span>
            </div>
          )}
        </button>
      </Tooltip>
      <span className="gallery-tag">{type}</span>
    </div>
  );
};

// ─── IncidentDetailModal ────────────────────────────────────────────────────────

/**
 * IncidentDetailModal
 *
 * Displays the full detail of an incident in a portal modal.
 *
 * SRP: responsible only for layout and presentation of incident data.
 *      Image loading → EvidencePhoto. Lightbox → PhotoLightbox.
 * DIP: depends on hook abstractions from @/shared/files, not on HTTP directly.
 * Clean Architecture: Presentation layer — no business logic, no HTTP calls.
 *
 * Lightbox state lives here (lifted state) because this component owns the
 * list of photos and decides which one the user clicked.
 */
export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isOpen,
  onClose,
  incident
}) => {
  // Lightbox state: null = closed, number = index of the open photo
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxResolutionIndex, setLightboxResolutionIndex] = useState<number | null>(null);

  // All hooks must be called before any conditional return (Rules of Hooks)
  const photosReport = incident?.photosReport ?? [];
  const photosResolution = incident?.photosResolution ?? [];

  if (!isOpen || !incident) return null;

  return (
    <>
      {createPortal(
        <div className="incident-modal-overlay" onClick={onClose}>
          <div
            className="incident-modal incident-detail-modal premium-theme"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="incident-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3>Detalle de Incidente {incident.incidentId}</h3>
                <ColorChip
                  label={incident.status.replace(/_/g, ' ')}
                  color={getStatusColor(incident.status)}
                  variant="soft"
                  size="xs"
                />
                <ColorChip
                  label={`Prioridad: ${incident.suggestedPriority}`}
                  color={getPriorityColor(incident.suggestedPriority)}
                  variant="soft"
                  size="xs"
                />
              </div>
              <Tooltip content='Cerrar' position='bottom' followCursor={false}>
                <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p" color='red'>
                  <X size={20} />
                </Button>
              </Tooltip>
            </div>

            <div className="incident-modal-body">

              {/* ── Basic info ── */}
              <div className="detail-section">
                <h4 className="detail-section-title">Información Básica</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Tipo de Incidente</span>
                    <span className="detail-value">{incident.incidentTypeName || 'Sin registrar'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Categoría</span>
                    <span className="detail-value">{incident.categoryName || 'Sin registrar'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Conexión / Acometida</span>
                    <span className="detail-value">{incident.connectionId || 'No asociado'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ID de Lectura</span>
                    <span className="detail-value">{incident.readingId || 'No asociado'}</span>
                  </div>
                </div>
              </div>

              {/* ── Report ── */}
              <div className="detail-section">
                <h4 className="detail-section-title">Reporte</h4>
                <div className="detail-description-box">
                  <p className="description-text">{incident.reportDescription}</p>
                </div>
                <div className="detail-grid mt-2">
                  <div className="detail-item">
                    <span className="detail-label">
                      <Calendar size={12} style={{ marginRight: 4 }} />
                      Fecha de Reporte
                    </span>
                    <span className="detail-value">{ConverDate(incident.reportDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <User size={12} style={{ marginRight: 4 }} />
                      Reportado Por (Usuario / Cliente)
                    </span>
                    <span className="detail-value">
                      {incident.reportedBy.name || 'Desconocido'}
                      {incident.reportOrigin ? ` (${incident.reportOrigin})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Location ── */}
              {(incident.referenceAddress || (incident.latitude && incident.longitude)) && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Ubicación</h4>
                  {incident.referenceAddress && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <MapPin size={16} className="text-secondary" />
                      <span className="detail-value">{incident.referenceAddress}</span>
                    </div>
                  )}
                  {/* Original coordinates box — kept intact */}
                  {incident.latitude && incident.longitude && (
                    <div className="geolocation-box">
                      <span className="detail-value">
                        Coordenadas: {incident.latitude}, {incident.longitude}
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="maps-link"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  )}
                  {/* Geocoded address card — reverse geocodes the saved coordinates */}
                  {incident.latitude && incident.longitude && (
                    <div style={{ marginTop: '10px' }}>
                      <GeoSection lat={Number(incident.latitude)} lng={Number(incident.longitude)} />
                    </div>
                  )}
                </div>
              )}

              {/* ── Resolution ── */}
              {incident.status === 'RESUELTO' && (
                <div className="detail-section highlight-resolved">
                  <h4 className="detail-section-title" style={{ color: 'var(--success-color)' }}>
                    <CheckCircle size={14} style={{ marginRight: 4 }} />
                    Resolución
                  </h4>
                  <div className="detail-description-box">
                    <p className="description-text">
                      {incident.resolutionDescription || 'Sin comentarios de resolución.'}
                    </p>
                  </div>
                  <div className="detail-grid mt-2">
                    <div className="detail-item">
                      <span className="detail-label">Fecha de Resolución</span>
                      <span className="detail-value">
                        {incident.resolutionDate ? ConverDate(incident.resolutionDate) : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Resuelto Por</span>
                      <span className="detail-value">{incident.resolvedBy?.name || 'Desconocido'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Costo de Reparación</span>
                      <span className="detail-value" style={{ fontWeight: 'bold' }}>
                        ${Number(incident.repairCost || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Cobrado al Usuario</span>
                      <span className="detail-value">{incident.chargeToUser ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Evidence photos ── */}
              {photosReport.length > 0 && (
                <div className="detail-section">
                  <h4 className="detail-section-title">
                    Evidencia Fotográfica ({photosReport.length})
                  </h4>
                  <div className="photos-gallery">
                    {photosReport.map((photo, idx) => (
                      <EvidencePhoto
                        key={photo.id}
                        photoId={photo.id}
                        filePath={photo.filePath}
                        type={photo.type}
                        onClick={() => setLightboxIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Resolution photo evidence ── */}
              {photosResolution.length > 0 && (
                <div className="detail-section">
                  <h4 className="detail-section-title">
                    Evidencia Fotográfica de Resolución ({photosResolution.length})
                  </h4>
                  <div className="photos-gallery">
                    {photosResolution.map((photo, idx) => (
                      <EvidencePhoto
                        key={photo.id}
                        photoId={photo.id}
                        filePath={photo.filePath}
                        type={photo.type}
                        onClick={() => setLightboxResolutionIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Status history — uses shared StatusTimeline ── */}
              {incident.historyRecent && incident.historyRecent.length > 0 && (
                <div className="detail-section">
                  <StatusTimeline
                    title="Historial de Estados"
                    items={incident.historyRecent.map((h) => ({
                      status: h.newStatus,
                      statusLabel: h.newStatus.replace(/_/g, ' '),
                      previousStatus: h.previousStatus ?? undefined,
                      previousStatusLabel: h.previousStatus?.replace(/_/g, ' '),
                      date: h.dateChange,
                      comment: h.observation ?? undefined,
                      actor: h.managedBy ?? undefined,
                    }))}
                    emptyMessage="Sin historial de estados."
                  />
                </div>
              )}

            </div>

            {/* ── Footer ── */}
            <div className="incident-modal-footer">
              <Tooltip content='Cerrar' position='bottom' followCursor={false}>
                <Button variant="outline" onClick={onClose} className="close-btn-p" color='red' value='Cerrar'>
                  <X size={20} />
                  Cerrar
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Lightbox — rendered in its own portal above the modal ── */}
      {lightboxIndex !== null && photosReport.length > 0 && (
        <PhotoLightbox
          photos={photosReport.map((p) => ({ photoId: p.id, filePath: p.filePath, type: p.type }))}
          activeIndex={lightboxIndex}
          category="incidents"
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}

      {/* ── Resolution photo lightbox ── */}
      {lightboxResolutionIndex !== null && photosResolution.length > 0 && (
        <PhotoLightbox
          photos={photosResolution.map((p) => ({ photoId: p.id, filePath: p.filePath, type: p.type }))}
          activeIndex={lightboxResolutionIndex}
          category="incidents"
          onClose={() => setLightboxResolutionIndex(null)}
          onIndexChange={setLightboxResolutionIndex}
        />
      )}
    </>
  );
};
