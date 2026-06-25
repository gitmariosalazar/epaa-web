import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { IncidentResponse } from '../../domain/schemas/dtos/response/incident.response';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentResponse | null;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isOpen,
  onClose,
  incident
}) => {
  if (!isOpen || !incident) return null;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESUELTO':
        return 'green';
      case 'EN_INSPECCION':
        return 'orange';
      case 'REPORTADO':
        return 'blue';
      case 'FALSO_REPORTE':
        return 'red';
      default:
        return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICA':
        return 'red';
      case 'ALTA':
        return 'orange';
      case 'MEDIA':
        return 'amber';
      case 'BAJA':
        return 'green';
      default:
        return 'neutral';
    }
  };

  return createPortal(
    <div className="incident-modal-overlay" onClick={onClose}>
      <div className="incident-modal incident-detail-modal premium-theme" onClick={(e) => e.stopPropagation()}>
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
              label={`Prioridad: ${incident.priority}`}
              color={getPriorityColor(incident.priority)}
              variant="soft"
              size="xs"
            />
          </div>
          <Button variant="ghost" size="sm" circle onClick={onClose} className="close-btn-p">
            <X size={20} />
          </Button>
        </div>

        <div className="incident-modal-body">
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
                  {incident.reportedBy || incident.reporterUserId || incident.clienteUsuarioReportaId || 'Desconocido'}
                  {incident.reportOrigin ? ` (${incident.reportOrigin})` : ''}
                </span>
              </div>
            </div>
          </div>

          {(incident.referenceAddress || (incident.latitude && incident.longitude)) && (
            <div className="detail-section">
              <h4 className="detail-section-title">Ubicación</h4>
              {incident.referenceAddress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <MapPin size={16} className="text-secondary" />
                  <span className="detail-value">{incident.referenceAddress}</span>
                </div>
              )}
              {incident.latitude && incident.longitude && (
                <div className="geolocation-box">
                  <span className="detail-value">Coordenadas: {incident.latitude}, {incident.longitude}</span>
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
            </div>
          )}

          {incident.status === 'RESUELTO' && (
            <div className="detail-section highlight-resolved">
              <h4 className="detail-section-title" style={{ color: 'var(--success-color)' }}>
                <CheckCircle size={14} style={{ marginRight: 4 }} />
                Resolución
              </h4>
              <div className="detail-description-box">
                <p className="description-text">{incident.resolutionDescription || 'Sin comentarios de resolución.'}</p>
              </div>
              <div className="detail-grid mt-2">
                <div className="detail-item">
                  <span className="detail-label">Fecha de Resolución</span>
                  <span className="detail-value">{incident.resolutionDate ? ConverDate(incident.resolutionDate) : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Resuelto Por</span>
                  <span className="detail-value">{incident.resolverUserId || 'Desconocido'}</span>
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

          {incident.evidencePhotos && incident.evidencePhotos.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Evidencia Fotográfica ({incident.evidencePhotos.length})</h4>
              <div className="photos-gallery">
                {incident.evidencePhotos.map((photo) => (
                  <div key={photo.photoId} className="gallery-item">
                    <img src={photo.filePath} alt={`Evidencia ID: ${photo.photoId}`} className="gallery-img" />
                    <span className="gallery-tag">{photo.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {incident.statusHistory && incident.statusHistory.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Historial de Estados</h4>
              <div className="audit-timeline">
                {incident.statusHistory.map((hist, idx) => (
                  <div key={idx} className="timeline-event">
                    <div className="timeline-badge"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-status-change">
                          {hist.previousStatus ? `${hist.previousStatus} ➜ ` : ''} <b>{hist.newStatus}</b>
                        </span>
                        <span className="timeline-date">{ConverDate(hist.changeDate)}</span>
                      </div>
                      {hist.observation && <p className="timeline-obs">{hist.observation}</p>}
                      {hist.managedBy && <span className="timeline-user">Por: {hist.managedBy}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="incident-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
