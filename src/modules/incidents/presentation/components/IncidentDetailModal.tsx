import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, User, CheckCircle, Navigation } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConverDate, ConverDateTimeToText } from '@/shared/utils/datetime/ConverDate';
import { EvidenceFiles } from '@/shared/files';
import { PhotoLightbox } from './PhotoLightbox';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { StatusTimeline } from '@/shared/presentation/components/Timeline';
import { GeoSection } from '@/shared/presentation/components/GeoLocation';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { MdOutlineTripOrigin, MdPhotoLibrary } from 'react-icons/md';
import { FaUserCheck, FaUsersCog } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import '../styles/IncidentDetailModal.css';
import { GiPhone } from "react-icons/gi";

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
              <div className="incident-modal-header-badges">
                <h3>Detalle de Incidente {incident.incidentCode}</h3>
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
                    <span className="detail-label">Días en curso</span>
                    <span className="detail-value font-medium">
                      {incident.openDays || 0} {' '}
                      {incident.openDays && incident.openDays == 0 ? 'días' : incident.openDays == 1 ? 'día' : 'días'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Orden de Trabajo</span>
                    <span className="detail-value font-medium">
                      {incident.orderCode || 'No asignada'}
                    </span>
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
                      <Calendar size={12} className="detail-label-icon" />
                      Fecha de Reporte
                    </span>
                    <span className="detail-value">
                      <ColorChip
                        label={ConverDateTimeToText(incident.reportDate)}
                        variant="ghost"
                        size="xs"
                        borderRadius={5}
                      />
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <User size={12} className="detail-label-icon" />
                      Reportado Por (Usuario / Cliente)
                    </span>
                    <div className="detail-value detail-value-user">

                      <ColorChip
                        label={incident.reportedBy.name ? incident.reportedBy.name : 'N/A'}
                        variant="ghost"
                        color='yellow'
                        size="xs"
                        borderRadius={5}
                        icon={<FaUserCheck />}
                      />
                      <ColorChip
                        label={incident.reportOrigin ? incident.reportOrigin : 'N/A'}
                        variant="ghost"
                        color='gray'
                        size="xs"
                        borderRadius={5}
                        icon={<MdOutlineTripOrigin />}
                      />
                      <ColorChip
                        label={incident.reportedBy.userType ? incident.reportedBy.userType : 'N/A'}
                        variant="ghost"
                        color='green'
                        size="xs"
                        borderRadius={5}
                        icon={<FaUsersCog />}
                      />
                      {
                        incident.reportedBy.phone && (
                          <ColorChip
                            label={typeof incident.reportedBy.phone === 'object' ? (incident.reportedBy.phone as any).numero : incident.reportedBy.phone}
                            variant="ghost"
                            status='info'
                            size="xs"
                            borderRadius={5}
                            icon={<GiPhone />}
                          />
                        )
                      }
                      {
                        incident.reportedBy.email && (
                          <ColorChip
                            label={typeof incident.reportedBy.email === 'object' ? (incident.reportedBy.email as any).correo : incident.reportedBy.email}
                            variant="ghost"
                            status='info'
                            size="xs"
                            borderRadius={5}
                            icon={<IoMail />}
                          />
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Location ── */}
              {(incident.referenceAddress || (incident.latitude && incident.longitude)) && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Ubicación</h4>
                  {incident.referenceAddress && (
                    <div className="incident-location-header">
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
                      <div className="maps-link">
                        <a className='geo-card__maps-link'
                          href={`https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation size={12} />
                          Ver en Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                  {/* Geocoded address card — reverse geocodes the saved coordinates */}
                  {incident.latitude && incident.longitude && (
                    <div className="incident-location-map-wrapper">
                      <GeoSection lat={Number(incident.latitude)} lng={Number(incident.longitude)} />
                    </div>
                  )}
                </div>
              )}

              {/* ── Resolution ── */}
              {incident.status === 'RESUELTO' && (
                <div className="detail-section highlight-resolved">
                  <h4 className="detail-section-title detail-section-title--success">
                    <CheckCircle size={14} className="detail-section-title-icon" />
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
                      <span className="detail-value detail-value--bold">
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
              <div className="detail-section">
                <h4 className="detail-section-title">
                  Evidencia Fotográfica de Reporte ({photosReport.length})
                </h4>
                {photosReport.length > 0 ? (
                  <div className="photos-gallery">
                    {photosReport.map((photo, idx) => (
                      <EvidenceFiles
                        key={photo.id}
                        fileId={photo.id}
                        filePath={photo.filePath}
                        type={photo.type}
                        onClick={() => setLightboxIndex(idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="evidence-empty-state">
                    <EmptyState
                      message="Sin evidencia de reporte"
                      description="No se ha agregado evidencia fotográfica de reporte."
                      icon={<MdPhotoLibrary size={35} className='icon-error-color' />}
                      variant='warning'
                    />
                  </div>
                )}
              </div>

              {/* ── Resolution photo evidence ── */}
              <div className="detail-section">
                <h4 className="detail-section-title">
                  Evidencia Fotográfica de Resolución ({photosResolution.length})
                </h4>
                {photosResolution.length > 0 ? (
                  <div className="photos-gallery">
                    {photosResolution.map((photo, idx) => (
                      <EvidenceFiles
                        key={photo.id}
                        fileId={photo.id}
                        filePath={photo.filePath}
                        type={photo.type}
                        onClick={() => setLightboxResolutionIndex(idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="evidence-empty-state">
                    <EmptyState
                      message="Sin evidencia de resolución"
                      description="No se ha agregado evidencia fotográfica de resolución."
                      icon={<MdPhotoLibrary size={35} className='icon-error-color' />}
                      variant='warning'
                    />
                  </div>
                )}
              </div>

              {/* ── Status history — uses shared StatusTimeline ── */}
              {incident.historyRecent && incident.historyRecent.length > 0 && (
                <div className="detail-section">
                  <StatusTimeline
                    title="Historial de Estados"
                    key={incident.incidentId}
                    items={incident.historyRecent.map((h) => ({
                      status: h.newStatus,
                      statusLabel: h.newStatus.replace(/_/g, ' '),
                      previousStatus: h.previousStatus ?? undefined,
                      previousStatusLabel: h.previousStatus?.replace(/_/g, ' '),
                      date: h.dateChange,
                      comment: h.observation ?? undefined,
                      actor: h.managedBy ? (
                        <div className="timeline-actor-container">
                          <p className='timeline-actor-title'>Actor del cambio:</p>
                          <div className="timeline-actor-secondary">
                            <ColorChip size='xs' variant='ghost' color='yellow' label={
                              typeof h.managedBy === 'string'
                                ? h.managedBy
                                : `${h.managedBy.nombre} ${h.managedBy.apellido}`

                            }
                              icon={<FaUserCheck />}
                            />
                            {typeof h.managedBy === 'object' && h.managedBy !== null && (h.managedBy.celular || h.managedBy.correo) && (
                              <div className="timeline-actor-secondary">
                                {h.managedBy.celular && (
                                  <ColorChip size='xs' variant='ghost' status='info' label={typeof h.managedBy.celular === 'object' ? (h.managedBy.celular as any).numero : h.managedBy.celular}
                                    icon={<GiPhone size={10} />}
                                  />
                                )}
                                {h.managedBy.correo && (
                                  <ColorChip size='xs' variant='ghost' status='accent' label={typeof h.managedBy.correo === 'object' ? (h.managedBy.correo as any).correo : h.managedBy.correo}
                                    icon={<IoMail size={10} />}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : undefined,
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
